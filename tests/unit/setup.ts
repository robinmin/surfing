import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, vi } from 'vitest';

Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
});

Object.defineProperty(globalThis, 'btoa', {
    value: (value: string) => Buffer.from(value, 'binary').toString('base64'),
    configurable: true,
});

beforeEach(() => {
    localStorage.clear();
    document.cookie = '';
    vi.restoreAllMocks();
});

afterEach(() => {
    vi.useRealTimers();
});
