import { describe, expect, it, vi } from 'vitest';

import { isExpiringWithin, getTierBadgeClass, getTierDisplayName } from '~/lib/subscription/display';

describe('subscription display helpers', () => {
    it('maps tiers to user-facing names and badge classes', () => {
        expect(getTierDisplayName('free')).toBe('Free');
        expect(getTierDisplayName('standard')).toBe('Standard');
        expect(getTierDisplayName('premium')).toBe('Premium');
        expect(getTierBadgeClass('free')).toContain('bg-gray-100');
        expect(getTierBadgeClass('standard')).toContain('bg-blue-100');
        expect(getTierBadgeClass('premium')).toContain('bg-purple-100');
    });

    it('detects expiring subscriptions while exempting lifetime and missing expirations', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));

        expect(
            isExpiringWithin({
                tier: 'standard',
                status: 'active',
                expiresAt: new Date('2025-01-05T00:00:00.000Z'),
                billingCycle: 'monthly',
            })
        ).toBe(true);

        expect(
            isExpiringWithin({
                tier: 'premium',
                status: 'active',
                expiresAt: new Date('2025-02-10T00:00:00.000Z'),
                billingCycle: 'lifetime',
            })
        ).toBe(false);

        expect(isExpiringWithin({ tier: 'free', status: 'active' })).toBe(false);
    });
});
