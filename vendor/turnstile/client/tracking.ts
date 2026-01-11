/**
 * tracking
 *
 * Universal analytics tracking abstraction layer.
 * Integrates with Google Analytics, Microsoft Clarity, and Sentry.
 *
 * @example
 * ```typescript
 * import { initTracker, trackEvent } from 'tracking';
 *
 * // Initialize
 * initTracker({
 *   googleAnalyticsId: 'G-XXXXXXXXXX',
 *   microsoftClarityId: 'abc123',
 *   sentryEnabled: true,
 * });
 *
 * // Track events
 * trackEvent('button_clicked', { buttonName: 'Subscribe' });
 * ```
 */

import googleAnalyticsPlugin from '@analytics/google-analytics';
import Analytics, { type AnalyticsPlugin } from 'analytics';

// ============================================================================
// Types
// ============================================================================

export interface TrackerConfig {
    /** Google Analytics 4 Measurement ID (e.g., 'G-XXXXXXXXXX') */
    googleAnalyticsId?: string;
    /** Microsoft Clarity Project ID */
    microsoftClarityId?: string;
    /** Enable Sentry breadcrumb tracking */
    sentryEnabled?: boolean;
    /** Debug mode - logs events to console */
    debug?: boolean;
}

export interface TrackingEvent {
    /** Event name (e.g., 'button_clicked', 'page_viewed') */
    name: string;
    /** Event parameters */
    params?: Record<string, unknown>;
}

export interface PageViewEvent {
    /** Page path (e.g., '/pricing') */
    path?: string;
    /** Page title */
    title?: string;
    /** Additional properties */
    properties?: Record<string, unknown>;
}

export interface UserIdentity {
    /** User ID */
    userId: string;
    /** User traits/attributes */
    traits?: Record<string, unknown>;
}

// ============================================================================
// Microsoft Clarity Plugin
// ============================================================================

/**
 * Custom Analytics.js plugin for Microsoft Clarity.
 * Clarity doesn't have an official Analytics.js plugin, so we build one.
 */
function clarityPlugin(config: { projectId: string }) {
    return {
        name: 'microsoft-clarity',
        config,
        initialize: () => {
            // Clarity is loaded via script tag in the HTML head
            // We just need to verify it's available
            if (typeof window !== 'undefined' && !window.clarity) {
                console.warn('[Tracking] Microsoft Clarity not loaded');
            }
        },
        track: ({
            payload,
        }: {
            payload: { event: string; properties?: Record<string, unknown> };
        }) => {
            if (typeof window !== 'undefined' && window.clarity) {
                // Use Clarity's custom tag feature to mark events
                // This allows filtering recordings by event in Clarity dashboard
                window.clarity('set', payload.event, JSON.stringify(payload.properties || {}));
            }
        },
        page: ({ payload }: { payload: { properties?: Record<string, unknown> } }) => {
            if (typeof window !== 'undefined' && window.clarity) {
                // Track page views as custom tags
                window.clarity('set', 'page_view', JSON.stringify(payload.properties || {}));
            }
        },
        identify: ({
            payload,
        }: {
            payload: { userId: string; traits?: Record<string, unknown> };
        }) => {
            if (typeof window !== 'undefined' && window.clarity) {
                // Identify user in Clarity
                window.clarity('identify', payload.userId, undefined, undefined, payload.traits);
            }
        },
    };
}

// ============================================================================
// Sentry Plugin
// ============================================================================

/**
 * Custom Analytics.js plugin for Sentry breadcrumbs.
 * Adds analytics events as breadcrumbs to Sentry error reports.
 */
function sentryPlugin() {
    return {
        name: 'sentry-breadcrumbs',
        initialize: () => {
            // Sentry is initialized via @sentry/astro
            // We just add breadcrumbs to existing instance
        },
        track: ({
            payload,
        }: {
            payload: { event: string; properties?: Record<string, unknown> };
        }) => {
            if (typeof window !== 'undefined') {
                // Dynamically import Sentry to avoid bundling issues
                import('@sentry/browser')
                    .then((Sentry) => {
                        Sentry.addBreadcrumb({
                            category: 'user-action',
                            message: payload.event,
                            data: payload.properties,
                            level: 'info',
                        });
                    })
                    .catch(() => {
                        // Sentry not available, silently fail
                    });
            }
        },
        page: ({ payload }: { payload: { properties?: Record<string, unknown> } }) => {
            if (typeof window !== 'undefined') {
                import('@sentry/browser')
                    .then((Sentry) => {
                        Sentry.addBreadcrumb({
                            category: 'navigation',
                            message: 'page_view',
                            data: payload.properties,
                            level: 'info',
                        });
                    })
                    .catch(() => {
                        // Sentry not available, silently fail
                    });
            }
        },
    };
}

