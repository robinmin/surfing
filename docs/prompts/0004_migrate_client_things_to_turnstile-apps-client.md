---
name: Migrate Client Code to turnstile-apps-client
description: Migrate Surfing's Stripe/Zitadel/Turnstile client code to shared @turnstile/client package using npm workspaces
status: Done
created_at: 2026-01-08 12:31:33
updated_at: 2026-01-09 22:16:24
---

## Migrate Client Code to turnstile-apps-client

### Background

The Surfing project has implemented client-side code for communicating with Stripe, Zitadel (OIDC auth), and Turnstile API. To support multiple applications with the same infrastructure, we need to extract this into a reusable package.

The Turnstile monorepo already has a `@turnstile_src/packages/client` package with base API client infrastructure (`base.ts`, `client.ts`, `types.ts`, `index.ts`).

**User decisions made:**

- Package stays in Turnstile monorepo (not published separately)
- Create generic checkout client for reuse
- Use npm workspaces for linking (not symlinks)
- **Build-time config generation** - Fetch config from Turnstile API at build time (NEW, approved)

### Requirements / Objectives

**Completed Analysis:**

1. **Code Review of `src/lib/`:**
   - `zitadel-auth.ts` - ✅ Migrate fully (OIDC auth, PKCE, popup, role extraction)
   - `auth-sync.ts` - ✅ Migrate fully (cross-tab BroadcastChannel sync)
   - `auth-provider.ts` - ✅ Migrate fully (generic provider interface)
   - `subscription.ts` - ⚠️ Partially migrate (generic utilities yes, Surfing roles no)
   - `env.ts` - ❌ Keep in Surfing (app-specific config)

2. **Migration approach:**
   - Create modular structure: `auth/`, `subscription/`, `checkout/`
   - Make code generic (configurable) rather than hardcoded to Surfing
   - Use TypeScript `compilerOptions.paths` for package resolution (cleaner than symlinks)
   - Configure `@turnstile/client` path mapping in `tsconfig.json`

3. **Surfing adaptation:**
   - Replace direct fetch with checkout client
   - Keep Surfing-specific roles (`surfing-free`, `surfing-standard`, `surfing-premium`)
   - Re-export from `@turnstile/client` for backward compatibility

### Solutions / Goals

#### Architecture Overview

```
turnstile_src/packages/client/
├── src/
│   ├── base.ts              # BaseApiClient (existing, do NOT modify)
│   ├── auth/                # NEW: Authentication module
│   │   ├── oidc.ts          # Generic OIDC/Zitadel client
│   │   ├── sync.ts          # Cross-tab session sync
│   │   ├── providers.ts     # Generic provider interface
│   │   └── index.ts
│   ├── subscription/        # NEW: Subscription utilities
│   │   ├── types.ts         # Generic types (tier, status, roles)
│   │   ├── access.ts        # Role-based access control
│   │   └── index.ts
│   ├── checkout/            # NEW: Checkout clients
│   │   ├── admin.ts         # Admin checkout (existing client.ts)
│   │   ├── customer.ts      # NEW: Customer checkout API
│   │   └── index.ts
│   ├── types.ts             # Existing types
│   └── index.ts             # Main exports
```

#### Core Components

**Auth Module (`auth/`):**

- Generic OIDC authentication with `oidc-client-ts`
- PKCE flow for static sites
- Popup-based auth
- Role extraction from JWT (supports `flatRolesClaim` and Zitadel project roles)
- Cross-tab sync via BroadcastChannel

**Subscription Module (`subscription/`):**

- Generic subscription types (tier, status, billing cycle)
- Configurable role hierarchy
- Access control utilities (`hasAccess`, `hasRole`, `getSubscriptionFromRoles`)
- App passes its own config (role names, mappings)

**Checkout Module (`checkout/`):**

- `TurnstileAdminClient` - Admin checkout API (existing)
- `TurnstileCustomerClient` - NEW: Customer checkout API (`/api/checkout/session`, `/api/checkout/portal`)
- Both extend `BaseApiClient`

#### Data Model

```typescript
// Generic subscription types (app defines values)
export type SubscriptionTier = string;
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'expired' | 'pending';

export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingCycle?: 'monthly' | 'yearly' | 'lifetime';
}

export interface SubscriptionConfig {
  roleHierarchy: { [role: string]: number }; // Higher = higher tier
  roleToTierMapping: { [role: string]: SubscriptionTier };
  defaultRole: string;
}
```

#### API / Interface Design

**Auth exports:**

```typescript
export { signInPopup, getUser, getCurrentSession, isAuthenticated } from './auth/oidc';
export { initAuthSync, onAuthSync } from './auth/sync';
```

**Subscription exports:**

