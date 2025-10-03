/**
 * Google Authentication Utilities
 *
 * This module provides utilities for Google One Tap authentication,
 * including script loading, configuration, and integration with Supabase.
 */

import { supabase } from './supabase';
import {
  generateSecureNonce,
  validateNonce,
  recordFailedAttempt,
  clearFailedAttempts,
  isRateLimited,
} from './security';
import { handleAuthError } from './error-handler';

/**
 * Google One Tap configuration interface
 */
export interface GoogleOneTapConfig {
  client_id: string;
  auto_select: boolean;
  cancel_on_tap_outside: boolean;
  context: 'signin' | 'signup' | 'use';
  nonce: string;
  itp_support: boolean;
}

/**
 * TypeScript declaration for Google global object
 */
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
        };
      };
    };
  }
}

/**
 * Google Sign In response interface
 */
export interface GoogleSignInResponse {
  credential: string;
  select_by: string;
  client_id: string;
}

/**
 * Google ID Token payload interface
 */
export interface GoogleIdTokenPayload {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
  nonce: string;
}

/**
 * Check if Google One Tap script is already loaded
 */
export const isGoogleScriptLoaded = (): boolean => {
  return !!(typeof window !== 'undefined' && window.google && window.google.accounts);
};

/**
 * Load Google One Tap script dynamically
 */
export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isGoogleScriptLoaded()) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (isGoogleScriptLoaded()) {
        resolve();
      } else {
        reject(new Error('Google script loaded but accounts API not available'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google One Tap script'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Get Google configuration from environment variables
 */
export const getGoogleConfig = (): GoogleOneTapConfig => {
  const clientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error(
      'Missing required environment variable: PUBLIC_GOOGLE_CLIENT_ID\n' +
        'Please add it to your .env file or Cloudflare environment variables.\n' +
        'Get this from Google Cloud Console: APIs & Services > Credentials'
    );
  }

  return {
    client_id: clientId,
    auto_select: false,
    cancel_on_tap_outside: false,
    context: 'signin',
    nonce: '', // Will be set dynamically
    itp_support: true,
  };
};

/**
 * Initialize Google One Tap with secure nonce handling
 */
export const initializeGoogleOneTap = async (
  onSuccess: (response: GoogleSignInResponse) => void,
  onError?: (error: Error) => void
): Promise<void> => {
  try {
    // Load Google script if not already loaded
    await loadGoogleScript();

    // Generate secure nonce and hash
    const { hash } = await generateSecureNonce();

    // Store nonce hash for verification later (not the actual nonce)
    sessionStorage.setItem('google_nonce_hash', hash);

    // Get configuration
    const config = getGoogleConfig();
    config.nonce = hash;

    // Initialize Google One Tap
    window.google?.accounts?.id?.initialize({
      ...config,
      callback: onSuccess,
      native_callback: (response: GoogleSignInResponse) => {
        // Handle native callback for mobile devices
        onSuccess(response);
      },
    });

    // Display Google One Tap
    window.google?.accounts?.id?.prompt((notification) => {
      if (
        onError &&
        ((notification.isNotDisplayed && notification.isNotDisplayed()) ||
          (notification.isSkippedMoment && notification.isSkippedMoment()))
      ) {
        const error = new Error('Google One Tap was not displayed or was skipped');
        onError(error);
      }
    });
  } catch (error) {
    const errorResponse = handleAuthError(error, 'Google One Tap initialization');
    const errorObj = new Error(errorResponse.userMessage);
    if (onError) {
      onError(errorObj);
    }
  }
};

/**
 * Sign in with Google using ID token with enhanced security
 */
export const signInWithGoogle = async (credential: string): Promise<any> => {
  try {
    // Decode and verify token
    const payload = decodeJWT(credential) as GoogleIdTokenPayload;
    const storedNonceHash = sessionStorage.getItem('google_nonce_hash');

    // Verify nonce hash instead of nonce
    if (!validateNonce(storedNonceHash || '', payload.nonce)) {
      throw new Error('Nonce verification failed. Possible replay attack.');
    }

    // Clear nonce from storage
    sessionStorage.removeItem('google_nonce_hash');

    // Validate token expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      throw new Error('Token has expired');
    }

    // Validate audience
    const clientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;
    if (payload.aud !== clientId) {
      throw new Error('Invalid token audience');
    }

    // Validate issuer
    if (!payload.iss.startsWith('https://accounts.google.com')) {
      throw new Error('Invalid token issuer');
    }

    // Validate email if present
    if (payload.email && !payload.email_verified) {
      throw new Error('Email not verified');
    }

    // Check rate limiting using email as identifier
    const identifier = payload.email || payload.sub;
    if (isRateLimited(identifier)) {
      throw new Error('Too many failed attempts. Please try again later.');
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credential,
    });

    if (error) {
      // Record failed attempt
      recordFailedAttempt(identifier);
      throw error;
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(identifier);

    return data;
  } catch (error) {
    const errorResponse = handleAuthError(error, 'Google sign in');

    // Log technical details for debugging
    console.error('Google sign in error:', {
      technical: error instanceof Error ? error.message : error,
      user: errorResponse.userMessage,
      suggestion: errorResponse.suggestion,
      shouldRetry: errorResponse.shouldRetry,
    });

    // Create appropriate error type
    let enhancedError: Error;
    if (errorResponse.shouldRetry) {
      enhancedError = new Error(errorResponse.userMessage);
    } else {
      enhancedError = new Error(errorResponse.userMessage);
    }

    throw enhancedError;
  }
};

/**
 * Decode JWT token (for nonce verification)
 */
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    throw new Error('Failed to decode JWT token');
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out');
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    throw error;
  }
};

/**
 * Listen for auth state changes
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
