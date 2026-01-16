/**
 * Email Feature Zod Schemas
 * 
 * Runtime validation schemas for all email-related data structures.
 * These complement the TypeScript types with runtime checks.
 * 
 * Note: Uses Zod v4 API
 */

import { z } from "zod";

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Email address validation with optional display name.
 */
export const emailAddressSchema = z.object({
    email: z
        .string()
        .email("Invalid email address format")
        .min(1, "Email address is required"),
    name: z.string().max(256, "Display name too long").optional(),
});

/**
 * Email content schema (at least text or html required).
 */
export const emailContentSchema = z
    .object({
        text: z.string().optional(),
        html: z.string().optional(),
    })
    .check((ctx) => {
        if (!ctx.value.text && !ctx.value.html) {
            ctx.issues.push({
                code: "custom",
                message: "At least text or HTML content is required",
                path: [],
                input: ctx.value,
            });
        }
    });

/**
 * Email attachment schema.
 */
export const emailAttachmentSchema = z.object({
    filename: z.string().min(1, "Filename is required").max(256),
    content: z.string().min(1, "Attachment content is required"),
    contentType: z.string().min(1, "Content type is required"),
    contentId: z.string().optional(),
});

// ============================================================================
// Email Message Schemas
// ============================================================================

/**
 * Complete email message validation schema.
 */
export const emailMessageSchema = z.object({
    from: emailAddressSchema,
    to: z
        .array(emailAddressSchema)
        .min(1, "At least one recipient is required")
        .max(50, "Maximum 50 recipients per message"),
    cc: z.array(emailAddressSchema).max(50).optional(),
    bcc: z.array(emailAddressSchema).max(50).optional(),
    replyTo: z.array(emailAddressSchema).max(10).optional(),
    subject: z
        .string()
        .min(1, "Subject is required")
        .max(1000, "Subject too long"),
    content: emailContentSchema,
    attachments: z.array(emailAttachmentSchema).max(10).optional(),
    headers: z.record(z.string(), z.string()).optional(),
    configurationSetName: z.string().max(256).optional(),
    tags: z.record(z.string(), z.string().max(256)).optional(),
});

/**
 * Templated email message validation schema.
 */
export const templatedEmailMessageSchema = z.object({
    from: emailAddressSchema,
    to: z
        .array(emailAddressSchema)
        .min(1, "At least one recipient is required")
        .max(50),
    cc: z.array(emailAddressSchema).max(50).optional(),
    bcc: z.array(emailAddressSchema).max(50).optional(),
    replyTo: z.array(emailAddressSchema).max(10).optional(),
    templateName: z
        .string()
        .min(1, "Template name is required")
        .max(256),
    templateData: z.record(z.string(), z.unknown()),
    configurationSetName: z.string().max(256).optional(),
    tags: z.record(z.string(), z.string().max(256)).optional(),
});

/**
 * Bulk email destination schema.
 */
export const bulkEmailDestinationSchema = z.object({
    to: emailAddressSchema,
    cc: z.array(emailAddressSchema).max(50).optional(),
    bcc: z.array(emailAddressSchema).max(50).optional(),
    templateData: z.record(z.string(), z.unknown()).optional(),
    tags: z.record(z.string(), z.string().max(256)).optional(),
});

/**
 * Bulk templated email validation schema.
 */
export const bulkTemplatedEmailMessageSchema = z.object({
    from: emailAddressSchema,
    replyTo: z.array(emailAddressSchema).max(10).optional(),
    templateName: z
        .string()
        .min(1, "Template name is required")
        .max(256),
    defaultTemplateData: z.record(z.string(), z.unknown()),
    destinations: z
        .array(bulkEmailDestinationSchema)
        .min(1, "At least one destination is required")
        .max(50, "Maximum 50 destinations per bulk send"),
    configurationSetName: z.string().max(256).optional(),
    defaultTags: z.record(z.string(), z.string().max(256)).optional(),
});

// ============================================================================
// Configuration Schemas
// ============================================================================

/**
 * AWS SES configuration validation schema.
 */
export const sesConfigSchema = z.object({
    region: z
        .string()
        .min(1, "AWS region is required")
        .regex(/^[a-z]{2}-[a-z]+-\d+$/, "Invalid AWS region format"),
    accessKeyId: z
        .string()
        .min(16, "Invalid AWS Access Key ID")
        .max(128),
    secretAccessKey: z
        .string()
        .min(16, "Invalid AWS Secret Access Key")
        .max(256),
    endpoint: z.string().url("Invalid endpoint URL").optional(),
});

