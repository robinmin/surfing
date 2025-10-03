/**
 * Error Handling Utilities
 *
 * This module provides comprehensive error handling for authentication flows,
 * including error categorization, user-friendly messages, and error recovery strategies.
 */

/**
 * Error categories for different types of authentication errors
 */
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  CONFIGURATION = 'configuration',
  RATE_LIMIT = 'rate_limit',
  SECURITY = 'security',
  UNKNOWN = 'unknown',
}

/**
 * Authentication error types
 */
export enum AuthErrorType {
  // Network errors
  NETWORK_UNREACHABLE = 'network_unreachable',
  CONNECTION_TIMEOUT = 'connection_timeout',
  SERVER_ERROR = 'server_error',

  // Configuration errors
  MISSING_CLIENT_ID = 'missing_client_id',
  MISSING_REDIRECT_URI = 'missing_redirect_uri',
  INVALID_CONFIGURATION = 'invalid_configuration',

  // Authentication errors
  INVALID_CREDENTIALS = 'invalid_credentials',
  TOKEN_EXPIRED = 'token_expired',
  TOKEN_INVALID = 'token_invalid',

  // Authorization errors
  INSUFFICIENT_PERMISSIONS = 'insufficient_permissions',
  ACCOUNT_DISABLED = 'account_disabled',
  EMAIL_NOT_VERIFIED = 'email_not_verified',

  // Rate limiting errors
  TOO_MANY_REQUESTS = 'too_many_requests',
  RATE_LIMITED = 'rate_limited',

  // Security errors
  NONCE_INVALID = 'nonce_invalid',
  STATE_INVALID = 'state_invalid',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',

  // General errors
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * Authentication error interface
 */
export interface AuthError {
  type: AuthErrorType;
  category: ErrorCategory;
  message: string;
  userMessage: string;
  code?: string;
  details?: any;
  timestamp: number;
  retryable: boolean;
  recoverable: boolean;
  suggestion?: string;
}

/**
 * Error handler response interface
 */
export interface ErrorHandlerResponse {
  shouldRetry: boolean;
  retryDelay?: number;
  userMessage: string;
  technicalMessage?: string;
  suggestion?: string;
  logLevel: 'error' | 'warn' | 'info';
  recoverable?: boolean;
}

/**
 * Error handler class for authentication flows
 */
class AuthErrorHandler {
  private errorPatterns: Map<RegExp, AuthErrorType> = new Map();
  private errorMessages: Map<AuthErrorType, { message: string; userMessage: string; suggestion?: string }> = new Map();

  constructor() {
    this.initializeErrorPatterns();
    this.initializeErrorMessages();
  }

  /**
   * Initialize error patterns for different error types
   */
  private initializeErrorPatterns(): void {
    // Network errors
    this.errorPatterns.set(/network.*unreachable|failed to fetch/i, AuthErrorType.NETWORK_UNREACHABLE);
    this.errorPatterns.set(/timeout|timed out/i, AuthErrorType.CONNECTION_TIMEOUT);
    this.errorPatterns.set(/502|503|504|server error/i, AuthErrorType.SERVER_ERROR);

    // Configuration errors
    this.errorPatterns.set(/missing.*client.*id/i, AuthErrorType.MISSING_CLIENT_ID);
    this.errorPatterns.set(/missing.*redirect.*uri/i, AuthErrorType.MISSING_REDIRECT_URI);
    this.errorPatterns.set(/invalid.*configuration/i, AuthErrorType.INVALID_CONFIGURATION);

    // Authentication errors
    this.errorPatterns.set(/invalid.*credential|invalid.*token/i, AuthErrorType.INVALID_CREDENTIALS);
    this.errorPatterns.set(/token.*expired/i, AuthErrorType.TOKEN_EXPIRED);
    this.errorPatterns.set(/id.*token.*invalid|malformed.*jwt/i, AuthErrorType.TOKEN_INVALID);

    // Authorization errors
    this.errorPatterns.set(/insufficient.*permission|access.*denied/i, AuthErrorType.INSUFFICIENT_PERMISSIONS);
    this.errorPatterns.set(/account.*disabled|account.*suspended/i, AuthErrorType.ACCOUNT_DISABLED);
    this.errorPatterns.set(/email.*not.*verified/i, AuthErrorType.EMAIL_NOT_VERIFIED);

    // Rate limiting errors
    this.errorPatterns.set(/too.*many.*request|rate.*limit/i, AuthErrorType.TOO_MANY_REQUESTS);
    this.errorPatterns.set(/temporarily.*blocked|exceeded.*quota/i, AuthErrorType.RATE_LIMITED);

    // Security errors
    this.errorPatterns.set(/nonce.*invalid|nonce.*mismatch/i, AuthErrorType.NONCE_INVALID);
    this.errorPatterns.set(/state.*invalid|state.*mismatch/i, AuthErrorType.STATE_INVALID);
    this.errorPatterns.set(/suspicious.*activity|security.*violation/i, AuthErrorType.SUSPICIOUS_ACTIVITY);
  }

