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
      return import.meta.env[key] || fallback
    }

    // Check if we're in a Node.js environment (for SSR)
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || fallback
    }

    return fallback
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error)
    return fallback
  }
}

/**
 * Get public environment variable (browser-safe)
 */
export const getPublicEnvVar = (key: string, fallback: string = ''): string => {
  try {
    if (typeof import.meta.env !== 'undefined') {
      return import.meta.env[key] || fallback
    }
    return fallback
  } catch (error) {
    console.warn(`Failed to access public environment variable ${key}:`, error)
    return fallback
  }
}

/**
 * Zitadel authentication configuration
 */
export const authConfig = {
  zitadel: {
    authority: getPublicEnvVar('PUBLIC_ZITADEL_AUTHORITY', ''),
    clientId: getPublicEnvVar('PUBLIC_ZITADEL_CLIENT_ID', ''),
    redirectUri: getPublicEnvVar('PUBLIC_ZITADEL_REDIRECT_URI', ''),
    postLogoutUri: getPublicEnvVar('PUBLIC_ZITADEL_POST_LOGOUT_URI', ''),
    orgId: getPublicEnvVar('PUBLIC_ZITADEL_ORG_ID', ''),
    isEnabled:
      getPublicEnvVar('PUBLIC_ZITADEL_AUTHORITY', '') !== '' &&
      getPublicEnvVar('PUBLIC_ZITADEL_CLIENT_ID', '') !== '',
    idpHints: {
      google: getPublicEnvVar('PUBLIC_ZITADEL_IDP_GOOGLE', ''),
      github: getPublicEnvVar('PUBLIC_ZITADEL_IDP_GITHUB', ''),
      apple: getPublicEnvVar('PUBLIC_ZITADEL_IDP_APPLE', ''),
      microsoft: getPublicEnvVar('PUBLIC_ZITADEL_IDP_MICROSOFT', ''),
    },
  },
}
