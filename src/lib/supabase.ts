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

// Get environment variables
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error(
    'Missing required environment variable: PUBLIC_SUPABASE_URL\n' +
      'Please add it to your .env file or Cloudflare environment variables.\n' +
      'Get this from your Supabase project dashboard: Settings > API'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing required environment variable: PUBLIC_SUPABASE_ANON_KEY\n' +
      'Please add it to your .env file or Cloudflare environment variables.\n' +
      'Get this from your Supabase project dashboard: Settings > API'
  );
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
});

// Export a helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Export type helpers for TypeScript
export type SupabaseClient = typeof supabase;
