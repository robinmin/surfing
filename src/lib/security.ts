/**
 * Security Utilities
 *
 * This module provides security utilities for authentication and data protection,
 * including nonce management, token validation, and secure storage practices.
 */

// Dynamic imports will be used for crypto functions

/**
 * Security configuration interface
 */
export interface SecurityConfig {
    maxNonceAge: number; // Maximum age for nonce in milliseconds
    maxRetries: number; // Maximum login attempts
    lockoutDuration: number; // Lockout duration in milliseconds
    allowedOrigins: string[]; // Allowed origins for OAuth callbacks
    enforceHttps: boolean; // Enforce HTTPS in production
}

/**
 * Security event types
 */
export type SecurityEvent =
    | 'LOGIN_ATTEMPT'
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILURE'
    | 'NONCE_USED'
    | 'RATE_LIMIT_EXCEEDED'
    | 'SECURITY_VIOLATION';

/**
 * Security event callback
 */
export type SecurityEventCallback = (event: SecurityEvent, data: unknown) => void;

/**
 * Nonce entry interface
 */
interface NonceEntry {
    nonce: string;
    hash: string;
    createdAt: number;
    used: boolean;
    userId?: string;
}

/**
 * Failed login attempt entry
 */
interface FailedAttempt {
    timestamp: number;
    ip?: string;
    userAgent?: string;
}

/**
 * Security Manager Class
 */
class SecurityManager {
    private config: SecurityConfig;
    private nonces: Map<string, NonceEntry> = new Map();
    private failedAttempts: Map<string, FailedAttempt[]> = new Map();
    private listeners: Set<SecurityEventCallback> = new Set();

    constructor() {
        this.config = {
            maxNonceAge: 10 * 60 * 1000, // 10 minutes
            maxRetries: 5,
            lockoutDuration: 15 * 60 * 1000, // 15 minutes
            allowedOrigins: this.getAllowedOrigins(),
            enforceHttps: this.shouldEnforceHttps(),
        };

        // Clean up expired nonces periodically
        if (typeof window !== 'undefined') {
            setInterval(() => {
                this.cleanupExpiredNonces();
            }, 60000); // Every minute

            // Clean up on window unload
            window.addEventListener('beforeunload', () => {
                this.cleanup();
            });
        }
    }

    /**
     * Clean up all stored data
     */
    private cleanup(): void {
        this.nonces.clear();
        this.failedAttempts.clear();
    }

    /**
     * Get allowed origins from environment
     */
    private getAllowedOrigins(): string[] {
        // Get site URL from environment (set by Astro from config.yaml)
        const siteUrl = import.meta.env.SITE || 'https://surfing.salty.vip';

        const origins = [
            typeof window !== 'undefined' ? window.location.origin : siteUrl,
            'http://localhost:4321', // Local development
            siteUrl, // Production (from config)
        ];

        // Add preview origins from environment if available
        const previewOrigins = import.meta.env.PUBLIC_ALLOWED_PREVIEW_ORIGINS;
        if (previewOrigins) {
            origins.push(...previewOrigins.split(',').map((o: string) => o.trim()));
        }

        return [...new Set(origins)]; // Remove duplicates
    }

    /**
     * Check if HTTPS should be enforced
     */
    private shouldEnforceHttps(): boolean {
        return import.meta.env.PROD === true || import.meta.env.MODE === 'production';
    }

    /**
     * Generate and store a secure nonce
     */
    async generateAndStoreNonce(userId?: string): Promise<{ nonce: string; hash: string }> {
        const { generateNonce, sha256Base64Url } = await import('../utils/crypto');
        const nonce = generateNonce();
        const hash = await sha256Base64Url(nonce);
        const timestamp = Date.now();

        const nonceEntry: NonceEntry = {
            nonce,
            hash,
            createdAt: timestamp,
            used: false,
            userId,
        };

        this.nonces.set(hash, nonceEntry);

        return { nonce, hash };
    }

    /**
     * Validate and consume a nonce by comparing hashes
     * This is used for OAuth flows where we store a hash and receive the original nonce back
     */
    async validateNonceHash(storedHash: string, receivedNonce: string): Promise<boolean> {
        const entry = this.nonces.get(storedHash);

        if (!entry) {
            this.notifyListeners('SECURITY_VIOLATION', {
                type: 'NONCE_NOT_FOUND',
                hash: storedHash,
            });
            return false;
        }

        if (entry.used) {
            this.notifyListeners('SECURITY_VIOLATION', {
                type: 'NONCE_ALREADY_USED',
                hash: storedHash,
                timestamp: entry.createdAt,
            });
            return false;
        }

        if (Date.now() - entry.createdAt > this.config.maxNonceAge) {
            this.nonces.delete(storedHash);
            this.notifyListeners('SECURITY_VIOLATION', {
                type: 'NONCE_EXPIRED',
                hash: storedHash,
                timestamp: entry.createdAt,
            });
            return false;
        }

        // Hash the received nonce and compare with stored hash
        const { sha256Base64Url } = await import('../utils/crypto');
        const receivedHash = await sha256Base64Url(receivedNonce);

        if (receivedHash !== storedHash) {
            this.notifyListeners('SECURITY_VIOLATION', {
                type: 'NONCE_MISMATCH',
                expectedHash: storedHash,
                receivedHash,
            });
            return false;
        }

        // Mark nonce as used
        entry.used = true;
        this.notifyListeners('NONCE_USED', { hash: storedHash, userId: entry.userId });

        // Schedule deletion of used nonce
        setTimeout(() => {
            this.nonces.delete(storedHash);
        }, 5000); // Delete after 5 seconds

        return true;
    }

