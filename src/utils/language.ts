import {
    CONTENT_LANG_MAP,
    DEFAULT_LANGUAGE,
    getPreferredLanguage,
    LANG_CODE_MAP,
    toContentLang,
    toI18nLang,
} from '~/i18n';

// Re-export for backward compatibility
export { LANG_CODE_MAP, CONTENT_LANG_MAP, toContentLang, toI18nLang };

/**
 * Extract language code from content ID
 * Content IDs follow pattern: {lang}/{slug}
 * Example: "en/hello-world" -> "en"
 */
export function extractLanguageFromId(id: string): string {
    const parts = id.split('/');
    return parts.length > 1 ? parts[0] : DEFAULT_LANGUAGE;
}

/**
 * Extract slug without language prefix from content ID
 * Example: "en/hello-world" -> "hello-world"
 */
export function extractSlugFromId(id: string): string {
    const parts = id.split('/');
    return parts.length > 1 ? parts.slice(1).join('/') : id;
}

/**
 * Get preferred language for content filtering
 * For static sites, this uses client-side preferences (localStorage/cookies/browser)
 */
export function getPreferredLanguageForContent(): string {
    const i18nLang = getPreferredLanguage();
    return toContentLang(i18nLang);
}

/**
 * Filter content collection by language
 * Returns only items matching the specified language
 */
export function filterContentByLanguage<T extends { id: string }>(
    items: T[],
    language: string
): T[] {
    return items.filter((item) => {
        const itemLang = extractLanguageFromId(item.id);
        return itemLang === language;
    });
}

/**
 * Deduplicate content by slug (removing language variants)
 * When multiple language versions exist, keeps only the one matching preferredLang
 * If preferredLang version doesn't exist, item is excluded (no fallback)
 */
export function deduplicateContent<T extends { id: string }>(
    items: T[],
    preferredLang: string
): T[] {
    const seenSlugs = new Set<string>();
    const result: T[] = [];

    // Group items by slug
    const itemsBySlug = new Map<string, T[]>();
    for (const item of items) {
        const slug = extractSlugFromId(item.id);
        if (!itemsBySlug.has(slug)) {
            itemsBySlug.set(slug, []);
        }
        itemsBySlug.get(slug)?.push(item);
    }

    // For each unique slug, pick the preferred language version
    for (const [slug, variants] of itemsBySlug) {
        if (seenSlugs.has(slug)) continue;

        // Find the variant in preferred language
        const preferredVariant = variants.find((item) => {
            const itemLang = extractLanguageFromId(item.id);
            return itemLang === preferredLang;
        });

        // Only include if preferred language version exists
        if (preferredVariant) {
            result.push(preferredVariant);
            seenSlugs.add(slug);
        }
    }

    return result;
}

/**
 * Filter and deduplicate content by language in one pass
 * This is the main function to use for content filtering
 */
export function filterAndDeduplicateContent<T extends { id: string }>(
    items: T[],
    preferredLang: string
): T[] {
    // Filter by language and deduplicate is the same operation
    // since we only keep items matching preferred language
    return deduplicateContent(items, preferredLang);
}

/**
 * Get all available languages for a specific content item (by slug)
 */
export function getAvailableLanguages<T extends { id: string }>(
    items: T[],
    slug: string
): string[] {
    const languages = new Set<string>();

    for (const item of items) {
        const itemSlug = extractSlugFromId(item.id);
        if (itemSlug === slug) {
            const lang = extractLanguageFromId(item.id);
            languages.add(lang);
        }
    }

    return Array.from(languages);
}
