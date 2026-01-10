/**
 * Auth Module
 *
 * Provides OIDC authentication, cross-tab sync, and provider interfaces.
 */

// OIDC Authentication - types
export type {
    AuthSession,
    OIDCConfig,
    OIDCProvider,
    OIDCUserProfile,
} from './oidc';
// OIDC Authentication - values
export {
    clearAuthState,
    getCurrentSession,
    getUser,
    handlePopupCallback,
    handleRedirectCallback,
    initOIDC,
    isAuthenticated,
    OIDCClient,
    renewToken,
    signInPopup,
    signInRedirect,
    signOut,
} from './oidc';
// Auth State Sync - types
export type {
    AuthSyncEvent,
    AuthSyncMessage,
    AuthSyncOptions,
} from './sync';
// Auth State Sync - values
// Re-export AuthSync class directly (not wrapped in {})
export {
    AuthSync,
    cleanupAuthSync,
    initAuthSync,
    notifyLogin,
    notifyLogout,
    notifySessionRefresh,
    onAuthSync,
} from './sync';

// Provider Interface - values
// Note: IAuthProvider is an interface, exported below as type

// Provider Interface - types
export type {
    AuthProviderConfig,
    AuthSignInResponse,
    ProviderAuthSession,
} from './providers';
// AuthProviderUtils is a class, re-export directly
export { AuthProviderUtils } from './providers';
