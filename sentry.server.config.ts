import * as Sentry from '@sentry/astro';

// Note: We can't import from src/lib/config here due to server context limitations
// So we'll read the config value directly
const SENTRY_DEBUG = false; // Match config.yaml sentry.debug value

// Get Sentry DSN from environment or use hardcoded value
const sentryDsn = process.env.PUBLIC_SENTRY_DSN || '';
const environment = process.env.MODE || 'production';
const isProduction = environment === 'production';

Sentry.init({
  dsn: sentryDsn,

  // Environment configuration
  environment,

  // Server-side specific: include request data for debugging
  sendDefaultPii: isProduction,

  // Sample rate for error events
  sampleRate: 1.0,

  // Sample rate for performance monitoring
  tracesSampleRate: isProduction ? 0.1 : 0.0,

  // Server-side integrations
  integrations: [Sentry.httpIntegration()],

  // Filter sensitive data before sending
  beforeSend(event, _hint) {
    // Don't send events in development unless debug mode is enabled in config
    if (!isProduction && !SENTRY_DEBUG) {
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
            .replace(/SUPABASE_[A-Z_]*=.*/g, 'SUPABASE_[REDACTED]')
            .replace(/[0-9]{13,}/g, '[REDACTED_ID]');
        }
        return exception;
      });
    }

    // Remove authentication headers and cookies
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
      delete event.request.headers['set-cookie'];
    }

    // Remove sensitive environment variables
    if (event.contexts?.runtime?.env) {
      const env = event.contexts.runtime.env as Record<string, any>;
      Object.keys(env).forEach((key) => {
        if (key.includes('KEY') || key.includes('SECRET') || key.includes('TOKEN') || key.includes('PASSWORD')) {
          env[key] = '[REDACTED]';
        }
      });
    }

    return event;
  },

  // Ignore common errors
  ignoreErrors: ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'Network request failed'],
});
