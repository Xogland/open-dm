# Intent & Nuance - Fix Stripe Type Errors

## Context
The project is integrating Stripe payments. A critical TypeScript error `TS7022` exists in `convex/stripe.ts` related to the `createPaymentIntent` action. This error prevents the Convex backend from compiling with type checking.

## Objectives
1. Resolve `TS7022: 'createPaymentIntent'` in `convex/stripe.ts`.
2. Ensure `selectedOrganization.stripeConfig` is correctly typed on the client (done in previous session, but will verify).
3. Fix any remaining `api.stripe` lint errors in frontend components.
4. Implement robust payment failure handling.
5. Verify the entire payment flow.

## Discovery Path
- Investigate `convex/stripe.ts` and its interaction with `api.organisation`.
- Check for circular dependencies caused by importing `api` in `stripe.ts`.
- Verify `convex/organisation.ts` exports and visibility.
- Run `npx convex dev` to see real-time error messages.
