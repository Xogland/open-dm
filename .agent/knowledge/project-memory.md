# Project Memory - Open DM

## Stripe Integration Quirks

### Circular Dependency (TS7022)

When building a Convex action that references a query in another file via the `api` or `internal` object, you may encounter `TS7022` if those files are part of what the generator processes.
**Fix**: Use a string-based query name with a type cast to `any` (e.g., `ctx.runQuery("path/to/func" as any, args)`) to break the circularity.

### Redacting Secret Keys

Stripe secret keys stored in the database MUST be redacted in public Convex queries to prevent exposure to the client.
**Implementation**: Sanitized all organization queries to return only `publishableKey` and `enabled` in the `stripeConfig` object.

### Partial Updates for Secret Keys

Since secret keys are redacted, client-side forms will receive an empty or placeholder value.
**Fix**: Updated the `updateOrganisationStripeConfig` mutation to make `secretKey` optional. If not provided, it preserves the existing value in the database.
**UI**: The form shows `••••••••••••` as a placeholder if a key is already set and only sends a new key if the user enters one.
