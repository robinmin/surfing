/**
 * Centralized Turnstile Client Re-Export Layer
 *
 * This file is the ONLY file in Surfing that should import directly from
 * '@turnstile/client'. All other Surfing files must import from this file.
 *
 * This separation layer provides:
 * - Single source of truth for all @turnstile/client imports
 * - Easier maintenance when updating @turnstile/client
 * - Clear API boundary between Surfing and Turnstile packages
 * - Ability to add Surfing-specific wrappers or transformations
 *
 * @example
 * // ✅ CORRECT - Import from this centralized file
 * import { getUser, signInPopup } from '~/lib/turnstile-client';
 *
 * // ❌ WRONG - Direct import from @turnstile/client
 * import { getUser } from '@turnstile/client/auth/oidc';
 */

// ============================================================================
// Authentication Module (@turnstile/client/auth)
// ============================================================================

/**
 * OIDC Authentication Client
 *
 * Provides Zitadel OIDC authentication with PKCE flow for static sites.
 * Includes popup and redirect-based authentication, token management,
 * and role extraction from JWT tokens.
 */
export {
  // OIDC Client
  OIDCClient,
  initOIDC,
  // Convenience functions
  signInPopup,
  signInRedirect,
  handlePopupCallback,
  handleRedirectCallback,
  signOut,
  getUser,
  getCurrentSession,
  isAuthenticated,
  renewToken,
  clearAuthState,
  isZitadelConfigured,
  onUserLoaded,
  onUserUnloaded,
  // Types
  type OIDCConfig,
  type OIDCUserProfile,
  type AuthSession,
  type OIDCProvider,
  type ZitadelIdProvider,
} from '@turnstile/client/auth/oidc';

/**
 * Auth Provider Interface
 *
 * Generic authentication provider interface for implementing
 * different auth backends (Zitadel, Auth0, etc.).
 */
export { AuthProviderUtils } from '@turnstile/client/auth/providers';

export type {
  IAuthProvider,
  AuthProvider,
  AuthProviderConfig,
  AuthSignInResponse,
} from '@turnstile/client/auth/providers';

/**
 * Auth State Synchronization
 *
 * Cross-tab authentication state synchronization using BroadcastChannel.
 * Ensures auth state stays consistent across multiple browser tabs.
 */
export {
  initAuthSync,
  onAuthSync,
  notifyLogin,
  notifyLogout,
  notifySessionRefresh,
  cleanupAuthSync,
  type AuthSyncOptions,
  type AuthSyncMessage,
  type AuthSyncEvent,
} from '@turnstile/client/auth/sync';

// ============================================================================
// Subscription Module (@turnstile/client/subscription)
// ============================================================================

/**
 * Subscription Access Control
 *
 * Generic role-based access control utilities.
 * Can be used with any app-specific role hierarchy.
 */
export {
  hasAccess,
  hasRole,
  hasRequiredRole,
  getHighestTierRole,
  getTierFromRoles,
  getSubscriptionFromRoles,
  getSubscriptionFromSession,
} from '@turnstile/client/subscription/access';

/**
 * Subscription Types
 *
 * Generic subscription types for building app-specific subscription systems.
 */
export type {
  RoleHierarchy,
  RoleToTierMapping,
  SubscriptionConfig,
  UserSubscription,
  SubscriptionTier,
  SubscriptionStatus,
} from '@turnstile/client/subscription/types';

// ============================================================================
// Checkout Module (@turnstile/client)
// ============================================================================

/**
 * Turnstile Checkout Clients
 *
 * API clients for interacting with Turnstile checkout endpoints.
 * - Admin: For admin operations (requires admin API key)
 * - Customer: For customer-facing operations (session, portal)
 */
export { TurnstileAdminClient } from '@turnstile/client/checkout/admin';

export { TurnstileCustomerClient } from '@turnstile/client/checkout/customer';

// ============================================================================
// Base Module (@turnstile/client/base + @turnstile/client/types)
// ============================================================================

/**
 * Base API Client
 *
 * Low-level API client for making authenticated requests to Turnstile API.
 */
export { BaseApiClient, TurnstileError } from '@turnstile/client/base';

export type { ApiResponse, ApiErrorResponse, TurnstileClientOptions, RequestOptions } from '@turnstile/client/types';
