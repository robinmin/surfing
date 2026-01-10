---
name: add Subscription-Based membership mechanism support
description: Implement 3-tier subscription membership (Free/Standard/Premium) with Stripe billing, Zitadel user metadata, and turnstile webhook integration
status: Done
created_at: 2026-01-07 12:50:50
updated_at: 2026-01-09 22:16:36
---

## add Subscription-Based membership mechanism support

### Background

As we already integrated the OIDC login mechanism, and also we already developed turnstile which is a integration platform to integrate with various services including zitadel and stripe and etc, we can now add a subscription-based membership mechanism to support different types of subscriptions such as monthly, yearly, and lifetime for current website surfing.

I need to implement a subscription-based membership mechanism that allows users to subscribe to different types of subscriptions such as monthly, yearly, and lifetime. This mechanism should be integrated with the existing OIDC login mechanism and stripe. Under the hood, I will use turnstile to integrate and manage them at the backend.

I need to make the subscription-based membership simple and clear.

No coding before we have a solution solution and structure designing.

### Requirements / Objectives

#### Original Requirements

- Refer to the following resources to design the subscription-based membership mechanism and membership structure
- Implement a new Pricing page as the landing page for subscription-based membership, and add into the navigation bar of surfing
- Work out a operation document for subscription-based membership configuration in stripe into `docs/prompts/0002/subscription-based-membership.md`
- Work out a tasks document for turnstile to integrate and manage subscription-based membership at the backend automatically based on stripe and zitadel's webhook events processing

#### Refined Requirements (from Discovery Interview)

**Membership Tiers:**

| Tier         | Price (Monthly) | Price (Yearly) | Price (Lifetime) | Features                                          |
| ------------ | --------------- | -------------- | ---------------- | ------------------------------------------------- |
| **Free**     | $0              | $0             | $0               | Public articles, cheatsheet viewing (no download) |
| **Standard** | $5/mo           | $50/yr         | $150             | + Premium articles, cheatsheet PDF downloads      |
| **Premium**  | $15/mo          | $150/yr        | $400             | + Priority access, API access, exclusive content  |

**Content Gating:**

- Premium articles: Accessible to Standard and Premium tiers
- Cheatsheet downloads: Available to Standard and Premium tiers
- API access: Premium tier only
- Exclusive content: Premium tier only

**Authentication Flow:**

- Pricing page is publicly accessible (no login required)
- Login required before initiating Stripe Checkout
- User must be authenticated to subscribe

**Technical Architecture:**

- Stripe handles payments and subscription lifecycle
- Turnstile processes Stripe webhooks and syncs to Zitadel
- Zitadel stores subscription metadata in user profile
- Surfing reads subscription tier from ID token claims
- Subscription status included via `urn:zitadel:iam:user:metadata` scope

### Solutions / Goals

#### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SUBSCRIPTION ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Surfing   │     │   Stripe    │     │  Turnstile  │     │   Zitadel   │
│  (Frontend) │     │  (Billing)  │     │  (Backend)  │     │   (Auth)    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │ 1. Display        │                   │                   │
       │    Pricing        │                   │                   │
       │◄──────────────────┤                   │                   │
       │                   │                   │                   │
       │ 2. User clicks    │                   │                   │
       │    Subscribe      │                   │                   │
       ├──────────────────►│                   │                   │
       │                   │                   │                   │
       │ 3. Checkout       │                   │                   │
       │    completes      │                   │                   │
       │                   ├──────────────────►│                   │
       │                   │  4. Webhook       │                   │
       │                   │                   │                   │
       │                   │                   ├──────────────────►│
       │                   │                   │  5. Update        │
       │                   │                   │     metadata      │
       │                   │                   │                   │
       │◄──────────────────┼───────────────────┼───────────────────┤
       │                   │                   │  6. Token with    │
       │                   │                   │     tier claim    │
       │                   │                   │                   │
       │ 7. Gate content   │                   │                   │
       │    based on tier  │                   │                   │
       ▼                   ▼                   ▼                   ▼
