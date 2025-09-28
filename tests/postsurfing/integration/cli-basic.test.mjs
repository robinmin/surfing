#!/usr/bin/env node

/**
 * Integration tests for basic CLI functionality
 */

import { TestUtils } from '../test-utils.mjs';

const utils = new TestUtils();

async function testBasicCLI() {
  console.log('Testing basic CLI functionality...');

  utils.setup();

  try {
    // Test 1: Help command
    await testHelpCommand();

    // Test 2: Version information
    await testVersionInfo();

    // Test 3: Error handling for missing arguments
    await testMissingArguments();

    // Test 4: Error handling for invalid content type
    await testInvalidContentType();

    // Test 5: Dry run mode
    await testDryRunMode();

    utils.success('All basic CLI tests passed');
  } catch (error) {
    utils.error(`Basic CLI test failed: ${error.message}`);
    throw error;
  } finally {
    utils.cleanup();
  }
}

async function testHelpCommand() {
  utils.log('Testing help command...');

  const result = await utils.runCLI(['--help']);

  utils.assert(result.success, 'Help command should succeed');
  utils.assertContains(result.stdout, 'PostSurfing CLI Tool', 'Should show tool name');
  utils.assertContains(result.stdout, 'USAGE:', 'Should show usage information');
  utils.assertContains(result.stdout, 'EXAMPLES:', 'Should show examples');
  utils.assertContains(result.stdout, 'articles', 'Should mention articles content type');
  utils.assertContains(result.stdout, 'showcase', 'Should mention showcase content type');
  utils.assertContains(result.stdout, 'documents', 'Should mention documents content type');

  utils.success('Help command test passed');
}

async function testVersionInfo() {
  utils.log('Testing version information...');

  const result = await utils.runCLI(['--help']);

  utils.assert(result.success, 'Should succeed');
  utils.assertContains(result.stdout, 'v1.0.0-beta.52', 'Should show version number');

  utils.success('Version info test passed');
}

async function testMissingArguments() {
  utils.log('Testing missing arguments error...');

  // Test with no arguments
  const result1 = await utils.runCLI([]);
  utils.assert(!result1.success, 'Should fail with no arguments');
  utils.assertContains(result1.output, 'File path is required', 'Should show file path error');

  // Test with file but no type
  const result2 = await utils.runCLI(['test.md']);
  utils.assert(!result2.success, 'Should fail with no content type');
  utils.assertContains(result2.output, 'Content type is required', 'Should show content type error');

  utils.success('Missing arguments test passed');
}

async function testInvalidContentType() {
  utils.log('Testing invalid content type error...');

  const result = await utils.runCLI(['test.md', '--type', 'invalid']);

  utils.assert(!result.success, 'Should fail with invalid content type');
  utils.assertContains(result.output, 'Invalid content type', 'Should show invalid type error');
  utils.assertContains(result.output, 'articles, showcase, documents', 'Should show valid types');

  utils.success('Invalid content type test passed');
}

async function testDryRunMode() {
  utils.log('Testing dry run mode...');

  const fixturePath = utils.copyFixture('simple-article.md');
  const result = await utils.runCLI([
    fixturePath,
    '--type',
    'articles',
    '--dry-run',
    '--no-build',
    '--no-commit',
    '--verbose',
  ]);

  utils.assert(result.success, 'Dry run should succeed');
  utils.assertContains(result.output, 'Dry run mode', 'Should indicate dry run mode');
  utils.assertContains(result.output, 'Content published successfully', 'Should show success message');

  utils.success('Dry run mode test passed');
}

// Run tests
testBasicCLI().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
