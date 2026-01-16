# Amazon SES Email Feature

A production-ready, type-safe email sending feature using Amazon Simple Email Service (SES) with AWS SDK v3.

## Features

- ✅ **Type-Safe**: Full TypeScript support with Zod validation
- ✅ **Production-Ready**: Error handling, retry logic, and proper credential management
- ✅ **Templated Emails**: Support for AWS SES templates
- ✅ **Bulk Sending**: Send up to 50 emails per request
- ✅ **HTML Templates**: Pre-built responsive HTML email templates
- ✅ **API Routes**: Server-side endpoints for secure email sending
- ✅ **Singleton Client**: Lazy-initialized, reusable SES client

## Setup

### 1. Install Dependencies

The AWS SDK packages are already installed:
- `@aws-sdk/client-ses`
- `@aws-sdk/client-sesv2`

### 2. Configure Environment Variables

Add these to your `.env.local`:

```env
# Required AWS Configuration
AWS_SES_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Default Sender (optional but recommended)
AWS_SES_FROM_EMAIL=noreply@yourdomain.com
AWS_SES_FROM_NAME=Your App Name

# For LocalStack testing (optional)
AWS_SES_ENDPOINT=http://localhost:4566
```

### 3. AWS SES Setup

Before sending emails in production:

1. **Verify Your Domain**: Add DNS records for your sending domain
2. **Configure DKIM**: Set up DomainKeys Identified Mail for better deliverability
3. **Request Production Access**: Move out of sandbox mode via AWS Support Console
4. **Create Configuration Sets**: For bounce/complaint tracking (optional)

## Usage

### Simple Email

```typescript
import { sendSimpleEmail } from '@/features/email';

const result = await sendSimpleEmail(
  'user@example.com',
  'Welcome!',
  { html: '<h1>Welcome to our app!</h1>' }
);

if (result.success) {
  console.log('Email sent:', result.messageId);
} else {
  console.error('Failed:', result.error);
}
```

### Full Email Control

```typescript
import { sendEmail } from '@/features/email';

const result = await sendEmail({
  from: { email: 'noreply@example.com', name: 'My App' },
  to: [
    { email: 'user@example.com', name: 'John Doe' },
  ],
  cc: [{ email: 'manager@example.com' }],
  subject: 'Important Update',
  content: {
    text: 'Plain text version',
    html: '<h1>HTML version</h1>',
  },
  tags: { campaign: 'onboarding' },
});
```

### Templated Email

```typescript
import { sendTemplatedEmail } from '@/features/email';

const result = await sendTemplatedEmail({
  from: { email: 'noreply@example.com' },
  to: [{ email: 'user@example.com' }],
  templateName: 'WelcomeEmail',
  templateData: {
    name: 'John',
    activationUrl: 'https://...',
  },
});
```

### Bulk Email

```typescript
import { sendBulkTemplatedEmail } from '@/features/email';

const result = await sendBulkTemplatedEmail({
  from: { email: 'noreply@example.com' },
  templateName: 'Newsletter',
  defaultTemplateData: { date: 'January 2024' },
  destinations: [
    { to: { email: 'user1@example.com' }, templateData: { name: 'User 1' } },
    { to: { email: 'user2@example.com' }, templateData: { name: 'User 2' } },
    // ... up to 50 destinations
  ],
});

console.log(`Sent: ${result.successful}/${result.total}`);
```

### Using Pre-built Templates

```typescript
import { sendEmail, generateWelcomeEmail } from '@/features/email';

const html = generateWelcomeEmail({
  recipientName: 'John',
  brandName: 'Open DM',
  loginUrl: 'https://opendm.app/login',
});

await sendEmail({
  from: { email: 'noreply@opendm.app', name: 'Open DM' },
  to: [{ email: 'john@example.com' }],
  subject: 'Welcome to Open DM!',
  content: { html },
});
```

## API Routes

### POST `/api/email/send`

Send a single email.

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Hello!",
  "content": { "html": "<h1>Hello!</h1>" },
  "from": { "email": "noreply@example.com", "name": "My App" }
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "abc123..."
}
```

### POST `/api/email/bulk`

Send bulk templated emails.

**Request Body:**
```json
{
  "templateName": "Newsletter",
  "defaultTemplateData": { "date": "January 2024" },
  "destinations": [
    { "email": "user@example.com", "name": "John", "templateData": { "coupon": "SAVE10" } }
  ]
}
```

### GET `/api/email/send`

Health check endpoint.

```json
{
  "service": "email",
  "provider": "amazon-ses",
  "configured": true
}
```

## Template Management

### Create a Template

```typescript
import { createEmailTemplate } from '@/features/email';

await createEmailTemplate({
  name: 'WelcomeEmail',
  subject: 'Welcome, {{name}}!',
  html: '<h1>Hello {{name}}</h1><p>Welcome!</p>',
  text: 'Hello {{name}}, Welcome!',
});
```

### Update or Create (Upsert)

```typescript
import { upsertEmailTemplate } from '@/features/email';

await upsertEmailTemplate({
  name: 'WelcomeEmail',
  subject: 'Welcome to {{brand}}, {{name}}!',
  html: '<h1>Hello {{name}}</h1>',
});
```

## Error Handling

```typescript
import { sendEmail, EmailErrorCode } from '@/features/email';

const result = await sendEmail({ /* ... */ });

if (!result.success) {
  switch (result.errorCode) {
    case EmailErrorCode.QUOTA_EXCEEDED:
      // Handle quota limit
      break;
    case EmailErrorCode.RATE_EXCEEDED:
      // Handle rate limit - implement backoff
      break;
    case EmailErrorCode.SANDBOX_MODE:
      // Need to verify recipient or request production access
      break;
    case EmailErrorCode.TEMPLATE_NOT_FOUND:
      // Create the template first
      break;
    default:
      console.error(result.error);
  }
}
```

## Available Templates

| Template | Function | Description |
|----------|----------|-------------|
| Welcome | `generateWelcomeEmail()` | New user welcome |
| Password Reset | `generatePasswordResetEmail()` | Password reset link |
| Notification | `generateNotificationEmail()` | Generic notification |
| Invoice | `generateInvoiceEmail()` | Billing invoice |
| Team Invite | `generateTeamInviteEmail()` | Team invitation |

## Directory Structure

```
src/features/email/
├── index.ts              # Main barrel export
├── client/
│   ├── index.ts
│   └── ses-client.ts     # SES client singleton
├── schemas/
│   └── index.ts          # Zod validation schemas
├── services/
│   ├── index.ts
│   ├── email-service.ts  # Core email sending
│   └── template-service.ts
├── templates/
│   ├── index.ts
│   ├── base-template.ts  # HTML email base
│   └── common-templates.ts
└── types/
    └── index.ts          # TypeScript interfaces
```

## Best Practices

1. **Always use the API routes** for client-side email triggers
2. **Monitor bounce rates** - keep below 5%
3. **Monitor complaint rates** - keep below 0.1%
4. **Use unsubscribe links** in marketing emails
5. **Warm up new IP addresses** gradually
6. **Clean email lists** regularly

## Testing

For local development, you can use [LocalStack](https://localstack.cloud/) to simulate SES:

```env
AWS_SES_ENDPOINT=http://localhost:4566
```

Or check configuration without sending:

```typescript
import { isSESConfigured } from '@/features/email';

const { configured, error } = isSESConfigured();
console.log('SES Ready:', configured);
```
