/**
 * Configuration loader for application settings
 *
 * This module loads configuration from the virtual module provided by Astro integration
 * which reads from config.yaml and makes it available to client-side code.
 */

export interface SentryConfig {
    enabled: boolean;
    debug: boolean;
    project: string;
    org: string;
}

export interface ZitadelAuthConfig {
    enabled: boolean;
    providers: {
        google: boolean;
        github: boolean;
        apple: boolean;
        microsoft: boolean;
    };
    popup: {
        width: number;
        height: number;
    };
    silent_renewal: boolean;
}

interface RawConfigModule {
    AUTH?: {
        zitadel?: {
            enabled?: boolean;
            providers?: {
                google?: boolean;
                github?: boolean;
                apple?: boolean;
                microsoft?: boolean;
            };
            popup?: {
                width?: number;
                height?: number;
            };
            silent_renewal?: boolean;
        };
    };
    SENTRY?: {
        enabled?: boolean;
        debug?: boolean;
        project?: string;
        org?: string;
    };
}

// Cache for configuration to avoid repeated imports
let authConfigCache: ZitadelAuthConfig | null = null;
let sentryConfigCache: SentryConfig | null = null;

/**
 * Get Zitadel authentication configuration from config.yaml via virtual module
 */
export const getAuthConfig = async (): Promise<ZitadelAuthConfig> => {
    if (authConfigCache) {
        return authConfigCache;
    }

    try {
        const configModule = (await import('astrowind:config')) as unknown as RawConfigModule;
        const AUTH = configModule.AUTH || {};
        const zitadel = AUTH.zitadel || {};

        authConfigCache = {
            enabled: zitadel.enabled !== undefined ? zitadel.enabled : true,
            providers: {
                google: zitadel.providers?.google !== undefined ? zitadel.providers.google : true,
                github: zitadel.providers?.github !== undefined ? zitadel.providers.github : true,
                apple: zitadel.providers?.apple !== undefined ? zitadel.providers.apple : true,
                microsoft:
                    zitadel.providers?.microsoft !== undefined ? zitadel.providers.microsoft : true,
            },
            popup: {
                width: zitadel.popup?.width || 500,
                height: zitadel.popup?.height || 600,
            },
            silent_renewal: zitadel.silent_renewal !== undefined ? zitadel.silent_renewal : true,
        };
        return authConfigCache;
    } catch (error) {
        console.warn('Failed to load auth config from virtual module, using defaults:', error);
        const fallback: ZitadelAuthConfig = {
            enabled: true,
            providers: {
                google: true,
                github: true,
                apple: true,
                microsoft: true,
            },
            popup: {
                width: 500,
                height: 600,
            },
            silent_renewal: true,
        };
        authConfigCache = fallback;
        return fallback;
    }
};

/**
 * Check if Zitadel authentication is enabled
 */
export const isZitadelAuthEnabled = async (): Promise<boolean> => {
    try {
        const config = await getAuthConfig();
        const authority = import.meta.env?.PUBLIC_ZITADEL_AUTHORITY || '';
        const clientId = import.meta.env?.PUBLIC_ZITADEL_CLIENT_ID || '';

        // Must have authority and client ID configured
        if (!authority || !clientId) {
            return false;
        }

        return config.enabled;
    } catch (error) {
        console.warn('Failed to check Zitadel configuration:', error);
        return false;
    }
};

/**
 * Get enabled authentication providers
 */
export const getEnabledProviders = async (): Promise<{
    google: boolean;
    github: boolean;
    apple: boolean;
    microsoft: boolean;
}> => {
    const config = await getAuthConfig();
    return config.providers;
};

/**
 * Get Sentry configuration
 */
export const getSentryConfig = async (): Promise<SentryConfig> => {
    if (sentryConfigCache) {
        return sentryConfigCache;
    }

    try {
        const configModule = (await import('astrowind:config')) as unknown as RawConfigModule;
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
