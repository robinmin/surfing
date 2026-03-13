import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('~/lib/turnstile-client', () => ({
    getHighestTierRole: vi.fn(),
    hasRequiredRole: vi.fn(),
    hasRole: vi.fn(),
}));

import {
    canAccessPremiumArticlesByRole,
    canDownloadCheatsheetsByRole,
    getSurfingSubscriptionFromRoles,
    getSurfingTierFromRoles,
    hasApiAccessByRole,
    hasRequiredSurfingRole,
    hasSurfingRole,
} from '~/lib/subscription/access';
import {
    getHighestTierRole,
    hasRequiredRole,
    hasRole,
} from '~/lib/turnstile-client';

const getHighestTierRoleMock = vi.mocked(getHighestTierRole);
const hasRequiredRoleMock = vi.mocked(hasRequiredRole);
const hasRoleMock = vi.mocked(hasRole);

describe('subscription access helpers', () => {
    beforeEach(() => {
        getHighestTierRoleMock.mockReset();
        hasRequiredRoleMock.mockReset();
        hasRoleMock.mockReset();
    });

    it('returns the default subscription when no session or roles exist', () => {
        expect(getSurfingSubscriptionFromRoles(null)).toEqual({ tier: 'free', status: 'active' });
        expect(getSurfingSubscriptionFromRoles({ roles: [] } as never)).toEqual({
            tier: 'free',
            status: 'active',
        });
    });

    it('maps the highest matched role to a Surfing tier', () => {
        getHighestTierRoleMock.mockReturnValue('surfing-premium');

        expect(getSurfingSubscriptionFromRoles({ roles: ['surfing-premium'] } as never)).toEqual({
            tier: 'premium',
            status: 'active',
        });
        expect(getSurfingTierFromRoles({ roles: ['surfing-premium'] } as never)).toBe('premium');
    });

    it('delegates direct and hierarchical role checks', () => {
        hasRoleMock.mockReturnValue(true);
        hasRequiredRoleMock.mockReturnValue(true);

        expect(hasSurfingRole({ roles: ['surfing-premium'] } as never, 'surfing-premium')).toBe(true);
        expect(hasRequiredSurfingRole({ roles: ['surfing-premium'] } as never, 'surfing-standard')).toBe(true);
        expect(canAccessPremiumArticlesByRole({ roles: ['surfing-premium'] } as never)).toBe(true);
        expect(canDownloadCheatsheetsByRole({ roles: ['surfing-premium'] } as never)).toBe(true);
        expect(hasApiAccessByRole({ roles: ['surfing-premium'] } as never)).toBe(true);
    });

    it('returns false when role checks cannot pass', () => {
        hasRoleMock.mockReturnValue(false);
        hasRequiredRoleMock.mockReturnValue(false);
        getHighestTierRoleMock.mockImplementation(() => undefined as never);

        expect(hasSurfingRole(null, 'surfing-free')).toBe(false);
        expect(hasRequiredSurfingRole(null, 'surfing-standard')).toBe(false);
        expect(hasApiAccessByRole({ roles: ['surfing-standard'] } as never)).toBe(false);
        expect(getSurfingSubscriptionFromRoles({ roles: ['other'] } as never)).toEqual({
            tier: 'free',
            status: 'active',
        });
    });
});
