# Mission Intent & Nuance: Email Architecture Alignment

## Context
The user provided a document `Opendm Email Architecture.pdf` which outlines the required architecture for the email relay system. The current implementation using Amazon SES is missing several key features:
1. `Reply-To` header alignment.
2. SES Message ID storage.
3. Event handling (Bounces/Complaints).
4. Formal validation/sanitization.

## Intent
Align the existing `convex/emails.ts` and `convex/submission.ts` with the provided specification.

## Nuance & Boundaries
- We are using Amazon SES SDK directly.
- Email forwarding is "critical infrastructure".
- Deliverability is a priority (SPF/DKIM/DMARC).
- Privacy: The `From` address must be ours, `Reply-To` must be the visitor's.
- Scalability: Avoid synchronous email sending if possible (already using scheduler).
- Traceability: Store SES Message IDs for all outbound emails.
