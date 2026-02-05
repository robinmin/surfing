---
name: debug and fix issue with subscription checkout
description: Investigate and fix the API error preventing checkout initiation on the pricing page.
status: TODO
current_phase: 0
verify_cmd: bun run check
impl_progress:
  phase_1: pending
created_at: 2026-01-10
updated_at: 2026-01-10
---

## Debug and Fix Issue with Subscription Checkout

### Background
The "Subscribe" button on the pricing page fails to initiate a checkout session. Instead of redirecting to the payment page, it throws an API error. This issue was observed during local development (`localhost:4321`) while pointing to the production Turnstile API (`https://turnstile-api.gobing.ai`).

### Symptoms
- User clicks "Subscribe" (or any paid tier button).
- Alert box appears: `Unable to start checkout. API Error (Status Code): Error Text`.
- No redirection occurs.

### Potential Causes
1. **CORS Policy**: The production API server might be blocking requests from `localhost`.
2. **Environment Mismatch**: `PUBLIC_TURNSTILE_API_URL` is set to production, but the user might be logged in with a local dev token (or vice versa), causing an Auth failure (401).
3. **API Endpoint Path**: Verify `POST /api/checkout/session` is the correct endpoint and accepts the current payload structure `{ tier, billingCycle }`.

### Objectives
1. **Identify Root Cause**: Get the exact HTTP status code and response text from the failure.
2. **Fix Environment/Configuration**:
    - If CORS: Update API CORS settings or use a local API proxy.
    - If Auth: Ensure the correct environment variables are used for dev vs prod.
3. **Verify Fix**: Ensure clicking "Subscribe" successfully redirects the user to the Stripe/Checkout URL.

### Tasks
- [ ] Reproduce the issue and capture the full error message/response.
- [ ] Check network tab for Preflight (OPTIONS) request status.
- [ ] Verify `PUBLIC_TURNSTILE_API_URL` in `.env` matches the active user session's authority.
- [ ] Test with a local instance of the API if necessary.