```

#### Core Components

1. **Surfing Frontend (This Repository)**
   - New `/pricing` page using existing `Pricing.astro` widget
   - Navigation bar update to include Pricing link
   - Subscription status reading from Zitadel token
   - Content gating logic for premium articles and downloads

2. **Stripe (SaaS)**
   - 2 Products: Standard, Premium
   - 6 Prices: Monthly/Yearly/Lifetime for each product
   - Features for entitlement tracking
   - Customer Portal for subscription management
   - Checkout Sessions for payment processing

3. **Turnstile (Backend Service)**
   - Webhook endpoint for Stripe events
   - Zitadel API client for metadata updates
   - Event logging and idempotency handling
   - User-to-customer ID mapping

4. **Zitadel (Identity Provider)**
   - User metadata storage for subscription info
   - ID token with subscription claims
   - Service user for turnstile API access

#### Data Model

**Zitadel User Metadata Schema:**

```json
{
  "subscription": {
    "tier": "standard",
    "status": "active",
    "billing_cycle": "monthly",
    "stripe_customer_id": "cus_xxx",
    "stripe_subscription_id": "sub_xxx",
    "current_period_end": "2025-02-07T00:00:00Z",
    "cancel_at_period_end": false,
    "updated_at": "2025-01-07T12:00:00Z"
  }
}
```

**Surfing Frontend Subscription Interface:**

```typescript
interface UserSubscription {
  tier: 'free' | 'standard' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'expired';
  billingCycle?: 'monthly' | 'yearly' | 'lifetime';
  expiresAt?: Date;
}
```

#### API / Interface Design

**Pricing Page Data Structure:**

```typescript
const pricingData = {
  tiers: [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0, lifetime: 0 },
      features: ['Public articles', 'Cheatsheet viewing'],
      cta: { text: 'Get Started', href: '/auth/login' },
    },
    {
      name: 'Standard',
      price: { monthly: 5, yearly: 50, lifetime: 150 },
      features: ['Everything in Free', 'Premium articles', 'Cheatsheet downloads'],
      cta: { text: 'Subscribe', action: 'checkout' },
      highlighted: true,
    },
    {
      name: 'Premium',
      price: { monthly: 15, yearly: 150, lifetime: 400 },
      features: ['Everything in Standard', 'Priority access', 'API access', 'Exclusive content'],
      cta: { text: 'Go Premium', action: 'checkout' },
    },
  ],
};
```

**Checkout Flow:**

1. User clicks Subscribe on Pricing page
2. If not logged in → Redirect to Zitadel login
3. After login → Create Stripe Checkout Session via turnstile API
4. User completes payment in Stripe Checkout
5. Stripe sends webhook to turnstile
6. Turnstile updates Zitadel user metadata
7. User's next token includes subscription tier

#### Key Implementation Details

**Token-Based Subscription Check (Client-Side):**

```typescript
// In src/lib/subscription.ts
export function getSubscriptionFromToken(user: User): UserSubscription {
  const metadata = user.profile['urn:zitadel:iam:user:metadata'];

  if (!metadata?.subscription) {
    return { tier: 'free', status: 'active' };
  }

  // Decode base64 values from Zitadel metadata
  const subscription = JSON.parse(atob(metadata.subscription));
  return {
    tier: subscription.tier || 'free',
    status: subscription.status || 'active',
    billingCycle: subscription.billing_cycle,
    expiresAt: subscription.current_period_end ? new Date(subscription.current_period_end) : undefined,
  };
}

export function hasAccess(userTier: string, requiredTier: 'standard' | 'premium'): boolean {
  const tierOrder = { free: 0, standard: 1, premium: 2 };
  return tierOrder[userTier] >= tierOrder[requiredTier];
}
```

**Content Gating in Astro:**

```astro
---
// In article page
import { getCurrentSession } from '~/lib/zitadel-auth';
import { getSubscriptionFromToken, hasAccess } from '~/lib/subscription';

const session = await getCurrentSession();
const subscription = session ? getSubscriptionFromToken(session.user) : { tier: 'free' };
const canAccessPremium = hasAccess(subscription.tier, 'standard');

// Article frontmatter indicates if premium
const isPremiumArticle = article.data.premium === true;
const showContent = !isPremiumArticle || canAccessPremium;
---

