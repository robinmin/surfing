import fs from 'node:fs';
import path from 'node:path';
import { extractContentMetadata, parseObsidianFrontmatter } from './content';

export interface ExtractedMetadata {
  title?: string;
  description?: string;
  wordCount: number;
  readingTime: number;
  headings: string[];
  links: string[];
  excerpt?: string;
  lastModified: Date;
  fileSize: number;
  language?: string;
  hasImages: boolean;
  hasCodeBlocks: boolean;
  linkCount: number;
  headingStructure: { level: number; text: string }[];
}

/**
 * Extract comprehensive metadata from a markdown file
 */
export async function extractMarkdownMetadata(filePath: string): Promise<ExtractedMetadata> {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const stats = await fs.promises.stat(filePath);

  const { frontmatter, body } = parseObsidianFrontmatter(content);
  const contentMeta = extractContentMetadata(body);

  // Detect language (simple heuristic)
  const language = detectLanguage(body);

  // Extract heading structure
  const headingStructure = extractHeadingStructure(body);

  // Check for images and code blocks
  const hasImages = /!\[.*?\]\(.*?\)|<img[^>]*>/i.test(body);
  const hasCodeBlocks = /```[\s\S]*?```|`[^`\n]+`/.test(body);

  return {
    title: frontmatter.title || extractTitleFromContent(body),
    description: frontmatter.description || frontmatter.excerpt || contentMeta.excerpt,
    wordCount: contentMeta.wordCount,
    readingTime: contentMeta.readingTime,
    headings: contentMeta.headings,
    links: contentMeta.links,
    excerpt: contentMeta.excerpt,
    lastModified: stats.mtime,
    fileSize: stats.size,
    language,
    hasImages,
    hasCodeBlocks,
    linkCount: contentMeta.links.length,
    headingStructure,
  };
}

/**
 * Extract metadata from an HTML file
 */
export async function extractHtmlMetadata(filePath: string): Promise<ExtractedMetadata> {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const stats = await fs.promises.stat(filePath);

  // Extract text content from HTML
  const textContent = stripHtml(content);
  const contentMeta = extractContentMetadata(textContent);

  // Extract HTML-specific metadata
  const title = extractHtmlTitle(content);
  const description = extractHtmlDescription(content);
  const headings = extractHtmlHeadings(content);
  const links = extractHtmlLinks(content);
  const language = extractHtmlLanguage(content);

  const hasImages = /<img[^>]*>/i.test(content);
  const hasCodeBlocks = /<code[^>]*>|<pre[^>]*>/i.test(content);

  return {
    title,
    description,
    wordCount: contentMeta.wordCount,
    readingTime: contentMeta.readingTime,
    headings,
    links,
    excerpt: description || contentMeta.excerpt,
    lastModified: stats.mtime,
    fileSize: stats.size,
    language,
    hasImages,
    hasCodeBlocks,
    linkCount: links.length,
    headingStructure: headings.map((text, index) => ({ level: 1, text })), // Simplified
  };
}

/**
 * Extract title from content if not in frontmatter
 */
function extractTitleFromContent(content: string): string | undefined {
  // Look for first H1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Look for first H2 heading if no H1
  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match) {
    return h2Match[1].trim();
  }

  // Extract from first paragraph
  const paragraphs = content.split('\n\n');
  const firstParagraph = paragraphs.find(p => p.trim() && !p.startsWith('#'));
  if (firstParagraph) {
    const words = firstParagraph.trim().split(/\s+/).slice(0, 8);
    return words.join(' ') + (words.length >= 8 ? '...' : '');
  }

  return undefined;
}

/**
 * Extract heading structure with levels
 */
function extractHeadingStructure(content: string): { level: number; text: string }[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: { level: number; text: string }[] = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({ level, text });
  }

  return headings;
}

/**
 * Simple language detection based on common words
 */
function detectLanguage(content: string): string {
  const text = content.toLowerCase();

  // English indicators
  const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'with'];
  const englishCount = englishWords.reduce((count, word) => {
    return count + (text.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
  }, 0);

  // Spanish indicators
  const spanishWords = ['el', 'la', 'de', 'que', 'y', 'es', 'en', 'un', 'se', 'no'];
  const spanishCount = spanishWords.reduce((count, word) => {
    return count + (text.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
  }, 0);

  // French indicators
  const frenchWords = ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir'];
  const frenchCount = frenchWords.reduce((count, word) => {
    return count + (text.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
  }, 0);

  if (englishCount > spanishCount && englishCount > frenchCount) {
    return 'en';
  } else if (spanishCount > frenchCount) {
    return 'es';
  } else if (frenchCount > 0) {
    return 'fr';
  }

  return 'en'; // Default to English
}

/**
 * Strip HTML tags and return plain text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract title from HTML
 */
function extractHtmlTitle(html: string): string | undefined {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) {
    return stripHtml(h1Match[1]).trim();
  }

  return undefined;
}

/**
 * Extract description from HTML meta tags
 */
function extractHtmlDescription(html: string): string | undefined {
  const metaDescMatch = html.match(/<meta[^>]+name=['"]description['"][^>]+content=['"]([^'"]*)['"]/i);
  if (metaDescMatch) {
    return metaDescMatch[1];
  }

  const ogDescMatch = html.match(/<meta[^>]+property=['"]og:description['"][^>]+content=['"]([^'"]*)['"]/i);
  if (ogDescMatch) {
    return ogDescMatch[1];
  }

  return undefined;
}

/**
 * Extract headings from HTML
 */
function extractHtmlHeadings(html: string): string[] {
  const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
  const headings: string[] = [];

  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const text = stripHtml(match[1]).trim();
    if (text) {
      headings.push(text);
    }
  }

  return headings;
}

/**
 * Extract links from HTML
 */
function extractHtmlLinks(html: string): string[] {
  const linkRegex = /<a[^>]+href=['"]([^'"]*)['"]/gi;
  const links: string[] = [];

  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      links.push(href);
    }
  }

  return [...new Set(links)]; // Remove duplicates
}

/**
 * Extract language from HTML
 */
function extractHtmlLanguage(html: string): string {
  const langMatch = html.match(/<html[^>]+lang=['"]([^'"]*)['"]/i);
  if (langMatch) {
    return langMatch[1];
  }

  const xmlLangMatch = html.match(/<html[^>]+xml:lang=['"]([^'"]*)['"]/i);
  if (xmlLangMatch) {
    return xmlLangMatch[1];
  }

  return 'en'; // Default to English
}

/**
 * Process all content files and extract metadata
 */
export async function processContentDirectory(dirPath: string): Promise<Map<string, ExtractedMetadata>> {
  const metadata = new Map<string, ExtractedMetadata>();

  if (!fs.existsSync(dirPath)) {
    return metadata;
  }

  const files = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(dirPath, file.name);
      const ext = path.extname(file.name).toLowerCase();

      try {
        let meta: ExtractedMetadata;

        if (ext === '.md' || ext === '.mdx') {
          meta = await extractMarkdownMetadata(filePath);
        } else if (ext === '.html') {
          meta = await extractHtmlMetadata(filePath);
        } else {
          continue; // Skip unsupported files
        }

        metadata.set(file.name, meta);
      } catch (error) {
        console.warn(`Failed to extract metadata from ${filePath}:`, error);
      }
    }
  }

  return metadata;
}

/**
 * Generate a metadata summary for all content
 */
export function generateMetadataSummary(allMetadata: Map<string, ExtractedMetadata>) {
  const summary = {
    totalFiles: allMetadata.size,
    totalWords: 0,
    averageReadingTime: 0,
    totalHeadings: 0,
    totalLinks: 0,
    languageDistribution: new Map<string, number>(),
    filesWithImages: 0,
    filesWithCode: 0,
    averageFileSize: 0,
  };

  for (const [, meta] of allMetadata) {
    summary.totalWords += meta.wordCount;
    summary.totalHeadings += meta.headings.length;
    summary.totalLinks += meta.linkCount;
    summary.averageFileSize += meta.fileSize;

    if (meta.hasImages) summary.filesWithImages++;
    if (meta.hasCodeBlocks) summary.filesWithCode++;

    const lang = meta.language || 'en';
    summary.languageDistribution.set(lang, (summary.languageDistribution.get(lang) || 0) + 1);
  }

  if (summary.totalFiles > 0) {
    summary.averageReadingTime = Math.round(summary.totalWords / 200); // 200 words per minute
    summary.averageFileSize = Math.round(summary.averageFileSize / summary.totalFiles);
  }

  return summary;
}