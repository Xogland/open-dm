---
trigger: always_on
---

# Type-Safety & Validation Protocol

## Zero-Tolerance Policy
* **No "Escape Hatches":** The use of `any`, `never`, or `unknown` (without immediate narrowing) is strictly prohibited.
* **Type-First Development:** Define interfaces and types in `src/features/[feature]/types.ts` before writing implementation code.

## Validation Rigor
* **Schema Validation:** Use Zod (or equivalent) for all data boundaries (API responses, form inputs, etc.).
* **Environment Safety:** All environment variables must be validated via a schema (e.g., `src/env.ts`) during the bootstrap phase.
* **State Integrity:** Client-side mutations must be wrapped in domain-specific hooks to handle validation and optimistic updates.