/**
 * Email Feature Type Definitions
 * 
 * Type-first approach: All interfaces defined here before implementation.
 * These types provide strict type safety across the email feature.
 */

import type { SESClientConfig } from "@aws-sdk/client-ses";

// ============================================================================
// Core Email Types
// ============================================================================

/**
 * Represents a single email address with optional display name.
 */
export interface EmailAddress {
    /** Email address (e.g., "user@example.com") */
    email: string;
    /** Optional display name (e.g., "John Doe") */
    name?: string;
}

/**
 * Email content in text and/or HTML format.
 */
export interface EmailContent {
    /** Plain text body */
    text?: string;
    /** HTML body */
    html?: string;
}

/**
 * Email attachment configuration.
 */
export interface EmailAttachment {
    /** Filename to display */
    filename: string;
    /** Base64 encoded content */
    content: string;
    /** MIME type (e.g., "application/pdf") */
    contentType: string;
    /** Content ID for inline attachments */
    contentId?: string;
}

/**
 * Complete email message structure.
 */
export interface EmailMessage {
    /** Sender email address */
    from: EmailAddress;
    /** Primary recipients */
    to: EmailAddress[];
    /** Carbon copy recipients */
    cc?: EmailAddress[];
    /** Blind carbon copy recipients */
    bcc?: EmailAddress[];
    /** Reply-to address (defaults to from) */
    replyTo?: EmailAddress[];
    /** Email subject line */
    subject: string;
    /** Email body content */
    content: EmailContent;
    /** Optional attachments */
    attachments?: EmailAttachment[];
    /** Custom headers */
    headers?: Record<string, string>;
    /** Configuration set name for tracking */
    configurationSetName?: string;
    /** Message tags for categorization */
    tags?: Record<string, string>;
}

// ============================================================================
// Templated Email Types
// ============================================================================

/**
 * Templated email message structure.
 * Uses AWS SES templates for dynamic content.
 */
export interface TemplatedEmailMessage {
    /** Sender email address */
    from: EmailAddress;
    /** Primary recipients */
    to: EmailAddress[];
    /** Carbon copy recipients */
    cc?: EmailAddress[];
    /** Blind carbon copy recipients */
    bcc?: EmailAddress[];
    /** Reply-to address */
    replyTo?: EmailAddress[];
    /** AWS SES template name */
    templateName: string;
    /** Template data for variable substitution */
    templateData: Record<string, unknown>;
    /** Configuration set name for tracking */
    configurationSetName?: string;
    /** Message tags for categorization */
    tags?: Record<string, string>;
}

/**
 * Bulk email destination with personalized template data.
 */
export interface BulkEmailDestination {
    /** Recipient email address */
    to: EmailAddress;
    /** Carbon copy recipients for this destination */
    cc?: EmailAddress[];
    /** Blind carbon copy recipients for this destination */
    bcc?: EmailAddress[];
    /** Personalized template data for this recipient */
    templateData?: Record<string, unknown>;
    /** Message tags specific to this destination */
    tags?: Record<string, string>;
}

/**
 * Bulk templated email message structure.
 * Supports up to 50 destinations per call.
 */
export interface BulkTemplatedEmailMessage {
    /** Sender email address */
    from: EmailAddress;
    /** Reply-to address */
    replyTo?: EmailAddress[];
    /** AWS SES template name */
    templateName: string;
    /** Default template data (can be overridden per destination) */
    defaultTemplateData: Record<string, unknown>;
    /** List of destinations (max 50) */
    destinations: BulkEmailDestination[];
    /** Configuration set name for tracking */
    configurationSetName?: string;
    /** Default tags for all destinations */
    defaultTags?: Record<string, string>;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Email send operation result.
 */
export interface EmailSendResult {
    /** Whether the operation was successful */
    success: boolean;
    /** AWS SES Message ID */
    messageId?: string;
    /** Error message if failed */
    error?: string;
    /** Error code for programmatic handling */
    errorCode?: string;
}

/**
 * Bulk email send operation result per destination.
 */
export interface BulkEmailSendStatus {
    /** Recipient email */
    email: string;
    /** Whether this specific send was successful */
    success: boolean;
    /** AWS SES Message ID for this destination */
    messageId?: string;
    /** Error message if failed */
    error?: string;
    /** Error code */
    errorCode?: string;
}

/**
 * Complete bulk email send result.
 */
export interface BulkEmailSendResult {
    /** Overall success (all destinations succeeded) */
    success: boolean;
    /** Total destinations processed */
    total: number;
    /** Number of successful sends */
    successful: number;
    /** Number of failed sends */
    failed: number;
    /** Per-destination status */
    statuses: BulkEmailSendStatus[];
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * AWS SES client configuration options.
 */
export interface SESConfig {
    /** AWS Region (e.g., "us-east-1") */
    region: string;
    /** AWS Access Key ID */
    accessKeyId: string;
    /** AWS Secret Access Key */
    secretAccessKey: string;
    /** Optional endpoint (for testing with LocalStack) */
    endpoint?: string;
}

/**
 * Email service configuration options.
 */
export interface EmailServiceConfig {
    /** Default sender address */
    defaultFrom: EmailAddress;
    /** Default configuration set for tracking */
    defaultConfigurationSet?: string;
    /** Maximum retry attempts */
    maxRetries?: number;
    /** Whether to throw on errors or return error result */
    throwOnError?: boolean;
    /** Enable debug logging */
    debug?: boolean;
}

/**
 * Complete email client configuration.
 */
export interface EmailClientConfig {
    /** AWS SES configuration */
    ses: SESConfig;
    /** Email service configuration */
    service?: EmailServiceConfig;
}

// ============================================================================
// Template Types (for creating/managing templates)
// ============================================================================

/**
 * Email template definition.
 */
export interface EmailTemplate {
    /** Unique template name */
    name: string;
    /** Subject line (can contain variables) */
    subject: string;
    /** Plain text body template */
    text?: string;
    /** HTML body template */
    html?: string;
}

/**
 * Template test data for rendering preview.
 */
export interface TemplateTestData {
    /** Template name to test */
    templateName: string;
    /** Sample data for rendering */
    testData: Record<string, unknown>;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Email-specific error types for handling.
 */
export enum EmailErrorCode {
    /** Invalid email address format */
    INVALID_ADDRESS = "INVALID_ADDRESS",
    /** AWS credentials invalid or missing */
    CREDENTIALS_ERROR = "CREDENTIALS_ERROR",
    /** Account is in sandbox mode */
    SANDBOX_MODE = "SANDBOX_MODE",
    /** Sending quota exceeded */
    QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
    /** Sending rate exceeded */
    RATE_EXCEEDED = "RATE_EXCEEDED",
    /** Template not found */
    TEMPLATE_NOT_FOUND = "TEMPLATE_NOT_FOUND",
    /** Configuration set not found */
    CONFIG_SET_NOT_FOUND = "CONFIG_SET_NOT_FOUND",
    /** Email content missing */
    CONTENT_MISSING = "CONTENT_MISSING",
    /** Generic SES error */
    SES_ERROR = "SES_ERROR",
    /** Network/connectivity error */
    NETWORK_ERROR = "NETWORK_ERROR",
    /** Unknown error */
    UNKNOWN = "UNKNOWN",
}

/**
 * Custom error class for email operations.
 */
export class EmailError extends Error {
    constructor(
        message: string,
        public readonly code: EmailErrorCode,
        public readonly originalError?: Error
    ) {
        super(message);
        this.name = "EmailError";
    }
}
