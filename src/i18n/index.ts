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

// Get nested property from object using dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Get user's preferred language with priority:
// 1. User preference (stored in localStorage/cookie)
// 2. Browser preference
// 3. Default language
export function getPreferredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  // 1. Check user preference in localStorage
  const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
  if (storedLang && Object.keys(LANGUAGES).includes(storedLang)) {
    return storedLang;
  }

  // 2. Check browser preference
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  if (Object.keys(LANGUAGES).includes(browserLang)) {
    return browserLang;
  }

  // 3. Fall back to default
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
export function t(key: string, lang?: SupportedLanguage): string {
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

// Get translation for server-side rendering
export function getServerTranslation(lang: SupportedLanguage) {
  return (key: string): string => t(key, lang);
}

// Get language from request (for SSR)
export function getLanguageFromRequest(request: Request): SupportedLanguage {
  // Check URL params first
  const url = new URL(request.url);
  const urlLang = url.searchParams.get('lang') as SupportedLanguage;
  if (urlLang && Object.keys(LANGUAGES).includes(urlLang)) {
    return urlLang;
  }

  // Check cookies
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((cookie) => {
        const [name, value] = cookie.trim().split('=');
        return [name, value];
      })
    );

    const cookieLang = cookies[LANGUAGE_STORAGE_KEY] as SupportedLanguage;
    if (cookieLang && Object.keys(LANGUAGES).includes(cookieLang)) {
      return cookieLang;
    }
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserLangs = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0])
      .filter((lang) => Object.keys(LANGUAGES).includes(lang));

    if (browserLangs.length > 0) {
      return browserLangs[0] as SupportedLanguage;
    }
  }

  return DEFAULT_LANGUAGE;
}
