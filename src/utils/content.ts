import { type CollectionEntry, getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { getPermalink } from './permalinks';

export interface ContentItemData {
    title: string;
    description?: string;
    excerpt?: string;
    tags?: string[];
    category?: string;
    publishDate?: Date;
    updateDate?: Date;
    featured?: boolean;
    draft?: boolean;
    readingTime?: number;
    wordCount?: number;
    image?: string;
    resolvedImage?: string | ImageMetadata | null;
    // Collection-specific properties
    author?: string;
    topic?: string;
    difficulty?: string;
    generatedBy?: string;
    format?: string;
    version?: string;
    pdfUrl?: string;
    technologies?: string[];
    // index signature for dynamic properties
    [key: string]: unknown;
}

export type ContentType = 'articles' | 'showcase' | 'documents' | 'cheatsheets';

// Obsidian-compatible frontmatter parser
export function parseObsidianFrontmatter(content: string): {
    frontmatter: Record<string, unknown>;
    body: string;
} {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { frontmatter: {}, body: content };
    }

    const [, frontmatterContent, body] = match;
    const frontmatter: Record<string, unknown> = {};

    // Parse YAML-like frontmatter with Obsidian extensions
    frontmatterContent.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        // Handle key-value pairs
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex === -1) return;

        const key = trimmed.slice(0, colonIndex).trim();
        const value = trimmed.slice(colonIndex + 1).trim();

        // Parse different value types
        if (value.startsWith('[') && value.endsWith(']')) {
            // Array values
            frontmatter[key] = value
                .slice(1, -1)
                .split(',')
                .map((item) => item.trim().replace(/^["']|["']$/g, ''))
                .filter(Boolean);
        } else if (value === 'true' || value === 'false') {
            // Boolean values
            frontmatter[key] = value === 'true';
        } else if (!Number.isNaN(Number(value)) && value !== '') {
            // Numeric values
            frontmatter[key] = Number(value);
        } else if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
            // Date values
            frontmatter[key] = new Date(value);
        } else {
            // String values (remove quotes if present)
            frontmatter[key] = value.replace(/^["']|["']$/g, '');
        }
    });

    return { frontmatter, body };
}

// Auto-generate metadata from content
export function extractContentMetadata(content: string): {
    wordCount: number;
    readingTime: number;
    headings: string[];
    links: string[];
    excerpt?: string;
} {
    // Calculate word count
    const words = content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
    const wordCount = words.length;

    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    // Extract headings
    const headingRegex = /^#{1,6}\s+(.+)$/gm;
    const headings = Array.from(content.matchAll(headingRegex)).map((match) => match[1].trim());

    // Extract links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = Array.from(content.matchAll(linkRegex)).map((match) => match[2]);

    // Generate excerpt from first paragraph
    const paragraphs = content.split('\n\n').filter((p) => p.trim() && !p.trim().startsWith('#'));
    const excerpt = paragraphs[0]?.slice(0, 160) + (paragraphs[0]?.length > 160 ? '...' : '');

    return {
        wordCount,
        readingTime,
        headings,
        links,
        excerpt: excerpt || undefined,
    };
}

// Get all content with unified interface
export async function getAllContent(type?: ContentType) {
    const collections = {
        articles: await getCollection('articles'),
        showcase: await getCollection('showcase'),
        documents: await getCollection('documents'),
    };

    if (type) {
        return collections[type] || [];
    }

    // Return all content with type information
    return [
        ...collections.articles.map((item) => ({ ...item, contentType: 'articles' as const })),
        ...collections.showcase.map((item) => ({ ...item, contentType: 'showcase' as const })),
        ...collections.documents.map((item) => ({ ...item, contentType: 'documents' as const })),
    ];
}

// Filter content by various criteria
export function filterContent<T extends { data: ContentItemData; id: string; collection?: string }>(
    content: T[],
    filters: {
        tags?: string[];
        category?: string;
        featured?: boolean;
        draft?: boolean;
        search?: string;
    }
): T[] {
    return content.filter((item) => {
        const data = item.data as Record<string, unknown>;

        // Filter by tags
        if (filters.tags?.length) {
            const itemTags = (data.tags as string[]) || [];
            const hasMatchingTag = filters.tags.some((tag) =>
                itemTags.some((itemTag: string) =>
                    itemTag.toLowerCase().includes(tag.toLowerCase())
                )
            );
            if (!hasMatchingTag) return false;
        }

        // Filter by category
        if (filters.category && (data as Record<string, string>).category !== filters.category) {
            return false;
        }

        // Filter by featured status
        if (
            filters.featured !== undefined &&
            (data as Record<string, boolean>).featured !== filters.featured
        ) {
            return false;
        }

        // Filter by draft status
        if (
            filters.draft !== undefined &&
            (data as Record<string, boolean>).draft !== filters.draft
        ) {
            return false;
        }

        // Filter by search term
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const title = (data.title as string | undefined)?.toLowerCase() || '';
            const description = (data.description as string | undefined)?.toLowerCase() || '';
            const excerpt = (data.excerpt as string | undefined)?.toLowerCase() || '';

            if (
                !title.includes(searchTerm) &&
                !description.includes(searchTerm) &&
                !excerpt.includes(searchTerm)
            ) {
                return false;
            }
        }

        return true;
    });
}

