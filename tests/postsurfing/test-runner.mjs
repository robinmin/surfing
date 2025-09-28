#!/usr/bin/env node

/**
 * Test Runner for PostSurfing CLI
 *
 * A simple test runner that executes all test files and reports results
 */

import { readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class TestRunner {
  constructor() {
    this.testFiles = [];
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
    };
  }

  /**
   * Find all test files
   */
  async findTestFiles(dir = __dirname) {
    const entries = await readdir(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);

      if (stats.isDirectory() && !entry.startsWith('.')) {
        await this.findTestFiles(fullPath);
      } else if (entry.endsWith('.test.mjs')) {
        this.testFiles.push(fullPath);
      }
    }
  }

  /**
   * Run a single test file
   */
  async runTestFile(testFile) {
    return new Promise((resolve) => {
      console.log(`\n🧪 Running ${testFile.replace(__dirname, '.')}`);

      const testProcess = spawn('node', [testFile], {
        stdio: 'pipe',
        cwd: process.cwd(),
      });

      let stdout = '';
      let stderr = '';

      testProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      testProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      testProcess.on('close', (code) => {
        const output = stdout + stderr;

        if (code === 0) {
          console.log('✅ PASSED');
          this.results.passed++;
        } else {
          console.log('❌ FAILED');
          console.log(output);
          this.results.failed++;
        }

        this.results.total++;
        resolve({ success: code === 0, output });
      });

      testProcess.on('error', (error) => {
        console.log('❌ ERROR');
        console.log(error.message);
        this.results.failed++;
        this.results.total++;
        resolve({ success: false, error: error.message });
      });
    });
  }

  /**
   * Run all tests
   */
  async runAll() {
    console.log('🏄 PostSurfing CLI Test Suite');
    console.log('═'.repeat(50));

    await this.findTestFiles();

    if (this.testFiles.length === 0) {
      console.log('⚠️  No test files found');
      return;
    }

    console.log(`Found ${this.testFiles.length} test files`);

    for (const testFile of this.testFiles) {
      await this.runTestFile(testFile);
    }

    this.printSummary();
  }

  /**
   * Print test summary
   */
  printSummary() {
    console.log('\n' + '═'.repeat(50));
    console.log('📊 Test Summary');
    console.log('═'.repeat(50));

    console.log(`Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⏭️  Skipped: ${this.results.skipped}`);

    const successRate = this.results.total > 0 ? Math.round((this.results.passed / this.results.total) * 100) : 0;

    console.log(`📈 Success Rate: ${successRate}%`);

    if (this.results.failed === 0) {
      console.log('\n🎉 All tests passed!');
    } else {
      console.log(`\n💥 ${this.results.failed} test(s) failed`);
      process.exit(1);
    }
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new TestRunner();
  runner.runAll().catch((error) => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

export { TestRunner };
