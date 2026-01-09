# Subscription-Based Membership: Stripe Configuration Operations Guide

This document provides step-by-step instructions for configuring Stripe to support the subscription-based membership system for Surfing.

## Table of Contents

1. [Overview](#overview)
2. [Stripe Product Structure](#stripe-product-structure)
3. [Step-by-Step Configuration](#step-by-step-configuration)
4. [Webhook Configuration](#webhook-configuration)
5. [Customer Portal Setup](#customer-portal-setup)
6. [Testing Checklist](#testing-checklist)

---

## Overview

### Membership Tiers

| Tier         | Features                                          | Monthly | Yearly  | Lifetime |
| ------------ | ------------------------------------------------- | ------- | ------- | -------- |
| **Free**     | Public articles, cheatsheet viewing (no download) | $0      | $0      | $0       |
| **Standard** | + Premium articles, cheatsheet downloads          | $5/mo   | $50/yr  | $150     |
| **Premium**  | + Priority access, API access, exclusive content  | $15/mo  | $150/yr | $400     |

### Architecture Flow

```
User → Surfing Pricing Page → Stripe Checkout → Stripe Webhook → Turnstile → Zitadel User Metadata
```

---

## Stripe Product Structure

### Products to Create

Create **2 Products** in Stripe (Free tier doesn't require a Stripe product):

#### Product 1: Surfing Standard

- **Name**: `Surfing Standard`
- **Description**: `Access premium articles and download cheatsheets`
- **Product ID** (metadata): `surfing_standard`

**Prices for Standard:**

| Price Name        | Amount  | Billing           | Stripe Price Type |
| ----------------- | ------- | ----------------- | ----------------- |
| Standard Monthly  | $5.00   | Monthly recurring | `recurring`       |
| Standard Yearly   | $50.00  | Yearly recurring  | `recurring`       |
| Standard Lifetime | $150.00 | One-time          | `one_time`        |

#### Product 2: Surfing Premium

- **Name**: `Surfing Premium`
- **Description**: `Full access with priority support, API access, and exclusive content`
- **Product ID** (metadata): `surfing_premium`

**Prices for Premium:**

| Price Name       | Amount  | Billing           | Stripe Price Type |
| ---------------- | ------- | ----------------- | ----------------- |
| Premium Monthly  | $15.00  | Monthly recurring | `recurring`       |
| Premium Yearly   | $150.00 | Yearly recurring  | `recurring`       |
| Premium Lifetime | $400.00 | One-time          | `one_time`        |

### Features (Entitlements)

Create these **Features** in Stripe for entitlement tracking:

| Feature Lookup Key     | Name                 | Description                                 |
| ---------------------- | -------------------- | ------------------------------------------- |
| `premium_articles`     | Premium Articles     | Access to premium/subscriber-only articles  |
| `cheatsheet_downloads` | Cheatsheet Downloads | Download cheatsheets as PDF                 |
| `priority_access`      | Priority Access      | Early access to new content and features    |
| `api_access`           | API Access           | Programmatic access to content via API      |
| `exclusive_content`    | Exclusive Content    | Access to exclusive subscriber-only content |

### Product-Feature Associations

| Product          | Features                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| Surfing Standard | `premium_articles`, `cheatsheet_downloads`                                                       |
| Surfing Premium  | `premium_articles`, `cheatsheet_downloads`, `priority_access`, `api_access`, `exclusive_content` |

---

## Step-by-Step Configuration

### Step 1: Create Products in Stripe Dashboard

1. Navigate to **Products** in Stripe Dashboard
2. Click **+ Add product**

**For Surfing Standard:**

```
Name: Surfing Standard
Description: Access premium articles and download cheatsheets
```

Add metadata:

```json
{
  "tier": "standard",
  "product_id": "surfing_standard"
}
```

**For Surfing Premium:**

```
Name: Surfing Premium
Description: Full access with priority support, API access, and exclusive content
```

Add metadata:

```json
{
  "tier": "premium",
  "product_id": "surfing_premium"
}
```

### Step 2: Create Prices for Each Product

For each product, add the following prices:

**Standard Product Prices:**

1. **Monthly Subscription**
   - Pricing model: Standard pricing
   - Price: $5.00 USD
   - Billing period: Monthly
   - Add metadata: `{ "billing_cycle": "monthly" }`

2. **Yearly Subscription**
   - Pricing model: Standard pricing
   - Price: $50.00 USD
   - Billing period: Yearly
   - Add metadata: `{ "billing_cycle": "yearly" }`

3. **Lifetime Access**
   - Pricing model: Standard pricing
   - Price: $150.00 USD
   - One-time payment
   - Add metadata: `{ "billing_cycle": "lifetime" }`

**Premium Product Prices:**

1. **Monthly Subscription**
   - Price: $15.00 USD, Monthly
   - Add metadata: `{ "billing_cycle": "monthly" }`

2. **Yearly Subscription**
   - Price: $150.00 USD, Yearly
   - Add metadata: `{ "billing_cycle": "yearly" }`

3. **Lifetime Access**
   - Price: $400.00 USD, One-time
   - Add metadata: `{ "billing_cycle": "lifetime" }`

### Step 3: Create Features (for Entitlements)

Navigate to **Product catalog** → **Entitlements** → **Features**

Create each feature:

```bash
# Using Stripe CLI (alternative to dashboard)
stripe features create --lookup-key="premium_articles" --name="Premium Articles"
stripe features create --lookup-key="cheatsheet_downloads" --name="Cheatsheet Downloads"
stripe features create --lookup-key="priority_access" --name="Priority Access"
stripe features create --lookup-key="api_access" --name="API Access"
stripe features create --lookup-key="exclusive_content" --name="Exclusive Content"
```

### Step 4: Associate Features with Products

In the Stripe Dashboard, for each product:

1. Go to the product details
2. Scroll to **Features** section
3. Click **Add feature**
4. Select the appropriate features

**Standard Product Features:**

- Premium Articles
- Cheatsheet Downloads

**Premium Product Features:**

- Premium Articles
- Cheatsheet Downloads
- Priority Access
- API Access
- Exclusive Content

### Step 5: Configure Checkout Sessions

When creating checkout sessions from Surfing, include:

```javascript
// Example checkout session creation (for turnstile backend)
const session = await stripe.checkout.sessions.create({
  mode: 'subscription', // or 'payment' for lifetime
  customer_email: userEmail,
  client_reference_id: zitadelUserId, // Link to Zitadel user
  line_items: [
    {
      price: priceId, // The Stripe Price ID
      quantity: 1,
    },
  ],
  success_url: 'https://surfing.salty.vip/subscription/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://surfing.salty.vip/pricing?canceled=true',
  metadata: {
    zitadel_user_id: zitadelUserId,
    tier: 'standard', // or 'premium'
  },
  subscription_data: {
    metadata: {
      zitadel_user_id: zitadelUserId,
    },
  },
});
```

---

## Webhook Configuration

### Required Webhook Events

Configure webhooks in Stripe Dashboard → Developers → Webhooks:

**Webhook Endpoint URL:** `https://turnstile.your-domain.com/webhooks/stripe`

**Events to subscribe:**

| Event                                  | Purpose                             |
| -------------------------------------- | ----------------------------------- |
| `checkout.session.completed`           | New subscription/purchase completed |
| `customer.subscription.created`        | Subscription created                |
| `customer.subscription.updated`        | Subscription plan changed           |
| `customer.subscription.deleted`        | Subscription canceled               |
| `invoice.paid`                         | Payment successful (renewal)        |
| `invoice.payment_failed`               | Payment failed                      |
| `customer.subscription.trial_will_end` | Trial ending soon (if using trials) |

### Webhook Signing Secret

1. After creating the webhook endpoint, copy the **Signing secret**
2. Store it securely in turnstile's environment: `STRIPE_WEBHOOK_SECRET`

### Event Payload Examples

**checkout.session.completed:**

```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_xxx",
      "client_reference_id": "zitadel_user_id_here",
      "customer": "cus_xxx",
      "subscription": "sub_xxx",
      "metadata": {
        "zitadel_user_id": "170848145649959169",
        "tier": "standard"
      }
    }
  }
}
```

**customer.subscription.updated:**

```json
{
  "type": "customer.subscription.updated",
  "data": {
    "object": {
      "id": "sub_xxx",
      "status": "active",
      "items": {
        "data": [
          {
            "price": {
              "product": "prod_xxx",
              "metadata": { "tier": "premium" }
            }
          }
        ]
      },
      "metadata": {
        "zitadel_user_id": "170848145649959169"
      }
    }
  }
}
```

---

## Customer Portal Setup

### Configure Customer Portal

Navigate to **Settings** → **Billing** → **Customer portal**

Enable the following features:

1. **Subscriptions**
   - [x] Customers can switch plans
   - [x] Customers can cancel subscriptions
   - [ ] Prorate subscription changes (enable if desired)

2. **Payment methods**
   - [x] Customers can update payment methods

3. **Invoice history**
   - [x] Customers can view invoice history

4. **Branding**
   - Set business name: `Surfing`
   - Set accent color to match Surfing brand
   - Add logo

### Portal Link Generation

```javascript
// Generate customer portal session (for turnstile backend)
const portalSession = await stripe.billingPortal.sessions.create({
  customer: stripeCustomerId,
  return_url: 'https://surfing.salty.vip/account',
});

// Redirect user to portalSession.url
```

---

## Testing Checklist

### Test Mode Setup

1. [ ] Create test products and prices in Stripe Test Mode
2. [ ] Configure test webhook endpoint
3. [ ] Use Stripe test card numbers for testing

### Test Scenarios

#### New Subscription Flow

- [ ] User selects Standard Monthly → Checkout completes → User gets Standard tier
- [ ] User selects Premium Yearly → Checkout completes → User gets Premium tier
- [ ] User selects Standard Lifetime → One-time payment → User gets Standard tier permanently

#### Subscription Management

- [ ] User upgrades from Standard to Premium → Tier updates correctly
- [ ] User downgrades from Premium to Standard → Tier updates at period end
- [ ] User cancels subscription → Tier reverts to Free at period end

#### Payment Failures

- [ ] Payment fails on renewal → User notified, grace period starts
- [ ] Payment succeeds after retry → Access restored

#### Lifetime Purchases

- [ ] Lifetime purchase has no expiration
- [ ] Lifetime users cannot be affected by subscription events

### Test Card Numbers

| Card Number        | Scenario           |
| ------------------ | ------------------ |
| `4242424242424242` | Successful payment |
| `4000000000000002` | Card declined      |
| `4000000000009995` | Insufficient funds |
| `4000002500003155` | Requires 3D Secure |

---

## Environment Variables

Required environment variables for turnstile:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_xxx          # or sk_test_xxx for testing
STRIPE_PUBLISHABLE_KEY=pk_live_xxx     # or pk_test_xxx for testing
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Product/Price IDs (get from Stripe Dashboard after creation)
STRIPE_PRODUCT_STANDARD=prod_xxx
STRIPE_PRODUCT_PREMIUM=prod_xxx

STRIPE_PRICE_STANDARD_MONTHLY=price_xxx
STRIPE_PRICE_STANDARD_YEARLY=price_xxx
STRIPE_PRICE_STANDARD_LIFETIME=price_xxx

STRIPE_PRICE_PREMIUM_MONTHLY=price_xxx
STRIPE_PRICE_PREMIUM_YEARLY=price_xxx
STRIPE_PRICE_PREMIUM_LIFETIME=price_xxx
```

---

## Price ID Reference Table

After creating products and prices, record the IDs here:

| Tier     | Billing Cycle | Stripe Price ID | Notes    |
| -------- | ------------- | --------------- | -------- |
| Standard | Monthly       | `price_`        |          |
| Standard | Yearly        | `price_`        |          |
| Standard | Lifetime      | `price_`        | One-time |
| Premium  | Monthly       | `price_`        |          |
| Premium  | Yearly        | `price_`        |          |
| Premium  | Lifetime      | `price_`        | One-time |

---

## Next Steps

After completing Stripe configuration:

1. Configure turnstile webhook handlers (see `turnstile-integration-tasks.md`)
2. Implement Pricing page in Surfing frontend
3. Add subscription status checking to Zitadel auth flow
4. Test end-to-end flow in test mode
5. Switch to live mode and verify configuration
