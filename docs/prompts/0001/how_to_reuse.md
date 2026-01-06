# Reusable Zitadel OIDC Authentication for Astro 5.0+ Static Sites

This document describes how to reuse the Zitadel OIDC authentication solution across multiple Astro 5.0+ static websites deployed to Cloudflare Pages via GitHub Actions.

## Solution Overview

| Feature | Implementation |
|---------|----------------|
| **Auth Library** | `oidc-client-ts` (client-side OIDC) |
| **Auth Backend** | Zitadel (unified identity provider) |
| **Flow** | Authorization Code + PKCE (popup-based) |
| **Site Type** | Static (`output: 'static'`) |
| **Deployment** | Cloudflare Pages via GitHub Actions |
| **Providers** | Google, GitHub, Apple, Microsoft |

## Files to Copy

Copy these files to your new Astro project:

### Core Auth Files (Required)

```
src/
├── lib/
│   ├── zitadel-auth.ts      # OIDC client wrapper
│   └── auth-sync.ts         # Cross-tab synchronization
├── pages/
│   └── auth/
│       └── callback.astro   # OAuth callback handler
└── components/
    └── auth/
        ├── AuthAvatar.astro     # Main auth UI component
        ├── LoginPopupMenu.astro # Provider selection menu
        └── UserMenu.astro       # Logged-in user menu
```

### Configuration Files (Modify for your project)

```
.env.example                 # Environment variable template
.github/workflows/deploy.yml # GitHub Actions workflow
src/config.yaml              # Site configuration (auth section)
```

### Translation Files (Required if using i18n)

Add these keys to your i18n translations:

```typescript
auth: {
  signIn: 'Sign In',
  signOut: 'Sign Out',
  signInWith: 'Sign in with',
  signInWithGoogle: 'Sign in with Google',
  signInWithApple: 'Sign in with Apple',
  signInWithGitHub: 'Sign in with GitHub',
  signInWithMicrosoft: 'Sign in with Microsoft',
  userMenu: 'User menu',
  loading: 'Loading...',
  profile: 'Profile',
  account: 'Account',
  settings: 'Settings',
  oneClickLogin: 'One Click Login',
  signedInAs: 'Signed in as',
  welcomeBack: 'Welcome back',
}
```

## Dependencies

Install the required npm package:

```bash
npm install oidc-client-ts
```

Also requires (likely already in your Astro project):
- `astro-icon` - For provider icons (tabler icons)
- `tailwind-merge` - For CSS class merging (if using Tailwind)

## Configuration Steps

### 1. Zitadel Setup (One-time per project)

1. **Create PKCE Application** in Zitadel Console:
   - Application Type: `User Agent` or `Native`
   - Authentication Method: `PKCE` (no client secret)
   - Redirect URI: `https://your-domain.com/auth/callback`
   - Post-logout URI: `https://your-domain.com`

2. **Note the IdP IDs** for each federated provider (Google, GitHub, Apple, Microsoft)

### 2. Environment Variables

Create `.env` file with:

```bash
# Required
PUBLIC_ZITADEL_AUTHORITY="https://your-instance.zitadel.cloud"
PUBLIC_ZITADEL_CLIENT_ID="your-pkce-client-id"

# Required for user organization assignment
PUBLIC_ZITADEL_ORG_ID="your-organization-id"

# Optional (have sensible defaults)
PUBLIC_ZITADEL_REDIRECT_URI="https://your-domain.com/auth/callback"
PUBLIC_ZITADEL_POST_LOGOUT_URI="https://your-domain.com"

# Optional (for direct IdP login)
PUBLIC_ZITADEL_IDP_GOOGLE="google-idp-id"
PUBLIC_ZITADEL_IDP_GITHUB="github-idp-id"
PUBLIC_ZITADEL_IDP_APPLE="apple-idp-id"
PUBLIC_ZITADEL_IDP_MICROSOFT="microsoft-idp-id"
```

### 3. GitHub Secrets

Add secrets to your GitHub repository:

```bash
gh secret set PUBLIC_ZITADEL_AUTHORITY --body "https://your-instance.zitadel.cloud"
gh secret set PUBLIC_ZITADEL_CLIENT_ID --body "your-client-id"
gh secret set PUBLIC_ZITADEL_ORG_ID --body "your-organization-id"
gh secret set PUBLIC_ZITADEL_REDIRECT_URI --body "https://your-domain.com/auth/callback"
gh secret set PUBLIC_ZITADEL_POST_LOGOUT_URI --body "https://your-domain.com"
gh secret set PUBLIC_ZITADEL_IDP_GOOGLE --body "google-idp-id"
gh secret set PUBLIC_ZITADEL_IDP_GITHUB --body "github-idp-id"
gh secret set PUBLIC_ZITADEL_IDP_APPLE --body "apple-idp-id"
gh secret set PUBLIC_ZITADEL_IDP_MICROSOFT --body "microsoft-idp-id"
```

