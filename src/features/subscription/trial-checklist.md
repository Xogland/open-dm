# Subscription Free Trial Checklist

This document tracks the status of free trial implementation for Open DM using Lemon Squeezy.

## 1. Multiple Trial Prevention
- [x] **Application-side Check**: Check if the organization has ever had a paid subscription in the `subscriptions` table. [x]
- [ ] **Lemon Squeezy Configuration**: Ensure "Exclude existing customers" is enabled in the Lemon Squeezy product settings to prevent them from starting multiple trials with the same email.
- [x] **Scope**: Trials are per-organization. [x]

## 2. Customer & Subscription Data
- [x] **Store Customer ID**: `lemonSqueezyCustomerId` is stored in Convex. [x]
- [x] **Track Trial Status**: `status: "on_trial"` is handled. [x]
- [x] **Track Trial Dates**: `trialEndsAt` is captured from webhooks. [x]
- [x] **Status Sync**: Webhooks correctly update the organisation's plan when a trial starts or ends. [x]

## 3. UI/UX Considerations
- [x] **Dynamic CTA**: Update "Upgrade" button to say "Start [X] Day Free Trial" if applicable. [x]
- [x] **Plan Benefits**: Ensure users see they get full access during the trial. [x]
- [ ] **Expiration Warning**: Show a banner when the trial is ending (e.g., "7 days remaining").

## 4. Backend Logic
- [x] **Webhook Handling**: `subscription_created` and `subscription_updated` handle trial attributes.
- [x] **Access Control**: `validateAction` and `useCanPerformAction` allow full access during trial.
- [x] **Auto-Reversion**: Subscriptions that are not converted (expire) automatically revert the organisation to the `free` plan.

---

### Recommended Improvements
1. **Proration & Trial UX**: Update `SubscriptionPlans` to detect if it's the first time and show "Start Free Trial".
2. **Feature Highlighting**: Clearly label which features are included in the trial.
