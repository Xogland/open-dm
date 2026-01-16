# Intent & Nuance - Payment and File Upload Updates

## Context

The user wants to upgrade the payment type selection to a "premium" multi-choice and file upload experience.
Additionally, the file upload flow needs to be robust, including storage integration and inbox consistency.
Finally, service selection messages should indicate payment steps with a dollar symbol.

## Proposed Strategy

1. **Audit:** Map out the chat flow logic, payment step implementation, and file upload capabilities.
2. **UI Upgrade:** Enhance the payment selection UI to match the premium aesthetics requested.
3. **Storage Integration:** Ensure file uploads are handled correctly via Convex storage and tracked in the inbox.
4. **Conditional Formatting:** Update the service message logic to suffix a "$" if payment is involved.

## Boundaries & Decisions

- Use Convex for backend storage and state management.
- Stick to Vanilla CSS/Shadcn (as per user rules) but make it "premium".
- Follow Next.js 15 async API patterns.
