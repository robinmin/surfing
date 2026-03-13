import { describe, expect, it } from 'vitest';

import {
    base64UrlEncode,
    generateNonce,
    generateNonceWithHash,
    sha256,
    sha256Base64Url,
    verifyNonce,
} from '~/utils/crypto';

describe('crypto utilities', () => {
    it('generates nonces with the requested length and character set', () => {
        const nonce = generateNonce(48);

        expect(nonce).toHaveLength(48);
        expect(nonce).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('hashes values with sha256 in hex and URL-safe base64 formats', async () => {
        await expect(sha256('hello')).resolves.toBe(
            '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
        );
        await expect(sha256Base64Url('hello')).resolves.toBe('LPJNul-wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ');
    });

    it('creates nonce/hash pairs and validates nonce equality', async () => {
        const { nonce, hashedNonce } = await generateNonceWithHash();

        expect(nonce).toHaveLength(32);
        expect(hashedNonce).toMatch(/^[A-Za-z0-9_-]+$/);
        expect(verifyNonce('a', 'a')).toBe(true);
        expect(verifyNonce('a', 'b')).toBe(false);
        expect(verifyNonce('', 'b')).toBe(false);
    });

    it('rewrites base64 strings into URL-safe form', () => {
        expect(base64UrlEncode('abc+/==')).toBe('abc-_');
    });
});
