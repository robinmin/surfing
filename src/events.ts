/**
 * Pricing Page Event Definitions
 *
 * Centralized event tracking definitions for the pricing page.
 * Each event includes TypeScript types and documentation.
 */

// ============================================================================
// Event Names
// ============================================================================

/**
 * Fired when the pricing page is viewed
 */
export const PRICING_PAGE_VIEWED = 'pricing_page_viewed';

/**
 * Fired when user changes billing cycle (monthly/yearly/lifetime)
 */
export const PRICING_BILLING_CYCLE_CHANGED = 'pricing_billing_cycle_changed';

/**
 * Fired when user clicks a CTA button (Get Started, Subscribe, Go Premium)
 */
export const PRICING_CTA_CLICKED = 'pricing_cta_clicked';

/**
 * Fired when user initiates checkout process
 */
export const PRICING_CHECKOUT_INITIATED = 'pricing_checkout_initiated';

/**
 * Fired when checkout fails
 */
export const PRICING_CHECKOUT_ERROR = 'pricing_checkout_error';

/**
 * Fired when user expands an FAQ item
 */
export const PRICING_FAQ_EXPANDED = 'pricing_faq_expanded';

/**
 * Fired when user collapses an FAQ item
 */
export const PRICING_FAQ_COLLAPSED = 'pricing_faq_collapsed';

/**
 * Fired when user scrolls to specific depth milestones
 */
export const PRICING_PAGE_SCROLLED = 'pricing_page_scrolled';

// ============================================================================
// Event Parameter Types
// ============================================================================

/**
 * Parameters for pricing_page_viewed event
 */
export interface PricingPageViewedParams {
    /** Current URL path */
    path: string;
    /** Page title */
    title: string;
    /** User authentication status */
    isAuthenticated: boolean;
    /** User's current subscription tier (if authenticated) */
    currentTier?: 'free' | 'standard' | 'premium';
}

/**
 * Parameters for pricing_billing_cycle_changed event
 */
export interface PricingBillingCycleChangedParams {
    /** Previous billing cycle */
    previousCycle: 'monthly' | 'yearly' | 'lifetime';
    /** New billing cycle */
    newCycle: 'monthly' | 'yearly' | 'lifetime';
}

/**
 * Parameters for pricing_cta_clicked event
 */
export interface PricingCtaClickedParams {
    /** Tier of the clicked CTA */
    tier: 'free' | 'standard' | 'premium';
    /** Current billing cycle */
    billingCycle: 'monthly' | 'yearly' | 'lifetime';
    /** CTA button text */
    ctaText: string;
    /** User authentication status */
    isAuthenticated: boolean;
    /** Whether this is the user's current plan */
    isCurrentPlan: boolean;
}

/**
 * Parameters for pricing_checkout_initiated event
 */
export interface PricingCheckoutInitiatedParams {
    /** Selected tier */
    tier: 'standard' | 'premium';
    /** Selected billing cycle */
    billingCycle: 'monthly' | 'yearly' | 'lifetime';
    /** Price amount */
    price: number;
    /** User ID */
    userId: string;
}

/**
 * Parameters for pricing_checkout_error event
 */
export interface PricingCheckoutErrorParams {
    /** Selected tier */
    tier: 'standard' | 'premium';
    /** Selected billing cycle */
    billingCycle: 'monthly' | 'yearly' | 'lifetime';
    /** Error message */
    error: string;
    /** Error code (if available) */
    errorCode?: string;
}

/**
 * Parameters for pricing_faq_expanded event
 */
export interface PricingFaqExpandedParams {
    /** FAQ question text (first 50 chars) */
    question: string;
    /** FAQ index (0-based) */
    index: number;
}

/**
 * Parameters for pricing_faq_collapsed event
 */
export interface PricingFaqCollapsedParams {
    /** FAQ question text (first 50 chars) */
    question: string;
    /** FAQ index (0-based) */
    index: number;
}

/**
 * Parameters for pricing_page_scrolled event
 */
export interface PricingPageScrolledParams {
    /** Scroll depth percentage (25, 50, 75, 100) */
    depth: 25 | 50 | 75 | 100;
}
