import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

// Note: post collection removed - using articles and showcase instead

// Articles collection for Obsidian markdown content
const articlesCollection = defineCollection({
  loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: './contents/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),

    // Obsidian frontmatter support
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    cssclass: z.string().optional(),

    // Status tracking
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // Subscription/premium content gating
    premium: z.boolean().default(false), // Requires Standard+ subscription to access

    // Content metadata
    author: z.string().optional(),
    image: z.string().optional(),
    excerpt: z.string().optional(),

    // Translation support
    translations: z.array(z.string()).default(['en']), // Available language codes for this content

    // Auto-generated fields
    readingTime: z.number().optional(),
    wordCount: z.number().optional(),

    metadata: metadataDefinition(),
  }),
});

// HTML documents collection for legacy and rich-formatted content
const documentsCollection = defineCollection({
  loader: glob({ pattern: ['**/*.{html,md}'], base: './contents/documents' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),

    // Content organization
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),

    // Status tracking
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // Document-specific fields
    source: z.string().optional(),
    contentType: z.enum(['page', 'snippet', 'template', 'legacy']).default('page'),
    author: z.string().optional(),
    image: z.string().optional(),

    // Translation support
    translations: z.array(z.string()).default(['en']), // Available language codes for this content

    // Custom styling support
    externalCSS: z.array(z.string()).optional(), // External CSS URLs (CDN, etc.)
    externalJS: z.array(z.string()).optional(), // External JS URLs (CDN, etc.)
    customCSS: z.string().optional(),
    customJS: z.string().optional(),
    preserveStyles: z.boolean().default(true),

    // Auto-extracted metadata
    headings: z.array(z.string()).optional(),
    links: z.array(z.string()).optional(),
    wordCount: z.number().optional(),
    readingTime: z.number().optional(),

    metadata: metadataDefinition(),
  }),
});

// Showcase collection for featured content
const showcaseCollection = defineCollection({
  loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: './contents/showcase' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string().optional(),
    publishDate: z.date(),

    // Showcase-specific fields
    projectUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    image: z.string(),
    technologies: z.array(z.string()).default([]),

    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),

    // Translation support
    translations: z.array(z.string()).default(['en']), // Available language codes for this content

    // Custom styling support (for interactive showcases)
    externalCSS: z.array(z.string()).optional(), // External CSS URLs (CDN, etc.)
    externalJS: z.array(z.string()).optional(), // External JS URLs (CDN, etc.)
    customCSS: z.string().optional(),
    customJS: z.string().optional(),
    preserveStyles: z.boolean().default(true),

    // Auto-generated fields
    readingTime: z.number().optional(),
    wordCount: z.number().optional(),

    metadata: metadataDefinition(),
  }),
});

// Cheatsheets collection for AI-generated reference materials
const cheatsheetsCollection = defineCollection({
  loader: glob({ pattern: ['**/*.{html,md}'], base: './contents/cheatsheets' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),

    // Content organization
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),

    // Status tracking
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // Cheatsheet-specific fields
    topic: z.string().optional(), // Main topic/technology
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    format: z.enum(['html', 'markdown']).default('html'),
    contentType: z.enum(['page', 'snippet', 'template', 'legacy']).optional(), // For backwards compatibility

    // Translation support
    translations: z.array(z.string()).default(['en']), // Available language codes for this content

    // File attachments
    pdfUrl: z.string().optional(), // Generated PDF version
    downloadUrl: z.string().optional(), // Direct download link

    // AI generation metadata
    generatedBy: z.string().optional(), // AI model used
    prompt: z.string().optional(), // Original prompt (optional)
    version: z.string().optional(), // Version of the cheatsheet

    // Content metadata
    author: z.string().optional(),
    source: z.string().optional(),
    image: z.string().optional(),

    // Auto-extracted metadata
    wordCount: z.number().optional(),
    readingTime: z.number().optional(),

    // Custom styling support (for HTML cheatsheets)
    externalCSS: z.array(z.string()).optional(), // External CSS URLs (CDN, etc.)
    externalJS: z.array(z.string()).optional(), // External JS URLs (CDN, etc.)
    customCSS: z.string().optional(),
    customJS: z.string().optional(),
    preserveStyles: z.boolean().default(true),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  articles: articlesCollection,
  documents: documentsCollection,
  showcase: showcaseCollection,
  cheatsheets: cheatsheetsCollection,
};
