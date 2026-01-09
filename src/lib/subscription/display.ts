/**
 * Surfing Subscription Display Utilities
 *
 * UI helper functions for displaying subscription information.
 * These functions are specific to Surfing's design system and branding.
 */

import type { SurfingSubscriptionTier } from './types'

/**
 * Get display name for subscription tier
 *
 * @param tier - Surfing subscription tier
 * @returns Human-readable display name
 */
export function getTierDisplayName(tier: SurfingSubscriptionTier): string {
  const names: Record<SurfingSubscriptionTier, string> = {
    free: 'Free',
    standard: 'Standard',
    premium: 'Premium',
  }
  return names[tier]
}

/**
 * Get CSS class for tier badge styling
 *
 * Returns Tailwind CSS classes for Surfing's tier badge design.
 * Colors match Surfing's brand: gray (free), blue (standard), purple (premium).
 *
 * @param tier - Surfing subscription tier
 * @returns Tailwind CSS class string
 */
export function getTierBadgeClass(tier: SurfingSubscriptionTier): string {
  const classes: Record<SurfingSubscriptionTier, string> = {
    free: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    standard: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  }
  return classes[tier]
}

/**
 * Check if subscription is about to expire (within 7 days)
 *
 * @param subscription - User's subscription info
 * @param days - Number of days to check (default: 7)
 * @returns true if subscription expires within the specified days
 */
export function isExpiringWithin(subscription: any, days: number = 7): boolean {
  if (!subscription.expiresAt) {
    return false
  }

  if (subscription.billingCycle === 'lifetime') {
    return false
  }

  const now = new Date()
  const expirationThreshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

  return subscription.expiresAt <= expirationThreshold
}
