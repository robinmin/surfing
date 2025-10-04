# Development Setup Guide

This guide will help you set up authentication services for local development of the Surfing application.

## 🚀 Quick Start

The application is already configured with basic development settings. The authentication services will show clear error messages and setup instructions when they're not properly configured.

## 🔧 Authentication Services Setup

### Google Sign-In (Google One Tap + FedCM)

**Current Status**: ✅ Configured with development client ID
**Error**: "The given origin is not allowed for the given client ID" (Expected in development)
**FedCM**: ✅ Implemented with fallback to Google One Tap

#### Understanding FedCM Migration

Google is transitioning from Google One Tap to **Federated Credential Management (FedCM)**. Our application:

- ✅ Supports FedCM API (Future-proof)
- ✅ Falls back to Google One Tap (Current compatibility)
- ✅ Provides clear migration guidance

#### To Fix This Issue:

1. **For Development (Recommended)**:
   - Create a Google OAuth client ID specifically for localhost
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project or create a new one
   - Navigate to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Select "Web application"
   - Add these to "Authorized JavaScript origins":
     - `http://localhost:4323`
     - `http://127.0.0.1:4323`
   - Add these to "Authorized redirect URIs":
     - `http://localhost:4323/auth/callback`
     - `http://127.0.0.1:4323/auth/callback`
   - Copy the client ID and update your `.env` file

2. **Update Environment Variable**:
   ```bash
   # In your .env file
   PUBLIC_GOOGLE_CLIENT_ID=your-new-client-id.apps.googleusercontent.com
   ```

#### FedCM Configuration (Future):

The application will automatically use FedCM when available. No additional configuration needed for most use cases.

### Apple Sign In

**Current Status**: ⚠️ Disabled by default (requires Apple Developer account)
**Error**: "Apple Sign In not configured" (If not set up)

Apple Sign In is **disabled by default** in `src/config.yaml`. Enable it when you have an Apple Developer account configured.

#### To Enable and Configure:

1. **Enable in Configuration**:

   ```yaml
   # In src/config.yaml
   auth:
     apple_sign_in:
       enabled: true # Change from false to true
   ```

