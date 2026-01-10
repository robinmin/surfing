/**
 * OIDC Authentication Service
 *
 * Provides OpenID Connect authentication using Zitadel (or any OIDC provider).
 * Supports popup-based authentication with PKCE for static sites.
 *
 * Features:
 * - Popup-based OIDC authentication (no SSR required)
 * - PKCE flow for secure public client authentication
 * - IdP hint support for direct provider selection
 * - Silent token renewal
 * - Cross-tab session synchronization
 * - Role extraction from JWT tokens (flatRolesClaim or project roles)
 */

import type { PopupWindowFeatures, UserManagerSettings } from 'oidc-client-ts';
import { Log, type User, UserManager, WebStorageStateStore } from 'oidc-client-ts';

// Enable debug logging in development
if (typeof globalThis.process !== 'undefined' && globalThis.process.env?.DEV === 'true') {
    Log.setLogger(console);
    Log.setLevel(Log.DEBUG);
}

/**
 * Supported identity providers (extendable for different IdPs)
 */
export type OIDCProvider = 'google' | 'github' | 'apple' | 'microsoft';

/**
 * OIDC user profile from ID token claims
 */
export interface OIDCUserProfile {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    preferred_username?: string;
    locale?: string;
}

/**
 * Simplified user session for application use
 */
export interface AuthSession {
    user: {
        id: string;
        email?: string;
        name?: string;
        picture?: string;
    };
    accessToken: string;
    idToken: string;
    expiresAt: number;
    roles?: string[];
}

/**
 * Configuration options for OIDC authentication
 */
export interface OIDCConfig {
    authority: string;
    clientId: string;
    redirectUri: string;
    postLogoutUri: string;
    orgId?: string;
    scope?: string;
    idpHints?: Partial<Record<OIDCProvider, string>>;
    popupWindowFeatures?: {
        width?: number;
        height?: number;
        location?: boolean;
        toolbar?: boolean;
        menubar?: boolean;
        resizable?: boolean;
    };
}

/**
 * Default OIDC configuration
 */
const DEFAULT_OIDC_CONFIG = {
    redirectUri: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    postLogoutUri: typeof window !== 'undefined' ? window.location.origin : '',
    scope: 'openid profile email offline_access urn:zitadel:iam:user:metadata',
    popupWindowFeatures: {
        location: false,
        toolbar: false,
        width: 500,
        height: 600,
    },
} as const;

/**
 * OIDC Authentication Client
 *
 * Manages OIDC authentication flow with configurable providers and settings.
 */
export class OIDCClient {
    private userManager: UserManager | null = null;
    private config: OIDCConfig & {
        popupWindowFeatures: NonNullable<OIDCConfig['popupWindowFeatures']>;
        idpHints: Record<OIDCProvider, string>;
    };

    constructor(config: OIDCConfig) {
        // Merge with defaults
        this.config = {
            authority: config.authority,
            clientId: config.clientId,
            redirectUri: config.redirectUri || DEFAULT_OIDC_CONFIG.redirectUri,
            postLogoutUri: config.postLogoutUri || DEFAULT_OIDC_CONFIG.postLogoutUri,
            orgId: config.orgId ?? undefined,
            scope: config.scope || DEFAULT_OIDC_CONFIG.scope,
            idpHints: {
                google: '',
                github: '',
                apple: '',
                microsoft: '',
                ...config.idpHints,
            },
            popupWindowFeatures: {
                location: false,
                toolbar: false,
                width: 500,
                height: 600,
                ...config.popupWindowFeatures,
            },
        };
    }

