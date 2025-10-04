/**
 * Environment utilities for safely accessing environment variables
 */

/**
 * Safely get an environment variable with fallback
 */
export const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || fallback;
    }

    // Check if we're in a Node.js environment (for SSR)
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || fallback;
    }

    return fallback;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return fallback;
  }
};

/**
 * Get public environment variable (browser-safe)
 */
export const getPublicEnvVar = (key: string, fallback: string = ''): string => {
  try {
    if (typeof import.meta.env !== 'undefined') {
      return import.meta.env[key] || fallback;
    }
    return fallback;
  } catch (error) {
    console.warn(`Failed to access public environment variable ${key}:`, error);
    return fallback;
  }
};

/**
 * Authentication configuration
 */
export const authConfig = {
  google: {
    clientId: getPublicEnvVar('PUBLIC_GOOGLE_CLIENT_ID', ''),
    isEnabled: getPublicEnvVar('PUBLIC_GOOGLE_CLIENT_ID', '') !== '',
  },
  apple: {
    servicesId: getPublicEnvVar('PUBLIC_APPLE_SERVICES_ID', ''),
    redirectUri: getPublicEnvVar('PUBLIC_APPLE_REDIRECT_URI', ''),
    isEnabled:
      getPublicEnvVar('PUBLIC_APPLE_SERVICES_ID', '') !== '' && getPublicEnvVar('PUBLIC_APPLE_REDIRECT_URI', '') !== '',
  },
};
