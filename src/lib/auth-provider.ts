/**
 * Auth Provider Interface
 *
 * Defines a common interface for all authentication providers (Google, Apple, etc.)
 * to ensure consistent implementation and extensibility.
 */

export type AuthProvider = 'google' | 'apple';

export interface AuthProviderConfig {
  clientId: string;
  [key: string]: any;
}

export interface AuthSignInResponse {
  credential: string;
  select_by?: string;
  client_id?: string;
}

export interface AuthSession {
  user: {
    id: string;
    email?: string;
    user_metadata?: any;
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
  initialize(onSuccess: (response: AuthSignInResponse) => void, onError?: (error: Error) => void): Promise<void>;

  /**
   * Sign in with provider using ID token
   */
  signIn(credential: string): Promise<any>;
}

/**
 * Common utilities for auth providers
 */
export class AuthProviderUtils {
  /**
   * Validate token expiration
   */
  static isTokenExpired(exp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return exp <= now;
  }

  /**
   * Decode JWT token payload
   */
  static decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
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
  static validateAudience(payload: any, expectedClientId: string): boolean {
    return payload.aud === expectedClientId;
  }

  /**
   * Validate token issuer
   */
  static validateIssuer(payload: any, expectedIssuerPrefix: string): boolean {
    if (!payload.iss) {
      return false;
    }
    return payload.iss.startsWith(expectedIssuerPrefix);
  }

  /**
   * Validate email verification
   */
  static validateEmailVerified(payload: any): boolean {
    if (payload.email && payload.email_verified !== undefined) {
      return payload.email_verified === true;
    }
    return true; // Email verification not required if email not present
  }
}
