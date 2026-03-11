# Review Findings (2026-03-11)

Scope: `surfing` (Astro 5 / Cloudflare Pages) + symlinked `vendor/turnstile-api` contract review for Stripe + Zitadel + Turnstile integration readiness.

## Critical

### 1) Checkout redirect broken due to API response shape mismatch
- Severity: `Critical`
- Impact:
  - Frontend expects top-level `url` from `/api/checkout/session`.
  - Backend returns wrapped payload as `{ data: { url } }`.
  - Result can set `window.location.href = undefined` and fail checkout start.
- Evidence:
  - [pricing.astro](/Users/robin/projects/surfing/src/pages/pricing.astro:600)
  - [pricing.astro](/Users/robin/projects/surfing/src/pages/pricing.astro:601)
  - [checkout.customer.controller.ts](/Users/robin/projects/surfing/vendor/turnstile-api/apps/api/src/controllers/checkout.customer.controller.ts:151)
  - [api-response.ts](/Users/robin/projects/surfing/vendor/turnstile-api/packages/core/src/utils/api-response.ts:12)

## High

### 2) Build-time Turnstile config fetch is disabled
- Severity: `High`
- Impact:
  - Config is never auto-synced from Turnstile API during build.
  - Drift risk between frontend assumptions and backend config.
- Evidence:
  - [astro.config.ts](/Users/robin/projects/surfing/astro.config.ts:296)
  - [astro.config.ts](/Users/robin/projects/surfing/astro.config.ts:297)

### 3) Config generator output path mismatch
- Severity: `High`
- Impact:
  - Script writes to `src/lib/turnstile/generated.config.ts`.
  - Repo currently uses `src/lib/turnstile-config/generated.config.ts`.
  - Generated output is effectively disconnected from checked-in file.
- Evidence:
  - [fetch-turnstile-config.mjs](/Users/robin/projects/surfing/scripts/fetch-turnstile-config.mjs:25)
  - [generated.config.ts](/Users/robin/projects/surfing/src/lib/turnstile-config/generated.config.ts:1)

### 4) Generated config currently placeholder with empty Stripe price IDs
- Severity: `High`
- Impact:
  - If this file is consumed for price mapping, checkout config is incomplete.
  - Increases risk of runtime failures or invalid pricing behavior.
- Evidence:
  - [generated.config.ts](/Users/robin/projects/surfing/src/lib/turnstile-config/generated.config.ts:26)
  - [generated.config.ts](/Users/robin/projects/surfing/src/lib/turnstile-config/generated.config.ts:33)

### 5) Type-check pipeline breaks with symlinked `vendor/turnstile-api`
- Severity: `High`
- Impact:
  - `tsconfig` includes `**/*`; `astro check` traverses vendored API/console/tests.
  - In this workspace it produces hundreds of errors and blocks quality gate.
- Evidence:
  - [tsconfig.json](/Users/robin/projects/surfing/tsconfig.json:16)
  - [package.json](/Users/robin/projects/surfing/package.json:16)

### 6) Existing Surfing app type errors block baseline checks
- Severity: `High`
- Impact:
  - Current project has local type errors unrelated to the new integration.
  - Prevents clean baseline before integration changes.
- Evidence:
  - [CodeBlockCopyFix.astro](/Users/robin/projects/surfing/src/components/common/CodeBlockCopyFix.astro:128)
  - [CodeBlockCopyFix.astro](/Users/robin/projects/surfing/src/components/common/CodeBlockCopyFix.astro:153)
  - [browse.astro](/Users/robin/projects/surfing/src/pages/browse.astro:328)
  - [browse.astro](/Users/robin/projects/surfing/src/pages/browse.astro:331)

## Medium

### 7) Free-tier CTA can call unsupported paid-checkout API path
- Severity: `Medium`
- Impact:
  - Frontend forwards button `tier` blindly.
  - Backend schema only accepts `standard | premium`.
  - Authenticated non-free users clicking free CTA can send unsupported payload and fail.
