import { describe, expect, it } from 'vitest';

import {
    DEFAULT_SURFING_SUBSCRIPTION,
    STATUS_MAPPING,
    SURFING_ROLE_HIERARCHY,
    SURFING_ROLE_TO_TIER,
    SURFING_TIER_MAPPING,
} from '~/lib/subscription/constants';

describe('subscription constants', () => {
    it('defines the expected role and tier mappings', () => {
        expect(DEFAULT_SURFING_SUBSCRIPTION).toEqual({ tier: 'free', status: 'active' });
        expect(SURFING_ROLE_HIERARCHY['surfing-free']).toBeLessThan(
            SURFING_ROLE_HIERARCHY['surfing-premium']
        );
        expect(SURFING_ROLE_TO_TIER['surfing-standard']).toBe('standard');
        expect(SURFING_TIER_MAPPING.pro).toBe('standard');
        expect(SURFING_TIER_MAPPING.enterprise).toBe('premium');
        expect(STATUS_MAPPING.trialing).toBe('active');
        expect(STATUS_MAPPING.paused).toBe('canceled');
    });
});
