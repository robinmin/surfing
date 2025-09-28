/**
 * Frontmatter Manager for PostSurfing CLI
 *
 * Handles frontmatter validation, completion, and user interaction
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

export class FrontmatterManager {
  constructor(logger, scriptDir) {
    this.logger = logger;
    this.scriptDir = scriptDir;
    this.schemas = this.loadSchemas();
  }

  /**
   * Load content type schemas
   */
  loadSchemas() {
    const schemas = {};
    const contentTypes = ['articles', 'showcase', 'documents'];

    contentTypes.forEach((type) => {
      const templatePath = join(this.scriptDir, 'templates', `${type}.yaml`);
      if (existsSync(templatePath)) {
        try {
          const template = readFileSync(templatePath, 'utf8');
          schemas[type] = this.parseTemplate(template);
        } catch (error) {
          this.logger.warn(`Failed to load template for ${type}: ${error.message}`);
        }
      }
    });

    // Fallback schemas if templates don't exist
    if (Object.keys(schemas).length === 0) {
      schemas.articles = this.getDefaultArticlesSchema();
      schemas.showcase = this.getDefaultShowcaseSchema();
      schemas.documents = this.getDefaultDocumentsSchema();
    }

    return schemas;
  }

  /**
   * Process frontmatter for content
   */
  async process(content, contentType, metadata, interactive = false) {
    this.logger.debug(`Processing frontmatter for ${contentType}`);

    const schema = this.schemas[contentType];
    if (!schema) {
      throw new Error(`Unknown content type: ${contentType}`);
    }

    // Extract existing frontmatter and body
    const { frontmatter: existing, body } = this.extractFrontmatter(content);

    // Merge with extracted metadata and HTML conversion results
    const merged = this.mergeMetadata(existing, metadata, schema);

    // Validate against schema
    const validation = this.validateFrontmatter(merged, schema);
    this.logger.frontmatterValidation(validation);

    // Handle missing required fields
    let finalFrontmatter = merged;
    if (!validation.valid || interactive) {
      finalFrontmatter = await this.handleMissingFields(merged, validation, schema, interactive);
    }

    // Apply auto-completion for optional fields
    finalFrontmatter = this.autoCompleteOptionalFields(finalFrontmatter, schema, metadata);

    // Final validation
    const finalValidation = this.validateFrontmatter(finalFrontmatter, schema);
    if (!finalValidation.valid) {
      throw new Error(`Validation failed: Missing required fields: ${finalValidation.missing.join(', ')}`);
    }

    return {
      frontmatter: finalFrontmatter,
      body: body,
    };
  }

  /**
   * Extract frontmatter and body from content
   */
  extractFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

    if (frontmatterMatch) {
      const frontmatterText = frontmatterMatch[1];
      const body = frontmatterMatch[2];

      try {
        const frontmatter = this.parseYaml(frontmatterText);
        return { frontmatter, body };
      } catch {
        this.logger.warn('Failed to parse existing frontmatter, treating as body content');
      }
    }

    return { frontmatter: {}, body: content };
  }

  /**
   * Merge metadata from various sources
   */
  mergeMetadata(existing, metadata, schema) {
    const merged = { ...existing };

    // Merge extracted metadata
    if (metadata.extractedTitle && !merged.title) {
      merged.title = metadata.extractedTitle;
    }

    if (metadata.extractedDescription && !merged.description) {
      merged.description = metadata.extractedDescription;
    }

    // Merge HTML conversion results
    if (metadata.customCSS) {
      merged.customCSS = metadata.customCSS;
    }

    if (metadata.customJS) {
      merged.customJS = metadata.customJS;
    }

    // Merge suggested tags
    if (metadata.suggestedTags && metadata.suggestedTags.length > 0) {
      merged.tags = merged.tags || [];
      metadata.suggestedTags.forEach((tag) => {
        if (!merged.tags.includes(tag)) {
          merged.tags.push(tag);
        }
      });
    }

    // Merge detected technologies (for showcase)
    if (schema.name === 'showcase' && metadata.detectedTechnologies) {
      merged.technologies = merged.technologies || [];
      metadata.detectedTechnologies.forEach((tech) => {
        if (!merged.technologies.includes(tech)) {
          merged.technologies.push(tech);
        }
      });
    }

    // Set reading time and word count
    if (metadata.readingTime) {
      merged.readingTime = metadata.readingTime;
    }

    if (metadata.wordCount) {
      merged.wordCount = metadata.wordCount;
    }

    return merged;
  }

  /**
   * Validate frontmatter against schema
   */
  validateFrontmatter(frontmatter, schema) {
    const missing = [];
    const warnings = [];
    const suggestions = [];

    // Check required fields
    schema.required.forEach((field) => {
      if (!frontmatter[field] || (Array.isArray(frontmatter[field]) && frontmatter[field].length === 0)) {
        missing.push(field);
      }
    });

    // Check field types and provide suggestions
    Object.entries(schema.fields).forEach(([field, config]) => {
      const value = frontmatter[field];

      if (value !== undefined && value !== null) {
        // Type checking
        if (config.type === 'array' && !Array.isArray(value)) {
          warnings.push(`${field} should be an array`);
        } else if (config.type === 'date' && !(value instanceof Date) && typeof value !== 'string') {
          warnings.push(`${field} should be a date`);
        } else if (config.type === 'boolean' && typeof value !== 'boolean') {
          warnings.push(`${field} should be a boolean`);
        }

        // Enum validation
        if (config.enum && !config.enum.includes(value)) {
          warnings.push(`${field} should be one of: ${config.enum.join(', ')}`);
        }
      }

      // Suggestions for optional fields
      if (!frontmatter[field] && config.optional && config.suggestion) {
        suggestions.push(`Consider adding ${field}: ${config.suggestion}`);
      }
    });

    return {
      valid: missing.length === 0,
      missing,
      warnings,
      suggestions,
    };
  }

  /**
   * Handle missing required fields
   */
  async handleMissingFields(frontmatter, validation, schema, interactive) {
    const updated = { ...frontmatter };

    for (const field of validation.missing) {
      const fieldConfig = schema.fields[field];

      if (fieldConfig.autoGenerate) {
        // Try to auto-generate the field
        const generated = this.autoGenerateField(field, fieldConfig, updated);
        if (generated !== null) {
          updated[field] = generated;
          this.logger.info(`Auto-generated ${field}: ${generated}`);
          continue;
        }
      }

      if (interactive) {
        // Prompt user for input
        const value = await this.promptForField(field, fieldConfig);
        if (value !== null) {
          updated[field] = value;
        }
      } else {
        throw new Error(`Required field missing: ${field}. Use --interactive to provide values.`);
      }
    }

    return updated;
  }

  /**
   * Auto-generate field values
   */
  autoGenerateField(field, _config, frontmatter) {
    switch (field) {
      case 'publishDate':
        return new Date();

      case 'slug':
        if (frontmatter.title) {
          return frontmatter.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }
        return null;

      case 'tags':
        return [];

      case 'technologies':
        return [];

      case 'featured':
        return false;

      case 'draft':
        return false;

      default:
        return null;
    }
  }

  /**
   * Auto-complete optional fields with defaults
   */
  autoCompleteOptionalFields(frontmatter, schema) {
    const completed = { ...frontmatter };

    Object.entries(schema.fields).forEach(([field, config]) => {
      if (config.optional && !completed[field] && config.default !== undefined) {
        completed[field] = config.default;
      }
    });

    // Set preserveStyles for documents if not specified
    if (schema.name === 'documents' && completed.preserveStyles === undefined) {
      completed.preserveStyles = true;
    }

    return completed;
  }

  /**
   * Prompt user for field input
   */
  async promptForField(field, config) {
    return new Promise((resolve) => {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      let prompt = `Enter ${field}`;
      if (config.description) {
        prompt += ` (${config.description})`;
      }
      if (config.enum) {
        prompt += ` [${config.enum.join('|')}]`;
      }
      prompt += ': ';

      rl.question(prompt, (answer) => {
        rl.close();

        if (!answer.trim()) {
          resolve(null);
          return;
        }

        // Type conversion
        if (config.type === 'array') {
          resolve(answer.split(',').map((item) => item.trim()));
        } else if (config.type === 'boolean') {
          resolve(['true', 'yes', 'y', '1'].includes(answer.toLowerCase()));
        } else if (config.type === 'date') {
          resolve(new Date(answer));
        } else {
          resolve(answer);
        }
      });
    });
  }

  /**
   * Parse simple YAML (reused from content-processor)
   */
  parseYaml(yamlText) {
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
   * Parse template file
   */
  parseTemplate() {
    // This would parse a more complex template format
    // For now, return a basic schema
    return this.getDefaultArticlesSchema();
  }

  /**
   * Default schema definitions
   */
  getDefaultArticlesSchema() {
    return {
      name: 'articles',
      required: ['title'],
      fields: {
        title: { type: 'string', description: 'Article title' },
        description: { type: 'string', optional: true, autoGenerate: true },
        slug: { type: 'string', optional: true, autoGenerate: true },
        publishDate: { type: 'date', optional: true, autoGenerate: true, default: new Date() },
        updateDate: { type: 'date', optional: true },
        tags: { type: 'array', optional: true, default: [] },
        category: { type: 'string', optional: true },
        aliases: { type: 'array', optional: true },
        cssclass: { type: 'string', optional: true },
        draft: { type: 'boolean', optional: true, default: false },
        featured: { type: 'boolean', optional: true, default: false },
        author: { type: 'string', optional: true },
        image: { type: 'string', optional: true },
        excerpt: { type: 'string', optional: true },
        readingTime: { type: 'number', optional: true },
        wordCount: { type: 'number', optional: true },
      },
    };
  }

  getDefaultShowcaseSchema() {
    return {
      name: 'showcase',
      required: ['title', 'description', 'publishDate', 'image'],
      fields: {
        title: { type: 'string', description: 'Project title' },
        description: { type: 'string', description: 'Project description' },
        slug: { type: 'string', optional: true, autoGenerate: true },
        publishDate: { type: 'date', description: 'Publication date' },
        projectUrl: { type: 'string', optional: true, description: 'Live demo URL' },
        githubUrl: { type: 'string', optional: true, description: 'Source code URL' },
        image: { type: 'string', description: 'Project screenshot/logo path' },
        technologies: { type: 'array', optional: true, default: [] },
        featured: { type: 'boolean', optional: true, default: false },
        category: { type: 'string', optional: true },
        tags: { type: 'array', optional: true, default: [] },
      },
    };
  }

  getDefaultDocumentsSchema() {
    return {
      name: 'documents',
      required: ['title'],
      fields: {
        title: { type: 'string', description: 'Document title' },
        description: { type: 'string', optional: true },
        slug: { type: 'string', optional: true, autoGenerate: true },
        publishDate: { type: 'date', optional: true, autoGenerate: true },
        updateDate: { type: 'date', optional: true },
        tags: { type: 'array', optional: true, default: [] },
        category: { type: 'string', optional: true },
        draft: { type: 'boolean', optional: true, default: false },
        featured: { type: 'boolean', optional: true, default: false },
        source: { type: 'string', optional: true },
        contentType: {
          type: 'string',
          optional: true,
          default: 'page',
          enum: ['page', 'snippet', 'template', 'legacy'],
        },
        author: { type: 'string', optional: true },
        customCSS: { type: 'string', optional: true },
        customJS: { type: 'string', optional: true },
        preserveStyles: { type: 'boolean', optional: true, default: true },
        headings: { type: 'array', optional: true },
        links: { type: 'array', optional: true },
        wordCount: { type: 'number', optional: true },
        readingTime: { type: 'number', optional: true },
      },
    };
  }
}
