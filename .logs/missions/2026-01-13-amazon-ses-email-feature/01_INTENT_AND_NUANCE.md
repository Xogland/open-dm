# Mission: Amazon SES Email Sending Feature

## Intent

Create a production-ready, type-safe email sending feature using Amazon SES (Simple Email Service) with AWS SDK v3, designed for extensibility within a Next.js 15 + Convex application.

## Scope

### In Scope
- AWS SES Client initialization with proper credential management
- Type-safe email sending service with Zod validation
- Support for plain text and HTML emails
- Support for templated emails
- Bulk email sending capability
- Email tracking configuration (bounces, complaints)
- Proper error handling and retry logic
- Environment variable validation
- Server-side API routes for email operations

### Out of Scope
- AWS infrastructure provisioning (SES setup, domain verification)
- CloudWatch integration (can be added later)
- SNS notification handlers for bounce/complaint webhooks

## Architectural Decisions

1. **Feature Isolation**: All email logic in `src/features/email/`
2. **Service Pattern**: Singleton SES client with factory functions
3. **Type-First**: Interfaces and schemas defined before implementation
4. **Env Validation**: AWS credentials validated at bootstrap via env.ts
5. **API Routes**: Next.js Route Handlers for server-side email operations
6. **No Client Exposure**: AWS credentials never exposed to client

## Key Dependencies

- `@aws-sdk/client-ses` - AWS SES SDK v3 (modular)
- `zod` - Runtime validation (already in project)

## Research Summary

### AWS SES Best Practices
- New accounts start in sandbox (200 emails/day, verified recipients only)
- Production access requires AWS Support request
- Must implement SPF, DKIM, DMARC for deliverability
- Keep bounce rate < 5%, complaint rate < 0.1%
- Use Configuration Sets for event tracking
- Warm up dedicated IPs gradually

### SDK v3 Patterns
- Use `SESClient` with `SendEmailCommand`
- Templated emails via `SendTemplatedEmailCommand`
- Bulk sends via `SendBulkTemplatedEmailCommand` (50 recipient limit)
- For larger volumes: queue via SQS + Lambda processing
