/**
 * Surfing Subscription Constants
 *
 * Role hierarchy, mappings, and default values for Surfing's subscription system.
 * These constants are specific to Surfing's business logic.
 */

import type { SurfingRole, SurfingSubscriptionTier, SurfingUserSubscription } from './types';

/**
 * Default subscription for unauthenticated or new users
 */
export const DEFAULT_SURFING_SUBSCRIPTION: SurfingUserSubscription = {
    tier: 'free',
    status: 'active',
};

/**
 * Surfing role hierarchy for access checking
 * Higher number = higher tier
 */
export const SURFING_ROLE_HIERARCHY: Record<SurfingRole, number> = {
    'surfing-free': 0,
    'surfing-standard': 1,
    'surfing-premium': 2,
};

/**
 * Map Surfing roles to subscription tiers
 */
export const SURFING_ROLE_TO_TIER: Record<SurfingRole, SurfingSubscriptionTier> = {
    'surfing-free': 'free',
    'surfing-standard': 'standard',
    'surfing-premium': 'premium',
};

/**
 * Map generic tier names to Surfing tier names
 * Provides compatibility with various tier naming conventions
 */
export const SURFING_TIER_MAPPING: Record<string, SurfingSubscriptionTier> = {
    free: 'free',
    standard: 'standard',
    pro: 'standard', // Map "pro" to "standard" for compatibility
    premium: 'premium',
    enterprise: 'premium', // Map enterprise to premium
};

/**
 * Map Turnstile status values to Surfing status
 */
export const STATUS_MAPPING: Record<string, SurfingUserSubscription['status']> = {
    free: 'active', // Free users are considered "active" in free tier
    active: 'active',
    trialing: 'active', // Treat trialing as active for access purposes
    past_due: 'past_due',
    paused: 'canceled',
    canceled: 'canceled',
    expired: 'expired',
};
