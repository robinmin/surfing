// Third-party module declarations (no @types packages available)
declare module '@analytics/google-analytics' {
    interface GoogleAnalyticsConfig {
        measurementIds: string[];
        dataLayerName?: string;
        gtagConfig?: Record<string, unknown>;
    }

    interface GoogleAnalyticsPlugin {
        name: string;
        config: GoogleAnalyticsConfig;
        initialize: () => void;
        track: (payload: {
            payload: { event: string; properties?: Record<string, unknown> };
        }) => void;
        page: (payload: { payload: { properties?: Record<string, unknown> } }) => void;
        identify: (payload: {
            payload: { userId: string; traits?: Record<string, unknown> };
        }) => void;
    }

    // biome-ignore lint/style/noDefaultExport: Must match actual module's default export signature
    export default function googleAnalyticsPlugin(
        config: GoogleAnalyticsConfig
    ): GoogleAnalyticsPlugin;
}

// Global Window type declarations
// Note: __OIDC_CONFIG__ is declared in vendor/turnstile/client/auth/oidc.ts
declare global {
    interface Window {
        __OIDC_INIT_PROMISE__?: Promise<void>;
        __OIDC_INIT_RESOLVE__?: () => void;
    }
}

export {};