```typescript
export { hasAccess, hasRole, getSubscriptionFromRoles } from './subscription/access';
export type { UserSubscription, SubscriptionConfig } from './subscription/types';
```

**Checkout exports:**

```typescript
export { TurnstileAdminClient } from './checkout/admin';
export { TurnstileCustomerClient } from './checkout/customer';
```

#### Key Implementation Details

- **Configurable channel names** for auth sync (not hardcoded)
- **Generic role hierarchy** - apps define their own roles and tiers
- **TypeScript path mapping** - Use `compilerOptions.paths` for `@turnstile/client` resolution
- **Backward compatibility** - Surfing can re-export for smooth migration
- **Type-safe** - full TypeScript support

**TypeScript Configuration:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@turnstile/client": ["turnstile_src/packages/client/src/index.ts"],
      "@turnstile/client/*": ["turnstile_src/packages/client/src/*/index.ts", "turnstile_src/packages/client/src/*"]
    }
  },
  "exclude": ["dist/", "zitadel_src/", "turnstile_src/"]
}
```

**Import Usage:**

```typescript
// In Surfing code
import { initOIDC, signInPopup } from '@turnstile/client/auth/oidc';
import { hasAccess, getSubscriptionFromRoles } from '@turnstile/client/subscription/access';
```

#### Edge Cases Handled

- Multiple browsers (BroadcastChannel fallback to storage events)
- Popup blocking (fallback to redirect)
- Token expiration (auto-renewal)
- Role hierarchy conflicts (highest tier wins)
- Unauthenticated users (default role)

#### Implementation Plan

**Phase 1: Create Auth Module** [Complexity: Low]

- Create `auth/oidc.ts` from `src/lib/zitadel-auth.ts` (make generic)
- Create `auth/sync.ts` from `src/lib/auth-sync.ts` (configurable channels)
- Create `auth/providers.ts` from `src/lib/auth-provider.ts`
- Create `auth/index.ts` exports

**Phase 2: Create Subscription Module** [Complexity: Medium]

- Create `subscription/types.ts` with generic types
- Create `subscription/access.ts` with configurable utilities
- Create `subscription/index.ts` exports

**Phase 3: Create Checkout Module** [Complexity: Low]

- Create `checkout/customer.ts` for customer checkout API
- Move `client.ts` to `checkout/admin.ts`
- Create `checkout/index.ts` exports

**Phase 4: Update Main Entry Point** [Complexity: Low]

- Update `src/index.ts` to export all modules
- Clean API surface

**Phase 5: Configure TypeScript Path Mapping** [Complexity: Low]

- Update `tsconfig.json` in Surfing to add path mappings
- Configure `@turnstile/client` and `@turnstile/client/*` paths
- Add `turnstile_src/` to exclude list (prevents type checking of package source)
- Update imports in Surfing to use `@turnstile/client` package name

**Example tsconfig.json:**

```json
{
  "compilerOptions": {
    "paths": {
      "@turnstile/client": ["turnstile_src/packages/client/src/index.ts"],
      "@turnstile/client/*": ["turnstile_src/packages/client/src/*/index.ts", "turnstile_src/packages/client/src/*"]
    }
  },
  "exclude": ["dist/", "zitadel_src/", "turnstile_src/"]
}
```

**Phase 5.5: Build-Time Config Generation** [Complexity: Medium] (NEW)

- Create Turnstile API endpoint: `/api/config/app/:applicationId`
- Create build script: `scripts/fetch-turnstile-config.mjs`
- Update Astro config with buildStart hook
- Add environment variables (PUBLIC_APPLICATION_ID, TURNSTILE_BUILD_TOKEN)

**Phase 6: Migrate Surfing** [Complexity: Medium]

- Update imports in `src/lib/zitadel-auth.ts` to use `@turnstile/client/auth/*`
- Update imports in `src/lib/auth-provider.ts` to use `@turnstile/client/auth/providers`
- Update imports in `src/lib/auth-sync.ts` to use `@turnstile/client/auth/sync`
- Update imports in `src/lib/subscription.ts` to use `@turnstile/client/subscription/*`
- Update `src/lib/turnstile-config/generated.config.ts` to import from `@turnstile/client`
- Import generated config from `~/lib/turnstile-config/generated.config.ts`
- Refactor `src/lib/subscription.ts` to use generated config
- Update `src/pages/pricing.astro` (use checkout client + generated price IDs)

**Phase 7: Testing & Validation** [Complexity: Medium]

- Build both projects
- Type check
- Runtime tests (login, checkout, access control)
- Integration test (full flow)

### References

- Plan file: `/Users/robin/.claude/plans/vivid-tumbling-snail.md`
- Turnstile client: `turnstile_src/packages/client/`
- Surfing lib: `src/lib/`
