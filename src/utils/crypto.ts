/**
 * Cryptographic utility functions
 *
 * This module provides cryptographic utilities for secure authentication flows,
 * including SHA-256 hashing for nonce generation and validation.
 */

/**
 * Generate a cryptographically secure random string for use as a nonce
 *
 * @param length - The length of the nonce to generate (default: 32)
 * @returns A random string suitable for use as a nonce
 */
export const generateNonce = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  // Use crypto.getRandomValues for cryptographically secure random numbers
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
};

/**
 * Hash a string using SHA-256 algorithm
 *
 * This function is commonly used for generating nonce hashes for Google One Tap authentication.
 * The hashed nonce is sent to Google and returned in the ID token for verification.
 *
 * @param data - The string to hash
 * @returns A Promise that resolves to the SHA-256 hash as a hex string
 *
 * @example
 * ```typescript
 * const nonce = generateNonce();
 * const hashedNonce = await sha256(nonce);
 * // Use hashedNonce for Google One Tap initialization
 * ```
 */
export const sha256 = async (data: string): Promise<string> => {
  // Encode the input string as a Uint8Array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // Compute the SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

  // Convert the ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
};

/**
 * Generate a nonce and its SHA-256 hash for Google One Tap authentication
 *
 * This utility combines nonce generation and hashing into a single function
 * for convenience in Google One Tap implementation.
 *
 * @returns A Promise that resolves to an object containing both the original nonce and its hash
 *
 * @example
 * ```typescript
 * const { nonce, hashedNonce } = await generateNonceWithHash();
 * // Store nonce in session/localStorage for verification later
 * sessionStorage.setItem('google_nonce', nonce);
 * // Use hashedNonce for Google One Tap initialization
 * ```
 */
export const generateNonceWithHash = async (): Promise<{
  nonce: string;
  hashedNonce: string;
}> => {
  const nonce = generateNonce();
  const hashedNonce = await sha256(nonce);

  return {
    nonce,
    hashedNonce,
  };
};

/**
 * Verify a nonce from an ID token against a stored nonce
 *
 * After Google One Tap authentication, the ID token will contain the original nonce
 * (not the hash). This function verifies that the nonce from the token matches
 * the nonce we stored before authentication.
 *
 * @param tokenNonce - The nonce extracted from the ID token
 * @param storedNonce - The nonce that was stored before authentication
 * @returns True if the nonces match, false otherwise
 *
 * @example
 * ```typescript
 * const storedNonce = sessionStorage.getItem('google_nonce');
 * const isValid = verifyNonce(tokenNonce, storedNonce);
 * if (isValid) {
 *   // Authentication is valid, proceed with user session
 * } else {
 *   // Possible replay attack, reject authentication
 * }
 * ```
 */
export const verifyNonce = (tokenNonce: string, storedNonce: string): boolean => {
  if (!tokenNonce || !storedNonce) {
    return false;
  }

  return tokenNonce === storedNonce;
};

/**
 * Convert a base64 string to a URL-safe base64 string
 *
 * Google One Tap requires URL-safe base64 encoding for the nonce hash.
 * This function replaces '+' with '-', '/' with '_', and removes padding.
 *
 * @param base64 - The base64 string to convert
 * @returns A URL-safe base64 string
 */
export const base64UrlEncode = (base64: string): string => {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Hash a string using SHA-256 and return a URL-safe base64 encoded result
 *
 * This is specifically formatted for Google One Tap nonce requirements.
 *
 * @param data - The string to hash
 * @returns A Promise that resolves to a URL-safe base64 encoded SHA-256 hash
 *
 * @example
 * ```typescript
 * const nonce = generateNonce();
 * const hashedNonce = await sha256Base64Url(nonce);
 * // Use hashedNonce directly in Google One Tap configuration
 * ```
 */
export const sha256Base64Url = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

  // Convert ArrayBuffer to base64
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64 = btoa(String.fromCharCode(...hashArray));

  return base64UrlEncode(base64);
};