/**
 * Email service configuration schema.
 */
export const emailServiceConfigSchema = z.object({
    defaultFrom: emailAddressSchema,
    defaultConfigurationSet: z.string().max(256).optional(),
    maxRetries: z.number().int().min(0).max(10).default(3),
    throwOnError: z.boolean().default(false),
    debug: z.boolean().default(false),
});

/**
 * Complete email client configuration schema.
 */
export const emailClientConfigSchema = z.object({
    ses: sesConfigSchema,
    service: emailServiceConfigSchema.optional(),
});

// ============================================================================
// Template Schemas
// ============================================================================

/**
 * Email template definition schema.
 */
export const emailTemplateSchema = z
    .object({
        name: z
            .string()
            .min(1, "Template name is required")
            .max(256)
            .regex(
                /^[a-zA-Z0-9_-]+$/,
                "Template name can only contain alphanumeric characters, underscores, and hyphens"
            ),
        subject: z
            .string()
            .min(1, "Subject is required")
            .max(1000),
        text: z.string().max(5_000_000).optional(),
        html: z.string().max(10_000_000).optional(),
    })
    .check((ctx) => {
        if (!ctx.value.text && !ctx.value.html) {
            ctx.issues.push({
                code: "custom",
                message: "At least text or HTML template content is required",
                path: [],
                input: ctx.value,
            });
        }
    });

/**
 * Template test data schema.
 */
export const templateTestDataSchema = z.object({
    templateName: z.string().min(1).max(256),
    testData: z.record(z.string(), z.unknown()),
});

// ============================================================================
// API Request Schemas
// ============================================================================

/**
 * API route schema for sending a single email.
 */
export const sendEmailRequestSchema = z.object({
    to: z.union([
        z.string().email(),
        emailAddressSchema,
        z.array(z.union([z.string().email(), emailAddressSchema])),
    ]),
    subject: z.string().min(1).max(1000),
    content: emailContentSchema,
    from: emailAddressSchema.optional(),
    cc: z.array(z.union([z.string().email(), emailAddressSchema])).optional(),
    bcc: z.array(z.union([z.string().email(), emailAddressSchema])).optional(),
    replyTo: z.array(z.union([z.string().email(), emailAddressSchema])).optional(),
    templateName: z.string().optional(),
    templateData: z.record(z.string(), z.unknown()).optional(),
    tags: z.record(z.string(), z.string()).optional(),
});

/**
 * API route schema for sending bulk emails.
 */
export const sendBulkEmailRequestSchema = z.object({
    templateName: z.string().min(1),
    defaultTemplateData: z.record(z.string(), z.unknown()),
    destinations: z
        .array(
            z.object({
                email: z.string().email(),
                name: z.string().optional(),
                templateData: z.record(z.string(), z.unknown()).optional(),
            })
        )
        .min(1)
        .max(50),
    from: emailAddressSchema.optional(),
    replyTo: z.array(emailAddressSchema).optional(),
    tags: z.record(z.string(), z.string()).optional(),
});

// ============================================================================
// Type Exports (inferred from schemas)
// ============================================================================

export type EmailAddressInput = z.infer<typeof emailAddressSchema>;
export type EmailContentInput = z.infer<typeof emailContentSchema>;
export type EmailAttachmentInput = z.infer<typeof emailAttachmentSchema>;
export type EmailMessageInput = z.infer<typeof emailMessageSchema>;
export type TemplatedEmailMessageInput = z.infer<typeof templatedEmailMessageSchema>;
export type BulkEmailDestinationInput = z.infer<typeof bulkEmailDestinationSchema>;
export type BulkTemplatedEmailMessageInput = z.infer<typeof bulkTemplatedEmailMessageSchema>;
export type SESConfigInput = z.infer<typeof sesConfigSchema>;
export type EmailServiceConfigInput = z.infer<typeof emailServiceConfigSchema>;
export type EmailClientConfigInput = z.infer<typeof emailClientConfigSchema>;
export type EmailTemplateInput = z.infer<typeof emailTemplateSchema>;
export type TemplateTestDataInput = z.infer<typeof templateTestDataSchema>;
export type SendEmailRequestInput = z.infer<typeof sendEmailRequestSchema>;
export type SendBulkEmailRequestInput = z.infer<typeof sendBulkEmailRequestSchema>;
