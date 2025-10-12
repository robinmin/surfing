/**
 * Configuration loader for application settings
 *
 * This module now loads configuration from the virtual module provided by Astro integration
 * which reads from config.yaml and makes it available to client-side code.
 */

export interface SentryConfig {
  enabled: boolean;
  debug: boolean;
  project: string;
  org: string;
}

export interface AuthConfig {
  google_one_tap: {
    enabled: boolean;
  };
  apple_sign_in: {
    enabled: boolean;
  };
  token_cache_duration: number;
}

// Cache for configuration to avoid repeated imports
let authConfigCache: AuthConfig | null = null;
let sentryConfigCache: SentryConfig | null = null;

/**
 * Get authentication configuration from config.yaml via virtual module
 */
export const getAuthConfig = async (): Promise<AuthConfig> => {
  if (authConfigCache) {
    return authConfigCache;
  }

  try {
    const configModule = (await import('astrowind:config')) as any;
    const AUTH = configModule.AUTH || {};
    authConfigCache = {
      google_one_tap: { enabled: true, ...AUTH.google_one_tap },
      apple_sign_in: { enabled: false, ...AUTH.apple_sign_in },
      token_cache_duration: AUTH.token_cache_duration || 900,
    };
    return authConfigCache;
  } catch (error) {
    console.warn('Failed to load auth config from virtual module, using defaults:', error);
    const fallback: AuthConfig = {
      google_one_tap: { enabled: true },
      apple_sign_in: { enabled: false },
      token_cache_duration: 900,
    };
    authConfigCache = fallback;
    return fallback;
  }
};

/**
 * Check if Google One Tap is enabled
 */
export const isGoogleOneTapEnabled = async (): Promise<boolean> => {
  try {
    const config = await getAuthConfig();
    const clientId = import.meta.env?.PUBLIC_GOOGLE_CLIENT_ID || '';

    // Must have client ID configured
    if (!clientId) {
      return false;
    }

    // In development, only enable if client ID is configured for localhost
    if (import.meta.env.DEV) {
      // Check if we're on localhost
      const isLocalhost =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      if (isLocalhost) {
        // For localhost development, require a client ID that includes 'localhost' or is Google's test client ID
        const isValidLocalhostClientId =
          clientId.includes('localhost') ||
          clientId.includes('test') ||
          clientId === '511333300252-2d54h6n4th9q0c3r1ed7k4eq9c5dj7v.apps.googleusercontent.com' || // Google's test client ID
          clientId === '644801417181-e1glvt4j9tpsaakvfqrlfrq56m277e4f.apps.googleusercontent.com'; // Google's official test client ID

        if (!isValidLocalhostClientId) {
          console.warn(
            "Google One Tap disabled in development: Client ID not configured for localhost. Use Google's test client ID or configure OAuth for localhost."
          );
          return false;
        }
      }
    }

    return config.google_one_tap.enabled;
  } catch (error) {
    console.warn('Failed to check Google One Tap configuration:', error);
    return false;
  }
};

/**
 * Check if Apple Sign In is enabled
 */
export const isAppleSignInEnabled = async (): Promise<boolean> => {
  try {
    const config = await getAuthConfig();
    const hasServicesId = (import.meta.env?.PUBLIC_APPLE_SERVICES_ID || '') !== '';
    const hasRedirectUri = (import.meta.env?.PUBLIC_APPLE_REDIRECT_URI || '') !== '';
    return config.apple_sign_in.enabled && hasServicesId && hasRedirectUri;
  } catch (error) {
    console.warn('Failed to check Apple Sign In configuration:', error);
    return false;
  }
};

/**
 * Get enabled authentication methods
 */
export const getEnabledAuthMethods = async (): Promise<{
  google: boolean;
  apple: boolean;
  showDivider: boolean;
}> => {
  const googleEnabled = await isGoogleOneTapEnabled();
  const appleEnabled = await isAppleSignInEnabled();

  return {
    google: googleEnabled,
    apple: appleEnabled,
    showDivider: googleEnabled && appleEnabled,
  };
};

/**
 * Get token cache duration in seconds
 * @returns Cache duration in seconds (default: 900 = 15 minutes)
 */
export const getTokenCacheDuration = async (): Promise<number> => {
  const config = await getAuthConfig();
  return config.token_cache_duration;
};

/**
 * Get Sentry configuration
 */
export const getSentryConfig = async (): Promise<SentryConfig> => {
  if (sentryConfigCache) {
    return sentryConfigCache;
  }

  try {
    const configModule = (await import('astrowind:config')) as any;
    const SENTRY = configModule.SENTRY || {};
    sentryConfigCache = {
      enabled: SENTRY.enabled !== undefined ? SENTRY.enabled : true,
      debug: SENTRY.debug !== undefined ? SENTRY.debug : false,
      project: SENTRY.project || import.meta.env.PUBLIC_SENTRY_PROJECT || '4510129071783936',
      org: SENTRY.org || import.meta.env.PUBLIC_SENTRY_ORG || '40fintech',
    };
    return sentryConfigCache;
  } catch (error) {
    console.warn('Failed to load Sentry config from virtual module, using defaults:', error);
    const fallback: SentryConfig = {
      enabled: true,
      debug: false,
      project: import.meta.env.PUBLIC_SENTRY_PROJECT || '4510129071783936',
      org: import.meta.env.PUBLIC_SENTRY_ORG || '40fintech',
    };
    sentryConfigCache = fallback;
    return fallback;
  }
};
