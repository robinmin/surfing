# Turnstile Integration Tasks: Subscription Webhook Processing

This document outlines the tasks required for turnstile to integrate and manage subscription-based membership at the backend, processing webhook events from Stripe and Zitadel.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Zitadel Configuration](#zitadel-configuration)
4. [Stripe Webhook Handler Tasks](#stripe-webhook-handler-tasks)
5. [Zitadel User Metadata Management](#zitadel-user-metadata-management)
6. [Data Models](#data-models)
7. [Implementation Tasks Checklist](#implementation-tasks-checklist)

---

## Overview

### System Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUBSCRIPTION FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────┐     ┌─────────┐     ┌───────────┐     ┌──────────┐     ┌─────────┐
│ Surfing │────▶│ Stripe  │────▶│ Turnstile │────▶│ Zitadel  │────▶│ Surfing │
│ Pricing │     │Checkout │     │ Webhooks  │     │ Metadata │     │ Content │
│  Page   │     │         │     │ Handler   │     │  Update  │     │  Gate   │
└─────────┘     └─────────┘     └───────────┘     └──────────┘     └─────────┘
     │               │               │                 │               │
     │  1. Select    │               │                 │               │
     │     Plan      │               │                 │               │
     │──────────────▶│               │                 │               │
     │               │  2. Payment   │                 │               │
     │               │     Success   │                 │               │
     │               │──────────────▶│                 │               │
     │               │               │  3. Update      │               │
     │               │               │     User        │               │
     │               │               │     Metadata    │               │
     │               │               │────────────────▶│               │
     │               │               │                 │  4. Token     │
     │               │               │                 │     Contains  │
     │               │               │                 │     Tier      │
     │               │               │                 │──────────────▶│
```

### Responsibilities

| Component     | Responsibility                                                          |
| ------------- | ----------------------------------------------------------------------- |
| **Surfing**   | Display pricing, initiate checkout, gate content based on user metadata |
| **Stripe**    | Handle payments, manage subscriptions, send webhook events              |
| **Turnstile** | Process webhooks, sync subscription status to Zitadel                   |
| **Zitadel**   | Store user metadata (subscription tier), issue tokens with claims       |

---

## Architecture

### Turnstile Webhook Endpoints

```
POST /webhooks/stripe          - Stripe event handler
POST /webhooks/zitadel         - Zitadel event handler (optional)
GET  /api/subscription/status  - Get current subscription status (for debugging)
POST /api/subscription/sync    - Manual sync trigger (admin only)
```

### User Metadata Schema (stored in Zitadel)

```json
{
  "subscription": {
    "tier": "standard", // "free" | "standard" | "premium"
    "status": "active", // "active" | "canceled" | "past_due" | "expired"
    "billing_cycle": "monthly", // "monthly" | "yearly" | "lifetime"
    "stripe_customer_id": "cus_xxx",
    "stripe_subscription_id": "sub_xxx",
    "current_period_end": "2025-02-07T00:00:00Z",
    "cancel_at_period_end": false,
    "updated_at": "2025-01-07T12:00:00Z"
  }
}
```

---

## Zitadel Configuration

### Task Z1: Enable User Metadata in ID Token

Configure Zitadel to include user metadata in the ID token so Surfing can read subscription status client-side.

**Steps:**

1. Navigate to Zitadel Console → Projects → Surfing Project → Application Settings
2. Enable **"User Info inside ID Token"**
3. Surfing must request scope: `urn:zitadel:iam:user:metadata`

**Verification:**

- After login, decode the ID token
- Confirm `urn:zitadel:iam:user:metadata` claim is present

### Task Z2: Create Service User for Turnstile

Create a service user that turnstile uses to update user metadata.

**Steps:**

1. Navigate to Zitadel Console → Users → Service Users
2. Create new service user:
   - Username: `turnstile-service`
   - Name: `Turnstile Subscription Service`
3. Generate a key (JSON format) for authentication
4. Store the key securely in turnstile environment

**Required Permissions:**

- `IAM_USER_WRITE` - To update user metadata
- `ORG_USER_READ` - To read user information

### Task Z3: Grant Manager Permissions

Grant the service user permissions to manage user metadata.

**Steps:**

1. Navigate to Organization → Managers
2. Add `turnstile-service` as Org User Manager
3. Or use API:
   ```bash
   # Using Zitadel Management API
   POST /management/v1/orgs/{orgId}/members
   {
     "userId": "<turnstile-service-user-id>",
     "roles": ["ORG_USER_MANAGER"]
   }
   ```

### Task Z4: Configure Actions (Optional)

Optionally, create Zitadel Actions to add custom claims at token issuance.

**Action: Add Subscription Claims to Token**

```javascript
// Zitadel Action: pre-access-token
function addSubscriptionClaims(ctx, api) {
  // Get user metadata
  const metadata = api.v1.user.metadata;

  if (metadata && metadata.subscription) {
    // Add subscription tier as a standard claim
    api.v1.claims.setClaim('subscription_tier', metadata.subscription.tier);
    api.v1.claims.setClaim('subscription_status', metadata.subscription.status);
  } else {
    // Default to free tier
    api.v1.claims.setClaim('subscription_tier', 'free');
    api.v1.claims.setClaim('subscription_status', 'active');
  }
}
```

---

## Stripe Webhook Handler Tasks

### Task S1: Webhook Endpoint Setup

Create the webhook endpoint that receives Stripe events.

**Implementation:**

```typescript
// POST /webhooks/stripe
interface StripeWebhookHandler {
  // Verify webhook signature
  verifySignature(payload: string, signature: string): boolean;

  // Route events to appropriate handlers
  handleEvent(event: Stripe.Event): Promise<void>;
}

// Event routing
const eventHandlers = {
  'checkout.session.completed': handleCheckoutCompleted,
  'customer.subscription.created': handleSubscriptionCreated,
  'customer.subscription.updated': handleSubscriptionUpdated,
  'customer.subscription.deleted': handleSubscriptionDeleted,
  'invoice.paid': handleInvoicePaid,
  'invoice.payment_failed': handlePaymentFailed,
};
```

### Task S2: Handle checkout.session.completed

Process new subscription purchases.

**Logic:**

```typescript
async function handleCheckoutCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
  const session = event.data.object;

  // Extract user info
  const zitadelUserId = session.client_reference_id || session.metadata?.zitadel_user_id;
  const stripeCustomerId = session.customer as string;

  if (!zitadelUserId) {
    throw new Error('Missing Zitadel user ID in checkout session');
  }

  // Determine tier from product
  const tier = await getTierFromSession(session);
  const billingCycle = await getBillingCycleFromSession(session);

  // For subscriptions
  if (session.mode === 'subscription') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await updateZitadelUserMetadata(zitadelUserId, {
      tier,
      status: 'active',
      billing_cycle: billingCycle,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: subscription.id,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    });
  }

  // For lifetime purchases (one-time payment)
  if (session.mode === 'payment') {
    await updateZitadelUserMetadata(zitadelUserId, {
      tier,
      status: 'active',
      billing_cycle: 'lifetime',
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: null, // No subscription for lifetime
      current_period_end: null, // Never expires
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    });
  }

  // Log for audit
  await logSubscriptionEvent('subscription_created', zitadelUserId, { tier, billingCycle });
}
```

### Task S3: Handle customer.subscription.updated

Process subscription changes (upgrades, downgrades, cancellations).

**Logic:**

```typescript
async function handleSubscriptionUpdated(event: Stripe.CustomerSubscriptionUpdatedEvent) {
  const subscription = event.data.object;
  const zitadelUserId = subscription.metadata?.zitadel_user_id;

  if (!zitadelUserId) {
    // Try to find user by customer ID
    const user = await findUserByStripeCustomerId(subscription.customer as string);
    if (!user) {
      console.error('Cannot find user for subscription:', subscription.id);
      return;
    }
    zitadelUserId = user.id;
  }

  // Get current tier from product
  const tier = await getTierFromSubscription(subscription);

  // Map Stripe status to our status
  const statusMap: Record<string, string> = {
    active: 'active',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'past_due',
    incomplete: 'pending',
    incomplete_expired: 'expired',
    trialing: 'active', // Treat trial as active
  };

  await updateZitadelUserMetadata(zitadelUserId, {
    tier: subscription.status === 'canceled' ? 'free' : tier,
    status: statusMap[subscription.status] || 'unknown',
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });

  await logSubscriptionEvent('subscription_updated', zitadelUserId, {
    status: subscription.status,
    tier,
  });
}
```

### Task S4: Handle customer.subscription.deleted

Process subscription cancellations.

**Logic:**

```typescript
async function handleSubscriptionDeleted(event: Stripe.CustomerSubscriptionDeletedEvent) {
  const subscription = event.data.object;
  const zitadelUserId = subscription.metadata?.zitadel_user_id;

  // Skip if user has lifetime access (no subscription means lifetime)
  const currentMetadata = await getZitadelUserMetadata(zitadelUserId);
  if (currentMetadata?.subscription?.billing_cycle === 'lifetime') {
    console.log('Ignoring subscription deletion for lifetime user:', zitadelUserId);
    return;
  }

  // Downgrade to free tier
  await updateZitadelUserMetadata(zitadelUserId, {
    tier: 'free',
    status: 'expired',
    stripe_subscription_id: null,
    current_period_end: null,
    cancel_at_period_end: false,
    updated_at: new Date().toISOString(),
  });

  await logSubscriptionEvent('subscription_deleted', zitadelUserId, {});
}
```

### Task S5: Handle invoice.payment_failed

Handle failed payments gracefully.

**Logic:**

```typescript
async function handlePaymentFailed(event: Stripe.InvoicePaymentFailedEvent) {
  const invoice = event.data.object;
  const subscription = invoice.subscription as string;

  if (!subscription) return; // Not a subscription invoice

  const sub = await stripe.subscriptions.retrieve(subscription);
  const zitadelUserId = sub.metadata?.zitadel_user_id;

  // Update status to past_due but don't immediately revoke access
  await updateZitadelUserMetadata(zitadelUserId, {
    status: 'past_due',
    updated_at: new Date().toISOString(),
  });

  // Log for notification system
  await logSubscriptionEvent('payment_failed', zitadelUserId, {
    invoice_id: invoice.id,
    attempt_count: invoice.attempt_count,
  });

  // TODO: Trigger email notification to user about payment failure
}
```

---

## Zitadel User Metadata Management

### Task M1: Implement Zitadel API Client

Create a client to interact with Zitadel Management API.

**Implementation:**

```typescript
interface ZitadelClient {
  // Authenticate using service user credentials
  authenticate(): Promise<string>; // Returns access token

  // Get user metadata
  getUserMetadata(userId: string, key: string): Promise<any>;

  // Set user metadata
  setUserMetadata(userId: string, key: string, value: any): Promise<void>;

  // Delete user metadata
  deleteUserMetadata(userId: string, key: string): Promise<void>;
}

class ZitadelManagementClient implements ZitadelClient {
  private baseUrl: string;
  private serviceUserKey: object; // JWT key from Zitadel

  async setUserMetadata(userId: string, key: string, value: any): Promise<void> {
    const token = await this.authenticate();

    // Value must be base64 encoded
    const encodedValue = Buffer.from(JSON.stringify(value)).toString('base64');

    await fetch(`${this.baseUrl}/management/v1/users/${userId}/metadata/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: encodedValue,
      }),
    });
  }
}
```

### Task M2: Implement Metadata Update Function

Higher-level function to update subscription metadata.

```typescript
async function updateZitadelUserMetadata(
  userId: string,
  subscriptionData: Partial<SubscriptionMetadata>
): Promise<void> {
  const client = getZitadelClient();

  // Get existing metadata
  const existing = await client.getUserMetadata(userId, 'subscription');

  // Merge with new data
  const updated = {
    ...existing,
    ...subscriptionData,
  };

  // Store back
  await client.setUserMetadata(userId, 'subscription', updated);

  // Also update individual keys for easier querying
  if (subscriptionData.tier) {
    await client.setUserMetadata(userId, 'subscription_tier', subscriptionData.tier);
  }
}
```

### Task M3: Implement User Lookup by Stripe Customer ID

Find Zitadel user from Stripe customer ID.

```typescript
async function findUserByStripeCustomerId(customerId: string): Promise<User | null> {
  const client = getZitadelClient();

  // Search users by metadata
  const response = await fetch(`${client.baseUrl}/management/v1/users/_search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await client.authenticate()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      queries: [
        {
          userMetadataQuery: {
            key: 'subscription',
            // This is a limitation - may need to store customer_id separately
          },
        },
      ],
    }),
  });

  // Alternative: Maintain a mapping table in turnstile database
  // stripe_customer_id -> zitadel_user_id
}
```

---

## Data Models

### Subscription Metadata (Zitadel)

```typescript
interface SubscriptionMetadata {
  tier: 'free' | 'standard' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'expired' | 'pending';
  billing_cycle: 'monthly' | 'yearly' | 'lifetime';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null; // ISO 8601 datetime
  cancel_at_period_end: boolean;
  updated_at: string; // ISO 8601 datetime
}
```

### Subscription Event Log (Turnstile Database)

```typescript
interface SubscriptionEventLog {
  id: string;
  user_id: string; // Zitadel user ID
  event_type: string; // 'subscription_created' | 'subscription_updated' | etc.
  event_data: object; // JSON payload
  stripe_event_id: string | null; // For idempotency
  created_at: Date;
}
```

### User-Customer Mapping (Turnstile Database)

```typescript
interface UserCustomerMapping {
  zitadel_user_id: string; // Primary key
  stripe_customer_id: string; // Unique index
  created_at: Date;
  updated_at: Date;
}
```

---

## Implementation Tasks Checklist

### Phase 1: Zitadel Setup

- [ ] **Z1**: Enable User Metadata in ID Token
- [ ] **Z2**: Create Service User for Turnstile
- [ ] **Z3**: Grant Manager Permissions to Service User
- [ ] **Z4**: Configure Actions for Custom Claims (optional)

### Phase 2: Turnstile Core Implementation

- [ ] **T1**: Create database tables (event log, user-customer mapping)
- [ ] **T2**: Implement Zitadel API client (authentication, metadata CRUD)
- [ ] **T3**: Implement webhook signature verification
- [ ] **T4**: Create webhook endpoint router

### Phase 3: Stripe Event Handlers

- [ ] **S1**: Webhook Endpoint Setup
- [ ] **S2**: Handle `checkout.session.completed`
- [ ] **S3**: Handle `customer.subscription.updated`
- [ ] **S4**: Handle `customer.subscription.deleted`
- [ ] **S5**: Handle `invoice.payment_failed`
- [ ] **S6**: Handle `invoice.paid` (for renewals)

### Phase 4: Metadata Management

- [ ] **M1**: Implement Zitadel API Client
- [ ] **M2**: Implement Metadata Update Function
- [ ] **M3**: Implement User Lookup by Stripe Customer ID
- [ ] **M4**: Add error handling and retry logic

### Phase 5: Testing & Monitoring

- [ ] **Test1**: Unit tests for each webhook handler
- [ ] **Test2**: Integration tests with Stripe test mode
- [ ] **Test3**: End-to-end test: purchase → metadata update → token verification
- [ ] **Mon1**: Add logging for all webhook events
- [ ] **Mon2**: Add metrics for success/failure rates
- [ ] **Mon3**: Set up alerts for payment failures

### Phase 6: API Endpoints (Optional)

- [ ] **API1**: GET /api/subscription/status - Debug endpoint
- [ ] **API2**: POST /api/subscription/sync - Manual sync trigger
- [ ] **API3**: POST /api/checkout/session - Create checkout session for Surfing

---

## Environment Variables for Turnstile

```bash
# Zitadel Configuration
ZITADEL_AUTHORITY=https://your-instance.zitadel.cloud
ZITADEL_SERVICE_USER_KEY=<base64-encoded-jwt-key>
ZITADEL_ORG_ID=<organization-id>

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Database (for event logging and mapping)
DATABASE_URL=postgresql://...

# Logging
LOG_LEVEL=info
```

---

## Error Handling Strategy

### Webhook Retry Behavior

Stripe retries failed webhooks for up to 3 days. Implement idempotency:

```typescript
async function handleWebhook(event: Stripe.Event): Promise<void> {
  // Check if we've already processed this event
  const existing = await db.subscriptionEventLog.findUnique({
    where: { stripe_event_id: event.id },
  });

  if (existing) {
    console.log('Event already processed:', event.id);
    return; // Idempotent - return success
  }

  try {
    // Process event
    await eventHandlers[event.type]?.(event);

    // Log successful processing
    await db.subscriptionEventLog.create({
      data: {
        stripe_event_id: event.id,
        event_type: event.type,
        event_data: event.data.object,
        user_id: extractUserId(event),
      },
    });
  } catch (error) {
    // Log failure but throw to trigger Stripe retry
    console.error('Webhook processing failed:', event.id, error);
    throw error;
  }
}
```

### Zitadel API Retry

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = 3, delayMs: number = 1000): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw new Error('Unreachable');
}
```

---

## Security Considerations

1. **Webhook Signature Verification**: Always verify Stripe webhook signatures
2. **Service User Credentials**: Store Zitadel service user key securely (secrets manager)
3. **Input Validation**: Validate all data from webhooks before processing
4. **Audit Logging**: Log all subscription changes for compliance
5. **Rate Limiting**: Implement rate limiting on API endpoints
6. **HTTPS Only**: All endpoints must use HTTPS

---

## Next Steps

1. Complete Zitadel configuration (Tasks Z1-Z4)
2. Implement turnstile webhook handlers (Tasks S1-S5)
3. Test with Stripe test mode
4. Update Surfing frontend to read subscription metadata from tokens
5. Implement content gating based on subscription tier