    /**
     * Validate and consume a nonce (direct comparison)
     * Use this when you have both the original nonce values
     */
    validateNonce(hash: string, providedNonce: string): boolean {
        const entry = this.nonces.get(hash);

        if (!entry) {
            this.notifyListeners('SECURITY_VIOLATION', {
                type: 'NONCE_NOT_FOUND',
                hash,
            });
            return false;
        }

        if (entry.used) {
            this.notifyListeners('SECURITY_VIOLATION', {
                type: 'NONCE_ALREADY_USED',
                hash,
                timestamp: entry.createdAt,
            });
            return false;
        }

        if (Date.now() - entry.createdAt > this.config.maxNonceAge) {
            this.nonces.delete(hash);
            this.notifyListeners('SECURITY_VIOLATION', {
                type: 'NONCE_EXPIRED',
                hash,
                timestamp: entry.createdAt,
            });
            return false;
        }

        // Verify the nonce matches the stored one
        const expectedHash = entry.hash;
        if (providedNonce !== entry.nonce) {
            this.notifyListeners('SECURITY_VIOLATION', {
                type: 'NONCE_MISMATCH',
                expectedHash,
                providedNonce,
            });
            return false;
        }

        // Mark nonce as used
        entry.used = true;
        this.notifyListeners('NONCE_USED', { hash, userId: entry.userId });

        // Schedule deletion of used nonce
        setTimeout(() => {
            this.nonces.delete(hash);
        }, 5000); // Delete after 5 seconds

        return true;
    }

    /**
     * Clean up expired nonces
     */
    private cleanupExpiredNonces(): void {
        const now = Date.now();
        const expiredKeys: string[] = [];

        for (const [hash, entry] of this.nonces.entries()) {
            if (now - entry.createdAt > this.config.maxNonceAge) {
                expiredKeys.push(hash);
            }
        }

        expiredKeys.forEach((hash) => {
            this.nonces.delete(hash);
        });
    }

    /**
     * Check if an origin is allowed
     */
    isAllowedOrigin(origin: string): boolean {
        return this.config.allowedOrigins.includes(origin);
    }

    /**
     * Check if current connection is secure
     */
    isSecureConnection(): boolean {
        if (typeof window === 'undefined') {
            return true; // Server-side is always considered secure
        }

        if (!this.config.enforceHttps) {
            return true; // Don't enforce in development
        }

        return (
            window.location.protocol === 'https:' ||
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1'
        );
    }

