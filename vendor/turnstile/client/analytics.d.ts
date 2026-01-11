/**
 * Type declarations for analytics libraries that don't have official TypeScript definitions.
 * These libraries use default exports, so we must declare them as such.
 */

declare module 'analytics' {
    export interface AnalyticsInstance {
        track(eventName: string, properties?: Record<string, unknown>): void;
        page(properties?: Record<string, unknown>): void;
        identify(userId: string, traits?: Record<string, unknown>): void;
    }

    export interface AnalyticsConfig {
        app: string;
        debug?: boolean;
        plugins?: unknown[];
    }

    // biome-ignore lint/style/noDefaultExport: External library uses default export
    export default function Analytics(config: AnalyticsConfig): AnalyticsInstance;
}

declare module '@analytics/google-analytics' {
    export interface GoogleAnalyticsPluginConfig {
        measurementIds: string[];
    }

    export interface GoogleAnalyticsPlugin {
        name: string;
    }

    // biome-ignore lint/style/noDefaultExport: External library uses default export
    export default function googleAnalytics(
        config: GoogleAnalyticsPluginConfig
    ): GoogleAnalyticsPlugin;
}