  /**
   * Initialize user-friendly error messages
   */
  private initializeErrorMessages(): void {
    // Network errors
    this.errorMessages.set(AuthErrorType.NETWORK_UNREACHABLE, {
      message: 'Network unreachable - unable to connect to authentication servers',
      userMessage: 'Unable to connect to our servers. Please check your internet connection and try again.',
      suggestion:
        'Check your internet connection and try again. If the problem persists, please try again in a few minutes.',
    });

    this.errorMessages.set(AuthErrorType.CONNECTION_TIMEOUT, {
      message: 'Connection timeout - authentication request took too long',
      userMessage: 'The request timed out. Please try again.',
      suggestion: 'Try again. If the problem continues, check your internet connection or try a different network.',
    });

    this.errorMessages.set(AuthErrorType.SERVER_ERROR, {
      message: 'Server error - authentication service is temporarily unavailable',
      userMessage: 'Our authentication service is temporarily unavailable. Please try again later.',
      suggestion: 'Please try again in a few minutes. If the problem persists, contact support.',
    });

    // Configuration errors
    this.errorMessages.set(AuthErrorType.MISSING_CLIENT_ID, {
      message: 'Missing Google Client ID configuration',
      userMessage: 'Authentication is not properly configured. Please contact the administrator.',
      suggestion: 'This is a configuration issue that needs to be resolved by the website administrator.',
    });

    this.errorMessages.set(AuthErrorType.MISSING_REDIRECT_URI, {
      message: 'Missing redirect URI configuration',
      userMessage: 'Authentication is not properly configured. Please contact the administrator.',
      suggestion: 'This is a configuration issue that needs to be resolved by the website administrator.',
    });

    this.errorMessages.set(AuthErrorType.INVALID_CONFIGURATION, {
      message: 'Invalid authentication configuration',
      userMessage: 'Authentication is not properly configured. Please contact the administrator.',
      suggestion: 'This is a configuration issue that needs to be resolved by the website administrator.',
    });

    // Authentication errors
    this.errorMessages.set(AuthErrorType.INVALID_CREDENTIALS, {
      message: 'Invalid credentials - authentication failed',
      userMessage: 'Authentication failed. Please try again or use a different account.',
      suggestion:
        'Please check your credentials and try again. If you continue to have issues, try resetting your password or using a different authentication method.',
    });

    this.errorMessages.set(AuthErrorType.TOKEN_EXPIRED, {
      message: 'Token expired - authentication session has expired',
      userMessage: 'Your session has expired. Please sign in again.',
      suggestion: 'Please sign in again to continue.',
    });

    this.errorMessages.set(AuthErrorType.TOKEN_INVALID, {
      message: 'Invalid token - authentication session is invalid',
      userMessage: 'Your session is invalid. Please sign in again.',
      suggestion: 'Please sign in again to continue.',
    });

    // Authorization errors
    this.errorMessages.set(AuthErrorType.INSUFFICIENT_PERMISSIONS, {
      message: 'Insufficient permissions - account lacks required permissions',
      userMessage: "Your account doesn't have the required permissions to access this resource.",
      suggestion: 'Please contact support if you believe this is an error.',
    });

    this.errorMessages.set(AuthErrorType.ACCOUNT_DISABLED, {
      message: 'Account disabled - user account has been disabled',
      userMessage: 'Your account has been disabled. Please contact support.',
      suggestion: 'Please contact support to resolve this issue.',
    });

    this.errorMessages.set(AuthErrorType.EMAIL_NOT_VERIFIED, {
      message: 'Email not verified - user email has not been verified',
      userMessage: 'Please verify your email address to continue.',
      suggestion:
        'Check your email inbox for a verification link and follow the instructions to verify your email address.',
    });

    // Rate limiting errors
    this.errorMessages.set(AuthErrorType.TOO_MANY_REQUESTS, {
      message: 'Too many requests - rate limit exceeded',
      userMessage: 'Too many sign-in attempts. Please wait before trying again.',
      suggestion:
        'Please wait a few minutes before trying to sign in again. This is a security measure to protect your account.',
    });

    this.errorMessages.set(AuthErrorType.RATE_LIMITED, {
      message: 'Rate limited - temporary access restriction',
      userMessage: 'You have been temporarily blocked due to too many attempts.',
      suggestion: 'Please wait a few minutes before trying again. This is a security measure to protect your account.',
    });

    // Security errors
    this.errorMessages.set(AuthErrorType.NONCE_INVALID, {
      message: 'Invalid nonce - security validation failed',
      userMessage: 'Security validation failed. Please try again.',
      suggestion: 'Please refresh the page and try again. This is a security measure to protect your account.',
    });

    this.errorMessages.set(AuthErrorType.STATE_INVALID, {
      message: 'Invalid state - security validation failed',
      userMessage: 'Security validation failed. Please try again.',
      suggestion: 'Please refresh the page and try again. This is a security measure to protect your account.',
    });

    this.errorMessages.set(AuthErrorType.SUSPICIOUS_ACTIVITY, {
      message: 'Suspicious activity detected - security measure triggered',
      userMessage: "For security reasons, we've temporarily blocked this request.",
      suggestion: 'Please wait a few minutes and try again. If you continue to have issues, please contact support.',
    });

    // Default error
    this.errorMessages.set(AuthErrorType.UNKNOWN_ERROR, {
      message: 'Unknown error occurred during authentication',
      userMessage: 'An unexpected error occurred. Please try again.',
      suggestion: 'If the problem persists, please try refreshing the page or contact support.',
    });
  }

