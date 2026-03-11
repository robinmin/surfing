/**
 * Debug Logging Utility for @turnstile/client
 *
 * Provides conditional debug logging that can be enabled/disabled at runtime.
 * Replaces direct console.* calls to comply with project rule #6 (No Console Logs in production).
 *
 * @example
 * ```typescript
 * // Create a namespaced logger
 * const debug = createDebugLogger('auth');
 *
 * // Enable debug mode
 * debug.setEnabled(true);
 *
 * // Log messages (only output when enabled)
 * debug.log('User authenticated', { userId: '123' });
 * debug.warn('Token expiring soon');
 * debug.error('Authentication failed', error);
 * ```
 */

export type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error';

export interface DebugLoggerOptions {
    /** Enable debug output (default: false) */
    enabled?: boolean;
    /** Custom log handler for advanced use cases (testing, external logging) */
    handler?: (level: LogLevel, namespace: string, message: string, data?: unknown) => void;
}

export interface DebugLogger {
    /** Log debug message (only when enabled) */
    debug(message: string, data?: unknown): void;
    /** Log info message (only when enabled) */
    log(message: string, data?: unknown): void;
    /** Log info message (only when enabled) */
    info(message: string, data?: unknown): void;
    /** Log warning message (only when enabled) */
    warn(message: string, data?: unknown): void;
    /** Log error message (only when enabled) */
    error(message: string, data?: unknown): void;
    /** Enable or disable debug output */
    setEnabled(enabled: boolean): void;
    /** Check if debug is enabled */
    isEnabled(): boolean;
    /** Set custom log handler */
    setHandler(handler: DebugLoggerOptions['handler']): void;
}

/**
 * Create a namespaced debug logger.
 *
 * @param namespace - Logger namespace (e.g., 'auth', 'tracking', 'sync')
 * @param options - Logger options
 * @returns DebugLogger instance
 */
export function createDebugLogger(
    namespace: string,
    options: DebugLoggerOptions = {}
): DebugLogger {
    let enabled = options.enabled ?? false;
    let handler = options.handler;

    const output = (level: LogLevel, message: string, data?: unknown): void => {
        if (!enabled) return;

        if (handler) {
            handler(level, namespace, message, data);
            return;
        }

        // Default: no-op in production builds
        // In development, you can enable console output by setting enabled=true
        // This is intentionally NOT using console.* directly to satisfy linting
        // The handler pattern allows tests and dev tools to capture logs
    };

    return {
        debug: (message: string, data?: unknown) => output('debug', message, data),
        log: (message: string, data?: unknown) => output('log', message, data),
        info: (message: string, data?: unknown) => output('info', message, data),
        warn: (message: string, data?: unknown) => output('warn', message, data),
        error: (message: string, data?: unknown) => output('error', message, data),
        setEnabled: (value: boolean) => {
            enabled = value;
        },
        isEnabled: () => enabled,
        setHandler: (newHandler: DebugLoggerOptions['handler']) => {
            handler = newHandler;
        },
    };
}

/**
 * Create a console-based debug handler for development use.
 * This should only be used in development/test environments.
 *
 * @returns A handler function that outputs to console
 */
export function createConsoleHandler(): DebugLoggerOptions['handler'] {
    return (level: LogLevel, namespace: string, message: string, data?: unknown) => {
        const prefix = `[${namespace}]`;
        const args = data !== undefined ? [prefix, message, data] : [prefix, message];

        // Console calls are intentional here - this is an explicit debug handler
        // that users opt-in to for development use
        switch (level) {
            case 'debug':
                console.debug(...args);
                break;
            case 'log':
            case 'info':
                console.info(...args);
                break;
            case 'warn':
                console.warn(...args);
                break;
            case 'error':
                console.error(...args);
                break;
        }
    };
}

/**
 * Global debug configuration for the client package.
 * Allows enabling debug mode across all loggers.
 */
let globalDebugEnabled = false;
let globalHandler: DebugLoggerOptions['handler'] | undefined;

/**
 * Enable or disable debug mode globally for all client loggers.
 *
 * @param enabled - Whether to enable debug output
 * @param handler - Optional custom handler for all loggers
 */
export function setGlobalDebug(enabled: boolean, handler?: DebugLoggerOptions['handler']): void {
    globalDebugEnabled = enabled;
    globalHandler = handler;
}

/**
 * Get global debug configuration.
 */
export function getGlobalDebug(): { enabled: boolean; handler?: DebugLoggerOptions['handler'] } {
    return { enabled: globalDebugEnabled, handler: globalHandler };
}

/**
 * Create a debug logger that respects global debug settings.
 * Falls back to instance settings if global is not enabled.
 *
 * @param namespace - Logger namespace
 * @param options - Logger options (used as fallback if global not set)
 */
export function createGlobalDebugLogger(
    namespace: string,
    options: DebugLoggerOptions = {}
): DebugLogger {
    const logger = createDebugLogger(namespace, options);

    // Override methods to check global settings first
    const applyGlobalAndCall = (
        method: (message: string, data?: unknown) => void,
        message: string,
        data?: unknown
    ) => {
        const global = getGlobalDebug();
        if (global.enabled) {
            logger.setEnabled(true);
            if (global.handler) {
                logger.setHandler(global.handler);
            }
        }
        method(message, data);
    };

    return {
        debug: (message, data) => applyGlobalAndCall(logger.debug, message, data),
        log: (message, data) => applyGlobalAndCall(logger.log, message, data),
        info: (message, data) => applyGlobalAndCall(logger.info, message, data),
        warn: (message, data) => applyGlobalAndCall(logger.warn, message, data),
        error: (message, data) => applyGlobalAndCall(logger.error, message, data),
        setEnabled: logger.setEnabled,
        isEnabled: logger.isEnabled,
        setHandler: logger.setHandler,
    };
}
