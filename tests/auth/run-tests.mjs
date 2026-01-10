#!/usr/bin/env node

/**
 * Test Runner for Authentication Tests
 * Runs all authentication-related unit tests
 */

import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFiles = ['token-guardian.test.mjs', 'google-one-tap.test.mjs'];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log('Running Authentication Tests...\n');
console.log('='.repeat(50));

async function runTest(testFile) {
    return new Promise((resolve) => {
        const testPath = join(__dirname, testFile);
        const testProcess = spawn('node', [testPath], {
            stdio: 'pipe',
        });

        let output = '';
        let errorOutput = '';

        testProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        testProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        testProcess.on('close', (code) => {
            totalTests++;

            if (code === 0) {
                passedTests++;
                console.log(`\n✓ ${testFile}`);
                console.log(output);
            } else {
                failedTests++;
                console.log(`\n✗ ${testFile}`);
                console.log(output);
                console.error(errorOutput);
            }

            resolve(code === 0);
        });
    });
}

async function runAllTests() {
    for (const testFile of testFiles) {
        await runTest(testFile);
        console.log('='.repeat(50));
    }

    // Print summary
    console.log('\nTest Summary:');
    console.log(`Total: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);

    if (failedTests > 0) {
        console.log('\n✗ Some tests failed');
        process.exit(1);
    } else {
        console.log('\n✓ All tests passed');
        process.exit(0);
    }
}

runAllTests();
