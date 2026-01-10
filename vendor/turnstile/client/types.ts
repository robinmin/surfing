/**
 * Turnstile Client Types
 *
 * Core types for the Turnstile API client.
 * These types are self-contained and do not depend on external packages.
 */

export interface TurnstileClientOptions {
    baseUrl: string;
    token?: string;
    /**
     * Custom fetch implementation (optional)
     * Useful for node environments where global fetch might vary or for mocking
     */
    fetch?: typeof fetch;
}

export interface RequestOptions extends RequestInit {
    token?: string;
}

/**
 * Standard API response structure from Turnstile API
 */
export interface ApiResponse<T> {
    result: 'success' | 'error' | 'warn';
    message: string;
    code: number;
    data: T;
}

/**
 * API error response with additional details
 */
export interface ApiErrorResponse<T = unknown> extends ApiResponse<null> {
    details?: T;
}
