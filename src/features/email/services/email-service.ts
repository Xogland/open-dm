/**
 * Email Service
 * 
 * Core email sending functionality using Amazon SES.
 * Supports plain text, HTML, and templated emails.
 */

import {
    SendEmailCommand,
    type SendEmailCommandInput,
    SendTemplatedEmailCommand,
    type SendTemplatedEmailCommandInput,
    SendBulkTemplatedEmailCommand,
    type SendBulkTemplatedEmailCommandInput,
    type BulkEmailDestination,
    type Destination,
    type MessageTag,
} from "@aws-sdk/client-ses";

import { getSESClient, isSESConfigured } from "../client/ses-client";
import {
    emailMessageSchema,
    templatedEmailMessageSchema,
    bulkTemplatedEmailMessageSchema,
} from "../schemas";
import type {
    EmailMessage,
    TemplatedEmailMessage,
    BulkTemplatedEmailMessage,
    EmailSendResult,
    BulkEmailSendResult,
    BulkEmailSendStatus,
    EmailAddress,
    EmailError,
    EmailErrorCode,
} from "../types";
import { EmailError as EmailErrorClass, EmailErrorCode as ErrorCodes } from "../types";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats an EmailAddress into SES format.
 */
function formatAddress(address: EmailAddress): string {
    if (address.name) {
        // RFC 5322 format: "Display Name" <email@example.com>
        const escapedName = address.name.replace(/"/g, '\\"');
        return `"${escapedName}" <${address.email}>`;
    }
    return address.email;
}

/**
 * Formats an array of EmailAddress into SES format.
 */
function formatAddresses(addresses: EmailAddress[]): string[] {
    return addresses.map(formatAddress);
}

/**
 * Creates an SES Destination object.
 */
function createDestination(
    to: EmailAddress[],
    cc?: EmailAddress[],
    bcc?: EmailAddress[]
): Destination {
    return {
        ToAddresses: formatAddresses(to),
        CcAddresses: cc ? formatAddresses(cc) : undefined,
        BccAddresses: bcc ? formatAddresses(bcc) : undefined,
    };
}

/**
 * Converts tags object to SES MessageTag array.
 */
function createMessageTags(tags?: Record<string, string>): MessageTag[] | undefined {
    if (!tags) return undefined;
    return Object.entries(tags).map(([Name, Value]) => ({ Name, Value }));
}

/**
 * Maps SES errors to our EmailErrorCode.
 */
function mapSESError(error: Error): EmailErrorClass {
    const errorName = error.name || "";
    const errorMessage = error.message || "";

    // Common SES error types
    const errorMappings: Record<string, ErrorCodes> = {
        MessageRejected: ErrorCodes.SES_ERROR,
        MailFromDomainNotVerified: ErrorCodes.SANDBOX_MODE,
        ConfigurationSetDoesNotExist: ErrorCodes.CONFIG_SET_NOT_FOUND,
        TemplateDoesNotExist: ErrorCodes.TEMPLATE_NOT_FOUND,
        InvalidParameterValue: ErrorCodes.INVALID_ADDRESS,
        Throttling: ErrorCodes.RATE_EXCEEDED,
        LimitExceededException: ErrorCodes.QUOTA_EXCEEDED,
        AccountSendingPausedException: ErrorCodes.QUOTA_EXCEEDED,
        CredentialsError: ErrorCodes.CREDENTIALS_ERROR,
        UnrecognizedClientException: ErrorCodes.CREDENTIALS_ERROR,
        InvalidClientTokenId: ErrorCodes.CREDENTIALS_ERROR,
    };

    // Check for specific error patterns
    for (const [pattern, code] of Object.entries(errorMappings)) {
        if (errorName.includes(pattern) || errorMessage.includes(pattern)) {
            return new EmailErrorClass(errorMessage, code, error);
        }
    }

    // Network errors
    if (
        errorName.includes("NetworkingError") ||
        errorName.includes("TimeoutError") ||
        errorMessage.includes("ENOTFOUND") ||
        errorMessage.includes("ECONNREFUSED")
    ) {
        return new EmailErrorClass(errorMessage, ErrorCodes.NETWORK_ERROR, error);
    }

    return new EmailErrorClass(errorMessage, ErrorCodes.UNKNOWN, error);
}

/**
 * Creates a successful result.
 */
function successResult(messageId?: string): EmailSendResult {
    return {
        success: true,
        messageId,
    };
}

/**
 * Creates an error result.
 */
function errorResult(error: EmailErrorClass): EmailSendResult {
    return {
        success: false,
        error: error.message,
        errorCode: error.code,
    };
}

// ============================================================================
// Email Sending Functions
// ============================================================================

/**
 * Sends a single email message.
 * 
 * @param message - Email message to send
 * @returns Result with success status and messageId
 * 
 * @example
 * ```typescript
 * const result = await sendEmail({
 *   from: { email: "noreply@example.com", name: "Example App" },
 *   to: [{ email: "user@example.com" }],
 *   subject: "Welcome!",
 *   content: { html: "<h1>Welcome to our app!</h1>" },
 * });
 * ```
 */
export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
    // Validate input
    const validation = emailMessageSchema.safeParse(message);
    if (!validation.success) {
        return errorResult(
            new EmailErrorClass(
                `Validation failed: ${validation.error.issues[0]?.message}`,
                ErrorCodes.INVALID_ADDRESS
            )
        );
    }

    // Check configuration
    const configCheck = isSESConfigured();
    if (!configCheck.configured) {
        return errorResult(
            new EmailErrorClass(
                configCheck.error || "SES not configured",
                ErrorCodes.CREDENTIALS_ERROR
            )
        );
    }

    try {
        const client = getSESClient();

        // Build the command input
        const input: SendEmailCommandInput = {
            Source: formatAddress(message.from),
            Destination: createDestination(message.to, message.cc, message.bcc),
            Message: {
                Subject: {
                    Data: message.subject,
                    Charset: "UTF-8",
                },
                Body: {
                    ...(message.content.text && {
                        Text: {
                            Data: message.content.text,
                            Charset: "UTF-8",
                        },
                    }),
                    ...(message.content.html && {
                        Html: {
                            Data: message.content.html,
                            Charset: "UTF-8",
                        },
                    }),
                },
            },
            ReplyToAddresses: message.replyTo
                ? formatAddresses(message.replyTo)
                : undefined,
            ConfigurationSetName: message.configurationSetName,
            Tags: createMessageTags(message.tags),
        };

        const command = new SendEmailCommand(input);
        const response = await client.send(command);

        return successResult(response.MessageId);
    } catch (error) {
        const mappedError = mapSESError(error as Error);
        console.error("[EmailService] Send failed:", mappedError.message, {
            code: mappedError.code,
        });
        return errorResult(mappedError);
    }
}

