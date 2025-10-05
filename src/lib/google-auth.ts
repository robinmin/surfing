/**
 * Google Authentication Utilities
 *
 * This module provides utilities for Google One Tap authentication,
 * including script loading, configuration, and integration with Supabase.
 */

import { supabase } from './supabase';
import { recordFailedAttempt, clearFailedAttempts, isRateLimited } from './security';
import { handleAuthError } from './error-handler';

/**
 * Google One Tap configuration interface
 */
export interface GoogleOneTapConfig {
  client_id: string;
  auto_select: boolean;
  cancel_on_tap_outside: boolean;
  context: 'signin' | 'signup' | 'use';
  nonce?: string;
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
          renderButton: (parent: HTMLElement, options: any) => void;
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
export const getGoogleConfig = async (): Promise<GoogleOneTapConfig> => {
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

  // Generate nonce for security
  // Per Supabase docs: hash the nonce for Google, but pass raw nonce to Supabase
  const { generateNonce, sha256 } = await import('~/utils/crypto');
  const nonce = generateNonce();
  const hashedNonce = await sha256(nonce);

  // Store raw nonce for Supabase validation
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('google_auth_nonce', nonce);
  }

  return {
    client_id: clientId,
    auto_select: false,
    cancel_on_tap_outside: false,
    context: 'signin',
    nonce: hashedNonce, // Send hashed nonce to Google
    itp_support: true,
  };
};

/**
 * Flag to prevent duplicate initialization
 */
let isInitializing = false;

/**
 * Initialize Google One Tap with secure nonce handling and FedCM support
 *
 * @param onSuccess - Callback function when user successfully signs in with Google
 * @param onError - Optional error callback if initialization fails
 *
 * @example
 * ```typescript
 * await initializeGoogleOneTap(
 *   (response) => console.log('Sign in success:', response),
 *   (error) => console.error('Sign in error:', error)
 * );
 * ```
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
  const originalConsoleError = console.error;

  // Suppress FedCM-related errors
  window.onerror = (message, source, lineno, colno, error) => {
    if (
      typeof message === 'string' &&
      (message.includes('FedCM get() rejects') ||
        message.includes('signal is aborted') ||
        message.includes('request has been aborted') ||
        message.includes('GSI_LOGGER') ||
        message.includes('Google One Tap was not displayed') ||
        message.includes('Google One Tap initialization error'))
    ) {
      return true; // Suppress the error
    }
    // Call original handler for other errors
    if (originalHandler) {
      return originalHandler(message, source, lineno, colno, error);
    }
    return false;
  };

  // Also suppress console.error calls for FedCM issues
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (
      message.includes('FedCM get() rejects') ||
      message.includes('signal is aborted') ||
      message.includes('request has been aborted') ||
      message.includes('GSI_LOGGER') ||
      message.includes('Google One Tap was not displayed') ||
      message.includes('Google One Tap initialization error')
    ) {
      return; // Suppress console.error
    }
    return originalConsoleError.apply(console, args);
  };

  try {
    // Check if client ID is properly configured
    const clientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your-production-google-client-id-here') {
      throw new Error('Google OAuth client ID not configured. Please configure your Google OAuth credentials.');
    }

    // Load Google script if not already loaded
    await loadGoogleScript();

    // Get configuration with nonce for security
    const config = await getGoogleConfig();

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
    // Restore original handlers after a delay
    setTimeout(() => {
      window.onerror = originalHandler;
      console.error = originalConsoleError;
    }, 3000);
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
      // Add configuration to prevent FedCM errors
      ux_mode: 'popup',
    });

    // Don't automatically show prompt to prevent FedCM errors
    // Let user click the sign-in button instead
    console.debug('Google One Tap initialized successfully (prompt disabled to prevent FedCM errors)');

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
    console.debug('Google One Tap initialization error:', error);
    if (onError) {
      onError(new Error('Failed to initialize Google Sign-In'));
    }
  }
};

/**
 * Sign in with Google using ID token with enhanced security
 *
 * @param credential - Google ID token (JWT) from Google One Tap
 * @returns Supabase session data containing user information
 * @throws Error if token validation fails, rate limiting is triggered, or Supabase auth fails
 *
 * @example
 * ```typescript
 * const session = await signInWithGoogle(googleIdToken);
 * console.log('Logged in user:', session.user.email);
 * ```
 */
