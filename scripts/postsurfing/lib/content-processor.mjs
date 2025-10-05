/**
 * Content Processor for PostSurfing CLI
 *
 * Handles file reading, content analysis, and output path determination
 */

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, extname, basename, dirname } from 'path';

export class ContentProcessor {
  constructor(logger) {
    this.logger = logger;
    this.supportedExtensions = ['.md', '.mdx', '.html', '.htm'];
  }

  /**
   * Process a content file or directory
   */
  async process(filePath, contentType, lang, options) {
    this.logger.debug(`Processing file: ${filePath}`);

    // Check if path exists
    if (!existsSync(filePath)) {
      throw new Error(`File or directory not found: ${filePath}`);
    }

    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      if (!options.batch) {
        throw new Error('Directory processing requires --batch flag');
      }
      return this.processBatch(filePath, contentType, lang, options);
    }

    return this.processSingleFile(filePath, contentType, lang, options);
  }

  /**
   * Process a single file
   */
  async processSingleFile(filePath, contentType, lang, options) {
    const extension = extname(filePath).toLowerCase();

    if (!this.supportedExtensions.includes(extension)) {
      throw new Error(`Unsupported file type: ${extension}. Supported: ${this.supportedExtensions.join(', ')}`);
    }

    this.logger.file('Reading', filePath);
    const content = readFileSync(filePath, 'utf8');

    // Analyze content
    const analysis = this.analyzeContent(content, extension);

    // Determine output path
    const outputPath = this.determineOutputPath(filePath, contentType, lang);

    // Check if output file already exists
    if (existsSync(outputPath) && !options.force) {
      this.logger.warn(`Output file already exists: ${outputPath}`);
      this.logger.warn('Use --force to overwrite or choose a different name');
    }

    return {
      content,
      metadata: analysis,
      outputPath,
      needsHtmlConversion: this.needsHtmlConversion(content, extension),
      originalPath: filePath,
    };
  }

  /**
   * Process multiple files in a directory
   */
  async processBatch(dirPath, contentType, lang, options) {
    this.logger.debug(`Processing directory: ${dirPath}`);

    const files = readdirSync(dirPath)
      .filter((file) => this.supportedExtensions.includes(extname(file).toLowerCase()))
      .map((file) => join(dirPath, file));

    if (files.length === 0) {
      throw new Error(`No supported files found in directory: ${dirPath}`);
    }

    this.logger.info(`Found ${files.length} files to process`);

    const results = [];
    for (let i = 0; i < files.length; i++) {
      this.logger.progress(i + 1, files.length, 'Processing files');

      try {
        const result = await this.processSingleFile(files[i], contentType, lang, options);
        results.push(result);
      } catch (error) {
        this.logger.error(`Failed to process ${files[i]}: ${error.message}`);
        if (!options['continue-on-error']) {
          throw error;
        }
      }
    }

    return { batch: true, results };
  }

  /**
   * Analyze content to extract metadata
   */
  analyzeContent(content, extension) {
    const analysis = {
      extension,
      hasExistingFrontmatter: false,
      existingFrontmatter: {},
      wordCount: 0,
      readingTime: 0,
      isHtml: extension === '.html' || extension === '.htm',
      extractedTitle: null,
      extractedDescription: null,
      suggestedTags: [],
      detectedTechnologies: [],
    };

    // Check for existing frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      analysis.hasExistingFrontmatter = true;
      try {
        // Simple YAML parsing for basic frontmatter
        const frontmatterText = frontmatterMatch[1];
        analysis.existingFrontmatter = this.parseSimpleYaml(frontmatterText);
      } catch {
        this.logger.warn('Failed to parse existing frontmatter');
      }
    }

    // Extract content without frontmatter
    const contentWithoutFrontmatter = analysis.hasExistingFrontmatter
      ? content.replace(/^---\n[\s\S]*?\n---\n/, '')
      : content;

    // Calculate word count and reading time
    if (analysis.isHtml) {
      // For HTML, extract text content for word count
      const textContent = contentWithoutFrontmatter
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      analysis.wordCount = textContent.split(' ').filter((word) => word.length > 0).length;
    } else {
      analysis.wordCount = contentWithoutFrontmatter.split(/\s+/).filter((word) => word.length > 0).length;
    }

    analysis.readingTime = Math.ceil(analysis.wordCount / 200); // 200 words per minute

    // Extract title
    analysis.extractedTitle = this.extractTitle(contentWithoutFrontmatter, analysis.isHtml);

    // Extract description (first paragraph)
    analysis.extractedDescription = this.extractDescription(contentWithoutFrontmatter, analysis.isHtml);

    // Suggest tags based on content
    analysis.suggestedTags = this.suggestTags(contentWithoutFrontmatter);

    // Detect technologies
    analysis.detectedTechnologies = this.detectTechnologies(contentWithoutFrontmatter);

    this.logger.object(analysis, 'Content Analysis');

    return analysis;
  }

  /**
   * Simple YAML parser for basic frontmatter
   */
  parseSimpleYaml(yamlText) {
    const result = {};
    const lines = yamlText.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;

      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();

      // Handle quoted strings
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map((item) => item.trim().replace(/['"]/g, ''));
      }

      // Handle booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;

      // Handle dates
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        value = new Date(value);
      }

      result[key] = value;
    }

    return result;
  }

  /**
   * Extract title from content
   */
  extractTitle(content, isHtml) {
    if (isHtml) {
      // Try to extract from <title> tag
      const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch) {
        return titleMatch[1].trim();
      }

      // Try to extract from first <h1> tag
      const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
      if (h1Match) {
        return h1Match[1].replace(/<[^>]*>/g, '').trim();
      }
    } else {
      // Try to extract from first # heading
      const headingMatch = content.match(/^#\s+(.+)$/m);
      if (headingMatch) {
        return headingMatch[1].trim();
      }
    }

    return null;
  }

  /**
   * Extract description from content
   */
  extractDescription(content, isHtml) {
    if (isHtml) {
      // Try to extract from meta description
      const metaMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      if (metaMatch) {
        return metaMatch[1].trim();
      }

      // Try to extract from first paragraph
      const pMatch = content.match(/<p[^>]*>(.*?)<\/p>/i);
      if (pMatch) {
        return pMatch[1]
          .replace(/<[^>]*>/g, '')
          .trim()
          .substring(0, 160);
      }
    } else {
      // Extract first paragraph from markdown
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```')) {
          return trimmed.substring(0, 160);
        }
      }
    }

    return null;
  }

  /**
   * Suggest tags based on content analysis
   */
  suggestTags(content) {
    const tags = new Set();
    const lowerContent = content.toLowerCase();

    // Technology keywords
    const techKeywords = {
      javascript: ['javascript', 'js', 'node.js', 'npm'],
      typescript: ['typescript', 'ts'],
      react: ['react', 'jsx', 'react.js'],
      vue: ['vue', 'vue.js', 'vuejs'],
      angular: ['angular', 'ng'],
      css: ['css', 'stylesheet', 'styling'],
      html: ['html', 'markup'],
      python: ['python', 'py', 'django', 'flask'],
      ai: ['ai', 'artificial intelligence', 'machine learning', 'ml'],
      api: ['api', 'rest', 'graphql', 'endpoint'],
      database: ['database', 'sql', 'mongodb', 'postgres'],
    };

    Object.entries(techKeywords).forEach(([tag, keywords]) => {
      if (keywords.some((keyword) => lowerContent.includes(keyword))) {
        tags.add(tag);
      }
    });

    return Array.from(tags).slice(0, 5); // Limit to 5 suggestions
  }

  /**
   * Detect technologies from content
   */
  detectTechnologies(content) {
    const technologies = new Set();
    const lowerContent = content.toLowerCase();

    const techPatterns = [
      { name: 'Astro', patterns: ['astro', 'astro.build'] },
      { name: 'React', patterns: ['react', 'jsx', 'react.js'] },
      { name: 'Vue', patterns: ['vue', 'vue.js', 'vuejs'] },
      { name: 'TypeScript', patterns: ['typescript', 'ts'] },
      { name: 'JavaScript', patterns: ['javascript', 'js'] },
      { name: 'Tailwind CSS', patterns: ['tailwind', 'tailwindcss'] },
      { name: 'Node.js', patterns: ['node.js', 'nodejs', 'npm'] },
      { name: 'Python', patterns: ['python', 'py'] },
      { name: 'Docker', patterns: ['docker', 'dockerfile'] },
    ];

    techPatterns.forEach(({ name, patterns }) => {
      if (patterns.some((pattern) => lowerContent.includes(pattern))) {
        technologies.add(name);
      }
    });

    return Array.from(technologies);
  }

  /**
   * Determine if content needs HTML conversion
   */
  needsHtmlConversion(content, extension) {
    if (extension === '.html' || extension === '.htm') {
      return true;
    }

    // For markdown files, be more careful about HTML detection
    // Don't convert if HTML tags are likely to be code examples

    // First, check if it's clearly a markdown file with HTML examples
    const hasMarkdownHeadings = content.match(/^#{1,6}\s+/m);
    const hasCodeBlocks = content.includes('```');

    // If it has markdown features, it's likely markdown with HTML examples
    if (hasMarkdownHeadings || hasCodeBlocks) {
      return false;
    }

    // Only convert if it's a complete HTML document structure
    // Check for DOCTYPE and proper HTML document structure at the start
    const startsWithDoctype = content.trimStart().startsWith('<!DOCTYPE html>');
    const startsWithHtml = content.trimStart().startsWith('<html');

    // Must start with DOCTYPE or <html> to be considered a real HTML document
    if (!startsWithDoctype && !startsWithHtml) {
      return false;
    }

    const hasHtmlTag = content.includes('<html');
    const hasHeadTag = content.includes('<head');
    const hasBodyTag = content.includes('<body');

    // Require proper document structure for conversion
    return (
      (startsWithDoctype && hasHtmlTag && hasHeadTag && hasBodyTag) || (startsWithHtml && hasHeadTag && hasBodyTag)
    );
  }

  /**
   * Determine output path for processed content
   */
  determineOutputPath(inputPath, contentType, lang = 'en') {
    const baseName = basename(inputPath, extname(inputPath));
    const outputDir = join(process.cwd(), 'contents', contentType, lang);

    // Always use .md extension for output
    const outputFileName = `${baseName}.md`;

    return join(outputDir, outputFileName);
  }

  /**
   * Write processed content to file
   */
  async writeContent(processedContent, outputPath) {
    this.logger.file('Writing', outputPath);

    // Ensure directory exists
    const dir = dirname(outputPath);
    if (!existsSync(dir)) {
      // Create the directory if it doesn't exist
      const { mkdirSync } = await import('fs');
      mkdirSync(dir, { recursive: true });
    }

    // Combine frontmatter and content
    const frontmatterYaml = this.stringifyYaml(processedContent.frontmatter);
    const finalContent = `---\n${frontmatterYaml}---\n\n${processedContent.body}`;

    writeFileSync(outputPath, finalContent, 'utf8');
    this.logger.success(`Content written to: ${outputPath}`);
  }

  /**
   * Simple YAML stringifier
   */
  stringifyYaml(obj) {
    let yaml = '';

    Object.entries(obj).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        yaml += `${key}: [${value.map((v) => `"${v}"`).join(', ')}]\n`;
      } else if (typeof value === 'string' && value.includes('\n')) {
        yaml += `${key}: |\n${value
          .split('\n')
          .map((line) => `  ${line}`)
          .join('\n')}\n`;
      } else if (typeof value === 'string') {
        yaml += `${key}: "${value}"\n`;
      } else if (value instanceof Date) {
        yaml += `${key}: ${value.toISOString().split('T')[0]}\n`;
      } else {
        yaml += `${key}: ${value}\n`;
      }
    });

    return yaml;
  }
}
