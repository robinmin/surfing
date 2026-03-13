import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    deduplicateContent,
    extractLanguageFromId,
    extractSlugFromId,
    filterAndDeduplicateContent,
    filterContentByLanguage,
    getAvailableLanguages,
    getPreferredLanguageForContent,
} from '~/utils/language';

const sampleItems = [
    { id: 'en/hello-world' },
    { id: 'cn/hello-world' },
    { id: 'jp/hello-world' },
    { id: 'en/deep/nested' },
];

describe('language utilities', () => {
    beforeEach(() => {
        localStorage.clear();
        document.cookie = '';
        vi.unstubAllGlobals();
    });

    it('extracts language and slug segments from content ids', () => {
        expect(extractLanguageFromId('en/hello-world')).toBe('en');
        expect(extractLanguageFromId('hello-world')).toBe('en');
        expect(extractSlugFromId('jp/guides/start-here')).toBe('guides/start-here');
        expect(extractSlugFromId('plain-slug')).toBe('plain-slug');
    });

    it('resolves preferred content language from browser preferences', () => {
        Object.defineProperty(navigator, 'language', {
            value: 'zh-CN',
            configurable: true,
        });

        expect(getPreferredLanguageForContent()).toBe('cn');
    });

    it('prefers local storage and cookies when detecting language', () => {
        localStorage.setItem('surfing-language', 'ja');
        expect(getPreferredLanguageForContent()).toBe('jp');

        localStorage.clear();
        document.cookie = 'surfing-language=zh';
        Object.defineProperty(navigator, 'language', {
            value: 'en-US',
            configurable: true,
        });

        expect(getPreferredLanguageForContent()).toBe('cn');
    });

    it('filters and deduplicates language variants by preferred language', () => {
        expect(filterContentByLanguage(sampleItems, 'en')).toEqual([
            { id: 'en/hello-world' },
            { id: 'en/deep/nested' },
        ]);

        expect(deduplicateContent(sampleItems, 'cn')).toEqual([{ id: 'cn/hello-world' }]);
        expect(filterAndDeduplicateContent(sampleItems, 'jp')).toEqual([{ id: 'jp/hello-world' }]);
    });

    it('lists available languages for a slug', () => {
        expect(getAvailableLanguages(sampleItems, 'hello-world').sort()).toEqual(['cn', 'en', 'jp']);
        expect(getAvailableLanguages(sampleItems, 'missing')).toEqual([]);
    });
});