- Evidence:
  - [pricing.astro](/Users/robin/projects/surfing/src/pages/pricing.astro:549)
  - [checkout.customer.controller.ts](/Users/robin/projects/surfing/vendor/turnstile-api/apps/api/src/controllers/checkout.customer.controller.ts:21)

### 8) Build-token behavior/docs inconsistent for config fetch
- Severity: `Medium`
- Impact:
  - Script comments imply token optional in dev.
  - API denies unauthenticated requests unless `Origin` is allowlisted.
  - Node fetch from build scripts often sends no `Origin`, causing unexpected failures.
- Evidence:
  - [fetch-turnstile-config.mjs](/Users/robin/projects/surfing/scripts/fetch-turnstile-config.mjs:14)
  - [config.app.controller.ts](/Users/robin/projects/surfing/vendor/turnstile-api/apps/api/src/controllers/config.app.controller.ts:65)
  - [config.app.controller.ts](/Users/robin/projects/surfing/vendor/turnstile-api/apps/api/src/controllers/config.app.controller.ts:70)

### 9) `check` command is mutating and environment-dependent
- Severity: `Medium`
- Impact:
  - `check` runs sync script that `rsync --delete`s vendored client and formats files.
  - Validation step is not read-only; local state changes during checks.
  - Can introduce churn/noise and accidental drift.
- Evidence:
  - [sync-turnstile.sh](/Users/robin/projects/surfing/scripts/sync-turnstile.sh:23)
  - [sync-turnstile.sh](/Users/robin/projects/surfing/scripts/sync-turnstile.sh:26)
  - [package.json](/Users/robin/projects/surfing/package.json:16)

## Low

### 10) Generator import boundary violates project rule
- Severity: `Low`
- Impact:
  - Project rule says only `src/lib/turnstile-client.ts` imports `@turnstile/client`.
  - Generator emits direct `@turnstile/client` import in generated file.
  - Architectural inconsistency and maintenance risk.
- Evidence:
  - [turnstile-client.ts](/Users/robin/projects/surfing/src/lib/turnstile-client.ts:4)
  - [fetch-turnstile-config.mjs](/Users/robin/projects/surfing/scripts/fetch-turnstile-config.mjs:93)

### 11) Dead/legacy popup-menu logic remains in AuthAvatar
- Severity: `Low`
- Impact:
  - AuthAvatar script still references `[data-popup-menu]` and provider-button classes.
  - Current rendered tree only includes `UserMenu` path and redirect-based login.
  - Increases complexity and confusion; potential source of future regressions.
- Evidence:
  - [AuthAvatar.astro](/Users/robin/projects/surfing/src/components/auth/AuthAvatar.astro:144)
  - [AuthAvatar.astro](/Users/robin/projects/surfing/src/components/auth/AuthAvatar.astro:303)
  - [AuthAvatar.astro](/Users/robin/projects/surfing/src/components/auth/AuthAvatar.astro:4)

## Additional Context From Validation Run

- Command run during review: `bun run check`
- Result summary from this workspace:
  - Surfing code errors present.
  - Symlinked `vendor/turnstile-api` contributes large additional error volume under current include rules.
- Note:
  - `check` mutates local files in this repo via `scripts/sync-turnstile.sh` + formatting.
  - No reverts were applied during review.

## Resolution Status (Updated 2026-03-11)

- Fixed:
  - Finding 1 (checkout response parsing mismatch)
  - Finding 2 (build-time fetch disabled)
  - Finding 3 (generator output path mismatch)
  - Finding 5 (type-check scope polluted by symlinked backend)
  - Finding 6 (Surfing app type errors listed in review)
  - Finding 7 (free-tier CTA could hit paid checkout endpoint)
  - Finding 8 (build-token behavior mismatch for config fetch)
  - Finding 9 (`check` command mutating repo state)
  - Finding 10 (generator import boundary inconsistency)
  - Finding 11 (dead popup/login legacy logic in AuthAvatar)

- Pending external credential:
  - Finding 4 (generated config currently placeholder values): generation pipeline is fixed, but regenerating live values now requires a valid `TURNSTILE_BUILD_TOKEN` for `/api/config/app/:appId`.