    /**
     * Get or create the UserManager singleton
     */
    private getUserManager(): UserManager {
        if (this.userManager) {
            return this.userManager;
        }

        const settings: UserManagerSettings = {
            authority: this.config.authority,
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            post_logout_redirect_uri: this.config.postLogoutUri,
            response_type: 'code',
            scope: this.config.orgId
                ? `${this.config.scope} urn:zitadel:iam:org:id:${this.config.orgId}`
                : this.config.scope,
            automaticSilentRenew: true,
            silentRequestTimeoutInSeconds: 10,
            userStore: new WebStorageStateStore({
                store: typeof window !== 'undefined' ? window.localStorage : undefined,
            }),
            popupWindowFeatures: this.getPopupWindowFeatures(),
        };

        this.userManager = new UserManager(settings);

        // Set up event handlers
        this.setupEventHandlers();

        return this.userManager;
    }

    /**
     * Calculate popup window position and features
     */
    private getPopupWindowFeatures(): PopupWindowFeatures {
        const { width = 500, height = 600 } = this.config.popupWindowFeatures;

        if (typeof window === 'undefined') {
            return { width, height, location: false, toolbar: false };
        }

        const left = Math.max(0, (window.innerWidth - width) / 2 + window.screenX);
        const top = Math.max(0, (window.innerHeight - height) / 2 + window.screenY);

        return {
            location: false,
            toolbar: false,
            width,
            height,
            left,
            top,
        };
    }

