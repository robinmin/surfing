/**
 * Test Utilities for Authentication Tests
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class TestUtils {
  constructor() {
    this.tempDir = join(__dirname, 'temp')
    this.fixturesDir = join(__dirname, 'fixtures')
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
   * Read file content
   */
  readFile(filepath) {
    return readFileSync(filepath, 'utf8')
  }

  /**
   * Write file content
   */
  writeFile(filepath, content) {
    const dir = dirname(filepath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(filepath, content, 'utf8')
  }

  /**
   * Assert condition
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`)
    }
  }

  /**
   * Log message
   */
  log(message) {
    console.log(`  ${message}`)
  }

  /**
   * Log success message
   */
  success(message) {
    console.log(`\n✓ ${message}\n`)
  }

  /**
   * Log error message
   */
  error(message) {
    console.error(`\n✗ ${message}\n`)
  }

  /**
   * Create a mock Supabase client for testing
   */
  createMockSupabase() {
    return {
      auth: {
        signInWithIdToken: async () => {
          // Mock successful sign in
          return {
            data: {
              user: {
                id: 'mock-user-id',
                email: 'mock@example.com',
                user_metadata: {
                  full_name: 'Mock User',
                  avatar_url: 'https://example.com/avatar.jpg',
                },
              },
              session: {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
              },
            },
            error: null,
          }
        },
        getSession: async () => {
          return {
            data: {
              session: {
                user: {
                  id: 'mock-user-id',
                  email: 'mock@example.com',
                },
              },
            },
            error: null,
          }
        },
        signOut: async () => {
          return { error: null }
        },
        onAuthStateChange: () => {
          return {
            data: {
              subscription: {
                unsubscribe: () => {},
              },
            },
          }
        },
      },
    }
  }

  /**
   * Create a mock Google ID token for testing
   */
  createMockGoogleIdToken(payload = {}) {
    const defaultPayload = {
      iss: 'https://accounts.google.com',
      sub: 'mock-google-user-id',
      aud: 'mock-client-id',
      email: 'mock@example.com',
      email_verified: true,
      name: 'Mock User',
      picture: 'https://example.com/avatar.jpg',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      nonce: 'mock-nonce-hash',
    }

    const mergedPayload = { ...defaultPayload, ...payload }

    // Create a simple mock JWT (not cryptographically valid, just for testing)
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
    const body = Buffer.from(JSON.stringify(mergedPayload)).toString('base64url')
    const signature = 'mock-signature'

    return `${header}.${body}.${signature}`
  }

  /**
   * Wait for a specified duration
   */
  async wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