/**
 * Sends a templated email using an SES template.
 * 
 * @param message - Templated email message
 * @returns Result with success status and messageId
 * 
 * @example
 * ```typescript
 * const result = await sendTemplatedEmail({
 *   from: { email: "noreply@example.com" },
 *   to: [{ email: "user@example.com" }],
 *   templateName: "WelcomeEmail",
 *   templateData: { name: "John", activationUrl: "https://..." },
 * });
 * ```
 */
export async function sendTemplatedEmail(
    message: TemplatedEmailMessage
): Promise<EmailSendResult> {
    // Validate input
    const validation = templatedEmailMessageSchema.safeParse(message);
    if (!validation.success) {
        return errorResult(
            new EmailErrorClass(
                `Validation failed: ${validation.error.issues[0]?.message}`,
                ErrorCodes.INVALID_ADDRESS
            )
        );
    }

    // Check configuration
    const configCheck = isSESConfigured();
    if (!configCheck.configured) {
        return errorResult(
            new EmailErrorClass(
                configCheck.error || "SES not configured",
                ErrorCodes.CREDENTIALS_ERROR
            )
        );
    }

    try {
        const client = getSESClient();

        const input: SendTemplatedEmailCommandInput = {
            Source: formatAddress(message.from),
            Destination: createDestination(message.to, message.cc, message.bcc),
            Template: message.templateName,
            TemplateData: JSON.stringify(message.templateData),
            ReplyToAddresses: message.replyTo
                ? formatAddresses(message.replyTo)
                : undefined,
            ConfigurationSetName: message.configurationSetName,
            Tags: createMessageTags(message.tags),
        };

        const command = new SendTemplatedEmailCommand(input);
        const response = await client.send(command);

        return successResult(response.MessageId);
    } catch (error) {
        const mappedError = mapSESError(error as Error);
        console.error("[EmailService] Templated send failed:", mappedError.message, {
            code: mappedError.code,
            template: message.templateName,
        });
        return errorResult(mappedError);
    }
}

