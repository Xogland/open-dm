# Research Trace: Email Architecture Audit

## Existing Implementation Analysis
- `convex/emails.ts`: Uses `@aws-sdk/client-ses`. Sends via `SendEmailCommand`. Uses `Source` and `Destination.BccAddresses`. Missing `ReplyToAddresses`.
- `convex/submission.ts`: Triggers `sendEscalation` via `ctx.scheduler.runAfter(0, ...)`.
- `convex/schema.ts`: `submissions` table layout.

## Discrepancies Found
| Feature | Doc Requirement | Current Implementation | Status |
|---------|-----------------|-------------------------|--------|
| From Address | Authenticated Opendm Domain | `process.env.AWS_SES_FROM_EMAIL` | ✅ |
| Reply-To | Visitor's Email | **Missing** | ❌ |
| To Address | User's Destination email | Uses BCC to team members | ⚠️ |
| Message ID | Store SES Message ID | **Not Stored** | ❌ |
| Event Handling | Bounces/Complaints | **Missing** | ❌ |
| Validation | Format & Length limits | Monthly limit only | ⚠️ |

## Action Items
1. Add `Reply-To` support.
2. Add `sesMessageId` to schema.
3. Store `sesMessageId` upon success.
4. Add internal mutation to update submission with message ID.
5. (Stretch) SES Webhook structure.
