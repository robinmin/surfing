import { BaseApiClient } from './base';
import type { RequestOptions } from './types';

// TODO: Import types from core when needed for specific methods

export class TurnstileClient extends BaseApiClient {
    /**
     * Checkout API
     */
    public readonly checkout = {
        /**
         * Create a new checkout session
         */
        create: (
            payload: { priceId: string; successUrl: string; cancelUrl: string },
            options?: RequestOptions
        ) => {
            return this.request<{ checkoutUrl: string }>('/admin/checkout/create', {
                ...options,
                method: 'POST',
                body: JSON.stringify(payload),
            });
        },

        /**
         * Create a customer portal session
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
         */
        checkHealth: () => {
            return this.request('/health');
        },
    };
}
