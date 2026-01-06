# Zitadel OIDC Authentication Setup Guide

This guide explains how to configure Zitadel as the authentication provider for Surfing.

## Overview

Surfing uses Zitadel as a unified authentication backend with support for multiple identity providers:

- Google
- GitHub
- Apple
- Microsoft

The implementation uses **OIDC Authorization Code Flow with PKCE**, which is the recommended approach for single-page applications (SPAs) and static sites.

## Prerequisites

1. A Zitadel instance (cloud or self-hosted)
2. Admin access to configure applications and identity providers
3. The identity providers (Google, GitHub, Apple, Microsoft) already configured in Zitadel

## Step 1: Create a PKCE Application in Zitadel

1. Log in to your Zitadel Console
2. Navigate to **Projects** → Select your project (or create one)
3. Click **New Application**
4. Configure the application:
   - **Name:** `Surfing Web`
   - **Type:** `User Agent` (for SPAs/static sites)
   - **Authentication Method:** `PKCE` (not Basic or POST)

5. Configure redirect URIs:

   ```
   Redirect URIs:
   - https://surfing.salty.vip/auth/callback
   - http://localhost:4321/auth/callback (for development)

   Post Logout Redirect URIs:
   - https://surfing.salty.vip
   - http://localhost:4321 (for development)
   ```

6. Save the application and note the **Client ID**

## Step 2: Get Identity Provider IDs

For each federated identity provider configured in Zitadel, you need the IdP ID:

1. Go to **Settings** → **Identity Providers**
2. For each provider (Google, GitHub, Apple, Microsoft):
   - Click on the provider
   - Copy the **IdP ID** from the URL or details page

These IDs are used for the `idp_hint` parameter to skip the provider selection screen.

## Step 3: Configure Environment Variables

Create or update your `.env` file with the following variables:

```bash
# Zitadel OIDC Configuration
PUBLIC_ZITADEL_AUTHORITY="https://your-instance.zitadel.cloud"
PUBLIC_ZITADEL_CLIENT_ID="your-client-id-from-step-1"
PUBLIC_ZITADEL_REDIRECT_URI="https://surfing.salty.vip/auth/callback"
PUBLIC_ZITADEL_POST_LOGOUT_URI="https://surfing.salty.vip"

# Identity Provider Hints (optional but recommended)
PUBLIC_ZITADEL_IDP_GOOGLE="your-google-idp-id"
PUBLIC_ZITADEL_IDP_GITHUB="your-github-idp-id"
PUBLIC_ZITADEL_IDP_APPLE="your-apple-idp-id"
PUBLIC_ZITADEL_IDP_MICROSOFT="your-microsoft-idp-id"
```

### Development Configuration

For local development, use:

```bash
PUBLIC_ZITADEL_AUTHORITY="https://your-instance.zitadel.cloud"
PUBLIC_ZITADEL_CLIENT_ID="your-client-id"
PUBLIC_ZITADEL_REDIRECT_URI="http://localhost:4321/auth/callback"
PUBLIC_ZITADEL_POST_LOGOUT_URI="http://localhost:4321"
```

## Step 4: Verify Configuration

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to the site and click the avatar button

3. Select a login provider (e.g., Google)

4. You should see a popup window with the Zitadel login page

5. After successful authentication, the popup closes and you're logged in

## Authentication Flow

```
User clicks "Sign in with Google"
         │
         ▼
┌─────────────────────────────────┐
│  Popup window opens             │
│  → Zitadel authorization page   │
│  → idp_hint=google-idp-id       │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Zitadel redirects to Google    │
│  (federated authentication)     │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  User authenticates with Google │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Google redirects to Zitadel    │
│  Zitadel issues tokens          │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Redirect to /auth/callback     │
│  oidc-client-ts processes tokens│
│  Popup closes automatically     │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Main window updates UI         │
│  User is now authenticated      │
└─────────────────────────────────┘
```

## Token Storage

Tokens are stored in `localStorage` under keys managed by `oidc-client-ts`:

- `oidc.user:<authority>:<client_id>` - User session data

The library handles:

- Automatic token refresh (silent renewal)
- Token expiration detection
- Secure PKCE flow

## Troubleshooting

### Popup blocked

If the popup is blocked by the browser:

- The system automatically falls back to redirect mode
- Users may need to allow popups for the site

### "Zitadel configuration incomplete" error

Check that these environment variables are set:

- `PUBLIC_ZITADEL_AUTHORITY`
- `PUBLIC_ZITADEL_CLIENT_ID`

### "Invalid redirect URI" error

Ensure the redirect URI in your `.env` file exactly matches what's configured in Zitadel:

- Check for trailing slashes
- Check http vs https
- Check the port number for development

### Silent renewal fails

If token refresh fails silently:

1. Check that `offline_access` scope is allowed in Zitadel
2. Verify the application has refresh token grant enabled
3. Check browser console for specific errors

### Cross-tab sync not working

The auth state syncs across tabs using:

1. BroadcastChannel API (modern browsers)
2. localStorage events (fallback)

If sync isn't working, check browser compatibility.

## Security Considerations

See `docs/SECURITY_AUDIT_OIDC.md` for a comprehensive security review.

Key points:

- PKCE prevents authorization code interception
- No client secrets in browser code
- Origin validation for postMessage
- XSS prevention through safe DOM manipulation

## Configuration Reference

### src/config.yaml

```yaml
auth:
  zitadel:
    enabled: true
    providers:
      google: true
      github: true
      apple: true
      microsoft: true
    popup:
      width: 500
      height: 600
    silent_renewal: true
  token_cache_duration: 900
```

### Environment Variables

| Variable                         | Required | Description                                 |
| -------------------------------- | -------- | ------------------------------------------- |
| `PUBLIC_ZITADEL_AUTHORITY`       | Yes      | Zitadel instance URL                        |
| `PUBLIC_ZITADEL_CLIENT_ID`       | Yes      | PKCE application client ID                  |
| `PUBLIC_ZITADEL_REDIRECT_URI`    | No       | Callback URL (defaults to `/auth/callback`) |
| `PUBLIC_ZITADEL_POST_LOGOUT_URI` | No       | Post-logout URL (defaults to origin)        |
| `PUBLIC_ZITADEL_IDP_GOOGLE`      | No       | Google IdP ID for direct login              |
| `PUBLIC_ZITADEL_IDP_GITHUB`      | No       | GitHub IdP ID for direct login              |
| `PUBLIC_ZITADEL_IDP_APPLE`       | No       | Apple IdP ID for direct login               |
| `PUBLIC_ZITADEL_IDP_MICROSOFT`   | No       | Microsoft IdP ID for direct login           |

## Related Documentation

- [Zitadel OIDC Documentation](https://zitadel.com/docs/guides/integrate/login/oidc)
- [oidc-client-ts Documentation](https://authts.github.io/oidc-client-ts/)
- [OAuth 2.1 Specification](https://oauth.net/2.1/)