  /**
   * Categorize an error based on its message or type
   */
  private categorizeError(error: Error | string): ErrorCategory {
    const message = typeof error === 'string' ? error : error.message;
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('timeout')) {
      return ErrorCategory.NETWORK;
    }
    if (lowerMessage.includes('invalid') || lowerMessage.includes('missing') || lowerMessage.includes('malformed')) {
      return ErrorCategory.VALIDATION;
    }
    if (lowerMessage.includes('unauthorized') || lowerMessage.includes('access denied')) {
      return ErrorCategory.AUTHORIZATION;
    }
    if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests')) {
      return ErrorCategory.RATE_LIMIT;
    }
    if (lowerMessage.includes('nonce') || lowerMessage.includes('state') || lowerMessage.includes('suspicious')) {
      return ErrorCategory.SECURITY;
    }
    if (lowerMessage.includes('client') || lowerMessage.includes('configuration')) {
      return ErrorCategory.CONFIGURATION;
    }
    if (lowerMessage.includes('token') || lowerMessage.includes('auth') || lowerMessage.includes('sign')) {
      return ErrorCategory.AUTHENTICATION;
    }

    return ErrorCategory.UNKNOWN;
  }

  /**
   * Detect error type from error message
   */
  private detectErrorType(error: Error | string): AuthErrorType {
    const message = typeof error === 'string' ? error : error.message;

    for (const [pattern, errorType] of this.errorPatterns.entries()) {
      if (pattern.test(message)) {
        return errorType;
      }
    }

    return AuthErrorType.UNKNOWN_ERROR;
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryable(errorType: AuthErrorType): boolean {
    const retryableTypes = [
      AuthErrorType.NETWORK_UNREACHABLE,
      AuthErrorType.CONNECTION_TIMEOUT,
      AuthErrorType.SERVER_ERROR,
      AuthErrorType.TOO_MANY_REQUESTS,
      AuthErrorType.RATE_LIMITED,
    ];

    return retryableTypes.includes(errorType);
  }

  /**
   * Determine if an error is recoverable
   */
  private isRecoverable(errorType: AuthErrorType): boolean {
    const nonRecoverableTypes = [
      AuthErrorType.ACCOUNT_DISABLED,
      AuthErrorType.INSUFFICIENT_PERMISSIONS,
      AuthErrorType.SUSPICIOUS_ACTIVITY,
    ];

    return !nonRecoverableTypes.includes(errorType);
  }

  /**
   * Get retry delay based on error type
   */
  private getRetryDelay(errorType: AuthErrorType): number {
    switch (errorType) {
      case AuthErrorType.NETWORK_UNREACHABLE:
      case AuthErrorType.CONNECTION_TIMEOUT:
        return 2000; // 2 seconds
      case AuthErrorType.SERVER_ERROR:
        return 5000; // 5 seconds
      case AuthErrorType.TOO_MANY_REQUESTS:
      case AuthErrorType.RATE_LIMITED:
        return 60000; // 1 minute
      default:
        return 1000; // 1 second
    }
  }

  /**
   * Handle authentication error
   */
  handleError(error: Error | string, context?: string): ErrorHandlerResponse {
    const errorType = this.detectErrorType(error);
    const category = this.categorizeError(error);
    const retryable = this.isRetryable(errorType);
    const recoverable = this.isRecoverable(errorType);
    const retryDelay = retryable ? this.getRetryDelay(errorType) : undefined;

    const errorConfig = this.errorMessages.get(errorType) || this.errorMessages.get(AuthErrorType.UNKNOWN_ERROR);
    const timestamp = Date.now();

    // Log technical details
    const logLevel = category === ErrorCategory.SECURITY ? 'warn' : 'error';
    const technicalMessage = typeof error === 'string' ? error : error.message;

    // Create structured error object
    const authError: AuthError = {
      type: errorType,
      category,
      message: technicalMessage,
      userMessage: errorConfig?.userMessage || 'An unknown error occurred',
      code: typeof error === 'object' && error.name ? error.name : undefined,
      details: context ? { context, originalError: error } : { originalError: error },
      timestamp,
      retryable,
      recoverable,
      suggestion: errorConfig?.suggestion,
    };

    // Log the error
    this.logError(authError, logLevel);

    return {
      shouldRetry: retryable,
      retryDelay,
      userMessage: errorConfig?.userMessage || 'An unknown error occurred',
      technicalMessage,
      suggestion: errorConfig?.suggestion,
      logLevel,
    };
  }

  /**
   * Log error with appropriate level
   */
  private logError(error: AuthError, level: 'error' | 'warn' | 'info'): void {
    const logData = {
      type: error.type,
      category: error.category,
      message: error.message,
      code: error.code,
      timestamp: new Date(error.timestamp).toISOString(),
      retryable: error.retryable,
      recoverable: error.recoverable,
      context: error.details,
    };

    switch (level) {
      case 'error':
        console.error('[AuthError]', logData);
        break;
      case 'warn':
        console.warn('[AuthWarning]', logData);
        break;
      case 'info':
        console.info('[AuthInfo]', logData);
        break;
    }
  }

  /**
   * Create a user-friendly error display object
   */
  createErrorDisplay(error: Error | string, context?: string) {
    const response = this.handleError(error, context);

    return {
      title: this.getErrorTitle(response),
      message: response.userMessage,
      suggestion: response.suggestion,
      canRetry: response.shouldRetry,
      retryDelay: response.retryDelay,
      isRecoverable: response.recoverable,
      showRetryButton: response.shouldRetry && response.recoverable,
      timestamp: Date.now(),
    };
  }

  /**
   * Get appropriate error title based on error type
   */
  private getErrorTitle(response: ErrorHandlerResponse): string {
    switch (response.logLevel) {
      case 'warn':
        return 'Security Notice';
      case 'error':
      default:
        return 'Authentication Error';
    }
  }

  /**
   * Check if error should be reported to monitoring
   */
  shouldReportError(error: AuthError): boolean {
    // Report security issues and critical errors
    if (error.category === ErrorCategory.SECURITY) {
      return true;
    }

    // Report errors that are not retryable and recoverable
    if (!error.retryable && !error.recoverable) {
      return true;
    }

    // Report configuration errors
    if (error.category === ErrorCategory.CONFIGURATION) {
      return true;
    }

    return false;
  }

  /**
   * Format error for reporting
   */
  formatErrorForReporting(error: AuthError) {
    return {
      type: error.type,
      category: error.category,
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      retryable: error.retryable,
      recoverable: error.recoverable,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      context: error.details,
    };
  }
}

// Create singleton instance
export const authErrorHandler = new AuthErrorHandler();

// Export convenience functions
export const handleAuthError = (error: Error | string, context?: string) =>
  authErrorHandler.handleError(error, context);
export const createAuthErrorDisplay = (error: Error | string, context?: string) =>
  authErrorHandler.createErrorDisplay(error, context);
export const shouldReportAuthError = (error: AuthError) => authErrorHandler.shouldReportError(error);
export const formatAuthErrorForReporting = (error: AuthError) => authErrorHandler.formatErrorForReporting(error);
