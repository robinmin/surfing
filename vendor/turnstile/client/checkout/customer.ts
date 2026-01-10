/**
 * Customer Checkout Client
 *
 * Client for Turnstile customer-facing checkout operations.
 * Use this for user-initiated checkouts and subscription management.
 */

import { BaseApiClient } from '../base';

/**
 * Turnstile Customer Client
 *
 * Provides customer-level API access for:
 * - Creating checkout sessions (self-service)
 * - Creating customer portal sessions (manage subscriptions)
 */
export class TurnstileCustomerClient extends BaseApiClient {
    /**
     * Checkout API
     */
    public readonly checkout = {
        /**
         * Create a new checkout session (customer endpoint)
         *
         * Used by customers to initiate subscription checkout.
         * Requires valid Bearer token from authentication.
         *
         * @param payload - Checkout parameters
         * @returns Checkout URL to redirect to Stripe
         */
        create: (payload: { tier: string; billingCycle: 'monthly' | 'yearly' | 'lifetime' }) => {
            return this.request<{ url: string }>('/api/checkout/session', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
        },

        /**
         * Create a customer portal session
         *
         * Used by customers to manage their existing subscriptions.
         * Requires valid Bearer token from authentication.
         *
         * @param returnUrl - Optional URL to return to after portal session
         * @returns Portal URL to redirect to Stripe Customer Portal
         */
        portal: (returnUrl?: string) => {
            return this.request<{ url: string }>('/api/checkout/portal', {
                method: 'POST',
                body: JSON.stringify({ return_url: returnUrl }),
            });
        },
    };
}
