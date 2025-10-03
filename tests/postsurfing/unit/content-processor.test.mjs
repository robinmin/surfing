#!/usr/bin/env node

/**
 * Unit tests for ContentProcessor
 */

import { TestUtils } from '../test-utils.mjs';
import { ContentProcessor } from '../../../scripts/postsurfing/lib/content-processor.mjs';
import { Logger } from '../../../scripts/postsurfing/lib/logger.mjs';

const utils = new TestUtils();

async function testContentProcessor() {
  console.log('Testing ContentProcessor...');

  utils.setup();

  try {
    const logger = new Logger(false);
    const processor = new ContentProcessor(logger);

    // Test 1: Process simple markdown file
    await testSimpleMarkdown(processor);

    // Test 2: Process markdown with frontmatter
    await testMarkdownWithFrontmatter(processor);

    // Test 3: Process HTML file
    await testHtmlFile(processor);

    // Test 4: Content analysis
    await testContentAnalysis(processor);

    // Test 5: Output path determination
    await testOutputPath(processor);

    utils.success('All ContentProcessor tests passed');
  } catch (error) {
    utils.error(`ContentProcessor test failed: ${error.message}`);
    throw error;
  } finally {
    utils.cleanup();
  }
}

async function testSimpleMarkdown(processor) {
  utils.log('Testing simple markdown processing...');

  const fixturePath = utils.copyFixture('simple-article.md');
  const result = await processor.processSingleFile(fixturePath, 'articles', 'en', {});

  utils.assert(result.content, 'Should have content');
  utils.assert(result.metadata, 'Should have metadata');
  utils.assert(result.outputPath, 'Should have output path');
  utils.assertEqual(result.metadata.extractedTitle, 'Simple Test Article', 'Should extract title');
  utils.assert(result.metadata.wordCount > 0, 'Should calculate word count');
  utils.assert(result.metadata.readingTime > 0, 'Should calculate reading time');
  utils.assertEqual(result.needsHtmlConversion, false, 'Should not need HTML conversion');

  utils.success('Simple markdown processing test passed');
}

async function testMarkdownWithFrontmatter(processor) {
  utils.log('Testing markdown with existing frontmatter...');

  const fixturePath = utils.copyFixture('article-with-frontmatter.md');
  const result = await processor.processSingleFile(fixturePath, 'articles', 'en', {});

  utils.assert(result.metadata.hasExistingFrontmatter, 'Should detect existing frontmatter');
  utils.assertEqual(
    result.metadata.existingFrontmatter.title,
    'Article with Existing Frontmatter',
    'Should parse existing title'
  );
  utils.assert(Array.isArray(result.metadata.existingFrontmatter.tags), 'Should parse tags as array');

  utils.success('Markdown with frontmatter test passed');
}

async function testHtmlFile(processor) {
  utils.log('Testing HTML file processing...');

  const fixturePath = utils.copyFixture('simple-html.html');
  const result = await processor.processSingleFile(fixturePath, 'documents', 'en', {});

  utils.assertEqual(result.metadata.isHtml, true, 'Should detect HTML file');
  utils.assertEqual(result.needsHtmlConversion, true, 'Should need HTML conversion');
  utils.assertEqual(result.metadata.extractedTitle, 'Simple HTML Test', 'Should extract title from HTML');

  utils.success('HTML file processing test passed');
}

async function testContentAnalysis(processor) {
  utils.log('Testing content analysis...');

  const content = `# Test Article

This is a test article about React and TypeScript development.

## Features

- React components
- TypeScript types
- Modern JavaScript
- CSS styling

The article covers various aspects of web development.`;

  const analysis = processor.analyzeContent(content, '.md');

  utils.assertEqual(analysis.extractedTitle, 'Test Article', 'Should extract title');
  utils.assert(analysis.wordCount > 0, 'Should count words');
  utils.assert(analysis.suggestedTags.includes('typescript'), 'Should suggest TypeScript tag');
  utils.assert(analysis.detectedTechnologies.includes('React'), 'Should detect React technology');

  utils.success('Content analysis test passed');
}

async function testOutputPath(processor) {
  utils.log('Testing output path determination...');

  const inputPath = '/test/path/my-article.md';
  const outputPath = processor.determineOutputPath(inputPath, 'articles', 'en');

  utils.assertContains(outputPath, 'contents/articles/en', 'Should use correct content directory with language');
  utils.assertContains(outputPath, 'my-article.md', 'Should preserve filename with .md extension');

  utils.success('Output path determination test passed');
}

// Run tests
testContentProcessor().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
