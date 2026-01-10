/**
 * Auth Provider Interface
 *
 * Defines a common interface for all authentication providers (Google, Apple, etc.)
 * to ensure consistent implementation and extensibility.
 */

export type AuthProvider = 'google' | 'apple';

export interface AuthProviderConfig {
    clientId: string;
    [key: string]: unknown;
}

export interface AuthSignInResponse {
    credential: string;
    select_by?: string;
    client_id?: string;
}

export interface ProviderAuthSession {
    user: {
        id: string;
        email?: string;
        user_metadata?: unknown;
    };
    cached?: boolean;
}

/**
 * Base interface for authentication providers
 */
export interface IAuthProvider {
    /**
     * Provider name (e.g., 'google', 'apple')
     */
    readonly provider: AuthProvider;

    /**
     * Check if provider script is loaded
     */
    isScriptLoaded(): boolean;

    /**
     * Load provider script dynamically
     */
    loadScript(): Promise<void>;

    /**
     * Get provider configuration
     */
    getConfig(): Promise<AuthProviderConfig>;

    /**
     * Initialize provider
     */
    initialize(
        onSuccess: (response: AuthSignInResponse) => void,
        onError?: (error: Error) => void
    ): Promise<void>;

    /**
     * Sign in with provider using ID token
     */
    signIn(credential: string): Promise<unknown>;
}

/**
 * Auth Provider Utilities
 *
 * Common utility functions for authentication providers.
 */

/**
 * Validate token expiration
 */
export function isTokenExpired(exp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return exp <= now;
}

/**
 * Decode JWT token payload
 */
export function decodeJWT(token: string): unknown {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        throw new Error('Failed to decode JWT token');
    }
}

/**
 * Validate token audience
 */
export function validateAudience(payload: unknown, expectedClientId: string): boolean {
    if (typeof payload !== 'object' || payload === null) {
        return false;
    }
    return (payload as { aud?: unknown }).aud === expectedClientId;
}

/**
 * Validate token issuer
 */
export function validateIssuer(payload: unknown, expectedIssuerPrefix: string): boolean {
    if (typeof payload !== 'object' || payload === null) {
        return false;
    }
    const iss = (payload as { iss?: unknown }).iss;
    if (!iss || typeof iss !== 'string') {
        return false;
    }
    return iss.startsWith(expectedIssuerPrefix);
}

/**
 * Validate email verification
 */
export function validateEmailVerified(payload: unknown): boolean {
    if (typeof payload !== 'object' || payload === null) {
        return false;
    }
    const { email, email_verified } = payload as { email?: unknown; email_verified?: unknown };

    if (email && typeof email === 'string' && email_verified !== undefined) {
        return email_verified === true;
    }
    return true; // Email verification not required if email not present
}

/**
 * @deprecated Use individual functions instead (isTokenExpired, decodeJWT, validateAudience, validateIssuer, validateEmailVerified)
 */
export const AuthProviderUtils = {
    isTokenExpired,
    decodeJWT,
    validateAudience,
    validateIssuer,
    validateEmailVerified,
};