    /**
     * Validate OAuth callback URL
     */
    validateCallbackUrl(url: string): boolean {
        try {
            const parsedUrl = new URL(url);

            // Check if origin is allowed
            if (!this.isAllowedOrigin(parsedUrl.origin)) {
                return false;
            }

            // Check if connection is secure when required
            if (this.config.enforceHttps && parsedUrl.protocol !== 'https:') {
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Record a failed login attempt
     */
    recordFailedAttempt(identifier: string, ip?: string, userAgent?: string): void {
        const attempts = this.failedAttempts.get(identifier) || [];
        attempts.push({
            timestamp: Date.now(),
            ip,
            userAgent,
        });

        // Keep only recent attempts
        const recent = attempts.filter(
            (attempt) => Date.now() - attempt.timestamp < this.config.lockoutDuration
        );

        this.failedAttempts.set(identifier, recent);

        if (recent.length >= this.config.maxRetries) {
            this.notifyListeners('RATE_LIMIT_EXCEEDED', {
                identifier,
                attempts: recent.length,
                ip,
            });
        }
    }

    /**
     * Check if identifier is rate limited
     */
    isRateLimited(identifier: string): boolean {
        const attempts = this.failedAttempts.get(identifier) || [];
        const recent = attempts.filter(
            (attempt) => Date.now() - attempt.timestamp < this.config.lockoutDuration
        );

        return recent.length >= this.config.maxRetries;
    }

    /**
     * Clear failed attempts for identifier (called on successful login)
     */
    clearFailedAttempts(identifier: string): void {
        this.failedAttempts.delete(identifier);
    }

    /**
     * Get remaining lockout time
     */
    getLockoutTimeRemaining(identifier: string): number {
        const attempts = this.failedAttempts.get(identifier) || [];
        const recent = attempts.filter(
            (attempt) => Date.now() - attempt.timestamp < this.config.lockoutDuration
        );

        if (recent.length < this.config.maxRetries) {
            return 0;
        }

        const oldestAttempt = recent[0];
        const timeElapsed = Date.now() - oldestAttempt.timestamp;
        const remaining = this.config.lockoutDuration - timeElapsed;

        return Math.max(0, remaining);
    }

    /**
     * Sanitize URL for display/redirect
     */
    sanitizeUrl(url: string): string {
        try {
            const parsed = new URL(url);

            // Only allow http and https protocols
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                return '/';
            }

            // Validate origin
            if (!this.isAllowedOrigin(parsed.origin)) {
                return '/';
            }

            return parsed.toString();
        } catch {
            return '/';
        }
    }

    /**
     * Securely store data in sessionStorage
     */
    secureSessionSet(key: string, data: unknown): void {
        try {
            const encrypted = btoa(
                JSON.stringify({
                    data,
                    timestamp: Date.now(),
                })
            );
            sessionStorage.setItem(`secure_${key}`, encrypted);
        } catch (error) {
            console.error('Failed to store data securely:', error);
        }
    }

    /**
     * Securely retrieve data from sessionStorage
     */
    secureSessionGet(key: string, maxAge: number = 24 * 60 * 60 * 1000): unknown {
        try {
            const encrypted = sessionStorage.getItem(`secure_${key}`);
            if (!encrypted) return null;

            const decoded = JSON.parse(atob(encrypted));

            // Check if data is too old
            if (Date.now() - decoded.timestamp > maxAge) {
                sessionStorage.removeItem(`secure_${key}`);
                return null;
            }

            return decoded.data;
        } catch (error) {
            console.error('Failed to retrieve secure data:', error);
            sessionStorage.removeItem(`secure_${key}`);
            return null;
        }
    }

    /**
     * Securely remove data from sessionStorage
     */
    secureSessionRemove(key: string): void {
        sessionStorage.removeItem(`secure_${key}`);
    }

    /**
     * Get security configuration
     */
    getConfig(): SecurityConfig {
        return { ...this.config };
    }

    /**
     * Update security configuration
     */
    updateConfig(updates: Partial<SecurityConfig>): void {
        this.config = { ...this.config, ...updates };
    }

    /**
     * Add security event listener
     */
    addEventListener(callback: SecurityEventCallback): () => void {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    /**
     * Remove security event listener
     */
    removeEventListener(callback: SecurityEventCallback): void {
        this.listeners.delete(callback);
    }

    /**
     * Notify listeners of security events
     */
    private notifyListeners(event: SecurityEvent, data: unknown): void {
        this.listeners.forEach((callback) => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Security listener error:', error);
            }
        });
    }

    /**
     * Get security metrics
     */
    getMetrics() {
        const now = Date.now();
        const activeNonces = Array.from(this.nonces.values()).filter(
            (entry) => !entry.used && now - entry.createdAt <= this.config.maxNonceAge
        );

        const totalFailedAttempts = Array.from(this.failedAttempts.values()).reduce(
            (total, attempts) => total + attempts.length,
            0
        );

        return {
            activeNonces: activeNonces.length,
            totalNonces: this.nonces.size,
            failedAttempts: totalFailedAttempts,
            blockedIdentifiers: Array.from(this.failedAttempts.keys()).filter((id) =>
                this.isRateLimited(id)
            ).length,
        };
    }
}

// Create singleton instance
export const securityManager = new SecurityManager();

// Export convenience functions
export const generateSecureNonce = (userId?: string) =>
    securityManager.generateAndStoreNonce(userId);
export const validateNonce = (hash: string, nonce: string) =>
    securityManager.validateNonce(hash, nonce);
export const validateNonceHash = (storedHash: string, receivedNonce: string) =>
    securityManager.validateNonceHash(storedHash, receivedNonce);
export const isAllowedOrigin = (origin: string) => securityManager.isAllowedOrigin(origin);
export const isSecureConnection = () => securityManager.isSecureConnection();
export const validateCallbackUrl = (url: string) => securityManager.validateCallbackUrl(url);
export const recordFailedAttempt = (identifier: string, ip?: string, userAgent?: string) =>
    securityManager.recordFailedAttempt(identifier, ip, userAgent);
export const isRateLimited = (identifier: string) => securityManager.isRateLimited(identifier);
export const clearFailedAttempts = (identifier: string) =>
    securityManager.clearFailedAttempts(identifier);
export const getLockoutTimeRemaining = (identifier: string) =>
    securityManager.getLockoutTimeRemaining(identifier);
export const sanitizeUrl = (url: string) => securityManager.sanitizeUrl(url);
export const secureSessionSet = (key: string, data: unknown) =>
    securityManager.secureSessionSet(key, data);
export const secureSessionGet = (key: string, maxAge?: number) =>
    securityManager.secureSessionGet(key, maxAge);
export const secureSessionRemove = (key: string) => securityManager.secureSessionRemove(key);
export const addSecurityListener = (callback: SecurityEventCallback) =>
    securityManager.addEventListener(callback);
export const removeSecurityListener = (callback: SecurityEventCallback) =>
    securityManager.removeEventListener(callback);
export const getSecurityMetrics = () => securityManager.getMetrics();
