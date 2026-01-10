/**
 * Subscription Module
 *
 * Generic types and utilities for subscription management and access control.
 */

// Access Control
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
} from './access';
// Types
export type {
    BillingCycle,
    RoleHierarchy,
    RoleToTierMapping,
    SubscriptionConfig,
    SubscriptionStatus,
    SubscriptionTier,
    UserSubscription,
} from './types';
export { DEFAULT_SUBSCRIPTION } from './types';
