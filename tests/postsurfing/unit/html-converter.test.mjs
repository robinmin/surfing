#!/usr/bin/env node

/**
 * Unit tests for HtmlConverter
 */

import { TestUtils } from '../test-utils.mjs';
import { HtmlConverter } from '../../../scripts/postsurfing/lib/html-converter.mjs';
import { Logger } from '../../../scripts/postsurfing/lib/logger.mjs';

const utils = new TestUtils();

async function testHtmlConverter() {
  console.log('Testing HtmlConverter...');
  
  utils.setup();
  
  try {
    const logger = new Logger(false);
    const converter = new HtmlConverter(logger);

    // Test 1: Full HTML document conversion
    await testFullHtmlConversion(converter);
    
    // Test 2: HTML fragment conversion
    await testHtmlFragmentConversion(converter);
    
    // Test 3: CSS extraction
    await testCssExtraction(converter);
    
    // Test 4: JavaScript extraction
    await testJsExtraction(converter);
    
    // Test 5: Meta tag extraction
    await testMetaExtraction(converter);

    utils.success('All HtmlConverter tests passed');
    
  } catch (error) {
    utils.error(`HtmlConverter test failed: ${error.message}`);
    throw error;
  } finally {
    utils.cleanup();
  }
}

async function testFullHtmlConversion(converter) {
  utils.log('Testing full HTML document conversion...');
  
  const htmlContent = utils.readFile(utils.getFixture('simple-html.html'));
  const result = await converter.convert(htmlContent, {}, true);
  
  utils.assert(result.extractedMetadata, 'Should extract metadata');
  utils.assertEqual(result.title, 'Simple HTML Test', 'Should extract title');
  utils.assert(result.customCSS, 'Should extract CSS');
  utils.assert(result.customJS, 'Should extract JavaScript');
  utils.assert(result.bodyContent, 'Should extract body content');
  utils.assert(result.cssLines > 0, 'Should count CSS lines');
  utils.assert(result.jsLines > 0, 'Should count JS lines');
  
  // Check that HTML structure is cleaned
  utils.assert(!result.bodyContent.includes('<html>'), 'Should remove html tag');
  utils.assert(!result.bodyContent.includes('<head>'), 'Should remove head tag');
  utils.assert(!result.bodyContent.includes('<body>'), 'Should remove body tag');
  utils.assert(!result.bodyContent.includes('<style>'), 'Should remove style tags');
  utils.assert(!result.bodyContent.includes('<script>'), 'Should remove script tags');
  
  utils.success('Full HTML conversion test passed');
}

async function testHtmlFragmentConversion(converter) {
  utils.log('Testing HTML fragment conversion...');
  
  const htmlContent = utils.readFile(utils.getFixture('html-fragment.html'));
  const result = await converter.convert(htmlContent, {}, true);
  
  utils.assert(result.bodyContent, 'Should have body content');
  utils.assert(result.customCSS, 'Should extract inline CSS');
  utils.assert(result.customJS, 'Should extract inline JS');
  
  // Fragment should preserve main structure but remove style/script tags
  utils.assertContains(result.bodyContent, '<div class="container">', 'Should preserve main content');
  utils.assert(!result.bodyContent.includes('<style>'), 'Should remove style tags');
  utils.assert(!result.bodyContent.includes('<script>'), 'Should remove script tags');
  
  utils.success('HTML fragment conversion test passed');
}

async function testCssExtraction(converter) {
  utils.log('Testing CSS extraction...');
  
  const htmlWithCSS = `
    <html>
    <head>
      <style>
        body { margin: 0; }
        .container { padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <style>
          .inline { color: red; }
        </style>
        Content
      </div>
    </body>
    </html>
  `;
  
  const result = await converter.convert(htmlWithCSS, {}, true);
  
  utils.assert(result.customCSS, 'Should extract CSS');
  utils.assertContains(result.customCSS, 'body { margin: 0; }', 'Should extract head CSS');
  utils.assertContains(result.customCSS, '.inline { color: red; }', 'Should extract inline CSS');
  
  utils.success('CSS extraction test passed');
}

async function testJsExtraction(converter) {
  utils.log('Testing JavaScript extraction...');
  
  const htmlWithJS = `
    <html>
    <head>
      <script>
        console.log('Head script');
      </script>
    </head>
    <body>
      <div>Content</div>
      <script>
        console.log('Body script');
      </script>
    </body>
    </html>
  `;
  
  const result = await converter.convert(htmlWithJS, {}, true);
  
  utils.assert(result.customJS, 'Should extract JavaScript');
  utils.assertContains(result.customJS, "console.log('Head script')", 'Should extract head JS');
  utils.assertContains(result.customJS, "console.log('Body script')", 'Should extract body JS');
  
  utils.success('JavaScript extraction test passed');
}

async function testMetaExtraction(converter) {
  utils.log('Testing meta tag extraction...');
  
  const htmlWithMeta = `
    <html>
    <head>
      <title>Test Title</title>
      <meta name="description" content="Test description">
      <meta name="author" content="Test Author">
      <meta name="keywords" content="test, html, conversion">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>Content</body>
    </html>
  `;
  
  const result = await converter.convert(htmlWithMeta, {}, true);
  
  utils.assertEqual(result.title, 'Test Title', 'Should extract title');
  utils.assertEqual(result.extractedMetadata.description, 'Test description', 'Should extract description');
  utils.assertEqual(result.extractedMetadata.author, 'Test Author', 'Should extract author');
  utils.assert(Array.isArray(result.extractedMetadata.keywords), 'Should extract keywords as array');
  utils.assertEqual(result.extractedMetadata.responsive, true, 'Should detect responsive meta tag');
  
  utils.success('Meta tag extraction test passed');
}

// Run tests
testHtmlConverter().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
