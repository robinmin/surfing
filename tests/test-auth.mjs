#!/usr/bin/env node

/**
 * Authentication Test Script
 *
 * This script tests the Google One Tap authentication setup
 * by verifying environment variables and configuration.
 */

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env')
    const envContent = readFileSync(envPath, 'utf-8')
    const env = {}

    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join('=')
        }
      }
    })

    return env
  } catch (error) {
    console.error('❌ Failed to load .env file:', error.message)
    return {}
  }
}

function testGoogleOAuth() {
  console.log('🔍 Testing Google OAuth Configuration...\n')

  const env = loadEnv()

  // Check Google Client ID
  const clientId = env.PUBLIC_GOOGLE_CLIENT_ID
  if (!clientId) {
    console.error('❌ PUBLIC_GOOGLE_CLIENT_ID is not set in .env file')
    return false
  }

  if (clientId === 'your-production-google-client-id-here') {
    console.error('❌ PUBLIC_GOOGLE_CLIENT_ID is still set to placeholder value')
    console.log('   Please replace with your actual Google OAuth client ID')
    return false
  }

  // Check if it's a valid Google client ID format
  const googleClientIdRegex = /^[0-9a-z-]+.apps.googleusercontent.com$/
  if (!googleClientIdRegex.test(clientId)) {
    console.error('❌ PUBLIC_GOOGLE_CLIENT_ID does not appear to be a valid Google client ID')
    console.log('   Expected format: xxxxxxxx-xxxxxxxxxxxxxxxxxx.apps.googleusercontent.com')
    return false
  }

  console.log('✅ Google Client ID format is valid')

  // Check if it's not the test client ID (which won't work in production)
  const testClientIds = [
    '511333300252-2d54h6n4th9q0c3r1ed7k4eq9c5dj7v.apps.googleusercontent.com',
    '644801417181-e1glvt4j9tpsaakvfqrlfrq56m277e4f.apps.googleusercontent.com',
  ]

  if (testClientIds.includes(clientId)) {
    console.warn('⚠️  Using Google test client ID - this will only work on localhost')
    console.log('   For production deployment, create OAuth credentials at:')
    console.log('   https://console.cloud.google.com/apis/credentials')
    return false
  }

  console.log('✅ Not using test client ID - suitable for production')

  // Check Supabase configuration
  const supabaseUrl = env.PUBLIC_SUPABASE_URL
  const supabaseKey = env.PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase configuration is incomplete')
    console.log('   Make sure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set')
    return false
  }

  console.log('✅ Supabase configuration is present')

  return true
}

function main() {
  console.log('🚀 Surfing Authentication Test\n')

  const success = testGoogleOAuth()

  if (success) {
    console.log('\n🎉 All authentication checks passed!')
    console.log('   Your Google One Tap authentication should work correctly.')
    console.log('   Deploy and test on https://surfing.salty.vip')
  } else {
    console.log('\n❌ Authentication configuration needs to be fixed.')
    console.log('   Please address the issues above before deploying.')
    process.exit(1)
  }
}

main()
