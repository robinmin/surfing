import { describe, expect, it } from 'vitest';

import { getFormattedDate, toUiAmount, trim } from '~/utils/utils';

describe('utils', () => {
    it('trims characters from both ends', () => {
        expect(trim('/hello/', '/')).toBe('hello');
        expect(trim('***hello***', '*')).toBe('hello');
        expect(trim('hello', '/')).toBe('hello');
    });

    it('formats dates using the configured locale', () => {
        expect(getFormattedDate(new Date('2025-01-02T00:00:00.000Z'))).toBe('Jan 2, 2025');
    });

    it('formats UI amounts across thresholds', () => {
        expect(toUiAmount(0)).toBe(0);
        expect(toUiAmount(532)).toBe('532');
        expect(toUiAmount(1000)).toBe('1K');
        expect(toUiAmount(1250)).toBe('1.3K');
        expect(toUiAmount(1250000)).toBe('1.3M');
        expect(toUiAmount(2000000)).toBe('2M');
        expect(toUiAmount(2500000000)).toBe('2.5B');
    });
});