2. **Apple Developer Portal Setup**:
   - Go to [Apple Developer Portal](https://developer.apple.com/)
   - Navigate to "Certificates, Identifiers & Profiles"
   - Create a new "Services ID" (com.yourdomain.webapp format)
   - Configure it for "Sign In with Apple"
   - Add your development redirect URI: `http://localhost:4323/auth/callback`
   - Download and configure the private key

3. **Update Environment Variables**:
   ```bash
   # In your .env file
   PUBLIC_APPLE_SERVICES_ID=com.yourdomain.webapp
   PUBLIC_APPLE_REDIRECT_URI=http://localhost:4323/auth/callback
   ```

### Sentry Error Tracking

**Current Status**: ✅ Configured and enabled by default
**Debug Mode**: Disabled in development (configurable in `src/config.yaml`)

Sentry provides error tracking and performance monitoring for both client and server-side code.

#### Configuration:

1. **Enable/Disable Sentry** in `src/config.yaml`:

   ```yaml
   sentry:
     enabled: true # Enable/disable Sentry
     debug: false # Set to true to send errors in development
   ```

2. **Get Sentry DSN**:
   - Create account at [sentry.io](https://sentry.io)
   - Create new project (select Astro or JavaScript)
   - Copy your DSN from project settings

3. **Update Environment Variables**:
   ```bash
   # In your .env file
   PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   SENTRY_AUTH_TOKEN=your-auth-token  # Optional, for source maps
   ```

#### Features:

- **Error Tracking**: Automatic capture of client and server errors
- **Performance Monitoring**: 10% sampling in production
- **Session Replay**: Captures user sessions on errors (10% in production)
- **Data Sanitization**: Automatically redacts sensitive data (API keys, tokens, passwords)
- **Privacy Controls**: PII only sent in production mode
- **Development Mode**: Errors not sent unless `sentry.debug: true`

## 🏃‍♂️ Running the Application

### Start Development Server:

```bash
npm run dev
```

### Access the Application:

- Local: http://localhost:4323/
- The port may change if 4323 is in use

## 📋 Environment Variables Reference

Copy this to your `.env` file and update with your actual values:

```bash
# Supabase Configuration (Required for Authentication)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google OAuth Configuration
PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Apple Sign In Configuration (Optional - disabled by default in src/config.yaml)
PUBLIC_APPLE_SERVICES_ID=com.yourdomain.webapp
PUBLIC_APPLE_REDIRECT_URI=http://localhost:4323/auth/callback

# Sentry Error Tracking (Optional)
PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

### Configuration Options

Authentication providers can be enabled/disabled in `src/config.yaml`:

```yaml
# Authentication configuration
auth:
  google_one_tap:
    enabled: true # Google One Tap sign-in
  apple_sign_in:
    enabled: false # Apple Sign In (requires Apple Developer account)

# Sentry error tracking configuration
sentry:
  enabled: true # Enable/disable Sentry error tracking
  debug: false # Set to true to enable Sentry in development mode
```

## 🐛 Common Issues and Solutions

### Issue: "The given origin is not allowed for the given client ID"

**Cause**: Using production OAuth client ID on localhost
**Solution**: Create a separate OAuth client for development with localhost origins

### Issue: "Apple Sign In not configured"

**Cause**: Missing or incorrect Apple Developer configuration
**Solution**: Set up Apple Developer account and configure Services ID

### Issue: "Missing required environment variable"

**Cause**: Environment variables not set in `.env` file
**Solution**: Copy and update the environment variables from the reference above

## 🔍 Testing Authentication

### Testing Google Sign-In:

1. Make sure Google OAuth is configured
2. Click "Sign in with Google" button
3. Follow the Google authentication flow
4. Verify you're redirected back and signed in

### Testing Apple Sign-In:

1. Make sure Apple Developer settings are configured
2. Click "Sign in with Apple" button
3. Follow the Apple authentication flow
4. Verify you're redirected back and signed in

## 📚 Additional Resources

- [Google One Tap Documentation](https://developers.google.com/identity/gsi/web)
- [FedCM Migration Guide](https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
- [Sign In with Apple Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Supabase Authentication Guide](https://supabase.com/docs/guides/auth)

### FedCM Specific Resources

- [FedCM Overview](https://developers.google.com/identity/federated-credentials-api)
- [FedCM Browser Support](https://developers.google.com/identity/federated-credentials-api/supported-browsers)
- [FedCM Migration Timeline](https://developers.google.com/identity/federated-credentials-api/timeline)

## 💡 Development Tips

1. **Use Different Client IDs**: Always use separate OAuth client IDs for development and production
2. **Check Console Messages**: The application provides helpful error messages in the browser console
3. **Environment-Specific Configuration**: Keep development and production settings separate
4. **Test Locally First**: Always test authentication flows locally before deploying

## 🎯 Production Deployment

### Production OAuth Setup

Before deploying to production, you need to configure OAuth credentials for your production domain (`https://surfing.salty.vip`).

#### Google OAuth for Production

1. **Create Production OAuth Client ID**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project or create a new one
   - Enable the Google Identity API
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Select "Web application"
   - Add to "Authorized JavaScript origins":
     - `https://surfing.salty.vip`
   - Leave "Authorized redirect URIs" empty (not needed for One Tap)
   - Copy the generated Client ID

2. **Update Environment Variables**:

   ```bash
   # In your .env file (and production environment variables)
   PUBLIC_GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
   ```

3. **Test Production Configuration**:
   ```bash
   # Run the authentication test script
   node scripts/test-auth.mjs
   ```

#### Apple Sign In for Production (Optional)

If you want to enable Apple Sign In in production:

1. **Update Apple Developer Configuration**:
   - Go to [Apple Developer Portal](https://developer.apple.com/)
   - Update your Services ID configuration
   - Add production redirect URI: `https://surfing.salty.vip/auth/callback`

2. **Update Environment Variables**:
   ```bash
   PUBLIC_APPLE_REDIRECT_URI=https://surfing.salty.vip/auth/callback
   ```

### GitHub Actions Configuration

Environment variables are configured as GitHub repository secrets and automatically injected during builds:

**Required GitHub Secrets:**

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_GOOGLE_CLIENT_ID`
- `PUBLIC_APPLE_SERVICES_ID` (if Apple Sign In is enabled)
- `PUBLIC_APPLE_REDIRECT_URI` (if Apple Sign In is enabled)
- `PUBLIC_SENTRY_DSN` (if Sentry is enabled)
- `SENTRY_AUTH_TOKEN` (if Sentry source maps are needed)

**Setup GitHub Secrets:**

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each required secret

The GitHub Actions workflows (`.github/workflows/actions.yaml` and `.github/workflows/deploy.yml`) automatically inject these secrets during the build process.

### Cloudflare Pages Configuration

Environment variables for Cloudflare Pages deployment:

**Setup Cloudflare Pages Secrets:**

Using Wrangler CLI:

```bash
# Production environment
npx wrangler pages secret put PUBLIC_SUPABASE_URL --project-name surfing
npx wrangler pages secret put PUBLIC_SUPABASE_ANON_KEY --project-name surfing
npx wrangler pages secret put PUBLIC_GOOGLE_CLIENT_ID --project-name surfing
npx wrangler pages secret put PUBLIC_SENTRY_DSN --project-name surfing
npx wrangler pages secret put SENTRY_AUTH_TOKEN --project-name surfing

# List configured secrets
npx wrangler pages secret list --project-name surfing
```

Or via Cloudflare Dashboard:

1. Log into Cloudflare dashboard
2. Go to Pages > surfing project
3. Navigate to Settings > Environment variables
4. Add variables for both Production and Preview environments

### Production Checklist

When deploying to production:

1. ✅ Update OAuth client IDs with production domains
2. ✅ Update Apple Developer configuration with production URLs (if enabled)
3. ✅ Configure GitHub repository secrets
4. ✅ Configure Cloudflare Pages environment variables
5. ✅ Test authentication flows on the production domain
6. ✅ Configure HTTPS (required for Apple Sign In)
7. ✅ Verify Sentry error tracking is working (if enabled)

---

**Need Help?** Check the browser console for detailed error messages and setup instructions.
