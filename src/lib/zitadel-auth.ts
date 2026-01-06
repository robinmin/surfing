/**
 * Zitadel OIDC Authentication Service
 *
 * Provides OpenID Connect authentication using Zitadel as the identity provider.
 * Supports popup-based authentication with PKCE for static sites.
 *
 * Features:
 * - Popup-based OIDC authentication (no SSR required)
 * - PKCE flow for secure public client authentication
 * - IdP hint support for direct provider selection (Google, GitHub, Apple, Microsoft)
 * - Silent token renewal
 * - Cross-tab session synchronization
 */

import { UserManager, WebStorageStateStore, User, Log } from 'oidc-client-ts';
import type { UserManagerSettings } from 'oidc-client-ts';
import { broadcastAuthEvent } from './auth-sync';

// Enable debug logging in development
if (import.meta.env.DEV) {
  Log.setLogger(console);
  Log.setLevel(Log.DEBUG);
}

/**
 * Supported identity providers via Zitadel federation
 */
export type ZitadelIdProvider = 'google' | 'github' | 'apple' | 'microsoft';

/**
 * Zitadel user profile from ID token claims
 */
export interface ZitadelUserProfile {
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
    provider?: string;
  };
  accessToken: string;
  idToken: string;
  expiresAt: number;
}

/**
 * Environment configuration for Zitadel
 */
interface ZitadelEnvConfig {
  authority: string;
  clientId: string;
  redirectUri: string;
  postLogoutUri: string;
  orgId?: string;
  idpGoogle?: string;
  idpGithub?: string;
  idpApple?: string;
  idpMicrosoft?: string;
}

/**
 * Get Zitadel configuration from environment variables
 */
const getEnvConfig = (): ZitadelEnvConfig => {
  const authority = import.meta.env.PUBLIC_ZITADEL_AUTHORITY;
  const clientId = import.meta.env.PUBLIC_ZITADEL_CLIENT_ID;
  const redirectUri = import.meta.env.PUBLIC_ZITADEL_REDIRECT_URI;
  const postLogoutUri = import.meta.env.PUBLIC_ZITADEL_POST_LOGOUT_URI;

  if (!authority || !clientId) {
    console.warn('Zitadel configuration incomplete. Set PUBLIC_ZITADEL_AUTHORITY and PUBLIC_ZITADEL_CLIENT_ID.');
  }

  return {
    authority: authority || '',
    clientId: clientId || '',
    redirectUri: redirectUri || `${window.location.origin}/auth/callback`,
    postLogoutUri: postLogoutUri || window.location.origin,
    orgId: import.meta.env.PUBLIC_ZITADEL_ORG_ID,
    idpGoogle: import.meta.env.PUBLIC_ZITADEL_IDP_GOOGLE,
    idpGithub: import.meta.env.PUBLIC_ZITADEL_IDP_GITHUB,
    idpApple: import.meta.env.PUBLIC_ZITADEL_IDP_APPLE,
    idpMicrosoft: import.meta.env.PUBLIC_ZITADEL_IDP_MICROSOFT,
  };
};

/**
 * Map provider name to Zitadel IdP hint
 */
const getIdpHint = (provider: ZitadelIdProvider): string | undefined => {
  const config = getEnvConfig();
  const mapping: Record<ZitadelIdProvider, string | undefined> = {
    google: config.idpGoogle,
    github: config.idpGithub,
    apple: config.idpApple,
    microsoft: config.idpMicrosoft,
  };
  return mapping[provider];
};

// Singleton UserManager instance
let userManager: UserManager | null = null;

/**
 * Get or create the UserManager singleton
 */
const getUserManager = (): UserManager => {
  if (userManager) {
    return userManager;
  }

  const config = getEnvConfig();

  if (!config.authority || !config.clientId) {
    throw new Error('Zitadel configuration incomplete. Cannot initialize auth.');
  }

  const settings: UserManagerSettings = {
    authority: config.authority,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    post_logout_redirect_uri: config.postLogoutUri,
    response_type: 'code',
    // Include org scope if configured to ensure users are created in the correct organization
    scope: config.orgId
      ? `openid profile email offline_access urn:zitadel:iam:org:id:${config.orgId}`
      : 'openid profile email offline_access',
    automaticSilentRenew: true,
    silentRequestTimeoutInSeconds: 10,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    // Popup configuration
    popupWindowFeatures: {
      location: false,
      toolbar: false,
      width: 500,
      height: 600,
      left: Math.max(0, (window.innerWidth - 500) / 2 + window.screenX),
      top: Math.max(0, (window.innerHeight - 600) / 2 + window.screenY),
    },
  };

  userManager = new UserManager(settings);

  // Set up event handlers
  userManager.events.addUserLoaded((user) => {
    console.debug('User loaded:', user.profile.email);
    broadcastAuthEvent('login', user.profile.sub);
  });

  userManager.events.addUserUnloaded(() => {
    console.debug('User unloaded');
    broadcastAuthEvent('logout');
  });

  userManager.events.addSilentRenewError((error) => {
    console.error('Silent renew error:', error);
  });

  userManager.events.addAccessTokenExpired(() => {
    console.debug('Access token expired');
  });

  return userManager;
};

