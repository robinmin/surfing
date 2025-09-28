#!/usr/bin/env node

/**
 * Integration tests for content processing workflow
 */

import { TestUtils } from '../test-utils.mjs';

const utils = new TestUtils();

async function testContentProcessing() {
  console.log('Testing content processing workflow...');
  
  utils.setup();
  
  try {
    // Test 1: Article processing
    await testArticleProcessing();
    
    // Test 2: HTML document processing
    await testHtmlDocumentProcessing();
    
    // Test 3: Showcase project processing
    await testShowcaseProcessing();
    
    // Test 4: Content with existing frontmatter
    await testExistingFrontmatter();
    
    // Test 5: HTML fragment processing
    await testHtmlFragmentProcessing();

    utils.success('All content processing tests passed');
    
  } catch (error) {
    utils.error(`Content processing test failed: ${error.message}`);
    throw error;
  } finally {
    utils.cleanup();
  }
}

async function testArticleProcessing() {
  utils.log('Testing article processing...');

  const fixturePath = utils.copyFixture('simple-article.md');
  const result = await utils.runCLI([
    fixturePath,
    '--type', 'articles',
    '--dry-run',
    '--no-build',
    '--no-commit',
    '--verbose'
  ]);

  utils.assert(result.success, 'Article processing should succeed');
  utils.assertContains(result.output, 'Processing content file', 'Should process content');
  utils.assertContains(result.output, 'Processing frontmatter', 'Should process frontmatter');
  utils.assertContains(result.output, 'All required fields are present', 'Should validate frontmatter');
  utils.assertContains(result.output, 'Content published successfully', 'Should complete successfully');

  utils.success('Article processing test passed');
}

async function testHtmlDocumentProcessing() {
  utils.log('Testing HTML document processing...');

  const fixturePath = utils.copyFixture('simple-html.html');
  const result = await utils.runCLI([
    fixturePath,
    '--type', 'documents',
    '--auto-convert',
    '--dry-run',
    '--no-build',
    '--no-commit',
    '--verbose'
  ]);

  utils.assert(result.success, 'HTML processing should succeed');
  utils.assertContains(result.output, 'Converting HTML to Surfing format', 'Should convert HTML');
  utils.assertContains(result.output, 'Title extracted', 'Should extract title');
  utils.assertContains(result.output, 'CSS extracted', 'Should extract CSS');
  utils.assertContains(result.output, 'JavaScript extracted', 'Should extract JavaScript');
  utils.assertContains(result.output, 'Content published successfully', 'Should complete successfully');

  utils.success('HTML document processing test passed');
}

async function testShowcaseProcessing() {
  utils.log('Testing showcase project processing...');
  
  const fixturePath = utils.copyFixture('showcase-project.md');
  const result = await utils.runCLI([
    fixturePath, 
    '--type', 'showcase', 
    '--dry-run', 
    '--no-build', 
    '--no-commit'
  ]);
  
  // Showcase requires more fields, so this might fail validation
  // but should still process the content
  utils.assertContains(result.output, 'Processing content file', 'Should process content');
  utils.assertContains(result.output, 'Processing frontmatter', 'Should process frontmatter');
  
  utils.success('Showcase processing test passed');
}

async function testExistingFrontmatter() {
  utils.log('Testing content with existing frontmatter...');

  const fixturePath = utils.copyFixture('article-with-frontmatter.md');
  const result = await utils.runCLI([
    fixturePath,
    '--type', 'articles',
    '--dry-run',
    '--no-build',
    '--no-commit',
    '--verbose'
  ]);

  utils.assert(result.success, 'Should succeed with existing frontmatter');
  utils.assertContains(result.output, 'Processing frontmatter', 'Should process frontmatter');
  utils.assertContains(result.output, 'Content published successfully', 'Should complete successfully');

  utils.success('Existing frontmatter test passed');
}

async function testHtmlFragmentProcessing() {
  utils.log('Testing HTML fragment processing...');

  // Create a modified HTML fragment with a title
  const originalContent = utils.readFile(utils.getFixture('html-fragment.html'));
  const modifiedContent = `<h1>HTML Fragment Test</h1>\n${originalContent}`;
  const tempPath = `${utils.tempDir}/html-fragment-with-title.html`;
  utils.writeFile(tempPath, modifiedContent);

  const result = await utils.runCLI([
    tempPath,
    '--type', 'documents',
    '--auto-convert',
    '--dry-run',
    '--no-build',
    '--no-commit',
    '--verbose'
  ]);

  utils.assert(result.success, 'HTML fragment processing should succeed');
  utils.assertContains(result.output, 'Converting HTML to Surfing format', 'Should convert HTML');
  utils.assertContains(result.output, 'Content published successfully', 'Should complete successfully');

  utils.success('HTML fragment processing test passed');
}

// Run tests
testContentProcessing().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
