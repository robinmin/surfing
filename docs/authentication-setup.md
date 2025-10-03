# Authentication Setup Guide

This guide walks you through configuring the authentication system for Surfing, which supports Google One Tap and Sign In with Apple authentication providers.

## Overview

The authentication system uses:

- **Supabase** - Authentication backend and user management
- **Google One Tap** - Google OAuth provider
- **Sign In with Apple** - Apple OAuth provider
- **Astro** - Frontend framework with client-side environment variables

## Prerequisites

1. **Supabase Project** - Create a free account at [supabase.com](https://supabase.com)
2. **Google Cloud Console** - Access to [console.cloud.google.com](https://console.cloud.google.com)
3. **Apple Developer Account** - Paid account required at [developer.apple.com](https://developer.apple.com)

## Environment Variables

The authentication system requires these environment variables to be configured:

### Supabase Configuration

```bash
# Get these from your Supabase project dashboard: Settings > API
PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"
```

### Google OAuth Configuration

```bash
# Get this from Google Cloud Console: APIs & Services > Credentials
PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

### Apple Sign In Configuration

```bash
# Get these from Apple Developer Portal: Certificates, Identifiers & Profiles
PUBLIC_APPLE_SERVICES_ID="com.yourdomain.webapp"
PUBLIC_APPLE_REDIRECT_URI="https://surfing.salty.vip/auth/callback"
```

## Setup Instructions

### 1. Supabase Project Setup

1. **Create Project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Choose organization and create new project
   - Set a strong database password

2. **Get Configuration Values**:
   - Navigate to **Project Settings** > **API**
   - Copy the **Project URL** → `PUBLIC_SUPABASE_URL`
   - Copy the **anon/public** key → `PUBLIC_SUPABASE_ANON_KEY`

### 2. Google OAuth Setup

1. **Create OAuth Client**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Select your project (or create new)
   - Navigate to **APIs & Services** > **Credentials**
   - Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs**
   - Select **Web application** as application type

2. **Configure OAuth Client**:
   - Add a name (e.g., "Surfing Web App")
   - Add **Authorized JavaScript origins**:
     - `http://localhost:4321` (local development)
     - `https://surfing.salty.vip` (production)
   - Add **Authorized redirect URIs**:
     - `https://surfing.salty.vip/auth/callback`
   - Click **Create**
   - Copy the **Client ID** → `PUBLIC_GOOGLE_CLIENT_ID`

### 3. Apple Sign In Setup

1. **Create App ID**:
   - Go to [Apple Developer Portal](https://developer.apple.com)
   - Navigate to **Certificates, Identifiers & Profiles**
   - Click **Identifiers** > **+** to create new identifier
   - Select **App IDs** and click **Continue**
   - Enter Bundle ID in reverse domain format (e.g., `com.surfing.webapp`)
   - Scroll down and check **Sign In with Apple** capability
   - Click **Continue** and **Register**

2. **Create Services ID**:
   - Go back to **Identifiers** > **+**
   - Select **Services IDs** and click **Continue**
   - Enter Identifier (e.g., `com.surfing.webapp.auth`) → `PUBLIC_APPLE_SERVICES_ID`
   - Enter primary domain (e.g., `surfing.salty.vip`)
   - Click **Continue** and **Register**

3. **Configure Services ID**:
   - Click on your newly created Services ID
   - Check **Sign In with Apple**
   - Click **Configure**
   - Enter **Return URLs**:
     - `https://surfing.salty.vip/auth/callback` → `PUBLIC_APPLE_REDIRECT_URI`
   - Click **Save**, then **Done**, then **Continue**, then **Register**

## Environment Configuration

### Local Development

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Fill in your values in `.env`:

```bash
# Supabase
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth
PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Apple Sign In
PUBLIC_APPLE_SERVICES_ID=com.yourdomain.webapp
PUBLIC_APPLE_REDIRECT_URI=https://surfing.salty.vip/auth/callback
```

### GitHub Actions (Build-time Variables)

Add as Repository Secrets in GitHub:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each variable:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `PUBLIC_GOOGLE_CLIENT_ID`
   - `PUBLIC_APPLE_SERVICES_ID`
   - `PUBLIC_APPLE_REDIRECT_URI`

### Cloudflare Pages (Runtime Variables)

Add as Environment Variables in Cloudflare:

1. Go to Cloudflare Dashboard > Pages > Surfing project
2. Navigate to **Settings** > **Environment variables**
3. Add each variable for both **Production** and **Preview** environments:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `PUBLIC_GOOGLE_CLIENT_ID`
   - `PUBLIC_APPLE_SERVICES_ID`
   - `PUBLIC_APPLE_REDIRECT_URI`

## Verification

### Test Environment Variables

Create a test file to verify variables are accessible:

```typescript
// src/pages/test-env.astro
---
const envVars = {
  supabaseUrl: import.meta.env.PUBLIC_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  googleClientId: import.meta.env.PUBLIC_GOOGLE_CLIENT_ID,
  appleServicesId: import.meta.env.PUBLIC_APPLE_SERVICES_ID,
  appleRedirectUri: import.meta.env.PUBLIC_APPLE_REDIRECT_URI,
};
---
<html>
<body>
  <h1>Environment Variables Test</h1>
  <pre>{JSON.stringify(envVars, null, 2)}</pre>
</body>
</html>
```

Visit `/test-env` to verify all variables are loaded correctly.

### Test Authentication Flow

1. Start development server: `npm run dev`
2. Navigate to a page with authentication components
3. Verify Google One Tap button appears
4. Verify Sign In with Apple button appears
5. Test login flow with both providers

## Troubleshooting

### Common Issues

**Environment variables not working:**

- Ensure `PUBLIC_` prefix is used for client-side access
- Restart development server after changing `.env`
- Check GitHub Actions secrets are properly named
- Verify Cloudflare Pages environment variables are set

**Google One Tap not appearing:**

- Verify `PUBLIC_GOOGLE_CLIENT_ID` is correct
- Check that current domain is in authorized JavaScript origins
- Ensure Google OAuth consent screen is configured

**Apple Sign In not working:**

- Verify `PUBLIC_APPLE_SERVICES_ID` matches Services ID exactly
- Check that return URL is configured in Apple Developer Portal
- Ensure Services ID has Sign In with Apple enabled

**Supabase authentication errors:**

- Verify `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that authentication providers are enabled in Supabase dashboard
- Ensure Site URL and redirect URLs are configured properly

### Debug Mode

Enable debug logging by adding to `.env`:

```bash
# Enable debug logging
DEBUG=true
```

## Next Steps

After setting up environment variables:

1. **Configure Supabase Providers** - Enable Google and Apple providers in Supabase dashboard
2. **Test Authentication Flow** - Verify complete login/logout functionality
3. **Deploy to Production** - Ensure all environment variables are configured in production

## Support

For additional help:

- Check [Supabase Documentation](https://supabase.com/docs)
- Review [Google OAuth Documentation](https://developers.google.com/identity)
- Consult [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