/**
 * Check if Zitadel is properly configured
 */
export const isZitadelConfigured = (): boolean => {
  const config = getEnvConfig();
  return !!(config.authority && config.clientId);
};

/**
 * Sign in using popup window
 *
 * @param provider - Optional IdP hint to pre-select provider
 * @returns User object with tokens and profile
 * @throws Error if popup is blocked or authentication fails
 */
export const signInPopup = async (provider?: ZitadelIdProvider): Promise<User> => {
  const manager = getUserManager();

  try {
    const extraQueryParams: Record<string, string> = {};

    // Add IdP hint if provider specified and configured
    if (provider) {
      const idpHint = getIdpHint(provider);
      if (idpHint) {
        extraQueryParams.idp_hint = idpHint;
      }
    }

    const user = await manager.signinPopup({
      extraQueryParams: Object.keys(extraQueryParams).length > 0 ? extraQueryParams : undefined,
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
};

/**
 * Sign in using redirect (fallback if popup is blocked)
 *
 * @param provider - Optional IdP hint to pre-select provider
 */
export const signInRedirect = async (provider?: ZitadelIdProvider): Promise<void> => {
  const manager = getUserManager();

  const extraQueryParams: Record<string, string> = {};

  if (provider) {
    const idpHint = getIdpHint(provider);
    if (idpHint) {
      extraQueryParams.idp_hint = idpHint;
    }
  }

  await manager.signinRedirect({
    extraQueryParams: Object.keys(extraQueryParams).length > 0 ? extraQueryParams : undefined,
  });
};

/**
 * Handle the popup callback (call this from /auth/callback page)
 *
 * @returns User object if successful
 */
export const handlePopupCallback = async (): Promise<User | void> => {
  try {
    const manager = getUserManager();
    return await manager.signinPopupCallback();
  } catch (error) {
    console.error('Popup callback error:', error);
    throw error;
  }
};

/**
 * Handle the redirect callback (call this from /auth/callback page)
 *
 * @returns User object if successful
 */
export const handleRedirectCallback = async (): Promise<User | void> => {
  try {
    const manager = getUserManager();
    return await manager.signinRedirectCallback();
  } catch (error) {
    console.error('Redirect callback error:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 *
 * @param localOnly - If true, only clear local session without Zitadel logout
 */
export const signOut = async (localOnly = false): Promise<void> => {
  const manager = getUserManager();

  if (localOnly) {
    await manager.removeUser();
  } else {
    await manager.signoutRedirect();
  }
};

/**
 * Get the current authenticated user
 *
 * @returns User object or null if not authenticated
 */
export const getUser = async (): Promise<User | null> => {
  try {
    const manager = getUserManager();
    const user = await manager.getUser();

    // Check if token is expired
    if (user && user.expired) {
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
};

/**
 * Get current user as simplified AuthSession
 *
 * @returns AuthSession or null if not authenticated
 */
export const getCurrentSession = async (): Promise<AuthSession | null> => {
  const user = await getUser();

  if (!user || !user.access_token) {
    return null;
  }

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
  };
};

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getUser();
  return user !== null && !user.expired;
};

/**
 * Subscribe to user loaded events
 */
export const onUserLoaded = (callback: (user: User) => void): (() => void) => {
  const manager = getUserManager();
  manager.events.addUserLoaded(callback);
  return () => manager.events.removeUserLoaded(callback);
};

/**
 * Subscribe to user unloaded events
 */
export const onUserUnloaded = (callback: () => void): (() => void) => {
  const manager = getUserManager();
  manager.events.addUserUnloaded(callback);
  return () => manager.events.removeUserUnloaded(callback);
};

/**
 * Subscribe to access token expiring events (fires ~60s before expiry)
 */
export const onAccessTokenExpiring = (callback: () => void): (() => void) => {
  const manager = getUserManager();
  manager.events.addAccessTokenExpiring(callback);
  return () => manager.events.removeAccessTokenExpiring(callback);
};

/**
 * Force a silent token renewal
 */
export const renewToken = async (): Promise<User | null> => {
  try {
    const manager = getUserManager();
    return await manager.signinSilent();
  } catch (error) {
    console.error('Token renewal error:', error);
    return null;
  }
};

/**
 * Clear all stored auth state (for debugging/recovery)
 */
export const clearAuthState = async (): Promise<void> => {
  const manager = getUserManager();
  await manager.removeUser();
  await manager.clearStaleState();
};
