#!/usr/bin/env node

/**
 * Unit tests for Token Guardian
 * Tests the token caching mechanism to ensure reliability and correctness
 */

import { TestUtils } from './test-utils.mjs';

const utils = new TestUtils();

// Mock localStorage for testing
class MockLocalStorage {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

// Setup global localStorage mock
global.localStorage = new MockLocalStorage();

// Token Guardian implementation (copied for testing)
const CACHE_KEY_PREFIX = 'auth_token_guardian_';
const CACHE_TIMESTAMP_KEY = `${CACHE_KEY_PREFIX}timestamp`;
const CACHE_USER_KEY = `${CACHE_KEY_PREFIX}user`;
const CACHE_DURATION_MS = 900 * 1000; // 15 minutes

const tokenGuardian = {
  isCacheValid() {
    try {
      if (typeof localStorage === 'undefined') {
        return false;
      }
      const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (!timestampStr) {
        return false;
      }
      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      return now - timestamp < CACHE_DURATION_MS;
    } catch {
      return false;
    }
  },

  getCachedTokenInfo() {
    try {
      if (!this.isCacheValid()) {
        return null;
      }
      const userStr = localStorage.getItem(CACHE_USER_KEY);
      const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (!userStr || !timestampStr) {
        return null;
      }
      const user = JSON.parse(userStr);
      return {
        timestamp: parseInt(timestampStr, 10),
        userId: user.id,
        email: user.email,
      };
    } catch {
      return null;
    }
  },

  updateTokenCache(userId, email) {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      const now = Date.now();
      localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
      localStorage.setItem(CACHE_USER_KEY, JSON.stringify({ id: userId, email: email || '' }));
    } catch (error) {
      console.error('Failed to update token cache:', error);
    }
  },

  clearTokenCache() {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      localStorage.removeItem(CACHE_USER_KEY);
    } catch (error) {
      console.error('Failed to clear token cache:', error);
    }
  },

  getCacheTimeRemaining() {
    try {
      const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (!timestampStr) {
        return 0;
      }
      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      const elapsed = now - timestamp;
      const remaining = CACHE_DURATION_MS - elapsed;
      return Math.max(0, Math.floor(remaining / 1000));
    } catch {
      return 0;
    }
  },
};

async function testTokenGuardian() {
  console.log('Testing Token Guardian...');

  utils.setup();

  try {
    // Test 1: Cache validation within duration window
    await testCacheHitWithinDuration(tokenGuardian);

    // Test 2: Cache miss after duration expires
    await testCacheMissAfterExpiration(tokenGuardian);

    // Test 3: Token cache update
    await testTokenCacheUpdate(tokenGuardian);

    // Test 4: Cache clearing
    await testCacheClear(tokenGuardian);

    // Test 5: Cache time remaining calculation
    await testCacheTimeRemaining(tokenGuardian);

    // Test 6: Invalid cache data handling
    await testInvalidCacheData(tokenGuardian);

    // Test 7: localStorage disabled scenario
    await testLocalStorageDisabled(tokenGuardian);

    utils.success('All Token Guardian tests passed');
  } catch (error) {
    utils.error(`Token Guardian test failed: ${error.message}`);
    throw error;
  } finally {
    utils.cleanup();
  }
}

async function testCacheHitWithinDuration(tokenGuardian) {
  utils.log('Testing cache hit within duration window...');

  // Clear cache first
  global.localStorage.clear();

  // Set cache with current timestamp
  const userId = 'test-user-123';
  const email = 'test@example.com';
  tokenGuardian.updateTokenCache(userId, email);

  // Immediately check if cache is valid (should be true)
  const isValid = tokenGuardian.isCacheValid();
  utils.assert(isValid === true, 'Cache should be valid immediately after update');

  // Get cached info
  const cachedInfo = tokenGuardian.getCachedTokenInfo();
  utils.assert(cachedInfo !== null, 'Cached info should exist');
  utils.assert(cachedInfo.userId === userId, 'Cached userId should match');
  utils.assert(cachedInfo.email === email, 'Cached email should match');

  utils.log('✓ Cache hit within duration window test passed');
}

async function testCacheMissAfterExpiration(tokenGuardian) {
  utils.log('Testing cache miss after expiration...');

  // Clear cache first
  global.localStorage.clear();

  // Set cache with old timestamp (expired)
  const userId = 'test-user-456';
  const oldTimestamp = Date.now() - 16 * 60 * 1000; // 16 minutes ago (expired)

  global.localStorage.setItem('auth_token_guardian_timestamp', oldTimestamp.toString());
  global.localStorage.setItem('auth_token_guardian_user', JSON.stringify({ id: userId, email: 'old@example.com' }));

  // Check if cache is valid (should be false)
  const isValid = tokenGuardian.isCacheValid();
  utils.assert(isValid === false, 'Cache should be invalid after expiration');

  // Get cached info (should be null)
  const cachedInfo = tokenGuardian.getCachedTokenInfo();
  utils.assert(cachedInfo === null, 'Cached info should be null when expired');

  utils.log('✓ Cache miss after expiration test passed');
}

