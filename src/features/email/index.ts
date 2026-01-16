/**
 * Email Feature - Main Barrel Export
 * 
 * Provides a clean public API for the email feature.
 * Import from '@/features/email' for all email functionality.
 * 
 * @example
 * ```typescript
 * import {
 *   sendEmail,
 *   sendSimpleEmail,
 *   generateWelcomeEmail,
 *   isSESConfigured,
 * } from '@/features/email';
 * ```
 */

// ============================================================================
// Client
// ============================================================================
export {
    getSESClient,
    getSESV2Client,
    getSESConfig,
    destroySESClients,
    isSESConfigured,
} from "./client";

// ============================================================================
// Services
// ============================================================================
export {
    // Email sending
    sendEmail,
    sendTemplatedEmail,
    sendBulkTemplatedEmail,
    sendSimpleEmail,
    // Template management
    createEmailTemplate,
    updateEmailTemplate,
    upsertEmailTemplate,
    deleteEmailTemplate,
    getEmailTemplate,
    listEmailTemplates,
    testRenderTemplate,
    // Types
    type TemplateOperationResult,
    type TemplateListResult,
    type TemplateGetResult,
    type TemplateRenderResult,
} from "./services";

// ============================================================================
// Types
// ============================================================================
export {
    // Core email types
    type EmailAddress,
    type EmailContent,
    type EmailAttachment,
    type EmailMessage,
    // Templated email types
    type TemplatedEmailMessage,
    type BulkEmailDestination,
    type BulkTemplatedEmailMessage,
    // Response types
    type EmailSendResult,
    type BulkEmailSendResult,
    type BulkEmailSendStatus,
    // Configuration types
    type SESConfig,
    type EmailServiceConfig,
    type EmailClientConfig,
    // Template types
    type EmailTemplate,
    type TemplateTestData,
    // Error handling
    EmailError,
    EmailErrorCode,
} from "./types";

// ============================================================================
// Schemas
// ============================================================================
export {
    // Validation schemas
    emailAddressSchema,
    emailContentSchema,
    emailAttachmentSchema,
    emailMessageSchema,
    templatedEmailMessageSchema,
    bulkEmailDestinationSchema,
    bulkTemplatedEmailMessageSchema,
    sesConfigSchema,
    emailServiceConfigSchema,
    emailClientConfigSchema,
    emailTemplateSchema,
    templateTestDataSchema,
    sendEmailRequestSchema,
    sendBulkEmailRequestSchema,
    // Inferred types from schemas
    type EmailAddressInput,
    type EmailContentInput,
    type EmailAttachmentInput,
    type EmailMessageInput,
    type TemplatedEmailMessageInput,
    type BulkEmailDestinationInput,
    type BulkTemplatedEmailMessageInput,
    type SESConfigInput,
    type EmailServiceConfigInput,
    type EmailClientConfigInput,
    type EmailTemplateInput,
    type TemplateTestDataInput,
    type SendEmailRequestInput,
    type SendBulkEmailRequestInput,
} from "./schemas";

// ============================================================================
// Templates
// ============================================================================
export {
    // Base template utilities
    generateBaseEmailTemplate,
    generateButtonHtml,
    generateHeadingHtml,
    generateParagraphHtml,
    generateDividerHtml,
    generateCalloutHtml,
    // Pre-built templates
    generateWelcomeEmail,
    generatePasswordResetEmail,
    generateNotificationEmail,
    generateInvoiceEmail,
    generateTeamInviteEmail,
    emailTemplates,
    // Template types
    type BaseTemplateOptions,
    type EmailTemplateType,
    type WelcomeEmailData,
    type PasswordResetData,
    type NotificationEmailData,
    type InvoiceEmailData,
    type TeamInviteData,
} from "./templates";