{showContent ? <article>{/* Full content */}</article> : <PremiumGate requiredTier="standard" />}
```

#### Edge Cases Handled

1. **User already subscribed**: Show "Manage Subscription" instead of "Subscribe"
2. **Subscription expired**: Downgrade to Free, show renewal prompt
3. **Payment failed**: Keep access during grace period, show warning
4. **Lifetime users**: Never expire, ignore subscription deletion events
5. **Plan upgrade/downgrade**: Immediate access change on upgrade, end-of-period on downgrade
6. **Not logged in on Pricing page**: Show prices, CTA goes to login first

#### Deliverables

1. **Documentation (Complete):**
   - ✅ `docs/prompts/0002/subscription-based-membership.md` - Stripe configuration guide
   - ✅ `docs/prompts/0002/turnstile-integration-tasks.md` - Turnstile webhook tasks

2. **Surfing Frontend (To Implement):**
   - [ ] `/pricing` page with tier comparison
   - [ ] Navigation bar update
   - [ ] Subscription utility functions
   - [ ] Content gating components
   - [ ] Checkout initiation flow

3. **Turnstile Backend (Separate Project):**
   - [ ] Stripe webhook handlers
   - [ ] Zitadel metadata sync
   - [ ] Checkout session creation API

4. **Zitadel Configuration:**
   - [ ] Enable user metadata in ID token
   - [ ] Create turnstile service user
   - [ ] Configure Actions (optional)

---

### Implementation Plan

#### Phase 1: Documentation & Design [Complexity: Low] ✅

**Goal**: Complete design documentation

- [x] Analyze requirements through discovery interview
- [x] Design subscription tier structure
- [x] Create Stripe configuration operations document
- [x] Create turnstile integration tasks document
- [x] Document data models and interfaces

**Deliverable**: Complete documentation in `docs/prompts/0002/`

---

#### Phase 2: Zitadel Configuration [Complexity: Low]

**Goal**: Prepare Zitadel for subscription metadata

- [x] Enable "User Info inside ID Token" for Surfing application
- [x] Verify `urn:zitadel:iam:user:metadata` scope works
- [x] Create turnstile service user with API key
- [x] Grant service user ORG_USER_MANAGER role
- [x] Test metadata read/write via Management API

**Deliverable**: Zitadel configured and tested for metadata storage
**Dependencies**: Zitadel admin access

---

#### Phase 3: Stripe Configuration [Complexity: Low]

**Goal**: Set up Stripe products and prices

- [ ] Create "Surfing Standard" product with 3 prices
- [ ] Create "Surfing Premium" product with 3 prices
- [ ] Create entitlement features
- [ ] Associate features with products
- [ ] Configure Customer Portal
- [ ] Set up webhook endpoint (pointing to turnstile)
- [ ] Record all Price IDs in configuration

**Deliverable**: Stripe fully configured in test mode
**Dependencies**: Stripe account access

---

#### Phase 4: Surfing Frontend - Pricing Page [Complexity: Medium] ✅

**Goal**: Implement the Pricing page

- [x] Create `src/pages/pricing.astro`
- [x] Add pricing data with tier information
- [x] Add billing cycle toggle (Monthly/Yearly/Lifetime)
- [x] Add "Current Plan" indicator for logged-in users
- [x] Implement checkout button logic (login check)
- [x] Add i18n translations for pricing content
- [x] Update `src/navigation.ts` to include Pricing link

**Deliverable**: Working Pricing page at `/pricing`
**Dependencies**: Phase 1 complete

---

#### Phase 5: Surfing Frontend - Subscription Utilities [Complexity: Medium] ✅

**Goal**: Implement subscription reading and gating

- [x] Create `src/lib/subscription.ts` with utility functions
- [x] Update `src/lib/zitadel-auth.ts` to include metadata scope
- [x] Create `PremiumGate.astro` component for content gating
- [x] Create `SubscriptionBadge.astro` for showing user tier
- [x] Update article schema to support `premium: boolean` field
- [x] Add download gating for cheatsheets (`CheatsheetDownload.astro`)

**Deliverable**: Subscription-aware frontend components
**Dependencies**: Phase 2, Phase 4

---

#### Phase 6: Turnstile Backend - Webhook Handlers [Complexity: High] ✅

**Goal**: Process Stripe webhooks and sync to Zitadel

**Note**: Turnstile already has comprehensive subscription infrastructure in place:

- [x] Webhook endpoint `/webhooks/stripe` exists (`apps/api/src/controllers/webhook.controller.ts`)
- [x] Signature verification implemented via `StripeClient.verifyWebhookSignature()`
- [x] Handle `checkout.session.completed` via `CheckoutSessionEvent`
- [x] Handle `customer.subscription.updated` via `SubscriptionEvent.cmd_updated()`
- [x] Handle `customer.subscription.deleted` via `SubscriptionEvent.cmd_deleted()`
- [x] Handle `invoice.payment_failed` via `InvoiceEvent`
- [x] Zitadel API client implemented (`ZitadelClient` in `vendor/zitadel`)
- [x] Event logging via `initLogger()` and Axiom integration
- [x] Idempotency via `WebhookService.handleWebhook()` duplicate detection

**Key Files**:

- `packages/core/src/services/event-pipeline/subscription/subscription.event.ts`
- `packages/core/src/services/subscription.service.ts`
- `packages/core/src/utils/subscription.ts`

**Deliverable**: Turnstile processing Stripe webhooks ✅
**Dependencies**: Phase 2, Phase 3

---

#### Phase 7: Turnstile Backend - Checkout API [Complexity: Medium] ✅

**Goal**: Create checkout sessions for Surfing

**Note**: Turnstile already has checkout infrastructure:

- [x] Endpoint `/admin/checkout/create` exists (`apps/api/src/controllers/checkout.controller.ts`)
- [x] Accepts `priceId`, `successUrl`, `cancelUrl`, `tier`
- [x] Creates Stripe Checkout Session with `clientReferenceId` for user tracking
- [x] Returns checkout URL to frontend
- [x] Validation via Zod schema
- [x] Customer portal via `/admin/checkout/portal`

**Surfing Integration**:

- Set `PUBLIC_TURNSTILE_API_URL` environment variable
- Pricing page calls `${TURNSTILE_API_URL}/admin/checkout/create`
- Auth middleware validates JWT before checkout

**Deliverable**: API for creating checkout sessions ✅
**Dependencies**: Phase 3, Phase 6

---

#### Phase 8: Integration Testing [Complexity: Medium]

**Goal**: End-to-end testing of subscription flow

- [ ] Test new subscription purchase (all tiers/cycles)
- [ ] Test upgrade from Standard to Premium
- [ ] Test subscription cancellation
- [ ] Test payment failure handling
- [ ] Test lifetime purchase
- [ ] Test content gating with different tiers
- [ ] Test token refresh after subscription change

**Deliverable**: Verified subscription system
**Dependencies**: All previous phases

---

#### Phase 9: Production Deployment [Complexity: Low]

**Goal**: Deploy to production

- [ ] Switch Stripe to live mode
- [ ] Update webhook endpoint to production URL
- [ ] Configure production environment variables
- [ ] Verify live payment flow with small amount
- [ ] Monitor webhook delivery and processing

**Deliverable**: Live subscription system
**Dependencies**: Phase 8

---

### References

- [Stripe Subscriptions Documentation](https://docs.stripe.com/subscriptions)
- [Stripe Build Subscriptions Integration](https://docs.stripe.com/billing/subscriptions/build-subscriptions)
- [Zitadel User Metadata Guide](https://zitadel.com/docs/guides/manage/customize/user-metadata)
- [Zitadel Custom Claims](https://zitadel.com/docs/apis/openidoauth/claims)
- [Building Membership Websites: Strategy and Design](https://wpusermanager.com/tutorials/building-membership-websites-the-strategy-and-design-phase-with-examples/)
- [3 Main Types of Memberships](https://membersolutions.com/types-of-memberships/)

### Related Documents

- [Stripe Configuration Operations](./0002/subscription-based-membership.md)
- [Turnstile Integration Tasks](./0002/turnstile-integration-tasks.md)
