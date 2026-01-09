/**
 * Test Utilities for PostSurfing CLI Tests
 */

import { spawn } from 'child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class TestUtils {
  constructor() {
    this.tempDir = join(__dirname, 'temp')
    this.fixturesDir = join(__dirname, 'fixtures')
    this.cliPath = join(__dirname, '../../scripts/postsurfing/postsurfing.mjs')
  }

  /**
   * Setup test environment
   */
  setup() {
    if (existsSync(this.tempDir)) {
      rmSync(this.tempDir, { recursive: true, force: true })
    }
    mkdirSync(this.tempDir, { recursive: true })
  }

  /**
   * Cleanup test environment
   */
  cleanup() {
    if (existsSync(this.tempDir)) {
      rmSync(this.tempDir, { recursive: true, force: true })
    }
  }

  /**
   * Get fixture file path
   */
  getFixture(filename) {
    return join(this.fixturesDir, filename)
  }

  /**
   * Copy fixture to temp directory
   */
  copyFixture(filename, newName = null) {
    const sourcePath = this.getFixture(filename)
    const targetPath = join(this.tempDir, newName || filename)

    const content = readFileSync(sourcePath, 'utf8')
    writeFileSync(targetPath, content, 'utf8')

    return targetPath
  }

  /**
   * Run CLI command
   */
  async runCLI(args, options = {}) {
    return new Promise((resolve) => {
      const cliProcess = spawn('node', [this.cliPath, ...args], {
        stdio: 'pipe',
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, ...options.env },
      })

      let stdout = ''
      let stderr = ''

      cliProcess.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      cliProcess.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      cliProcess.on('close', (code) => {
        resolve({
          success: code === 0,
          code,
          stdout,
          stderr,
          output: stdout + stderr,
        })
      })

      cliProcess.on('error', (error) => {
        resolve({
          success: false,
          code: -1,
          stdout,
          stderr,
          output: stderr,
          error: error.message,
        })
      })
    })
  }

  /**
   * Assert that a condition is true
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`)
    }
  }

  /**
   * Assert that two values are equal
   */
  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`Assertion failed: ${message}\nExpected: ${expected}\nActual: ${actual}`)
    }
  }

  /**
   * Assert that a string contains a substring
   */
  assertContains(haystack, needle, message) {
    if (!haystack.includes(needle)) {
      throw new Error(`Assertion failed: ${message}\nExpected "${haystack}" to contain "${needle}"`)
    }
  }

  /**
   * Assert that a file exists
   */
  assertFileExists(filePath, message) {
    if (!existsSync(filePath)) {
      throw new Error(`Assertion failed: ${message}\nFile does not exist: ${filePath}`)
    }
  }

  /**
   * Assert that a file does not exist
   */
  assertFileNotExists(filePath, message) {
    if (existsSync(filePath)) {
      throw new Error(`Assertion failed: ${message}\nFile should not exist: ${filePath}`)
    }
  }

  /**
   * Read file content
   */
  readFile(filePath) {
    return readFileSync(filePath, 'utf8')
  }

  /**
   * Write file content
   */
  writeFile(filePath, content) {
    const dir = dirname(filePath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(filePath, content, 'utf8')
  }

  /**
   * Parse frontmatter from content
   */
  parseFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

    if (!frontmatterMatch) {
      return { frontmatter: {}, body: content }
    }

    const frontmatterText = frontmatterMatch[1]
    const body = frontmatterMatch[2]

    // Simple YAML parsing
    const frontmatter = {}
    const lines = frontmatterText.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const colonIndex = trimmed.indexOf(':')
      if (colonIndex === -1) continue

      const key = trimmed.substring(0, colonIndex).trim()
      let value = trimmed.substring(colonIndex + 1).trim()

      // Handle quoted strings
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map((item) => item.trim().replace(/['"]/g, ''))
      }

      // Handle booleans
      if (value === 'true') value = true
      if (value === 'false') value = false

      frontmatter[key] = value
    }

    return { frontmatter, body }
  }

  /**
   * Log test progress
   */
  log(message) {
    console.log(`  ${message}`)
  }

  /**
   * Log test error
   */
  error(message) {
    console.error(`  ❌ ${message}`)
  }

  /**
   * Log test success
   */
  success(message) {
    console.log(`  ✅ ${message}`)
  }
}
