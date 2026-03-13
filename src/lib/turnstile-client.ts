/**
 * Centralized Turnstile SDK re-export layer for Surfing.
 *
 * This file is the only place in Surfing that should import directly from
 * `@gobing-ai/turnstile-client`. All application code should import from here so SDK
 * upgrades stay isolated to a single boundary.
 */

export type {
    AuthSession,
    AuthSyncEvent,
    AuthSyncMessage,
    AuthSyncOptions,
    OIDCConfig,
    OIDCProvider,
    OIDCUserProfile,
    PublicApplicationConfig,
    TurnstileClientOptions,
} from '@gobing-ai/turnstile-client';
export {
    cleanupAuthSync,
    clearAuthState,
    createTurnstileClient,
    getCurrentSession,
    getHighestTierRole,
    getSubscriptionFromRoles,
    getSubscriptionFromSession,
    getTierDisplayName,
    getTierFromRoles,
    getUser,
    handlePopupCallback,
    handleRedirectCallback,
    hasAccess,
    hasRequiredRole,
    hasRole,
    initAuthSync,
    initOIDC,
    isAuthenticated,
    notifyLogin,
    notifyLogout,
    notifySessionRefresh,
    OIDCClient,
    onAuthSync,
    renewToken,
    signInPopup,
    signInRedirect,
    signOut,
    TurnstileClient,
} from '@gobing-ai/turnstile-client';
export type { ZitadelIdProvider } from '@gobing-ai/turnstile-client/auth/oidc';
export {
    isZitadelConfigured,
    onUserLoaded,
    onUserUnloaded,
} from '@gobing-ai/turnstile-client/auth/oidc';
export type {
    AuthProvider,
    AuthProviderConfig,
    AuthSignInResponse,
    IAuthProvider,
} from '@gobing-ai/turnstile-client/auth/providers';
export { AuthProviderUtils } from '@gobing-ai/turnstile-client/auth/providers';

export type {
    BillingCycle,
    RoleHierarchy,
    RoleToTierMapping,
    SubscriptionConfig,
    SubscriptionStatus,
    SubscriptionTier,
    UserSubscription,
} from '@gobing-ai/turnstile-client/subscription/types';

export type {
    PageViewEvent,
    TrackerConfig,
    TrackingEvent,
    UserIdentity,
} from '@gobing-ai/turnstile-client/tracking';
export {
    getAnalyticsInstance,
    identifyUser,
    initTracker,
    trackEvent,
    trackPageView,
} from '@gobing-ai/turnstile-client/tracking';
