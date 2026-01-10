/**
 * Subscription Types
 *
 * Generic types for subscription management.
 * Applications define their own tier values while using these interfaces.
 */

/**
 * Generic subscription tier (app-defined)
 * Example: 'free', 'standard', 'premium' or 'bronze', 'silver', 'gold'
 */
export type SubscriptionTier = string;

/**
 * Subscription status values
 */
export type SubscriptionStatus =
    | 'active'
    | 'canceled'
    | 'past_due'
    | 'expired'
    | 'pending'
    | 'trialing'
    | 'paused';

/**
 * Billing cycle options
 */
export type BillingCycle = 'monthly' | 'yearly' | 'lifetime';

/**
 * User subscription information
 */
export interface UserSubscription {
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    billingCycle?: BillingCycle;
    expiresAt?: Date;
    cancelAtPeriodEnd?: boolean;
    stripeCustomerId?: string;
}

/**
 * Role hierarchy for access checking
 * Higher number = higher tier/permission level
 */
export type RoleHierarchy = Record<string, number>;

/**
 * Role to tier mapping
 */
export type RoleToTierMapping = Record<string, SubscriptionTier>;

/**
 * Subscription configuration for an application
 * Defines roles, tiers, and hierarchy for access control
 */
export interface SubscriptionConfig {
    /**
     * Role hierarchy: maps role name to priority level
     * Example: { 'app-free': 0, 'app-standard': 1, 'app-premium': 2 }
     */
    roleHierarchy: RoleHierarchy;

    /**
     * Maps roles to subscription tiers
     * Example: { 'app-free': 'free', 'app-standard': 'standard', 'app-premium': 'premium' }
     */
    roleToTierMapping: RoleToTierMapping;

    /**
     * Default role assigned to unauthenticated users
     */
    defaultRole: string;
}

/**
 * Default subscription for unauthenticated or new users
 */
export const DEFAULT_SUBSCRIPTION: UserSubscription = {
    tier: 'free',
    status: 'active',
};
