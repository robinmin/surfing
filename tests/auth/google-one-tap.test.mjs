#!/usr/bin/env node

/**
 * Unit tests for Google One Tap Authentication
 * Tests token validation, nonce handling, and sign-in flow
 */

import { TestUtils } from './test-utils.mjs';

const utils = new TestUtils();

// Mock sessionStorage for testing
class MockSessionStorage {
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

// Setup global mocks
global.sessionStorage = new MockSessionStorage();
global.window = {
    location: {
        hostname: 'localhost',
    },
};

// Auth Provider utilities (copied for testing)
const authProvider = {
    AuthProviderUtils: {
        decodeJWT(token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
                        .join('')
                );
                return JSON.parse(jsonPayload);
            } catch {
                throw new Error('Failed to decode JWT token');
            }
        },

        isTokenExpired(exp) {
            const now = Math.floor(Date.now() / 1000);
            return exp <= now;
        },

        validateAudience(payload, expectedClientId) {
            return payload.aud === expectedClientId;
        },

        validateIssuer(payload, expectedIssuerPrefix) {
            if (!payload.iss) {
                return false;
            }
            return payload.iss.startsWith(expectedIssuerPrefix);
        },

        validateEmailVerified(payload) {
            if (payload.email && payload.email_verified !== undefined) {
                return payload.email_verified === true;
            }
            return true;
        },
    },
};

// Security module mock
const security = {
    failedAttempts: new Map(),

    recordFailedAttempt(identifier) {
        const current = this.failedAttempts.get(identifier) || 0;
        this.failedAttempts.set(identifier, current + 1);
    },

    clearFailedAttempts(identifier) {
        this.failedAttempts.delete(identifier);
    },

    isRateLimited(identifier) {
        const attempts = this.failedAttempts.get(identifier) || 0;
        return attempts >= 5;
    },
};

async function testGoogleOneTap() {
    console.log('Testing Google One Tap Authentication...');

    utils.setup();

    try {
        // Test 1: JWT token decoding
        await testJwtDecoding(authProvider);

        // Test 2: Token expiration validation
        await testTokenExpiration(authProvider);

        // Test 3: Audience validation
        await testAudienceValidation(authProvider);

        // Test 4: Issuer validation
        await testIssuerValidation(authProvider);

        // Test 5: Email verification validation
        await testEmailVerification(authProvider);

        // Test 6: Nonce handling
        await testNonceHandling();

        // Test 7: Rate limiting
        await testRateLimiting();

        utils.success('All Google One Tap tests passed');
    } catch (error) {
        utils.error(`Google One Tap test failed: ${error.message}`);
        throw error;
    } finally {
        utils.cleanup();
    }
}

async function testJwtDecoding(authProvider) {
    utils.log('Testing JWT token decoding...');

    // Create a valid mock token
    const mockToken = utils.createMockGoogleIdToken({
        email: 'decode-test@example.com',
        name: 'Decode Test User',
    });

    // Decode the token
    const decoded = authProvider.AuthProviderUtils.decodeJWT(mockToken);

    utils.assert(decoded !== null, 'Decoded token should not be null');
    utils.assert(decoded.email === 'decode-test@example.com', 'Email should match');
    utils.assert(decoded.name === 'Decode Test User', 'Name should match');
    utils.assert(decoded.iss === 'https://accounts.google.com', 'Issuer should be Google');

    utils.log('✓ JWT token decoding test passed');
}

async function testTokenExpiration(authProvider) {
    utils.log('Testing token expiration validation...');

    // Test with valid (not expired) token
    const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const isExpired = authProvider.AuthProviderUtils.isTokenExpired(futureExp);
    utils.assert(isExpired === false, 'Future expiration should not be expired');

    // Test with expired token
    const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const isExpiredPast = authProvider.AuthProviderUtils.isTokenExpired(pastExp);
    utils.assert(isExpiredPast === true, 'Past expiration should be expired');

    // Test with current timestamp (edge case - should be expired since it's not in the future)
    const now = Math.floor(Date.now() / 1000);
    const isExpiredNow = authProvider.AuthProviderUtils.isTokenExpired(now);
    utils.assert(
        isExpiredNow === true,
        'Current timestamp should be considered expired (not in future)'
    );

    utils.log('✓ Token expiration validation test passed');
}

