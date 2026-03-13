import { describe, expect, it, vi } from 'vitest';

import {
    getCurrentLanguage,
    getPreferredLanguage,
    setLanguagePreference,
    t,
    toContentLang,
    toI18nLang,
} from '~/i18n';

describe('i18n helpers', () => {
    it('maps between i18n language codes and content directory codes', () => {
        expect(toContentLang('zh')).toBe('cn');
        expect(toContentLang('ja')).toBe('jp');
        expect(toI18nLang('cn')).toBe('zh');
        expect(toI18nLang('jp')).toBe('ja');
    });

    it('resolves language preference from localStorage, cookies, and navigator', () => {
        Object.defineProperty(navigator, 'language', {
            value: 'ja-JP',
            configurable: true,
        });
        expect(getPreferredLanguage()).toBe('ja');

        document.cookie = 'surfing-language=zh';
        expect(getPreferredLanguage()).toBe('zh');

        localStorage.setItem('surfing-language', 'en');
        expect(getPreferredLanguage()).toBe('en');
        expect(getCurrentLanguage()).toBe('en');
    });

    it('falls back to the default language when preferences are invalid or no window exists', () => {
        localStorage.setItem('surfing-language', 'invalid');
        document.cookie = 'surfing-language=invalid';
        Object.defineProperty(navigator, 'language', {
            value: 'de-DE',
            configurable: true,
        });
        expect(getPreferredLanguage()).toBe('en');

        const originalWindow = globalThis.window;
        Object.defineProperty(globalThis, 'window', { value: undefined, configurable: true });
        expect(getPreferredLanguage()).toBe('en');
        expect(getCurrentLanguage()).toBe('en');
        setLanguagePreference('zh');
        Object.defineProperty(globalThis, 'window', { value: originalWindow, configurable: true });
    });

    it('stores the selected language and dispatches a reactive change event', () => {
        const listener = vi.fn();
        window.addEventListener('languageChange', listener);

        setLanguagePreference('ja');

        expect(localStorage.getItem('surfing-language')).toBe('ja');
        expect(document.cookie).toContain('surfing-language=ja');
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('returns translated text with english fallback and warns on missing keys', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        expect(t('nav.home', 'zh')).toBe('首页');
        expect(t('common.copySuccess', 'ja')).toBeTruthy();
        expect(t('site.description', 'ja')).toBeTruthy();
        expect(t('site.description', undefined)).toBeTruthy();
        expect(t('nav.home', 'fr' as never)).toBe('Home');
        expect(t('missing.key', 'zh')).toBe('missing.key');
        expect(t(undefined, 'en')).toBe('');
        expect(warnSpy).toHaveBeenCalledWith('Translation key not found: missing.key');
    });
});
