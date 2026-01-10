/**
 * Surfing Subscription Module
 *
 * Barrel export for all subscription-related functionality.
 * Import from this file for convenience, or import from specific modules for clarity.
 *
 * @example
 * // Convenience import (recommended for most cases)
 * import { canAccessPremiumArticlesByRole, getTierDisplayName } from '~/lib/subscription';
 *
 * // Specific imports (for tree-shaking and clarity)
 * import { canAccessPremiumArticlesByRole } from '~/lib/subscription/access';
 * import { getTierDisplayName } from '~/lib/subscription/display';
 */

// ============================================================================
// Access Control
// ============================================================================
export {
    canAccessPremiumArticlesByRole,
    canDownloadCheatsheetsByRole,
    getSurfingSubscriptionFromRoles,
    getSurfingTierFromRoles,
    hasApiAccessByRole,
    hasRequiredSurfingRole,
    hasSurfingRole,
} from './access';

// ============================================================================
// Constants
// ============================================================================
export {
    DEFAULT_SURFING_SUBSCRIPTION,
    STATUS_MAPPING,
    SURFING_ROLE_HIERARCHY,
    SURFING_ROLE_TO_TIER,
    SURFING_TIER_MAPPING,
} from './constants';
// ============================================================================
// Display Utilities
// ============================================================================
export { getTierBadgeClass, getTierDisplayName, isExpiringWithin } from './display';
// ============================================================================
// Types
// ============================================================================
export type { SurfingRole, SurfingSubscriptionTier, SurfingUserSubscription } from './types';