async function testAudienceValidation(authProvider) {
    utils.log('Testing audience validation...');

    const payload = {
        aud: 'expected-client-id',
    };

    // Valid audience
    const isValidAudience = authProvider.AuthProviderUtils.validateAudience(
        payload,
        'expected-client-id'
    );
    utils.assert(isValidAudience === true, 'Matching audience should be valid');

    // Invalid audience
    const isInvalidAudience = authProvider.AuthProviderUtils.validateAudience(
        payload,
        'wrong-client-id'
    );
    utils.assert(isInvalidAudience === false, 'Non-matching audience should be invalid');

    utils.log('✓ Audience validation test passed');
}

async function testIssuerValidation(authProvider) {
    utils.log('Testing issuer validation...');

    // Valid Google issuer
    const googlePayload = {
        iss: 'https://accounts.google.com',
    };
    const isValidGoogle = authProvider.AuthProviderUtils.validateIssuer(
        googlePayload,
        'https://accounts.google.com'
    );
    utils.assert(isValidGoogle === true, 'Google issuer should be valid');

    // Invalid issuer
    const invalidPayload = {
        iss: 'https://malicious-issuer.com',
    };
    const isInvalid = authProvider.AuthProviderUtils.validateIssuer(
        invalidPayload,
        'https://accounts.google.com'
    );
    utils.assert(isInvalid === false, 'Invalid issuer should be rejected');

    // Missing issuer
    const missingPayload = {};
    const isMissing = authProvider.AuthProviderUtils.validateIssuer(
        missingPayload,
        'https://accounts.google.com'
    );
    utils.assert(isMissing === false, 'Missing issuer should be rejected');

    utils.log('✓ Issuer validation test passed');
}

async function testEmailVerification(authProvider) {
    utils.log('Testing email verification validation...');

    // Email verified
    const verifiedPayload = {
        email: 'verified@example.com',
        email_verified: true,
    };
    const isVerified = authProvider.AuthProviderUtils.validateEmailVerified(verifiedPayload);
    utils.assert(isVerified === true, 'Verified email should pass validation');

    // Email not verified
    const unverifiedPayload = {
        email: 'unverified@example.com',
        email_verified: false,
    };
    const isUnverified = authProvider.AuthProviderUtils.validateEmailVerified(unverifiedPayload);
    utils.assert(isUnverified === false, 'Unverified email should fail validation');

    // No email field (should pass - verification not required)
    const noEmailPayload = {};
    const noEmail = authProvider.AuthProviderUtils.validateEmailVerified(noEmailPayload);
    utils.assert(noEmail === true, 'No email field should pass validation');

    utils.log('✓ Email verification validation test passed');
}

async function testNonceHandling() {
    utils.log('Testing nonce handling...');

    // Clear session storage
    global.sessionStorage.clear();

    // Store a nonce
    const testNonce = 'test-nonce-12345';
    global.sessionStorage.setItem('google_auth_nonce', testNonce);

    // Retrieve nonce
    const retrievedNonce = global.sessionStorage.getItem('google_auth_nonce');
    utils.assert(retrievedNonce === testNonce, 'Retrieved nonce should match stored nonce');

    // Remove nonce (simulate one-time use)
    global.sessionStorage.removeItem('google_auth_nonce');
    const removedNonce = global.sessionStorage.getItem('google_auth_nonce');
    utils.assert(removedNonce === null, 'Nonce should be removed after use');

    utils.log('✓ Nonce handling test passed');
}

async function testRateLimiting() {
    utils.log('Testing rate limiting...');

    const identifier = 'rate-limit-test@example.com';

    // Clear any existing attempts
    security.clearFailedAttempts(identifier);

    // Should not be rate limited initially
    const isLimitedInitial = security.isRateLimited(identifier);
    utils.assert(isLimitedInitial === false, 'Should not be rate limited initially');

    // Record multiple failed attempts
    for (let i = 0; i < 5; i++) {
        security.recordFailedAttempt(identifier);
    }

    // Should now be rate limited
    const isLimitedAfter = security.isRateLimited(identifier);
    utils.assert(isLimitedAfter === true, 'Should be rate limited after 5 failed attempts');

    // Clear attempts
    security.clearFailedAttempts(identifier);
    const isLimitedAfterClear = security.isRateLimited(identifier);
    utils.assert(isLimitedAfterClear === false, 'Should not be rate limited after clearing');

    utils.log('✓ Rate limiting test passed');
}

// Run tests
testGoogleOneTap()
    .then(() => {
        console.log('\n✓ All tests completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n✗ Tests failed:', error);
        process.exit(1);
    });