export const signInWithGoogle = async (credential: string): Promise<any> => {
  try {
    // Decode and validate token
    const payload = (await decodeJWT(credential)) as GoogleIdTokenPayload;
    const { AuthProviderUtils } = await import('./auth-provider');
    const clientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;

    // Perform comprehensive token validation
    if (AuthProviderUtils.isTokenExpired(payload.exp)) {
      throw new Error('Token has expired');
    }

    if (!AuthProviderUtils.validateAudience(payload, clientId)) {
      throw new Error('Invalid token audience');
    }

    if (!AuthProviderUtils.validateIssuer(payload, 'https://accounts.google.com')) {
      throw new Error('Invalid token issuer');
    }

    if (!AuthProviderUtils.validateEmailVerified(payload)) {
      throw new Error('Email not verified');
    }

    // Get stored nonce for Supabase
    // Note: We don't validate the nonce ourselves - Supabase does this
    // Supabase compares hash(storedNonce) with payload.nonce
    let storedNonce: string | null = null;
    if (typeof sessionStorage !== 'undefined') {
      storedNonce = sessionStorage.getItem('google_auth_nonce');
      // Clear the nonce after retrieval to prevent reuse
      if (storedNonce) {
        sessionStorage.removeItem('google_auth_nonce');
      }
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

    // Pass the original nonce to Supabase for validation
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credential,
      nonce: storedNonce || undefined,
    });

    if (error) {
      // Record failed attempt
      recordFailedAttempt(identifier);
      throw error;
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(identifier);

    // Update token guardian cache on successful login
    if (data.user) {
      const { updateTokenCache } = await import('./token-guardian');
      updateTokenCache(data.user.id, data.user.email, data.user.user_metadata);

      // Notify other tabs about login
      const { notifyLogin } = await import('./auth-sync');
      notifyLogin(data.user.id);
    }

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
 * Decode JWT token (uses shared utility)
 */
export const decodeJWT = async (token: string): Promise<any> => {
  const { AuthProviderUtils } = await import('./auth-provider');
  return AuthProviderUtils.decodeJWT(token);
};

/**
 * Sign out current user and clear token cache
 * Uses Supabase's built-in cleanup methods
 */
export const signOut = async (): Promise<void> => {
  try {
    if (!supabase) {
      throw new Error('Authentication service not available');
    }

    // Clear token guardian cache first (our custom cache, not handled by Supabase)
    const { clearTokenCache } = await import('./token-guardian');
    clearTokenCache();

    // Notify other tabs about logout before signing out
    const { notifyLogout } = await import('./auth-sync');
    notifyLogout();

    // Use Supabase's built-in signOut which automatically clears:
    // - User from browser session
    // - All localStorage items
    // - Triggers "SIGNED_OUT" event
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    console.debug('Supabase sign out completed successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out');
  }
};

/**
 * Get current session with token guardian caching
 * Reduces unnecessary auth server checks by using cached validation
 *
 * @param skipCache - If true, bypass cache and fetch fresh session from auth server
 * @returns Session object if user is authenticated, null otherwise
 *
 * @example
 * ```typescript
 * // Get session (may use cache)
 * const session = await getCurrentSession();
 *
 * // Force fresh session fetch
 * const freshSession = await getCurrentSession(true);
 * ```
 */
export const getCurrentSession = async (skipCache = false) => {
  try {
    if (!supabase) {
      throw new Error('Authentication service not available');
    }

    // Use token guardian cache unless explicitly skipped
    if (!skipCache) {
      const { isCacheValid, getCachedTokenInfo } = await import('./token-guardian');

      // If cache is valid, return cached session info
      if (isCacheValid()) {
        const cachedInfo = getCachedTokenInfo();
        if (cachedInfo) {
          console.debug('Using cached token validation', {
            userId: cachedInfo.userId,
            cacheAge: Math.floor((Date.now() - cachedInfo.timestamp) / 1000) + 's',
          });

          // Return lightweight session object from cache
          // Full session will be fetched only when cache expires
          return {
            user: {
              id: cachedInfo.userId,
              email: cachedInfo.email,
              user_metadata: cachedInfo.userMetadata,
            },
            cached: true,
          };
        }
      }
    }

    // Cache expired or skipped - fetch fresh session from auth server
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    // Update cache with fresh validation
    if (session?.user) {
      const { updateTokenCache } = await import('./token-guardian');
      updateTokenCache(session.user.id, session.user.email, session.user.user_metadata);
    }

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
