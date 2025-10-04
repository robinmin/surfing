/**
 * Google Authentication Utilities
 *
 * This module provides utilities for Google One Tap authentication,
 * including script loading, configuration, and integration with Supabase.
 */

import { supabase } from './supabase';
import { generateSecureNonce, recordFailedAttempt, clearFailedAttempts, isRateLimited } from './security';
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

    // Add error handling for FedCM-related issues
    script.onerror = (error) => {
      console.debug('Google script loading error:', error);
      reject(new Error('Failed to load Google One Tap script'));
    };

    script.onload = () => {
      // Add a small delay to ensure Google API is fully initialized
      setTimeout(() => {
        if (isGoogleScriptLoaded()) {
          resolve();
        } else {
          reject(new Error('Google script loaded but accounts API not available'));
        }
      }, 100);
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
        '\nTo fix this issue:\n' +
        '1. Add to your .env file: PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id\n' +
        '2. Create OAuth credentials at: https://console.cloud.google.com/\n' +
        '3. Add localhost:4323 to authorized JavaScript origins for development\n' +
        '4. See detailed setup instructions in the .env file'
    );
  }

  // Check if using localhost with a non-localhost client ID
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost && !clientId.includes('localhost') && !clientId.includes('test')) {
    console.warn(
      '🔧 Development Warning: Using production Google client ID on localhost.\n' +
        'This may cause "origin not allowed" errors.\n' +
        'Consider creating a separate OAuth client for development.\n' +
        'See .env file for setup instructions.'
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
 * Flag to prevent duplicate initialization
 */
let isInitializing = false;

/**
 * Initialize Google One Tap with secure nonce handling and FedCM support
 */
export const initializeGoogleOneTap = async (
  onSuccess: (response: GoogleSignInResponse) => void,
  onError?: (error: Error) => void
): Promise<void> => {
  // Prevent duplicate initialization
  if (isInitializing) {
    return;
  }
  isInitializing = true;

  // Add global error handler for FedCM-related errors
  const originalHandler = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    // Suppress FedCM-related errors
    if (
      typeof message === 'string' && (
        message.includes('FedCM get() rejects') ||
        message.includes('signal is aborted') ||
        message.includes('request has been aborted') ||
        message.includes('GSI_LOGGER')
      )
    ) {
      return true; // Suppress the error
    }
    // Call original handler for other errors
    if (originalHandler) {
      return originalHandler(message, source, lineno, colno, error);
    }
    return false;
  };

  try {
    // Check if client ID is properly configured
    const clientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your-production-google-client-id-here') {
      throw new Error('Google OAuth client ID not configured. Please configure your Google OAuth credentials.');
    }

    // Load Google script if not already loaded
    await loadGoogleScript();

    // Generate secure nonce and hash
    const { hash } = await generateSecureNonce();

    // Store nonce hash for verification later (not the actual nonce)
    sessionStorage.setItem('google_nonce_hash', hash);

    // Get configuration
    const config = getGoogleConfig();
    config.nonce = hash;

    // Use traditional Google One Tap (FedCM not yet fully supported by Google)
    initializeGoogleOneTapLegacy(config, onSuccess, onError);
  } catch (error) {
    const errorResponse = handleAuthError(error, 'Google authentication initialization');
    const errorObj = new Error(errorResponse.userMessage);
    if (onError) {
      onError(errorObj);
    }
  } finally {
    // Reset initialization flag
    isInitializing = false;
    // Restore original error handler after a delay
    setTimeout(() => {
      window.onerror = originalHandler;
    }, 2000);
  }
};

/**
 * Legacy Google One Tap implementation (for backward compatibility)
 */
const initializeGoogleOneTapLegacy = (
  config: GoogleOneTapConfig,
  onSuccess: (response: GoogleSignInResponse) => void,
  onError?: (error: Error) => void
): void => {
  try {
    // Initialize Google One Tap with FedCM disabled to prevent abort errors
    window.google?.accounts?.id?.initialize({
      ...config,
      callback: onSuccess,
      native_callback: (response: GoogleSignInResponse) => {
        // Handle native callback for mobile devices
        onSuccess(response);
      },
      // Disable FedCM auto-prompting to prevent abort errors
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Only display prompt if not using FedCM to prevent abort errors
    // Use a timeout to ensure proper initialization
    setTimeout(() => {
      try {
        window.google?.accounts?.id?.prompt((notification) => {
          // Handle FedCM-related errors gracefully
          if (notification && typeof notification === 'object') {
            // Check if FedCM caused the issue
            if (notification.getMomentType && notification.getMomentType() === 'display') {
              // FedCM is being used, suppress the prompt to avoid errors
              return;
            }
          }

          // Handle regular notification errors
          if (
            onError &&
            ((notification.isNotDisplayed && notification.isNotDisplayed()) ||
              (notification.isSkippedMoment && notification.isSkippedMoment()))
          ) {
            const error = new Error('Google One Tap was not displayed or was skipped');
            onError(error);
          }
        });
      } catch (promptError) {
        // Silently handle prompt errors to prevent console noise
        console.debug('Google One Tap prompt suppressed:', promptError);
      }
    }, 1000); // Delay to ensure proper initialization

    // Log FedCM migration notice only in development
    if (console && console.info && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.info(
        '📢 FedCM Migration Notice: Google will require Federated Credential Management in future updates.\n' +
          'This application is prepared for FedCM but currently uses legacy Google One Tap for compatibility.\n' +
          'For migration guidance, see: https://developers.google.com/identity/gsi/web/guides/fedcm-migration'
      );
    }
  } catch (error) {
    // Handle initialization errors gracefully
    if (onError) {
      onError(new Error('Failed to initialize Google Sign-In'));
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

    // Verify that the payload nonce matches the stored hash
    // Note: Google returns the original nonce in the token, not the hash
    // We need to hash the payload nonce and compare it with the stored hash
    if (!storedNonceHash) {
      throw new Error('Nonce verification failed. No stored nonce found.');
    }

    const payloadNonceHash = await import('../utils/crypto').then((m) => m.sha256Base64Url(payload.nonce));
    if (payloadNonceHash !== storedNonceHash) {
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
    if (!supabase) {
      throw new Error('Authentication service not available');
    }

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
    if (!supabase) {
      throw new Error('Authentication service not available');
    }
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
    if (!supabase) {
      throw new Error('Authentication service not available');
    }
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
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
};
