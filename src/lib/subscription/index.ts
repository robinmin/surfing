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
// Types
// ============================================================================
export type { SurfingSubscriptionTier, SurfingRole, SurfingUserSubscription } from './types';

// ============================================================================
// Constants
// ============================================================================
export {
  DEFAULT_SURFING_SUBSCRIPTION,
  SURFING_ROLE_HIERARCHY,
  SURFING_ROLE_TO_TIER,
  SURFING_TIER_MAPPING,
  STATUS_MAPPING,
} from './constants';

// ============================================================================
// Access Control
// ============================================================================
export {
  getSurfingSubscriptionFromRoles,
  hasSurfingRole,
  hasRequiredSurfingRole,
  canAccessPremiumArticlesByRole,
  canDownloadCheatsheetsByRole,
  hasApiAccessByRole,
  getSurfingTierFromRoles,
} from './access';

// ============================================================================
// Display Utilities
// ============================================================================
export { getTierDisplayName, getTierBadgeClass, isExpiringWithin } from './display';