async function testTokenCacheUpdate(tokenGuardian) {
  utils.log('Testing token cache update...');

  // Clear cache first
  global.localStorage.clear();

  const userId = 'update-user-789';
  const email = 'update@example.com';

  // Update cache
  tokenGuardian.updateTokenCache(userId, email);

  // Verify cache was updated
  const timestamp = global.localStorage.getItem('auth_token_guardian_timestamp');
  const userStr = global.localStorage.getItem('auth_token_guardian_user');

  utils.assert(timestamp !== null, 'Timestamp should be set');
  utils.assert(userStr !== null, 'User data should be set');

  const user = JSON.parse(userStr);
  utils.assert(user.id === userId, 'User ID should match');
  utils.assert(user.email === email, 'User email should match');

  utils.log('✓ Token cache update test passed');
}

async function testCacheClear(tokenGuardian) {
  utils.log('Testing cache clear...');

  // Set up cache
  global.localStorage.clear();
  tokenGuardian.updateTokenCache('clear-user', 'clear@example.com');

  // Verify cache exists
  utils.assert(tokenGuardian.isCacheValid() === true, 'Cache should exist before clear');

  // Clear cache
  tokenGuardian.clearTokenCache();

  // Verify cache is cleared
  const isValid = tokenGuardian.isCacheValid();
  utils.assert(isValid === false, 'Cache should be invalid after clear');

  const cachedInfo = tokenGuardian.getCachedTokenInfo();
  utils.assert(cachedInfo === null, 'Cached info should be null after clear');

  utils.log('✓ Cache clear test passed');
}

async function testCacheTimeRemaining(tokenGuardian) {
  utils.log('Testing cache time remaining calculation...');

  // Clear cache first
  global.localStorage.clear();

  // Set cache with known timestamp
  tokenGuardian.updateTokenCache('time-user', 'time@example.com');

  // Get time remaining (should be close to 900 seconds)
  const timeRemaining = tokenGuardian.getCacheTimeRemaining();
  utils.assert(timeRemaining > 890 && timeRemaining <= 900, 'Time remaining should be around 900 seconds');

  // Test with expired cache
  global.localStorage.setItem('auth_token_guardian_timestamp', (Date.now() - 1000000).toString());
  const expiredTimeRemaining = tokenGuardian.getCacheTimeRemaining();
  utils.assert(expiredTimeRemaining === 0, 'Expired cache should have 0 time remaining');

  utils.log('✓ Cache time remaining test passed');
}

async function testInvalidCacheData(tokenGuardian) {
  utils.log('Testing invalid cache data handling...');

  // Clear cache first
  global.localStorage.clear();

  // Set invalid JSON in cache
  global.localStorage.setItem('auth_token_guardian_timestamp', Date.now().toString());
  global.localStorage.setItem('auth_token_guardian_user', 'invalid-json{');

  // Should handle gracefully
  const cachedInfo = tokenGuardian.getCachedTokenInfo();
  utils.assert(cachedInfo === null, 'Invalid cache data should return null');

  // Set invalid timestamp
  global.localStorage.setItem('auth_token_guardian_timestamp', 'not-a-number');
  const isValid = tokenGuardian.isCacheValid();
  utils.assert(isValid === false, 'Invalid timestamp should make cache invalid');

  utils.log('✓ Invalid cache data handling test passed');
}

async function testLocalStorageDisabled(tokenGuardian) {
  utils.log('Testing localStorage disabled scenario...');

  // Temporarily disable localStorage
  const originalLocalStorage = global.localStorage;
  global.localStorage = undefined;

  // All operations should handle gracefully
  let error = null;
  try {
    const isValid = tokenGuardian.isCacheValid();
    utils.assert(isValid === false, 'Should return false when localStorage unavailable');

    const cachedInfo = tokenGuardian.getCachedTokenInfo();
    utils.assert(cachedInfo === null, 'Should return null when localStorage unavailable');

    // Update should not throw
    tokenGuardian.updateTokenCache('disabled-user', 'disabled@example.com');

    // Clear should not throw
    tokenGuardian.clearTokenCache();
  } catch (e) {
    error = e;
  }

  // Restore localStorage
  global.localStorage = originalLocalStorage;

  utils.assert(error === null, 'Operations should not throw when localStorage is disabled');

  utils.log('✓ localStorage disabled scenario test passed');
}

// Run tests
testTokenGuardian()
  .then(() => {
    console.log('\n✓ All tests completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Tests failed:', error);
    process.exit(1);
  });
