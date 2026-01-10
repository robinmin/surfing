/**
 * Auth State Synchronization
 *
 * Ensures authentication state is synchronized across all browser tabs/windows
 * using BroadcastChannel API and storage events as fallback.
 *
 * Features:
 * - Real-time auth state sync across tabs
 * - Login/logout events propagated to all tabs
 * - Fallback to storage events for older browsers
 * - Configurable channel names for multi-app scenarios
 */

export type AuthSyncEvent = 'login' | 'logout' | 'session_refresh';

export interface AuthSyncMessage {
    type: AuthSyncEvent;
    timestamp: number;
    userId?: string;
}

export interface AuthSyncOptions {
    channelName?: string;
    storageKey?: string;
}

export class AuthSync {
    private broadcastChannel: BroadcastChannel | null = null;
    private listeners: Set<(event: AuthSyncEvent) => void> = new Set();
    private channelName: string;
    private storageKey: string;
    private initialized: boolean = false;

    constructor(options: AuthSyncOptions = {}) {
        this.channelName = options.channelName || 'turnstile_auth_sync';
        this.storageKey = options.storageKey || 'turnstile_auth_state';
    }

    /**
     * Initialize auth state synchronization
     */
    init(): void {
        if (this.initialized) {
            return;
        }

        if (typeof window === 'undefined') {
            return;
        }

        // Use BroadcastChannel if available
        if ('BroadcastChannel' in window) {
            try {
                this.broadcastChannel = new BroadcastChannel(this.channelName);

                this.broadcastChannel.addEventListener('message', (event) => {
                    const message = event.data as AuthSyncMessage;
                    console.debug('Auth sync message received:', message);

                    // Notify all listeners
                    for (const listener of this.listeners) {
                        void listener(message.type);
                    }
                });

                console.debug('Auth sync initialized with BroadcastChannel:', this.channelName);
            } catch (error) {
                console.debug('Failed to initialize BroadcastChannel:', error);
            }
        }

        // Fallback: Listen to storage events for cross-tab sync
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            window.addEventListener('storage', (event) => {
                if (event.key === this.storageKey && event.newValue !== event.oldValue) {
                    try {
                        const state = event.newValue ? JSON.parse(event.newValue) : null;

                        if (state?.type) {
                            console.debug('Auth sync via storage event:', state);

                            // Notify all listeners
                            for (const listener of this.listeners) {
                                void listener(state.type);
                            }
                        }
                    } catch (error) {
                        console.debug('Failed to parse storage auth state:', error);
                    }
                }
            });

            console.debug('Auth sync initialized with storage events:', this.storageKey);
        }

        this.initialized = true;
    }

    /**
     * Broadcast auth event to all tabs
     */
    private broadcast(type: AuthSyncEvent, userId?: string): void {
        if (!this.initialized) {
            console.warn('AuthSync not initialized. Call init() first.');
            return;
        }

        const message: AuthSyncMessage = {
            type,
            timestamp: Date.now(),
            userId,
        };

        // Broadcast via BroadcastChannel
        if (this.broadcastChannel) {
            try {
                this.broadcastChannel.postMessage(message);
                console.debug('Auth event broadcasted via channel:', message);
            } catch (error) {
                console.debug('Failed to broadcast via channel:', error);
            }
        }

        // Fallback: Use localStorage for cross-tab sync
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(message));
                console.debug('Auth event broadcasted via storage:', message);
            } catch (error) {
                console.debug('Failed to broadcast via storage:', error);
            }
        }
    }

    /**
     * Subscribe to auth sync events
     */
    onAuthSync(callback: (event: AuthSyncEvent) => void): () => void {
        this.listeners.add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Notify login event to all tabs
     */
    notifyLogin(userId: string): void {
        this.broadcast('login', userId);
    }

    /**
     * Notify logout event to all tabs
     */
    notifyLogout(): void {
        this.broadcast('logout');
    }

    /**
     * Notify session refresh to all tabs
     */
    notifySessionRefresh(userId: string): void {
        this.broadcast('session_refresh', userId);
    }

    /**
     * Cleanup auth sync resources
     */
    cleanup(): void {
        if (this.broadcastChannel) {
            this.broadcastChannel.close();
            this.broadcastChannel = null;
        }

        this.listeners.clear();
        this.initialized = false;
        console.debug('Auth sync cleaned up');
    }
}

// ============================================================================
// CONVENIENCE FUNCTIONS (using default/singleton instance)
// ============================================================================

let defaultSync: AuthSync | null = null;

/**
 * Initialize auth state synchronization (convenience function)
 */
export function initAuthSync(options?: AuthSyncOptions): AuthSync {
    defaultSync = new AuthSync(options);
    defaultSync.init();
    return defaultSync;
}

/**
 * Subscribe to auth sync events (convenience function)
 */
export function onAuthSync(callback: (event: AuthSyncEvent) => void): () => void {
    if (!defaultSync) {
        throw new Error('AuthSync not initialized. Call initAuthSync() first.');
    }
    return defaultSync.onAuthSync(callback);
}

/**
 * Notify login event (convenience function)
 */
export function notifyLogin(userId: string): void {
    if (!defaultSync) {
        throw new Error('AuthSync not initialized. Call initAuthSync() first.');
    }
    defaultSync.notifyLogin(userId);
}

/**
 * Notify logout event (convenience function)
 */
export function notifyLogout(): void {
    if (!defaultSync) {
        throw new Error('AuthSync not initialized. Call initAuthSync() first.');
    }
    defaultSync.notifyLogout();
}

/**
 * Notify session refresh (convenience function)
 */
export function notifySessionRefresh(userId: string): void {
    if (!defaultSync) {
        throw new Error('AuthSync not initialized. Call initAuthSync() first.');
    }
    defaultSync.notifySessionRefresh(userId);
}

/**
 * Cleanup auth sync resources (convenience function)
 */
export function cleanupAuthSync(): void {
    if (!defaultSync) {
        return;
    }
    defaultSync.cleanup();
    defaultSync = null;
}
