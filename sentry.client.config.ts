import * as Sentry from '@sentry/astro';
import { getSentryConfig } from './src/lib/config';

// Get Sentry configuration
const sentryConfig = getSentryConfig();
const sentryDsn = import.meta.env.PUBLIC_SENTRY_DSN || '';
const environment = import.meta.env.MODE || 'production';
const isProduction = environment === 'production';

Sentry.init({
  dsn: sentryDsn,

  // Environment configuration
  environment,

  // Adds request headers and IP for users
  // Only enable in production for privacy
  sendDefaultPii: isProduction,

  // Sample rate for error events (1.0 = 100%)
  sampleRate: 1.0,

  // Sample rate for performance monitoring
  tracesSampleRate: isProduction ? 0.1 : 0.0, // 10% in production, 0% in dev

  // Replay sampling rates
  replaysSessionSampleRate: 0.0, // 0% session replays
  replaysOnErrorSampleRate: isProduction ? 0.1 : 0.0, // 10% error replays in production

  // Enable performance monitoring
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out sensitive data
  beforeSend(event, _hint) {
    // Don't send events in development unless debug mode is enabled in config
    if (!isProduction && !sentryConfig.debug) {
      return null;
    }

    // Remove sensitive data from error messages
    if (event.exception?.values) {
      event.exception.values = event.exception.values.map((exception) => {
        if (exception.value) {
          // Remove tokens, keys, and other sensitive data
          exception.value = exception.value
            .replace(/sk-[a-zA-Z0-9-_]{20,}/g, '[REDACTED_API_KEY]')
            .replace(/ey[a-zA-Z0-9-_]{20,}\.[a-zA-Z0-9-_]{20,}\.[a-zA-Z0-9-_]{20,}/g, '[REDACTED_JWT]')
            .replace(/[0-9]{13,}/g, '[REDACTED_ID]');
        }
        return exception;
      });
    }

    // Remove authentication tokens from request data
    if (event.request?.headers) {
      delete event.request.headers.Authorization;
      delete event.request.headers.Cookie;
    }

    return event;
  },

  // Ignore common errors that aren't actionable
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension://',
    'moz-extension://',

    // Network errors (user's connectivity issues)
    'Network request failed',
    'NetworkError',
    'Failed to fetch',

    // User cancelled actions
    'AbortError',
    'User denied',
    'popup_closed_by_user',

    // ResizeObserver errors (non-critical)
    'ResizeObserver loop limit exceeded',
  ],

  // Don't send events from these URLs (bots, scrapers)
  denyUrls: [
    /graph\.facebook\.com/i,
    /connect\.facebook\.net/i,
    /eatdifferent\.com\.woopra-ns\.com/i,
    /static\.woopra\.com/i,
  ],
});
