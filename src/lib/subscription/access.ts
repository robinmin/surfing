/**
 * Surfing Subscription Access Control
 *
 * Role-based access control functions specific to Surfing.
 * These functions use @turnstile/client utilities internally but provide
 * Surfing-specific type safety and business logic.
 */

import type { AuthSession } from '~/lib/turnstile-client';
// Import turnstile utilities for internal use
import { getHighestTierRole, hasRequiredRole, hasRole } from '~/lib/turnstile-client';
// Import Surfing-specific constants
import {
    DEFAULT_SURFING_SUBSCRIPTION,
    SURFING_ROLE_HIERARCHY,
    SURFING_ROLE_TO_TIER,
} from './constants';
import type { SurfingRole, SurfingSubscriptionTier, SurfingUserSubscription } from './types';

// ============================================================================
// Surfing-Specific Access Control Functions
// ============================================================================

/**
 * Get Surfing subscription tier from user's roles
 *
 * Extracts the highest tier role from the user's roles array
 * and maps it to a Surfing subscription tier.
 *
 * @param session - Auth session with roles array
 * @returns SurfingUserSubscription based on roles
 */
export function getSurfingSubscriptionFromRoles(
    session: AuthSession | null
): SurfingUserSubscription {
    if (!session || !session.roles || session.roles.length === 0) {
        return DEFAULT_SURFING_SUBSCRIPTION;
    }

    // Find the highest tier role
    const highestRole = getHighestTierRole(session.roles, SURFING_ROLE_HIERARCHY);

    if (!highestRole) {
        return DEFAULT_SURFING_SUBSCRIPTION;
    }

    // Map role to subscription tier
    const tier = SURFING_ROLE_TO_TIER[highestRole] || 'free';

    return {
        tier,
        status: 'active', // Roles are always active (no role = no access)
    };
}

/**
 * Check if user has a specific Surfing role
 *
 * @param session - Auth session with roles array
 * @param requiredRole - Surfing role to check for
 * @returns true if user has the role
 */
export function hasSurfingRole(session: AuthSession | null, requiredRole: SurfingRole): boolean {
    if (!session || !session.roles) {
        return false;
    }
    return hasRole(session.roles, requiredRole);
}

/**
 * Check if user has at least the required Surfing role tier
 *
 * @param session - Auth session with roles array
 * @param requiredRole - Minimum role tier required
 * @returns true if user has at least the required role
 */
export function hasRequiredSurfingRole(
    session: AuthSession | null,
    requiredRole: SurfingRole
): boolean {
    if (!session || !session.roles || session.roles.length === 0) {
        return false;
    }

    return hasRequiredRole(session.roles, requiredRole, SURFING_ROLE_HIERARCHY);
}

/**
 * Role-based access check for premium articles
 *
 * Business rule: Users with 'surfing-standard' or higher can access premium articles
 *
 * @param session - Auth session with roles array
 * @returns true if user has surfing-standard or higher role
 */
export function canAccessPremiumArticlesByRole(session: AuthSession | null): boolean {
    return hasRequiredSurfingRole(session, 'surfing-standard');
}

/**
 * Role-based access check for cheatsheet downloads
 *
 * Business rule: Users with 'surfing-standard' or higher can download cheatsheets
 *
 * @param session - Auth session with roles array
 * @returns true if user has surfing-standard or higher role
 */
export function canDownloadCheatsheetsByRole(session: AuthSession | null): boolean {
    return hasRequiredSurfingRole(session, 'surfing-standard');
}

/**
 * Role-based access check for API access
 *
 * Business rule: Only users with 'surfing-premium' role can access the API
 *
 * @param session - Auth session with roles array
 * @returns true if user has surfing-premium role
 */
export function hasApiAccessByRole(session: AuthSession | null): boolean {
    return hasSurfingRole(session, 'surfing-premium');
}

/**
 * Get user's Surfing subscription tier from roles
 *
 * @param session - Auth session with roles array
 * @returns Surfing subscription tier
 */
export function getSurfingTierFromRoles(session: AuthSession | null): SurfingSubscriptionTier {
    const subscription = getSurfingSubscriptionFromRoles(session);
    return subscription.tier;
}
