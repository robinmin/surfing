import { en } from './translations/en';
import { zh } from './translations/zh';
import { ja } from './translations/ja';
import type { Translation } from './translations/en';

export type SupportedLanguage = 'en' | 'zh' | 'ja';

export const LANGUAGES: Record<SupportedLanguage, { name: string; flag: string; nativeName: string }> = {
  en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
  zh: { name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  ja: { name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
};

const translations: Record<SupportedLanguage, Translation> = {
  en,
  zh,
  ja,
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const LANGUAGE_STORAGE_KEY = 'surfing-language';

/**
 * Language code mapping between i18n codes and content directory names
 * i18n: 'en' | 'zh' | 'ja'
 * content: 'en' | 'cn' | 'jp'
 */
export const LANG_CODE_MAP: Record<SupportedLanguage, string> = {
  en: 'en',
  zh: 'cn',
  ja: 'jp',
};

export const CONTENT_LANG_MAP: Record<string, SupportedLanguage> = {
  en: 'en',
  cn: 'zh',
  jp: 'ja',
};

/**
 * Convert i18n language code to content directory name
 * Example: 'zh' -> 'cn', 'ja' -> 'jp'
 */
export function toContentLang(i18nLang: SupportedLanguage): string {
  return LANG_CODE_MAP[i18nLang] || i18nLang;
}

/**
 * Convert content directory name to i18n language code
 * Example: 'cn' -> 'zh', 'jp' -> 'ja'
 */
export function toI18nLang(contentLang: string): SupportedLanguage {
  return CONTENT_LANG_MAP[contentLang] || (contentLang as SupportedLanguage);
}

// Get nested property from object using dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Get user's preferred language with priority:
// 1. User preference (localStorage)
// 2. Cookie (set by SSR)
// 3. Browser preference
// 4. Default language
export function getPreferredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  // 1. Check user preference in localStorage
  const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
  if (storedLang && Object.keys(LANGUAGES).includes(storedLang)) {
    return storedLang;
  }

  // 2. Check cookie (set by SSR or previous session)
  const cookieMatch = document.cookie.match(new RegExp(`(?:^|;\\s*)${LANGUAGE_STORAGE_KEY}=([^;]+)`));
  if (cookieMatch) {
    const cookieLang = cookieMatch[1] as SupportedLanguage;
    if (Object.keys(LANGUAGES).includes(cookieLang)) {
      return cookieLang;
    }
  }

  // 3. Check browser preference
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  if (Object.keys(LANGUAGES).includes(browserLang)) {
    return browserLang;
  }

  // 4. Fall back to default
  return DEFAULT_LANGUAGE;
}

// Set user language preference
export function setLanguagePreference(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);

  // Also set as cookie for SSR support
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;

  // Dispatch custom event for reactive updates
  window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
}

// Get current language (reactive in client)
export function getCurrentLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  return getPreferredLanguage();
}

// Translation function
export function t(key: string | undefined, lang?: SupportedLanguage): string {
  // Handle undefined or empty keys
  if (!key) return '';

  const currentLang = lang || getCurrentLanguage();
  const translation = translations[currentLang];

  const value = getNestedValue(translation, key);

  if (value === undefined || value === null) {
    // Fallback to English if key not found
    const fallback = getNestedValue(translations.en, key);
    if (fallback === undefined || fallback === null) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return fallback;
  }

  return value;
}
