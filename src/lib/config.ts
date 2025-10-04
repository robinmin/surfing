/**
 * Configuration loader for application settings
 */

export interface SentryConfig {
  enabled: boolean;
  debug: boolean;
}

export interface AuthConfig {
  auth: {
    google_one_tap: {
      enabled: boolean;
    };
    apple_sign_in: {
      enabled: boolean;
    };
    token_cache_duration: number;
  };
}

// Static configuration based on YAML
const AUTH_CONFIG: AuthConfig['auth'] = {
  google_one_tap: {
    enabled: true,
  },
  apple_sign_in: {
    enabled: false,
  },
  token_cache_duration: 900, // 15 minutes in seconds
};

// Sentry configuration based on YAML
const SENTRY_CONFIG: SentryConfig = {
  enabled: true,
  debug: false,
};

/**
 * Get authentication configuration
 */
export const getAuthConfig = (): AuthConfig['auth'] => {
  return AUTH_CONFIG;
};

/**
 * Check if Google One Tap is enabled
 */
export const isGoogleOneTapEnabled = (): boolean => {
  try {
    const config = getAuthConfig();
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
export const isAppleSignInEnabled = (): boolean => {
  try {
    const config = getAuthConfig();
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
export const getEnabledAuthMethods = (): {
  google: boolean;
  apple: boolean;
  showDivider: boolean;
} => {
  const googleEnabled = isGoogleOneTapEnabled();
  const appleEnabled = isAppleSignInEnabled();

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
export const getTokenCacheDuration = (): number => {
  return AUTH_CONFIG.token_cache_duration;
};

/**
 * Get Sentry configuration
 */
export const getSentryConfig = (): SentryConfig => {
  return SENTRY_CONFIG;
};
