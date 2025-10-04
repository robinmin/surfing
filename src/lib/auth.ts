/**
 * Authentication State Management
 *
 * This module provides centralized authentication state management,
 * session handling, and authentication utilities for the entire application.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import type { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';

/**
 * User interface for authentication state
 */
export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  provider?: 'google' | 'apple';
  email_verified?: boolean;
  created_at?: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

/**
 * Session interface for authentication state
 * Note: This wraps Supabase's session but adds our custom user type
 */
export interface Session {
  user: User | null;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * Authentication event types
 */
export type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'INITIAL_SESSION';

/**
 * Authentication event callback
 */
export type AuthEventCallback = (event: AuthEvent, session: Session | null) => void;

/**
 * Authentication state manager class
 */
class AuthManager {
  private state: AuthState = {
    user: null,
    session: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  };

  private listeners: Set<AuthEventCallback> = new Set();
  private authSubscription: { unsubscribe: () => void } | null = null;

  /**
   * Initialize authentication state manager
   */
  async initialize(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // Check if Supabase is configured
      if (!isSupabaseConfigured() || !supabase) {
        this.setState({
          error: 'Authentication service not configured. Please check your environment variables.',
          isLoading: false,
        });
        return;
      }

      // Get initial session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      this.handleSessionChange(session || null, 'INITIAL_SESSION');

      // Set up auth state change listener
      this.authSubscription = supabase.auth.onAuthStateChange((event, session) => {
        this.handleSessionChange(session, event as AuthEvent);
      }).data.subscription;
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.setState({
        error: error instanceof Error ? error.message : 'Failed to initialize authentication',
        isLoading: false,
      });
    }
  }