    /**
     * Set up UserManager event handlers
     */
    private setupEventHandlers(): void {
        if (!this.userManager) return;

        this.userManager.events.addUserLoaded((user) => {
            console.debug('User loaded:', user.profile.email);
            // Dispatch custom event for auth state changes
            if (typeof window !== 'undefined') {
                window.dispatchEvent(
                    new CustomEvent('turnstile:auth:login', {
                        detail: { userId: user.profile.sub },
                    })
                );
            }
        });

        this.userManager.events.addUserUnloaded(() => {
            console.debug('User unloaded');
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('turnstile:auth:logout'));
            }
        });

        this.userManager.events.addSilentRenewError((error) => {
            console.error('Silent renew error:', error);
        });

        this.userManager.events.addAccessTokenExpired(() => {
            console.debug('Access token expired');
        });
    }

    /**
     * Check if OIDC is properly configured
     */
    isConfigured(): boolean {
        return !!(this.config.authority && this.config.clientId);
    }

    /**
     * Get IdP hint for a provider
     */
    private getIdpHint(provider?: OIDCProvider): string | undefined {
        if (!provider) return undefined;
        const hint = this.config.idpHints[provider];
        return hint || undefined;
    }

    /**
     * Sign in using popup window
     *
     * @param provider - Optional IdP hint to pre-select provider
     * @returns User object with tokens and profile
     */
    async signInPopup(provider?: OIDCProvider): Promise<User> {
        const manager = this.getUserManager();

        try {
            const extraQueryParams: Record<string, string> = {};

            // Add IdP hint if provider specified and configured
            if (provider) {
                const idpHint = this.getIdpHint(provider);
                if (idpHint) {
                    extraQueryParams.idp_hint = idpHint;
                }
            }

            const user = await manager.signinPopup({
                extraQueryParams:
                    Object.keys(extraQueryParams).length > 0 ? extraQueryParams : undefined,
            });

            if (!user) {
                throw new Error('Authentication failed: No user returned');
            }

            return user;
        } catch (error) {
            // Check if popup was blocked
            if (error instanceof Error && error.message.includes('Popup window closed')) {
                throw new Error('Sign-in popup was closed. Please try again and allow popups.');
            }
            throw error;
        }
    }

    /**
     * Sign in using redirect (fallback if popup is blocked)
     *
     * @param provider - Optional IdP hint to pre-select provider
     */
    async signInRedirect(provider?: OIDCProvider): Promise<void> {
        const manager = this.getUserManager();

        const extraQueryParams: Record<string, string> = {};

        if (provider) {
            const idpHint = this.getIdpHint(provider);
            if (idpHint) {
                extraQueryParams.idp_hint = idpHint;
            }
        }

        await manager.signinRedirect({
            extraQueryParams:
                Object.keys(extraQueryParams).length > 0 ? extraQueryParams : undefined,
        });
    }

    /**
     * Handle the popup callback (call this from /auth/callback page)
     *
     * After calling this, use getUser() to get the user object
     */
    async handlePopupCallback(): Promise<void> {
        try {
            const manager = this.getUserManager();
            await manager.signinPopupCallback();
        } catch (error) {
            console.error('Popup callback error:', error);
            throw error;
        }
    }

    /**
     * Handle the redirect callback (call this from /auth/callback page)
     *
     * After calling this, use getUser() to get the user object
     */
    async handleRedirectCallback(): Promise<void> {
        try {
            const manager = this.getUserManager();
            await manager.signinRedirectCallback();
        } catch (error) {
            console.error('Redirect callback error:', error);
            throw error;
        }
    }

    /**
     * Sign out the current user
     *
     * @param localOnly - If true, only clear local session without IdP logout
     */
    async signOut(localOnly = false): Promise<void> {
        const manager = this.getUserManager();

        if (localOnly) {
            await manager.removeUser();
        } else {
            await manager.signoutRedirect();
        }
    }

    /**
     * Get the current authenticated user
     *
     * @returns User object or null if not authenticated
     */
    async getUser(): Promise<User | null> {
        try {
            const manager = this.getUserManager();
            const user = await manager.getUser();

            // Check if token is expired
            if (user?.expired) {
                console.debug('Token expired, attempting silent renewal');
                try {
                    return await manager.signinSilent();
                } catch {
                    console.debug('Silent renewal failed');
                    return null;
                }
            }

            return user;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }

    /**
     * Extract roles from user profile
     *
     * Supports multiple claim formats:
     * - flatRolesClaim (from Zitadel Action): profile.oidc_fields.flatRolesClaim
     * - Zitadel project roles: profile['urn:zitadel:iam:org:project:roles']
     *
     * @param profile - User profile from JWT token
     * @returns Array of role names or empty array if none found
     */
    private extractRolesFromProfile(profile: OIDCUserProfile): string[] {
        // Try flatRolesClaim first (from Zitadel Action)
        const oidcFields = (profile as unknown as Record<string, unknown>).oidc_fields as
            | Record<string, unknown>
            | undefined;
        if (oidcFields && Array.isArray(oidcFields.flatRolesClaim)) {
            return oidcFields.flatRolesClaim as string[];
        }

        // Try Zitadel native project roles format
        const projectRoles = (profile as unknown as Record<string, unknown>)[
            'urn:zitadel:iam:org:project:roles'
        ] as Record<string, unknown> | undefined;
        if (projectRoles && typeof projectRoles === 'object') {
            return Object.keys(projectRoles);
        }

        // No roles found
        return [];
    }

    /**
     * Get current user as simplified AuthSession
     *
     * @returns AuthSession or null if not authenticated
     */
    async getCurrentSession(): Promise<AuthSession | null> {
        const user = await this.getUser();

        if (!user || !user.access_token) {
            return null;
        }

        // Extract roles from profile
        const roles = this.extractRolesFromProfile(user.profile as OIDCUserProfile);

        return {
            user: {
                id: user.profile.sub,
                email: user.profile.email,
                name: user.profile.name || user.profile.preferred_username,
                picture: user.profile.picture,
            },
            accessToken: user.access_token,
            idToken: user.id_token || '',
            expiresAt: user.expires_at || 0,
            roles: roles.length > 0 ? roles : undefined,
        };
    }

    /**
     * Check if user is currently authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        const user = await this.getUser();
        return user !== null && !user.expired;
    }

    /**
     * Subscribe to user loaded events
     */
    onUserLoaded(callback: (user: User) => void): () => void {
        const manager = this.getUserManager();
        manager.events.addUserLoaded(callback);
        return () => manager.events.removeUserLoaded(callback);
    }

    /**
     * Subscribe to user unloaded events
     */
    onUserUnloaded(callback: () => void): () => void {
        const manager = this.getUserManager();
        manager.events.addUserUnloaded(callback);
        return () => manager.events.removeUserUnloaded(callback);
    }

    /**
     * Subscribe to access token expiring events (fires ~60s before expiry)
     */
    onAccessTokenExpiring(callback: () => void): () => void {
        const manager = this.getUserManager();
        manager.events.addAccessTokenExpiring(callback);
        return () => manager.events.removeAccessTokenExpiring(callback);
    }

    /**
     * Force a silent token renewal
     */
    async renewToken(): Promise<User | null> {
        try {
            const manager = this.getUserManager();
            return await manager.signinSilent();
        } catch (error) {
            console.error('Token renewal error:', error);
            return null;
        }
    }

    /**
     * Clear all stored auth state (for debugging/recovery)
     */
    async clearAuthState(): Promise<void> {
        const manager = this.getUserManager();
        await manager.removeUser();
        await manager.clearStaleState();
    }
}

