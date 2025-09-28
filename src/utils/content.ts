import { getCollection, type CollectionEntry } from 'astro:content';
import { getPermalink } from './permalinks';

export type ContentType = 'articles' | 'documents' | 'showcase';

// Obsidian-compatible frontmatter parser
export function parseObsidianFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const [, frontmatterContent, body] = match;
  const frontmatter: Record<string, any> = {};

  // Parse YAML-like frontmatter with Obsidian extensions
  frontmatterContent.split('\n').forEach(line => {
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
        .map(item => item.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else if (value === 'true' || value === 'false') {
      // Boolean values
      frontmatter[key] = value === 'true';
    } else if (!isNaN(Number(value)) && value !== '') {
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
  const words = content.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Calculate reading time (average 200 words per minute)
  const readingTime = Math.ceil(wordCount / 200);

  // Extract headings
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings: string[] = [];
  let headingMatch;
  while ((headingMatch = headingRegex.exec(content)) !== null) {
    headings.push(headingMatch[1].trim());
  }

  // Extract links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: string[] = [];
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    links.push(linkMatch[2]);
  }

  // Generate excerpt from first paragraph
  const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.trim().startsWith('#'));
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
    documents: await getCollection('documents'),
    showcase: await getCollection('showcase'),
  };

  if (type) {
    return collections[type] || [];
  }

  // Return all content with type information
  return [
    ...collections.articles.map(item => ({ ...item, contentType: 'articles' as const })),
    ...collections.documents.map(item => ({ ...item, contentType: 'documents' as const })),
    ...collections.showcase.map(item => ({ ...item, contentType: 'showcase' as const })),
  ];
}

// Filter content by various criteria
export function filterContent<T extends CollectionEntry<any>>(
  content: T[],
  filters: {
    tags?: string[];
    category?: string;
    featured?: boolean;
    draft?: boolean;
    search?: string;
  }
): T[] {
  return content.filter(item => {
    const data = item.data;

    // Filter by tags
    if (filters.tags?.length) {
      const itemTags = data.tags || [];
      const hasMatchingTag = filters.tags.some(tag =>
        itemTags.some((itemTag: string) =>
          itemTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    // Filter by category
    if (filters.category && data.category !== filters.category) {
      return false;
    }

    // Filter by featured status
    if (filters.featured !== undefined && data.featured !== filters.featured) {
      return false;
    }

    // Filter by draft status
    if (filters.draft !== undefined && data.draft !== filters.draft) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const title = data.title?.toLowerCase() || '';
      const description = data.description?.toLowerCase() || '';
      const excerpt = data.excerpt?.toLowerCase() || '';

      if (!title.includes(searchTerm) &&
          !description.includes(searchTerm) &&
          !excerpt.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
}

// Sort content by various criteria
export function sortContent<T extends CollectionEntry<any>>(
  content: T[],
  sortBy: 'date' | 'title' | 'readingTime' | 'featured' = 'date',
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...content].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'date':
        aValue = a.data.publishDate || a.data.updateDate || new Date(0);
        bValue = b.data.publishDate || b.data.updateDate || new Date(0);
        break;
      case 'title':
        aValue = a.data.title?.toLowerCase() || '';
        bValue = b.data.title?.toLowerCase() || '';
        break;
      case 'readingTime':
        aValue = a.data.readingTime || 0;
        bValue = b.data.readingTime || 0;
        break;
      case 'featured':
        aValue = a.data.featured ? 1 : 0;
        bValue = b.data.featured ? 1 : 0;
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
export function getContentUrl(entry: CollectionEntry<any>, collection: string): string {
  switch (collection) {
    case 'post':
      return getPermalink(entry.slug, 'post');
    case 'articles':
      return getPermalink(entry.slug, 'article');
    case 'documents':
      return getPermalink(entry.slug, 'document');
    case 'showcase':
      return getPermalink(entry.slug, 'showcase');
    default:
      return `/${entry.slug}`;
  }
}

// Get related content based on tags and category
export async function getRelatedContent<T extends CollectionEntry<any>>(
  currentEntry: T,
  collection: string,
  limit: number = 3
): Promise<T[]> {
  const allContent = await getAllContent(collection as ContentType) as T[];
  const currentTags = currentEntry.data.tags || [];
  const currentCategory = currentEntry.data.category;

  // Score content by relevance
  const scoredContent = allContent
    .filter(item => item.slug !== currentEntry.slug)
    .map(item => {
      let score = 0;
      const itemTags = item.data.tags || [];

      // Score by matching tags
      const matchingTags = currentTags.filter(tag =>
        itemTags.some((itemTag: string) =>
          itemTag.toLowerCase() === tag.toLowerCase()
        )
      );
      score += matchingTags.length * 2;

      // Score by matching category
      if (currentCategory && item.data.category === currentCategory) {
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
export function extractTags(content: CollectionEntry<any>[]): string[] {
  const tagSet = new Set<string>();

  content.forEach(item => {
    const tags = item.data.tags || [];
    tags.forEach((tag: string) => {
      tagSet.add(tag.toLowerCase().trim());
    });
  });

  return Array.from(tagSet).sort();
}

// Extract and normalize categories from content
export function extractCategories(content: CollectionEntry<any>[]): string[] {
  const categorySet = new Set<string>();

  content.forEach(item => {
    if (item.data.category) {
      categorySet.add(item.data.category.toLowerCase().trim());
    }
  });

  return Array.from(categorySet).sort();
}