// Sort content by various criteria
export function sortContent<T extends { data: ContentItemData; id: string; collection?: string }>(
    content: T[],
    sortBy: 'date' | 'title' | 'readingTime' | 'featured' = 'date',
    order: 'asc' | 'desc' = 'desc'
): T[] {
    return [...content].sort((a, b) => {
        let aValue: string | number | Date, bValue: string | number | Date;

        switch (sortBy) {
            case 'date':
                aValue =
                    (a.data as Record<string, Date>).publishDate ||
                    (a.data as Record<string, Date>).updateDate ||
                    new Date(0);
                bValue =
                    (b.data as Record<string, Date>).publishDate ||
                    (b.data as Record<string, Date>).updateDate ||
                    new Date(0);
                break;
            case 'title':
                aValue = (a.data as Record<string, string>).title?.toLowerCase() || '';
                bValue = (b.data as Record<string, string>).title?.toLowerCase() || '';
                break;
            case 'readingTime':
                aValue = (a.data as Record<string, number>).readingTime || 0;
                bValue = (b.data as Record<string, number>).readingTime || 0;
                break;
            case 'featured':
                aValue = (a.data as Record<string, boolean>).featured ? 1 : 0;
                bValue = (b.data as Record<string, boolean>).featured ? 1 : 0;
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

// Generate content URL
export function getContentUrl(entry: CollectionEntry<ContentType>, collection: string): string {
    const data = entry.data as Record<string, unknown>;
    const slug = (data?.slug || entry.id) as string;
    switch (collection) {
        case 'post':
            return getPermalink(slug, 'post');
        case 'articles':
            return getPermalink(slug, 'article');
        case 'documents':
            return getPermalink(slug, 'document');
        case 'showcase':
            return getPermalink(slug, 'showcase');
        default:
            return `/${slug}`;
    }
}

// Get related content based on tags and category
export async function getRelatedContent(
    currentEntry: CollectionEntry<ContentType>,
    collection: string,
    limit: number = 3
): Promise<CollectionEntry<ContentType>[]> {
    const allContent = (await getAllContent(
        collection as ContentType
    )) as CollectionEntry<ContentType>[];
    const data = currentEntry.data as Record<string, unknown>;
    const currentTags = (data.tags as string[]) || [];
    const currentCategory = data.category as string | undefined;

    // Score content by relevance
    const scoredContent = allContent
        .filter(
            (item) => (item.data.slug || item.id) !== (currentEntry.data.slug || currentEntry.id)
        )
        .map((item) => {
            let score = 0;
            const data = item.data as Record<string, unknown>;
            const itemTags = (data.tags as string[]) || [];

            // Score by matching tags
            const matchingTags = currentTags.filter((tag: string) =>
                itemTags.some((itemTag: string) => itemTag.toLowerCase() === tag.toLowerCase())
            );
            score += matchingTags.length * 2;

            // Score by matching category
            if (
                currentCategory &&
                (item.data as Record<string, unknown>).category === currentCategory
            ) {
                score += 3;
            }

            return { item, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ item }) => item);

    return scoredContent;
}

// Extract and normalize tags from content
export function extractTags<T extends { data: ContentItemData }>(content: T[]): string[] {
    const tagSet = new Set<string>();

    content.forEach((item) => {
        const data = item.data as Record<string, unknown>;
        const tags = (data.tags as string[]) || [];
        tags.forEach((tag: string) => {
            tagSet.add(tag.toLowerCase().trim());
        });
    });

    return Array.from(tagSet).sort();
}

// Extract and normalize categories from content
export function extractCategories<T extends { data: ContentItemData }>(content: T[]): string[] {
    const categorySet = new Set<string>();

    content.forEach((item) => {
        const data = item.data as Record<string, unknown>;
        const category = data.category as string | undefined;
        if (category) {
            categorySet.add(category.toLowerCase().trim());
        }
    });

    return Array.from(categorySet).sort();
}