### 4. GitHub Actions Workflow

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Build
  run: npm install && npm run build
  env:
    # Zitadel OIDC Authentication
    PUBLIC_ZITADEL_AUTHORITY: ${{ secrets.PUBLIC_ZITADEL_AUTHORITY }}
    PUBLIC_ZITADEL_CLIENT_ID: ${{ secrets.PUBLIC_ZITADEL_CLIENT_ID }}
    PUBLIC_ZITADEL_ORG_ID: ${{ secrets.PUBLIC_ZITADEL_ORG_ID }}
    PUBLIC_ZITADEL_REDIRECT_URI: ${{ secrets.PUBLIC_ZITADEL_REDIRECT_URI }}
    PUBLIC_ZITADEL_POST_LOGOUT_URI: ${{ secrets.PUBLIC_ZITADEL_POST_LOGOUT_URI }}
    PUBLIC_ZITADEL_IDP_GOOGLE: ${{ secrets.PUBLIC_ZITADEL_IDP_GOOGLE }}
    PUBLIC_ZITADEL_IDP_GITHUB: ${{ secrets.PUBLIC_ZITADEL_IDP_GITHUB }}
    PUBLIC_ZITADEL_IDP_APPLE: ${{ secrets.PUBLIC_ZITADEL_IDP_APPLE }}
    PUBLIC_ZITADEL_IDP_MICROSOFT: ${{ secrets.PUBLIC_ZITADEL_IDP_MICROSOFT }}
```

### 5. Add Auth Component to Layout

In your main layout or header:

```astro
---
import AuthAvatar from '~/components/auth/AuthAvatar.astro';
---

<header>
  <!-- Other header content -->
  <AuthAvatar isPrimary={true} />
</header>
```

**Important:** Only ONE AuthAvatar should have `isPrimary={true}` to prevent duplicate popup menus.

### 6. Update config.yaml

Add auth section to your `src/config.yaml`:

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

## Customization Options

### Disable Specific Providers

In `src/config.yaml`:

```yaml
auth:
  zitadel:
    providers:
      google: true
      github: true
      apple: false      # Disabled
      microsoft: false  # Disabled
```

Then update `LoginPopupMenu.astro` to filter providers based on config.

### Custom Styling

The components use Tailwind CSS classes. Modify these files for custom styling:
- `AuthAvatar.astro` - Avatar button appearance
- `LoginPopupMenu.astro` - Provider button styles
- `UserMenu.astro` - Logged-in user dropdown

### Multi-Site Same Zitadel Instance

For multiple sites sharing one Zitadel instance:
1. Create one PKCE application per site in Zitadel
2. Each site gets its own Client ID
3. All sites can use the same IdP IDs (federated providers are shared)

### Customize Cross-Tab Sync Channel

In `auth-sync.ts`, update these constants to be unique per project:

```typescript
const AUTH_SYNC_CHANNEL = 'yourproject_auth_sync';
const AUTH_STATE_KEY = 'yourproject_auth_state';
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Astro Site                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ AuthAvatar  │──│LoginPopupMenu│──│ zitadel-auth.ts   │  │
│  └─────────────┘  └──────────────┘  └─────────┬─────────┘  │
│         │                                      │            │
│  ┌──────┴───────┐                   ┌─────────┴─────────┐  │
│  │   UserMenu   │                   │  oidc-client-ts   │  │
│  └──────────────┘                   └─────────┬─────────┘  │
└───────────────────────────────────────────────┼─────────────┘
                                                │
                    ┌───────────────────────────┴───────────┐
                    │           Zitadel Instance            │
                    │  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
                    │  │ Google  │ │ GitHub  │ │  Apple  │ │
                    │  └─────────┘ └─────────┘ └─────────┘ │
                    │  ┌─────────┐                         │
                    │  │Microsoft│                         │
                    │  └─────────┘                         │
                    └───────────────────────────────────────┘
```

## Checklist for New Project

- [ ] Install `oidc-client-ts` package
- [ ] Copy auth files (lib, components, pages)
- [ ] Add translation keys to i18n
- [ ] Create Zitadel PKCE application
- [ ] Configure environment variables
- [ ] Add GitHub secrets
- [ ] Update GitHub Actions workflow
- [ ] Add AuthAvatar to layout
- [ ] Update config.yaml
- [ ] Test login with each provider

## Security Considerations

- Uses PKCE (no client secrets in browser)
- Tokens stored in localStorage (acceptable for SPAs)
- Origin validation for postMessage
- CSRF protection via PKCE state parameter

See `docs/SECURITY_AUDIT_OIDC.md` for detailed security analysis.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Popup blocked | Falls back to redirect automatically |
| "Configuration incomplete" | Check `PUBLIC_ZITADEL_AUTHORITY` and `PUBLIC_ZITADEL_CLIENT_ID` |
| Invalid redirect URI | Ensure URI in Zitadel matches exactly |
| Silent renewal fails | Check `offline_access` scope in Zitadel |
| Cross-tab sync not working | Check browser BroadcastChannel support |

## Related Documentation

- [Zitadel OIDC Guide](https://zitadel.com/docs/guides/integrate/login/oidc)
- [oidc-client-ts Docs](https://authts.github.io/oidc-client-ts/)
- [Astro Static Output](https://docs.astro.build/en/guides/server-side-rendering/)
