/**
 * Apple Authentication Utilities
 *
 * This module provides utilities for Apple Sign In authentication,
 * including script loading, configuration, and integration with Supabase.
 */

import { supabase } from './supabase';
import { validateCallbackUrl, recordFailedAttempt, clearFailedAttempts, isRateLimited } from './security';

/**
 * Apple Sign In configuration interface
 */
export interface AppleSignInConfig {
  clientId: string;
  redirectURI: string;
  scope: string;
  state: string;
  usePopup: boolean;
}

/**
 * Apple Sign In response interface
 */
export interface AppleSignInResponse {
  authorization: {
    code: string;
    id_token: string;
    state: string;
  };
  user: {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
  };
}

/**
 * Apple ID token payload interface
 */
export interface AppleIdTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  at_hash: string;
  email: string;
  email_verified: boolean;
  is_private_email: boolean;
  auth_time: number;
  nonce_supported: boolean;
}

/**
 * TypeScript declaration for AppleID global object
 */
declare global {
  interface Window {
    AppleID: {
      auth: {
        init: (config: AppleSignInConfig) => void;
        signIn: () => Promise<AppleSignInResponse>;
        signOut: () => void;
      };
    };
  }
}

/**
 * Check if Apple Sign In script is already loaded
 */
export const isAppleScriptLoaded = (): boolean => {
  return (
    typeof window !== 'undefined' && typeof window.AppleID !== 'undefined' && typeof window.AppleID.auth !== 'undefined'
  );
};

/**
 * Load Apple Sign In script dynamically
 */
export const loadAppleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isAppleScriptLoaded()) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (isAppleScriptLoaded()) {
        resolve();
      } else {
        reject(new Error('Apple Sign In script loaded but AppleID.auth not available'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Apple Sign In script'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Get Apple Sign In configuration from environment variables
 */
export const getAppleConfig = (): AppleSignInConfig => {
  const clientId = import.meta.env.PUBLIC_APPLE_SERVICES_ID;
  const redirectURI = import.meta.env.PUBLIC_APPLE_REDIRECT_URI;

  if (!clientId) {
    throw new Error(
      'Missing required environment variable: PUBLIC_APPLE_SERVICES_ID\n' +
        'Please add it to your .env file or Cloudflare environment variables.\n' +
        'Get this from Apple Developer Portal: Certificates, Identifiers & Profiles'
    );
  }

  if (!redirectURI) {
    throw new Error(
      'Missing required environment variable: PUBLIC_APPLE_REDIRECT_URI\n' +
        'Please add it to your .env file or Cloudflare environment variables.\n' +
        'Get this from Apple Developer Portal: Certificates, Identifiers & Profiles'
    );
  }

  // Validate redirect URI
  if (!validateCallbackUrl(redirectURI)) {
    throw new Error('Invalid redirect URI');
  }

  // Generate a secure state for security
  const state = generateState();

  return {
    clientId,
    redirectURI,
    scope: 'name email',
    state,
    usePopup: true,
  };
};

/**
 * Generate a random state string for Apple Sign In
 */
export const generateState = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  // Use crypto.getRandomValues for cryptographically secure random numbers
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
};

/**
 * Initialize Apple Sign In
 */
export const initializeAppleAuth = async (): Promise<void> => {
  try {
    // Load Apple script if not already loaded
    await loadAppleScript();

    // Get configuration
    const config = getAppleConfig();

    // Initialize Apple Sign In
    window.AppleID.auth.init(config);

    // Store state for verification later
    sessionStorage.setItem('apple_signin_state', config.state);
  } catch (error) {
    console.error('Apple Sign In initialization error:', error);
    throw error instanceof Error ? error : new Error('Failed to initialize Apple Sign In');
  }
};

/**
 * Sign in with Apple with enhanced security
 */
export const signInWithApple = async (): Promise<any> => {
  try {
    // Ensure Apple Sign In is initialized
    if (!isAppleScriptLoaded()) {
      await initializeAppleAuth();
    }

    // Perform sign in
    const response = await window.AppleID.auth.signIn();

    // Verify state
    const storedState = sessionStorage.getItem('apple_signin_state');
    if (response.authorization.state !== storedState) {
      throw new Error('Invalid state parameter. Possible CSRF attack.');
    }

    // Clear state from storage
    sessionStorage.removeItem('apple_signin_state');

    // Decode and validate ID token
    const payload = decodeJWT(response.authorization.id_token);

    // Validate token expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      throw new Error('Token has expired');
    }

    // Validate audience
    const clientId = import.meta.env.PUBLIC_APPLE_SERVICES_ID;
    if (payload.aud !== clientId) {
      throw new Error('Invalid token audience');
    }

    // Validate issuer
    if (!payload.iss.startsWith('https://appleid.apple.com')) {
      throw new Error('Invalid token issuer');
    }

    // Validate email if present
    if (payload.email && !payload.email_verified) {
      throw new Error('Email not verified');
    }

    // Check rate limiting using email or subject as identifier
    const identifier = payload.email || payload.sub;
    if (isRateLimited(identifier)) {
      throw new Error('Too many failed attempts. Please try again later.');
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: response.authorization.id_token,
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
    console.error('Apple sign in error:', error);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();

    // Also sign out from Apple if available
    if (isAppleScriptLoaded()) {
      window.AppleID.auth.signOut();
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
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
 * Handle Apple Sign In callback (for redirect flow)
 */
export const handleAppleCallback = async (): Promise<any> => {
  try {
    // This would be used for redirect flow if needed in the future
    // For now, we're using popup flow
    throw new Error('Redirect flow not implemented. Use popup flow instead.');
  } catch (error) {
    console.error('Apple callback error:', error);
    throw new Error('Redirect flow not implemented. Use popup flow instead.');
  }
};
