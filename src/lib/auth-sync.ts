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
 */

const AUTH_SYNC_CHANNEL = 'surfing_auth_sync';
const AUTH_STATE_KEY = 'surfing_auth_state';

export type AuthSyncEvent = 'login' | 'logout' | 'session_refresh';

export interface AuthSyncMessage {
  type: AuthSyncEvent;
  timestamp: number;
  userId?: string;
}

let broadcastChannel: BroadcastChannel | null = null;
const listeners: Set<(event: AuthSyncEvent) => void> = new Set();

/**
 * Initialize auth state synchronization
 */
export const initAuthSync = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // Use BroadcastChannel if available
  if ('BroadcastChannel' in window) {
    try {
      broadcastChannel = new BroadcastChannel(AUTH_SYNC_CHANNEL);

      broadcastChannel.addEventListener('message', (event) => {
        const message = event.data as AuthSyncMessage;
        console.debug('Auth sync message received:', message);

        // Notify all listeners
        listeners.forEach((listener) => listener(message.type));
      });

      console.debug('Auth sync initialized with BroadcastChannel');
    } catch (error) {
      console.debug('Failed to initialize BroadcastChannel:', error);
    }
  }

  // Fallback: Listen to storage events for cross-tab sync
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === AUTH_STATE_KEY && event.newValue !== event.oldValue) {
        try {
          const state = event.newValue ? JSON.parse(event.newValue) : null;

          if (state?.type) {
            console.debug('Auth sync via storage event:', state);

            // Notify all listeners
            listeners.forEach((listener) => listener(state.type));
          }
        } catch (error) {
          console.debug('Failed to parse storage auth state:', error);
        }
      }
    });

    console.debug('Auth sync initialized with storage events');
  }
};

/**
 * Broadcast auth event to all tabs
 */
export const broadcastAuthEvent = (type: AuthSyncEvent, userId?: string): void => {
  const message: AuthSyncMessage = {
    type,
    timestamp: Date.now(),
    userId,
  };

  // Broadcast via BroadcastChannel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(message);
      console.debug('Auth event broadcasted via channel:', message);
    } catch (error) {
      console.debug('Failed to broadcast via channel:', error);
    }
  }

  // Fallback: Use localStorage for cross-tab sync
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(message));
      console.debug('Auth event broadcasted via storage:', message);
    } catch (error) {
      console.debug('Failed to broadcast via storage:', error);
    }
  }
};

/**
 * Subscribe to auth sync events
 */
export const onAuthSync = (callback: (event: AuthSyncEvent) => void): (() => void) => {
  listeners.add(callback);

  // Return unsubscribe function
  return () => {
    listeners.delete(callback);
  };
};

/**
 * Cleanup auth sync resources
 */
export const cleanupAuthSync = (): void => {
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
  }

  listeners.clear();
  console.debug('Auth sync cleaned up');
};

/**
 * Notify login event to all tabs
 */
export const notifyLogin = (userId: string): void => {
  broadcastAuthEvent('login', userId);
};

/**
 * Notify logout event to all tabs
 */
export const notifyLogout = (): void => {
  broadcastAuthEvent('logout');
};

/**
 * Notify session refresh to all tabs
 */
export const notifySessionRefresh = (userId: string): void => {
  broadcastAuthEvent('session_refresh', userId);
};
