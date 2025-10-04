/**
 * Supabase Client Configuration
 *
 * This module initializes and exports the Supabase client for use throughout the application.
 * It handles authentication, session management, and OAuth provider integration.
 *
 * Environment Variables Required:
 * - PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 *
 * Note: These are PUBLIC keys safe for client-side use.
 * Security is managed by Supabase Row Level Security (RLS) policies.
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables safely
const supabaseUrl = import.meta.env?.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.PUBLIC_SUPABASE_ANON_KEY || '';

// Check if we have valid configuration
const hasValidConfig = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co';

// Validate required environment variables with better error handling
if (!hasValidConfig) {
  console.warn(
    'Supabase configuration incomplete. Authentication features will be limited.\n' +
      'Please add these to your .env file:\n' +
      '- PUBLIC_SUPABASE_URL=your-project-url.supabase.co\n' +
      '- PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n' +
      'Get these from your Supabase project dashboard: Settings > API'
  );
}

// Create and export the Supabase client
export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Store session in local storage for persistence across page refreshes
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        // Automatically refresh the session when it expires
        autoRefreshToken: true,
        // Persist the session across browser tabs
        persistSession: true,
        // Detect session from URL for OAuth callbacks
        detectSessionInUrl: true,
      },
    })
  : null;

// Export a helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return hasValidConfig && !!supabase;
};

// Export type helpers for TypeScript
export type SupabaseClient = typeof supabase;
