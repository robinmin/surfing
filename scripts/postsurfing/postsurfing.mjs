#!/usr/bin/env node

/**
 * PostSurfing CLI Tool
 *
 * A comprehensive tool for publishing content to the Surfing platform.
 * Handles markdown files, HTML documents, and automated publishing workflow.
 *
 * Usage: postsurfing <file-path> --type <articles|showcase|documents> [options]
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { parseArgs } from 'util';

import { ContentProcessor } from './lib/content-processor.mjs';
import { FrontmatterManager } from './lib/frontmatter-manager.mjs';
import { HtmlConverter } from './lib/html-converter.mjs';
import { GitManager } from './lib/git-manager.mjs';
import { BuildValidator } from './lib/build-validator.mjs';
import { Logger } from './lib/logger.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const { values: options, positionals: args } = parseArgs({
  args: process.argv.slice(2),
  options: {
    type: { type: 'string', short: 't' },
    lang: { type: 'string', short: 'l', default: 'en' },
    interactive: { type: 'boolean', short: 'i' },
    'auto-convert': { type: 'boolean' },
    batch: { type: 'boolean' },
    'dry-run': { type: 'boolean' },
    'no-build': { type: 'boolean' },
    'no-commit': { type: 'boolean' },
    'commit-message': { type: 'string' },
    force: { type: 'boolean' },
    verbose: { type: 'boolean', short: 'v' },
    help: { type: 'boolean', short: 'h' },
  },
  allowPositionals: true,
});

// Initialize logger
const logger = new Logger(options.verbose);

/**
 * Display help information
 */
function showHelp() {
  const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'));

  console.log(`
PostSurfing CLI Tool v${packageJson.version}
Automated content publishing for the Surfing platform

 USAGE:
   postsurfing <file-path> --type <content-type> [options]

 ARGUMENTS:
   <file-path>                   Path to the content file to publish

 REQUIRED OPTIONS:
   -t, --type <type>            Content type: articles, showcase, documents

 OPTIONS:
   -l, --lang <lang>            Content language: en, cn, jp (default: en)

 OPTIONS:
   -l, --lang <lang>            Content language: en, cn, jp (default: en)
   -i, --interactive            Prompt for missing required fields
       --auto-convert           Auto-convert HTML files to Surfing format
       --batch                  Process multiple files in directory
       --dry-run                Preview changes without applying them
       --no-build               Skip build validation step
       --no-commit              Skip git commit and push
       --commit-message <msg>   Custom commit message
       --force                  Overwrite existing files without warning
   -v, --verbose                Enable detailed logging
   -h, --help                   Show this help message

EXAMPLES:
  # Publish a markdown article
  postsurfing ./my-article.md --type articles

  # Convert and publish HTML document
  postsurfing ./legacy-page.html --type documents --auto-convert

  # Interactive mode for showcase project
  postsurfing ./project.md --type showcase --interactive

  # Dry run to preview changes
  postsurfing ./content.md --type articles --dry-run

  # Batch process directory
  postsurfing ./content-dir/ --type articles --batch

CONTENT TYPES:
  articles    - AI insights, research, and technical content
  showcase    - Project portfolios with live demos and source links
  documents   - HTML content for legacy or rich-formatted pieces
  cheatsheets - AI-generated reference materials and quick guides

For more information, visit: https://github.com/robin/surfing
`);
}

/**
 * Validate command line arguments
 */
function validateArgs() {
  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (args.length === 0) {
    logger.error('Error: File path is required');
    logger.info('Use --help for usage information');
    process.exit(1);
  }

  if (!options.type) {
    logger.error('Error: Content type is required');
    logger.info('Use --type with one of: articles, showcase, documents, cheatsheets');
    process.exit(1);
  }

  const validTypes = ['articles', 'showcase', 'documents', 'cheatsheets'];
  if (!validTypes.includes(options.type)) {
    logger.error(`Error: Invalid content type "${options.type}"`);
    logger.info(`Valid types: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  const validLangs = ['en', 'cn', 'jp'];
  if (!validLangs.includes(options.lang)) {
    logger.warn(`Warning: Invalid language "${options.lang}", defaulting to "en"`);
    options.lang = 'en';
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    validateArgs();

    const filePath = args[0];
    const contentType = options.type;

    logger.infoVerbose(`🏄 PostSurfing CLI Tool`);
    logger.infoVerbose(`📁 Processing: ${filePath}`);
    logger.infoVerbose(`📝 Content Type: ${contentType}`);

    if (options['dry-run']) {
      logger.infoVerbose('🔍 Dry run mode - no changes will be applied');
    }

    // Initialize processors
    const contentProcessor = new ContentProcessor(logger);
    const frontmatterManager = new FrontmatterManager(logger, __dirname);
    const htmlConverter = new HtmlConverter(logger);
    const buildValidator = new BuildValidator(logger);
    const gitManager = new GitManager(logger);

    // Step 1: Process content file
    logger.step('Processing content file...');
    const processedContent = await contentProcessor.process(filePath, contentType, options.lang, options);

    // Step 2: Handle HTML conversion if needed
    if (processedContent.needsHtmlConversion) {
      logger.step('Converting HTML to Surfing format...');
      const conversionResult = await htmlConverter.convert(
        processedContent.content,
        processedContent.metadata,
        options['auto-convert']
      );

      // Update content and metadata with conversion results
      processedContent.content = conversionResult.bodyContent;
      processedContent.metadata = { ...processedContent.metadata, ...conversionResult };
    }

    // Step 3: Manage frontmatter
    logger.step('Processing frontmatter...');
    const finalContent = await frontmatterManager.process(
      processedContent.content,
      contentType,
      processedContent.metadata,
      options.interactive
    );

    // Step 4: Write processed content (if not dry run)
    if (!options['dry-run']) {
      logger.step('Writing processed content...');
      await contentProcessor.writeContent(finalContent, processedContent.outputPath);
    }

    // Step 5: Build validation
    if (!options['no-build'] && !options['dry-run']) {
      logger.step('Validating build...');
      const buildResult = await buildValidator.validate();
      if (!buildResult.success) {
        logger.error('Build validation failed!');
        logger.error(buildResult.error);
        process.exit(1);
      }
    }

    // Step 6: Git operations
    if (!options['no-commit'] && !options['dry-run']) {
      logger.step('Committing changes...');
      const commitMessage =
        options['commit-message'] || `Add ${contentType.slice(0, -1)}: ${finalContent.frontmatter.title}`;

      await gitManager.commitAndPush(commitMessage, processedContent.outputPath);
    }

    // Success!
    logger.success('✅ Content published successfully!');
    if (!options['dry-run']) {
      logger.infoVerbose(`📄 File: ${processedContent.outputPath}`);
      logger.infoVerbose(`🌐 Content will be available after deployment`);
    }
  } catch (error) {
    logger.error('❌ Publishing failed:');
    logger.error(error.message);
    if (options.verbose) {
      logger.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the CLI
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
