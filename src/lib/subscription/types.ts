/**
 * Surfing Subscription Types
 *
 * Type definitions for Surfing's subscription system.
 * These types are specific to Surfing and not generic enough for @turnstile/client.
 */

/**
 * Surfing subscription tier levels
 */
export type SurfingSubscriptionTier = 'free' | 'standard' | 'premium'

/**
 * Surfing role names from Zitadel
 */
export type SurfingRole = 'surfing-free' | 'surfing-standard' | 'surfing-premium'

/**
 * Surfing subscription information
 */
export interface SurfingUserSubscription {
  tier: SurfingSubscriptionTier
  status: 'active' | 'canceled' | 'past_due' | 'expired' | 'pending'
  billingCycle?: 'monthly' | 'yearly' | 'lifetime'
  expiresAt?: Date
  cancelAtPeriodEnd?: boolean
  stripeCustomerId?: string
}
