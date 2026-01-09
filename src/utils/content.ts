import { type CollectionEntry, getCollection } from 'astro:content'
import { getPermalink } from './permalinks'

export type ContentType = 'articles' | 'showcase' | 'documents' | 'cheatsheets'

// Obsidian-compatible frontmatter parser
export function parseObsidianFrontmatter(content: string): {
  frontmatter: Record<string, any>
  body: string
} {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const [, frontmatterContent, body] = match
  const frontmatter: Record<string, any> = {}

  // Parse YAML-like frontmatter with Obsidian extensions
  frontmatterContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    // Handle key-value pairs
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) return

    const key = trimmed.slice(0, colonIndex).trim()
    const value = trimmed.slice(colonIndex + 1).trim()

    // Parse different value types
    if (value.startsWith('[') && value.endsWith(']')) {
      // Array values
      frontmatter[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else if (value === 'true' || value === 'false') {
      // Boolean values
      frontmatter[key] = value === 'true'
    } else if (!isNaN(Number(value)) && value !== '') {
      // Numeric values
      frontmatter[key] = Number(value)
    } else if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      // Date values
      frontmatter[key] = new Date(value)
    } else {
      // String values (remove quotes if present)
      frontmatter[key] = value.replace(/^["']|["']$/g, '')
    }
  })

  return { frontmatter, body }
}

// Auto-generate metadata from content
export function extractContentMetadata(content: string): {
  wordCount: number
  readingTime: number
  headings: string[]
  links: string[]
  excerpt?: string
} {
  // Calculate word count
  const words = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
  const wordCount = words.length

  // Calculate reading time (average 200 words per minute)
  const readingTime = Math.ceil(wordCount / 200)

  // Extract headings
  const headingRegex = /^#{1,6}\s+(.+)$/gm
  const headings: string[] = []
  let headingMatch: RegExpExecArray | null
  while ((headingMatch = headingRegex.exec(content)) !== null) {
    headings.push(headingMatch[1].trim())
  }

  // Extract links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const links: string[] = []
  let linkMatch: RegExpExecArray | null
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    links.push(linkMatch[2])
  }

  // Generate excerpt from first paragraph
  const paragraphs = content.split('\n\n').filter((p) => p.trim() && !p.trim().startsWith('#'))
  const excerpt = paragraphs[0]?.slice(0, 160) + (paragraphs[0]?.length > 160 ? '...' : '')

  return {
    wordCount,
    readingTime,
    headings,
    links,
    excerpt: excerpt || undefined,
  }
}

// Get all content with unified interface
export async function getAllContent(type?: ContentType) {
  const collections = {
    articles: await getCollection('articles'),
    showcase: await getCollection('showcase'),
    documents: await getCollection('documents'),
  }

  if (type) {
    return collections[type] || []
  }

  // Return all content with type information
  return [
    ...collections.articles.map((item) => ({ ...item, contentType: 'articles' as const })),
    ...collections.showcase.map((item) => ({ ...item, contentType: 'showcase' as const })),
    ...collections.documents.map((item) => ({ ...item, contentType: 'documents' as const })),
  ]
}

// Filter content by various criteria
export function filterContent(
  content: any[],
  filters: {
    tags?: string[]
    category?: string
    featured?: boolean
    draft?: boolean
    search?: string
  }
): any[] {
  return content.filter((item) => {
    const data = item.data

    // Filter by tags
    if (filters.tags?.length) {
      const itemTags = data.tags || []
      const hasMatchingTag = filters.tags.some((tag) =>
        itemTags.some((itemTag: string) => itemTag.toLowerCase().includes(tag.toLowerCase()))
      )
      if (!hasMatchingTag) return false
    }

    // Filter by category
    if (filters.category && (data as any).category !== filters.category) {
      return false
    }

    // Filter by featured status
    if (filters.featured !== undefined && (data as any).featured !== filters.featured) {
      return false
    }

    // Filter by draft status
    if (filters.draft !== undefined && (data as any).draft !== filters.draft) {
      return false
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const title = data.title?.toLowerCase() || ''
      const description = data.description?.toLowerCase() || ''
      const excerpt = data.excerpt?.toLowerCase() || ''

      if (
        !title.includes(searchTerm) &&
        !description.includes(searchTerm) &&
        !excerpt.includes(searchTerm)
      ) {
        return false
      }
    }

    return true
  })
}

// Sort content by various criteria
export function sortContent(
  content: any[],
  sortBy: 'date' | 'title' | 'readingTime' | 'featured' = 'date',
  order: 'asc' | 'desc' = 'desc'
): any[] {
  return [...content].sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortBy) {
      case 'date':
        aValue = (a.data as any).publishDate || (a.data as any).updateDate || new Date(0)
        bValue = (b.data as any).publishDate || (b.data as any).updateDate || new Date(0)
        break
      case 'title':
        aValue = (a.data as any).title?.toLowerCase() || ''
        bValue = (b.data as any).title?.toLowerCase() || ''
        break
      case 'readingTime':
        aValue = (a.data as any).readingTime || 0
        bValue = (b.data as any).readingTime || 0
        break
      case 'featured':
        aValue = (a.data as any).featured ? 1 : 0
        bValue = (b.data as any).featured ? 1 : 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })
}

// Generate content URL
export function getContentUrl(entry: any, collection: string): string {
  const slug = (entry.data?.slug || entry.id) as string
  switch (collection) {
    case 'post':
      return getPermalink(slug, 'post')
    case 'articles':
      return getPermalink(slug, 'article')
    case 'documents':
      return getPermalink(slug, 'document')
    case 'showcase':
      return getPermalink(slug, 'showcase')
    default:
      return `/${slug}`
  }
}

// Get related content based on tags and category
export async function getRelatedContent(
  currentEntry: any,
  collection: string,
  limit: number = 3
): Promise<any[]> {
  const allContent = (await getAllContent(collection as ContentType)) as any[]
  const currentTags = (currentEntry.data as any).tags || []
  const currentCategory = (currentEntry.data as any).category

  // Score content by relevance
  const scoredContent = allContent
    .filter((item) => (item.data.slug || item.id) !== (currentEntry.data.slug || currentEntry.id))
    .map((item) => {
      let score = 0
      const itemTags = (item.data as any).tags || []

      // Score by matching tags
      const matchingTags = currentTags.filter((tag: string) =>
        itemTags.some((itemTag: string) => itemTag.toLowerCase() === tag.toLowerCase())
      )
      score += matchingTags.length * 2

      // Score by matching category
      if (currentCategory && (item.data as any).category === currentCategory) {
        score += 3
      }

      return { item, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item)

  return scoredContent
}

// Extract and normalize tags from content
export function extractTags(content: CollectionEntry<any>[]): string[] {
  const tagSet = new Set<string>()

  content.forEach((item: any) => {
    const tags = item.data.tags || []
    tags.forEach((tag: string) => {
      tagSet.add(tag.toLowerCase().trim())
    })
  })

  return Array.from(tagSet).sort()
}

// Extract and normalize categories from content
export function extractCategories(content: CollectionEntry<any>[]): string[] {
  const categorySet = new Set<string>()

  content.forEach((item: any) => {
    if (item.data.category) {
      categorySet.add(item.data.category.toLowerCase().trim())
    }
  })

  return Array.from(categorySet).sort()
}