// ============================================================================
// CONVENIENCE FUNCTIONS (using default/singleton instance)
// ============================================================================

let defaultClient: OIDCClient | null = null;

/**
 * Initialize the default OIDC client with configuration
 */
export function initOIDC(config: OIDCConfig): OIDCClient {
    defaultClient = new OIDCClient(config);
    return defaultClient;
}

/**
 * Sign in using popup (convenience function)
 */
export async function signInPopup(provider?: OIDCProvider): Promise<User> {
    // Wait for initialization if the promise exists
    // biome-ignore lint/suspicious/noExplicitAny: window cast needed for global OIDC promise
    if (typeof window !== 'undefined' && (window as any).__OIDC_INIT_PROMISE__) {
        // biome-ignore lint/suspicious/noExplicitAny: window cast needed for global OIDC promise
        await (window as any).__OIDC_INIT_PROMISE__;
    }

    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    return defaultClient.signInPopup(provider);
}

/**
 * Sign in using redirect (convenience function)
 */
export async function signInRedirect(provider?: OIDCProvider): Promise<void> {
    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    return defaultClient.signInRedirect(provider);
}

/**
 * Handle popup callback (convenience function)
 */
export async function handlePopupCallback(): Promise<void> {
    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    await defaultClient.handlePopupCallback();
}

/**
 * Handle redirect callback (convenience function)
 */
export async function handleRedirectCallback(): Promise<void> {
    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    await defaultClient.handleRedirectCallback();
}

/**
 * Sign out (convenience function)
 */
export async function signOut(localOnly = false): Promise<void> {
    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    return defaultClient.signOut(localOnly);
}

/**
 * Get current user (convenience function)
 */
export async function getUser(): Promise<User | null> {
    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    return defaultClient.getUser();
}

/**
 * Get current session (convenience function)
 */
export async function getCurrentSession(): Promise<AuthSession | null> {
    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    return defaultClient.getCurrentSession();
}

/**
 * Check if authenticated (convenience function)
 */
export async function isAuthenticated(): Promise<boolean> {
    if (!defaultClient) {
        return false;
    }
    return defaultClient.isAuthenticated();
}

/**
 * Renew token (convenience function)
 */
export async function renewToken(): Promise<User | null> {
    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    return defaultClient.renewToken();
}

/**
 * Clear auth state (convenience function)
 */
export async function clearAuthState(): Promise<void> {
    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    return defaultClient.clearAuthState();
}

/**
 * Check if Zitadel is configured
 */
export function isZitadelConfigured(): boolean {
    return defaultClient !== null;
}

/**
 * Subscribe to user loaded events (convenience function)
 */
export function onUserLoaded(callback: (user: User) => void): () => void {
    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    return defaultClient.onUserLoaded(callback);
}

/**
 * Subscribe to user unloaded events (convenience function)
 */
export function onUserUnloaded(callback: () => void): () => void {
    if (!defaultClient) {
        throw new Error('OIDC client not initialized. Call initOIDC() first.');
    }
    return defaultClient.onUserUnloaded(callback);
}

/**
 * Type alias for OIDCProvider (ZitadelIdProvider)
 */
export type ZitadelIdProvider = OIDCProvider;
