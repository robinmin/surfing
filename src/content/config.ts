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
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/content/articles' }),
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

    // Content metadata
    author: z.string().optional(),
    image: z.string().optional(),
    excerpt: z.string().optional(),

    // Auto-generated fields
    readingTime: z.number().optional(),
    wordCount: z.number().optional(),

    metadata: metadataDefinition(),
  }),
});

// HTML documents collection
const documentsCollection = defineCollection({
  loader: glob({ pattern: ['*.html'], base: 'src/content/documents' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.date().optional(),

    tags: z.array(z.string()).default([]),
    category: z.string().optional(),

    // HTML-specific metadata
    source: z.string().optional(), // Original source URL or file
    contentType: z.enum(['page', 'snippet', 'template']).default('page'),

    // Auto-extracted metadata
    headings: z.array(z.string()).optional(),
    links: z.array(z.string()).optional(),

    metadata: metadataDefinition(),
  }),
});

// Showcase collection for featured content
const showcaseCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/content/showcase' }),
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
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  articles: articlesCollection,
  documents: documentsCollection,
  showcase: showcaseCollection,
};
