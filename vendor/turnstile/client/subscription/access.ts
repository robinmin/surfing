/**
 * Subscription Access Control
 *
 * Generic utilities for role-based access control.
 * Works with any application's role and tier configuration.
 */

import type {
    RoleHierarchy,
    RoleToTierMapping,
    SubscriptionConfig,
    SubscriptionTier,
    UserSubscription,
} from './types';

import { DEFAULT_SUBSCRIPTION } from './types';

/**
 * Check if user's role has access to a required role level
 *
 * @param userRole - User's current role
 * @param requiredRole - Minimum role required for access
 * @param hierarchy - Role hierarchy mapping
 * @returns true if user has access
 */
export function hasAccess(
    userRole: string,
    requiredRole: string,
    hierarchy: RoleHierarchy
): boolean {
    const userLevel = hierarchy[userRole] ?? -1;
    const requiredLevel = hierarchy[requiredRole] ?? -1;
    return userLevel >= requiredLevel;
}

/**
 * Check if user has a specific role
 *
 * @param userRoles - Array of user's roles
 * @param requiredRole - Role to check for
 * @returns true if user has the role
 */
export function hasRole(userRoles: string[], requiredRole: string): boolean {
    if (!userRoles || userRoles.length === 0) {
        return false;
    }
    return userRoles.includes(requiredRole);
}

/**
 * Get the highest tier role from user's roles
 *
 * @param userRoles - Array of user's roles
 * @param hierarchy - Role hierarchy mapping
 * @returns The highest tier role, or empty string if no roles found
 */
export function getHighestTierRole(userRoles: string[], hierarchy: RoleHierarchy): string {
    if (!userRoles || userRoles.length === 0) {
        return '';
    }

    let highestRole = '';
    let highestPriority = -1;

    for (const role of userRoles) {
        if (role in hierarchy) {
            const priority = hierarchy[role];
            if (priority > highestPriority) {
                highestRole = role;
                highestPriority = priority;
            }
        }
    }

    return highestRole;
}

/**
 * Get subscription tier from user's roles
 *
 * @param userRoles - Array of user's roles
 * @param roleToTierMapping - Maps roles to subscription tiers
 * @returns Subscription tier
 */
export function getTierFromRoles(
    userRoles: string[],
    roleToTierMapping: RoleToTierMapping
): SubscriptionTier {
    if (!userRoles || userRoles.length === 0) {
        return 'free'; // Default tier
    }

    // Map each role to its tier and return the first match
    for (const role of userRoles) {
        if (role in roleToTierMapping) {
            return roleToTierMapping[role];
        }
    }

    return 'free'; // Default tier
}

/**
 * Get user's subscription from roles
 *
 * Extracts the highest tier role from the user's roles array,
 * maps it to a subscription tier, and returns a UserSubscription object.
 *
 * @param userRoles - Array of user's roles
 * @param config - Subscription configuration
 * @returns UserSubscription based on roles
 */
export function getSubscriptionFromRoles(
    userRoles: string[],
    config: SubscriptionConfig
): UserSubscription {
    if (!userRoles || userRoles.length === 0) {
        return DEFAULT_SUBSCRIPTION;
    }

    // Find the highest tier role
    const highestRole = getHighestTierRole(userRoles, config.roleHierarchy);

    if (!highestRole) {
        return DEFAULT_SUBSCRIPTION;
    }

    // Map role to subscription tier
    const tier = config.roleToTierMapping[highestRole] || 'free';

    return {
        tier,
        status: 'active', // Roles are always active (no role = no access)
    };
}

/**
 * Check if user has at least the required role tier
 *
 * @param userRoles - Array of user's roles
 * @param requiredRole - Minimum role tier required
 * @param hierarchy - Role hierarchy mapping
 * @returns true if user has at least the required role
 */
export function hasRequiredRole(
    userRoles: string[],
    requiredRole: string,
    hierarchy: RoleHierarchy
): boolean {
    if (!userRoles || userRoles.length === 0) {
        return false;
    }

    const requiredPriority = hierarchy[requiredRole] ?? -1;

    for (const role of userRoles) {
        if (role in hierarchy) {
            const priority = hierarchy[role];
            if (priority >= requiredPriority) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Combined access check (tries roles first, falls back to metadata)
 *
 * This function provides a smooth migration path from metadata-based
 * to role-based access control. It checks roles first, and if no roles
 * are found, falls back to the legacy metadata-based check.
 *
 * @param userRoles - Array of user's roles (from JWT)
 * @param userMetadata - User metadata from Zitadel (legacy)
 * @param config - Subscription configuration
 * @returns UserSubscription object
 */
export function getSubscriptionFromSession(
    userRoles: string[] | undefined,
    userMetadata: Record<string, string> | undefined,
    config: SubscriptionConfig
): UserSubscription {
    // Try role-based first
    if (userRoles && userRoles.length > 0) {
        return getSubscriptionFromRoles(userRoles, config);
    }

    // Fallback to metadata-based (legacy)
    if (userMetadata) {
        const tierBase64 = userMetadata.subscription_tier;
        const statusBase64 = userMetadata.subscription_status;

        if (tierBase64 || statusBase64) {
            try {
                const tier = tierBase64 ? atob(tierBase64) : 'free';
                const status = statusBase64 ? atob(statusBase64) : 'active';

                return {
                    tier: config.roleToTierMapping[tier] || tier,
                    status: status as UserSubscription['status'],
                };
            } catch {
                // If decoding fails, return default
            }
        }
    }

    return DEFAULT_SUBSCRIPTION;
}

/**
 * Check if subscription is about to expire (within specified days)
 *
 * @param subscription - User's subscription info
 * @param days - Number of days to check (default: 7)
 * @returns true if subscription expires within the specified days
 */
export function isExpiringWithin(subscription: UserSubscription, days: number = 7): boolean {
    if (!subscription.expiresAt) {
        return false;
    }

    if (subscription.billingCycle === 'lifetime') {
        return false;
    }

    const now = new Date();
    const expirationThreshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return subscription.expiresAt <= expirationThreshold;
}

/**
 * Get display name for subscription tier
 *
 * @param tier - Subscription tier
 * @returns Display name (capitalize first letter)
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
}