  /**
   * Handle session changes from Supabase
   */
  private handleSessionChange(session: SupabaseSession | null, event: AuthEvent): void {
    const user = session?.user ? this.formatUser(session.user) : null;

    // Convert Supabase session to our custom session type
    const customSession: Session | null = session
      ? {
          user,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
          expires_in: session.expires_in,
          token_type: session.token_type,
        }
      : null;

    this.setState({
      user,
      session: customSession,
      isLoading: false,
      isAuthenticated: !!user,
      error: null,
    });

    // Notify listeners
    this.notifyListeners(event, session);

    // Emit custom events for component integration
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('authStateChange', {
          detail: { event, session, user },
        })
      );
    }
  }

  /**
   * Format user data from Supabase
   */
  private formatUser(supabaseUser: SupabaseUser): User {
    const provider = this.extractProvider(supabaseUser);

    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: this.extractDisplayName(supabaseUser, provider),
      avatar_url: this.extractAvatarUrl(supabaseUser, provider),
      provider: provider || undefined,
      email_verified: supabaseUser.user_metadata?.email_verified || supabaseUser.email_confirmed_at != null,
      created_at: supabaseUser.created_at,
      last_sign_in_at: supabaseUser.last_sign_in_at,
      user_metadata: supabaseUser.user_metadata,
      app_metadata: supabaseUser.app_metadata,
    };
  }

  /**
   * Extract authentication provider from user data
   */
  private extractProvider(user: any): 'google' | 'apple' | null {
    // Check app_metadata for provider info
    if (user.app_metadata?.provider) {
      return user.app_metadata.provider;
    }

    // Check user metadata for provider-specific data
    if (user.user_metadata?.provider) {
      return user.user_metadata.provider;
    }

    // Check email domain for Apple privacy emails
    if (user.email?.endsWith('@privaterelay.appleid.com')) {
      return 'apple';
    }

    return null;
  }

  /**
   * Extract display name from user data
   */
  private extractDisplayName(user: any, provider: string | null): string | undefined {
    // Check user metadata first
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }

    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }

    // Check provider-specific metadata
    if (provider === 'google' && user.user_metadata?.name) {
      return user.user_metadata.name;
    }

    if (provider === 'apple') {
      const firstName = user.user_metadata?.first_name;
      const lastName = user.user_metadata?.last_name;
      if (firstName || lastName) {
        return `${firstName || ''} ${lastName || ''}`.trim();
      }
    }

    return user.user_metadata?.display_name || user.email;
  }

  /**
   * Extract avatar URL from user data
   */
  private extractAvatarUrl(user: any, provider: string | null): string | undefined {
    // Check user metadata for avatar
    if (user.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }

    if (user.user_metadata?.picture) {
      return user.user_metadata.picture;
    }

    // Check provider-specific metadata
    if (provider === 'google' && user.user_metadata?.picture) {
      return user.user_metadata.picture;
    }

    return user.user_metadata?.image;
  }

  /**
   * Update auth state
   */
  private setState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyStateChange();
  }

  /**
   * Notify listeners of state changes
   */
  private notifyStateChange(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('authStateUpdate', {
          detail: { ...this.state },
        })
      );
    }
  }

  /**
   * Notify listeners of auth events
   */
  private notifyListeners(event: AuthEvent, session: SupabaseSession | null): void {
    this.listeners.forEach((callback) => {
      try {
        callback(event, session);
      } catch (error) {
        console.error('Auth listener error:', error);
      }
    });
  }

  /**
   * Get current authentication state
   */
  getState(): AuthState {
    return { ...this.state };
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    return this.state.user;
  }

  /**
   * Get current session
   */
  getSession(): Session | null {
    return this.state.session;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  /**
   * Check if authentication is loading
   */
  isLoading(): boolean {
    return this.state.isLoading;
  }

  /**
   * Get current error
   */
  getError(): string | null {
    return this.state.error;
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      this.setState({ isLoading: true });

      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      await supabase.auth.signOut();

      // State will be updated by the auth state change listener
    } catch (error) {
      console.error('Sign out error:', error);
      this.setState({
        error: error instanceof Error ? error.message : 'Failed to sign out',
        isLoading: false,
      });
    }
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<void> {
    try {
      this.setState({ isLoading: true });

      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      const { error } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      // Session will be updated by the auth state change listener
    } catch (error) {
      console.error('Session refresh error:', error);
      this.setState({
        error: error instanceof Error ? error.message : 'Failed to refresh session',
        isLoading: false,
      });
    }
  }

  /**
   * Update user metadata
   */
  async updateUserMetadata(metadata: Record<string, any>): Promise<void> {
    try {
      this.setState({ isLoading: true });

      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      const { error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) {
        throw error;
      }

      // State will be updated by the auth state change listener
    } catch (error) {
      console.error('Update user metadata error:', error);
      this.setState({
        error: error instanceof Error ? error.message : 'Failed to update user metadata',
        isLoading: false,
      });
    }
  }

  /**
   * Add auth event listener
   */
  addEventListener(callback: AuthEventCallback): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Remove auth event listener
   */
  removeEventListener(callback: AuthEventCallback): void {
    this.listeners.delete(callback);
  }

  /**
   * Clear authentication state
   */
  clear(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      this.authSubscription = null;
    }

    this.listeners.clear();

    this.setState({
      user: null,
      session: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  }

  /**
   * Reset error state
   */
  clearError(): void {
    this.setState({ error: null });
  }
}

// Create singleton instance
export const authManager = new AuthManager();

// Export convenience functions
export const initializeAuth = () => authManager.initialize();
export const getCurrentUser = () => authManager.getUser();
export const getCurrentSession = () => authManager.getSession();
export const isAuthenticated = () => authManager.isAuthenticated();
export const isLoading = () => authManager.isLoading();
export const getAuthError = () => authManager.getError();
export const getAuthState = () => authManager.getState();
export const signOut = () => authManager.signOut();
export const refreshSession = () => authManager.refreshSession();
export const updateUserMetadata = (metadata: Record<string, any>) => authManager.updateUserMetadata(metadata);
export const addAuthListener = (callback: AuthEventCallback) => authManager.addEventListener(callback);
export const removeAuthListener = (callback: AuthEventCallback) => authManager.removeEventListener(callback);
export const clearAuthError = () => authManager.clearError();
export const clearAuth = () => authManager.clear();

// Export reactive auth state getter for components
export const getReactiveAuthState = () => {
  return new Proxy(authManager.getState(), {
    get(_target, prop) {
      return authManager.getState()[prop as keyof AuthState];
    },
  });
};
