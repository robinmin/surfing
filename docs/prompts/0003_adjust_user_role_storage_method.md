---
name: adjust user role storage method
description: <prompt description>
status: Backlog
created_at: 2026-01-08 08:48:48
updated_at: 2026-01-08 08:48:48
---

## adjust user role storage method

### Background

We need to continue to do some enhancements to project turnstile based on current project's stripe subscription processing. I already added a softlink to the project's repository at @turnstile_src. project turnstile is designed to integrate all relevant infrastructures together, including zitadel, stripe, and other services.

One thing must be clarified here: we already implemented a simple RBAC infrastructure in my zitadel instance. That's say, once client requests a JWT token, we will respond with a JWT token that contains the user's email address and a custom claim once the user is authenticated. For example, the client will receive a JWT token with the following payload:

```json
{
  "email": "xxxx@abc.com",
  "oidc_fields": {
    "flatRolesClaim": ["admin", "editor", "viewer"] // ← like this
  },
  "amr": ["user", "mfa"]
}
```

So, we **can not store the subscription status** in the user metadata. Instead, we need to store it as a customized zitadel role. But the other relevant information, such as the subscription date, next billing date and etc., still and must be stored in the user metadata.

let's assume we already defined the following roles for application surfing in zitadel's relevant project:

- `surfing-free`
- `surfing-standard`
- `surfing-premium`

To support multiple subscription plans, we need to store user roles and metadata always with the same prefix `surfing-`. For example, you can refer to above roles. Or when we need to store expiration date into user metadata, we can use the key named as `surfing-expiration-date`(or something similar, for example `surfing_expiration_date` if `-` is not allowed).

I also added another softlink @zitadel_src to the source code of zitadel. You can refer to it if needed. But it's a huge repository, so you can read it only necessary -- NO pre-loading.

### Requirements / Objectives

We need to implement most of the following features in @zitadel_src, and some adaptive changes in current codebase surfing.

- By default, we will assign the `surfing-free` role to all login users.
- Once the stripe transaction is completed and successful, we need to update the user's role and metadata accordingly(including next billing date as the expiration date of current subscription). Including subscripting a plan, canceling a plan, and upgrading a plan or downgrading a plan.(I am not sure how the recharge process works, but we need to ensure that the user's role and metadata are updated accordingly.)

- Once then subscription status is changed, we not only need to update the user's role accordingly, but also update the user's metadata accordingly.

- We will implement a customized action in zitadel to do login expiration check during the authentication process separately. This is a separate task, not in the scope of this task. **JUST FOR REFERENCE**, so that we can decide how to implement store these key information in this task, and we will use them in the next task.

Before taking any action, I need you to fully understand this requirement, and figure out which part should be implemented in @turnstile_src, and which part should be implemented in current codebase surfing, and which part should be out of scope. Then we can have a detailed discussion about the implementation plan.

### Solutions / Goals

### References
