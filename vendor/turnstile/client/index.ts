/**
 * @turnstile/client
 *
 * Turnstile client library for browser applications.
 *
 * Provides:
 * - OIDC authentication (Zitadel, or any OIDC provider)
 * - Cross-tab auth state synchronization
 * - Role-based subscription access control
 * - Admin and customer checkout APIs
 *
 * @example
 * ```typescript
 * import { initOIDC, signInPopup, getCurrentSession } from '@turnstile/client';
 * import { getSubscriptionFromRoles } from 'subscription';
 * import { TurnstileCustomerClient } from '@turnstile/client';
 *
 * // Initialize auth
 * initOIDC({
 *   authority: 'https://zitadel.example.com',
 *   clientId: 'my-app',
 *   redirectUri: 'https://myapp.com/auth/callback',
 * });
 *
 * // Sign in
 * const user = await signInPopup('google');
 *
 * // Get session with roles
 * const session = await getCurrentSession();
 *
 * // Check subscription access
 * const config = { roleHierarchy: { 'app-free': 0, 'app-pro': 1 }, ... };
 * const subscription = getSubscriptionFromRoles(session.roles, config);
 * ```
 */

// ============================================================================
// Base Classes
// ============================================================================

export { BaseApiClient, TurnstileError } from './base';
export type { ApiErrorResponse, ApiResponse, TurnstileClientOptions } from './types';

// ============================================================================
// Auth Module - re-export with proper isolatedModules handling
// ============================================================================

export type {
    AuthSession,
    OIDCConfig,
    OIDCProvider,
    OIDCUserProfile,
} from './auth/oidc';
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
} from './auth/oidc';
export type {
    AuthProviderConfig,
    AuthSignInResponse,
    IAuthProvider,
    ProviderAuthSession,
} from './auth/providers';
// Note: IAuthProvider is an interface, exported as type below
export { AuthProviderUtils } from './auth/providers';
export type {
    AuthSyncEvent,
    AuthSyncMessage,
    AuthSyncOptions,
} from './auth/sync';
export {
    AuthSync,
    cleanupAuthSync,
    initAuthSync,
    notifyLogin,
    notifyLogout,
    notifySessionRefresh,
    onAuthSync,
} from './auth/sync';

// ============================================================================
// Subscription Module
// ============================================================================

export {
    getHighestTierRole,
    getSubscriptionFromRoles,
    getSubscriptionFromSession,
    getTierDisplayName,
    getTierFromRoles,
    hasAccess,
    hasRequiredRole,
    hasRole,
    isExpiringWithin,
} from './subscription/access';

export type {
    BillingCycle,
    RoleHierarchy,
    RoleToTierMapping,
    SubscriptionConfig,
    SubscriptionTier,
    UserSubscription,
} from './subscription/types';

export { DEFAULT_SUBSCRIPTION } from './subscription/types';

// ============================================================================
// Checkout Module
// ============================================================================

export { TurnstileAdminClient } from './checkout/admin';

export { TurnstileCustomerClient } from './checkout/customer';
