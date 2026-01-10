/**
 * Admin Checkout Client
 *
 * Client for Turnstile admin operations including checkout management.
 * Use this for admin-facing features like creating checkout sessions and portals.
 */

import { BaseApiClient } from '../base';
import type { RequestOptions } from '../types';

/**
 * Turnstile Admin Client
 *
 * Provides admin-level API access for:
 * - Creating checkout sessions (for admins managing users)
 * - Creating customer portal sessions (for account management)
 * - System health checks
 */
export class TurnstileAdminClient extends BaseApiClient {
    /**
     * Checkout API
     */
    public readonly checkout = {
        /**
         * Create a new checkout session (admin endpoint)
         *
         * @param payload - Checkout session parameters
         * @param options - Request options
         * @returns Checkout URL
         */
        create: (
            payload: { priceId: string; successUrl: string; cancelUrl: string },
            options?: RequestOptions
        ) => {
            return this.request<{ url: string }>('/admin/checkout/create', {
                ...options,
                method: 'POST',
                body: JSON.stringify(payload),
            });
        },

        /**
         * Create a customer portal session (admin endpoint)
         *
         * @param options - Request options
         * @returns Portal URL
         */
        portal: (options?: RequestOptions) => {
            return this.request<{ url: string }>('/admin/checkout/portal', {
                ...options,
                method: 'POST',
            });
        },
    };

    /**
     * System API
     */
    public readonly system = {
        /**
         * Check API health status
         *
         * @returns Health status
         */
        checkHealth: () => {
            return this.request('/health');
        },
    };
}