// ============================================================================
// Global Analytics Instance
// ============================================================================

let analyticsInstance: ReturnType<typeof Analytics> | null = null;

// ============================================================================
// Public API
// ============================================================================

/**
 * Initialize the analytics tracker with configured providers.
 *
 * @param config - Tracker configuration
 *
 * @example
 * ```typescript
 * initTracker({
 *   googleAnalyticsId: 'G-S3D3Q82DSX',
 *   microsoftClarityId: 'topkp7sgz2',
 *   sentryEnabled: true,
 * });
 * ```
 */
export function initTracker(config: TrackerConfig): void {
    if (typeof window === 'undefined') {
        console.warn('[Tracking] Cannot initialize tracker in non-browser environment');
        return;
    }

    if (analyticsInstance) {
        console.warn('[Tracking] Tracker already initialized');
        return;
    }

    const plugins: AnalyticsPlugin[] = [];

    // Add Google Analytics plugin
    if (config.googleAnalyticsId) {
        plugins.push(
            googleAnalyticsPlugin({
                measurementIds: [config.googleAnalyticsId],
                // Use standard dataLayer instead of custom ga4DataLayer
                // This ensures compatibility with Partytown's forward configuration
                dataLayerName: 'dataLayer',
                // Enable GA4 DebugView when debug mode is on
                gtagConfig: config.debug
                    ? {
                          debug_mode: true,
                      }
                    : undefined,
            })
        );
    }

    // Add Microsoft Clarity plugin
    if (config.microsoftClarityId) {
        plugins.push(clarityPlugin({ projectId: config.microsoftClarityId }));
    }

    // Add Sentry plugin
    if (config.sentryEnabled) {
        plugins.push(sentryPlugin());
    }

    // Initialize Analytics.js
    analyticsInstance = Analytics({
        app: 'surfing',
        debug: config.debug || false,
        plugins,
    });

    if (config.debug) {
        console.log(
            '[Tracking] Initialized with plugins:',
            plugins.map((p) => p.name)
        );
    }
}

/**
 * Track a custom event.
 *
 * @param eventName - Event name (e.g., 'button_clicked')
 * @param params - Event parameters
 *
 * @example
 * ```typescript
 * trackEvent('pricing_cta_clicked', {
 *   tier: 'standard',
 *   billingCycle: 'monthly',
 * });
 * ```
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
    if (!analyticsInstance) {
        console.warn('[Tracking] Tracker not initialized. Call initTracker() first.');
        return;
    }

    analyticsInstance.track(eventName, params || {});
}

/**
 * Track a page view.
 *
 * @param event - Page view event data
 *
 * @example
 * ```typescript
 * trackPageView({
 *   path: '/pricing',
 *   title: 'Pricing - Surfing',
 * });
 * ```
 */
export function trackPageView(event?: PageViewEvent): void {
    if (!analyticsInstance) {
        console.warn('[Tracking] Tracker not initialized. Call initTracker() first.');
        return;
    }

    analyticsInstance.page(event?.properties || {});
}

/**
 * Identify a user.
 *
 * @param userId - User ID
 * @param traits - User traits/attributes
 *
 * @example
 * ```typescript
 * identifyUser('user-123', {
 *   email: 'user@example.com',
 *   plan: 'standard',
 * });
 * ```
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
    if (!analyticsInstance) {
        console.warn('[Tracking] Tracker not initialized. Call initTracker() first.');
        return;
    }

    analyticsInstance.identify(userId, traits || {});
}

/**
 * Get the analytics instance (for advanced usage).
 * @internal
 */
export function getAnalyticsInstance(): ReturnType<typeof Analytics> | null {
    return analyticsInstance;
}

// ============================================================================
// Type Augmentation for Window
// ============================================================================

declare global {
    interface Window {
        clarity?: (
            method: 'set' | 'identify',
            key: string,
            value?: string,
            sessionId?: string,
            customData?: Record<string, unknown>
        ) => void;
    }
}
