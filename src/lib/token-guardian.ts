/**
 * Token Guardian - Cached Token Validation
 *
 * Implements a caching mechanism to reduce unnecessary auth server checks
 * by storing token validation timestamps in localStorage with configurable duration.
 *
 * Flow:
 * 1. Check if we have a recent validation timestamp (within cache duration)
 * 2. If valid cache exists, skip auth server check
 * 3. If cache expired or missing, validate with auth server and update cache
 */

import { getTokenCacheDuration } from './config';

const CACHE_KEY_PREFIX = 'auth_token_guardian_';
const CACHE_TIMESTAMP_KEY = `${CACHE_KEY_PREFIX}timestamp`;
const CACHE_USER_KEY = `${CACHE_KEY_PREFIX}user`;

export interface CachedTokenInfo {
  timestamp: number;
  userId: string;
  email?: string;
}

/**
 * Get cache duration in milliseconds
 */
const getCacheDurationMs = (): number => {
  return getTokenCacheDuration() * 1000; // Convert seconds to milliseconds
};

/**
 * Check if cached token validation is still valid
 */
export const isCacheValid = (): boolean => {
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
    const cacheDuration = getCacheDurationMs();

    // Check if cache is within valid duration
    return now - timestamp < cacheDuration;
  } catch (error) {
    console.debug('Failed to check cache validity:', error);
    return false;
  }
};

/**
 * Get cached token info if valid
 */
export const getCachedTokenInfo = (): CachedTokenInfo | null => {
  try {
    if (!isCacheValid()) {
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
  } catch (error) {
    console.debug('Failed to get cached token info:', error);
    return null;
  }
};

/**
 * Update token cache with new validation timestamp
 */
export const updateTokenCache = (userId: string, email?: string): void => {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const now = Date.now();
    localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
    localStorage.setItem(
      CACHE_USER_KEY,
      JSON.stringify({
        id: userId,
        email: email || '',
      })
    );

    console.debug('Token cache updated:', {
      userId,
      timestamp: now,
      expiresIn: `${getCacheDurationMs() / 1000}s`,
    });
  } catch (error) {
    console.error('Failed to update token cache:', error);
  }
};

/**
 * Clear token cache (on sign out or error)
 */
export const clearTokenCache = (): void => {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    localStorage.removeItem(CACHE_USER_KEY);

    console.debug('Token cache cleared');
  } catch (error) {
    console.error('Failed to clear token cache:', error);
  }
};

/**
 * Get time remaining until cache expires (in seconds)
 */
export const getCacheTimeRemaining = (): number => {
  try {
    const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestampStr) {
      return 0;
    }

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    const cacheDuration = getCacheDurationMs();
    const elapsed = now - timestamp;
    const remaining = cacheDuration - elapsed;

    return Math.max(0, Math.floor(remaining / 1000)); // Convert to seconds
  } catch {
    return 0;
  }
};

/**
 * Force refresh token cache (useful for testing)
 */
export const forceRefreshCache = async (
  validateFn: () => Promise<{ userId: string; email?: string }>
): Promise<void> => {
  try {
    const result = await validateFn();
    updateTokenCache(result.userId, result.email);
  } catch {
    clearTokenCache();
    throw new Error('Failed to refresh token cache');
  }
};