/**
 * Sends bulk templated emails (up to 50 destinations).
 * 
 * @param message - Bulk email message with destinations
 * @returns Result with per-destination status
 * 
 * @example
 * ```typescript
 * const result = await sendBulkTemplatedEmail({
 *   from: { email: "noreply@example.com" },
 *   templateName: "Newsletter",
 *   defaultTemplateData: { date: "2024-01" },
 *   destinations: [
 *     { to: { email: "user1@example.com" }, templateData: { name: "User 1" } },
 *     { to: { email: "user2@example.com" }, templateData: { name: "User 2" } },
 *   ],
 * });
 * ```
 */
export async function sendBulkTemplatedEmail(
    message: BulkTemplatedEmailMessage
): Promise<BulkEmailSendResult> {
    // Validate input
    const validation = bulkTemplatedEmailMessageSchema.safeParse(message);
    if (!validation.success) {
        const errorMessage = `Validation failed: ${validation.error.issues[0]?.message}`;
        return {
            success: false,
            total: message.destinations?.length ?? 0,
            successful: 0,
            failed: message.destinations?.length ?? 0,
            statuses: (message.destinations ?? []).map((dest) => ({
                email: dest.to.email,
                success: false,
                error: errorMessage,
                errorCode: ErrorCodes.INVALID_ADDRESS,
            })),
        };
    }

    // Check configuration
    const configCheck = isSESConfigured();
    if (!configCheck.configured) {
        const errorMessage = configCheck.error || "SES not configured";
        return {
            success: false,
            total: message.destinations.length,
            successful: 0,
            failed: message.destinations.length,
            statuses: message.destinations.map((dest) => ({
                email: dest.to.email,
                success: false,
                error: errorMessage,
                errorCode: ErrorCodes.CREDENTIALS_ERROR,
            })),
        };
    }

    try {
        const client = getSESClient();

        // Build destinations
        const destinations: BulkEmailDestination[] = message.destinations.map((dest) => ({
            Destination: createDestination([dest.to], dest.cc, dest.bcc),
            ReplacementTemplateData: dest.templateData
                ? JSON.stringify({
                    ...message.defaultTemplateData,
                    ...dest.templateData,
                })
                : undefined,
            ReplacementTags: createMessageTags(dest.tags),
        }));

        const input: SendBulkTemplatedEmailCommandInput = {
            Source: formatAddress(message.from),
            Template: message.templateName,
            DefaultTemplateData: JSON.stringify(message.defaultTemplateData),
            Destinations: destinations,
            ReplyToAddresses: message.replyTo
                ? formatAddresses(message.replyTo)
                : undefined,
            ConfigurationSetName: message.configurationSetName,
            DefaultTags: createMessageTags(message.defaultTags),
        };

        const command = new SendBulkTemplatedEmailCommand(input);
        const response = await client.send(command);

        // Build per-destination status
        const statuses: BulkEmailSendStatus[] = (response.Status ?? []).map(
            (status, index) => {
                const dest = message.destinations[index];
                return {
                    email: dest?.to.email ?? "unknown",
                    success: status.Status === "Success",
                    messageId: status.MessageId,
                    error: status.Error,
                };
            }
        );

        const successful = statuses.filter((s) => s.success).length;
        const failed = statuses.filter((s) => !s.success).length;

        return {
            success: failed === 0,
            total: statuses.length,
            successful,
            failed,
            statuses,
        };
    } catch (error) {
        const mappedError = mapSESError(error as Error);
        console.error("[EmailService] Bulk send failed:", mappedError.message, {
            code: mappedError.code,
            template: message.templateName,
            destinations: message.destinations.length,
        });

        return {
            success: false,
            total: message.destinations.length,
            successful: 0,
            failed: message.destinations.length,
            statuses: message.destinations.map((dest) => ({
                email: dest.to.email,
                success: false,
                error: mappedError.message,
                errorCode: mappedError.code,
            })),
        };
    }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Quick helper to send a simple email.
 * Uses environment variable for default sender.
 */
export async function sendSimpleEmail(
    to: string | string[],
    subject: string,
    content: { text?: string; html?: string }
): Promise<EmailSendResult> {
    const defaultFromEmail = process.env.AWS_SES_FROM_EMAIL;
    const defaultFromName = process.env.AWS_SES_FROM_NAME;

    if (!defaultFromEmail) {
        return errorResult(
            new EmailErrorClass(
                "AWS_SES_FROM_EMAIL environment variable not set",
                ErrorCodes.CREDENTIALS_ERROR
            )
        );
    }

    const toAddresses = Array.isArray(to) ? to : [to];

    return sendEmail({
        from: {
            email: defaultFromEmail,
            name: defaultFromName,
        },
        to: toAddresses.map((email) => ({ email })),
        subject,
        content,
    });
}
