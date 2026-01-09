import { I18N } from 'astrowind:config'

/**
 * Collections that support translation filtering
 * Read from config.yaml: i18n.support_translation
 */
const FILTERED_COLLECTIONS = I18N.support_translation || []

/**
 * Check if a collection should be filtered by language
 * @param collectionName - Name of the collection (e.g., 'articles', 'cheatsheets')
 * @returns true if collection should filter by language
 */
export function isCollectionFiltered(collectionName: string): boolean {
  return FILTERED_COLLECTIONS.includes(collectionName)
}

/**
 * Get list of all collections that support translation filtering
 * @returns Array of collection names that are filtered by language
 */
export function getSupportedCollections(): string[] {
  return [...FILTERED_COLLECTIONS]
}

/**
 * Check if a collection should show all languages (no filtering)
 * @param collectionName - Name of the collection
 * @returns true if collection should show all language versions
 */
export function isCollectionMultilingual(collectionName: string): boolean {
  return !isCollectionFiltered(collectionName)
}
