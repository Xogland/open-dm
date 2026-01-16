/**
 * Email Template Service
 * 
 * Manages SES email templates: create, update, delete, and test.
 */

import {
    CreateTemplateCommand,
    type CreateTemplateCommandInput,
    UpdateTemplateCommand,
    type UpdateTemplateCommandInput,
    DeleteTemplateCommand,
    GetTemplateCommand,
    ListTemplatesCommand,
    TestRenderTemplateCommand,
} from "@aws-sdk/client-ses";

import { getSESClient, isSESConfigured } from "../client/ses-client";
import { emailTemplateSchema, templateTestDataSchema } from "../schemas";
import type { EmailTemplate } from "../types";
import { EmailErrorCode } from "../types";

// ============================================================================
// Types
// ============================================================================

export interface TemplateOperationResult {
    success: boolean;
    error?: string;
    errorCode?: EmailErrorCode;
}

export interface TemplateListResult {
    success: boolean;
    templates?: Array<{
        name: string;
        createdAt?: Date;
    }>;
    nextToken?: string;
    error?: string;
}

export interface TemplateGetResult {
    success: boolean;
    template?: EmailTemplate;
    error?: string;
}

export interface TemplateRenderResult {
    success: boolean;
    renderedSubject?: string;
    renderedText?: string;
    renderedHtml?: string;
    error?: string;
}

// ============================================================================
// Template Management Functions
// ============================================================================

/**
 * Creates a new email template in SES.
 * 
 * @param template - Template definition
 * @returns Operation result
 * 
 * @example
 * ```typescript
 * const result = await createEmailTemplate({
 *   name: "WelcomeEmail",
 *   subject: "Welcome, {{name}}!",
 *   html: "<h1>Hello {{name}}</h1><p>Welcome to our app!</p>",
 *   text: "Hello {{name}}, Welcome to our app!",
 * });
 * ```
 */
export async function createEmailTemplate(
    template: EmailTemplate
): Promise<TemplateOperationResult> {
    // Validate input
    const validation = emailTemplateSchema.safeParse(template);
    if (!validation.success) {
        return {
            success: false,
            error: `Validation failed: ${validation.error.issues[0]?.message}`,
            errorCode: EmailErrorCode.INVALID_ADDRESS,
        };
    }

    // Check configuration
    const configCheck = isSESConfigured();
    if (!configCheck.configured) {
        return {
            success: false,
            error: configCheck.error,
            errorCode: EmailErrorCode.CREDENTIALS_ERROR,
        };
    }

    try {
        const client = getSESClient();

        const input: CreateTemplateCommandInput = {
            Template: {
                TemplateName: template.name,
                SubjectPart: template.subject,
                TextPart: template.text,
                HtmlPart: template.html,
            },
        };

        const command = new CreateTemplateCommand(input);
        await client.send(command);

        return { success: true };
    } catch (error) {
        const err = error as Error;
        console.error("[TemplateService] Create failed:", err.message);

        return {
            success: false,
            error: err.message,
            errorCode: err.name.includes("AlreadyExists")
                ? EmailErrorCode.SES_ERROR
                : EmailErrorCode.UNKNOWN,
        };
    }
}

/**
 * Updates an existing email template.
 */
export async function updateEmailTemplate(
    template: EmailTemplate
): Promise<TemplateOperationResult> {
    // Validate input
    const validation = emailTemplateSchema.safeParse(template);
    if (!validation.success) {
        return {
            success: false,
            error: `Validation failed: ${validation.error.issues[0]?.message}`,
            errorCode: EmailErrorCode.INVALID_ADDRESS,
        };
    }

    const configCheck = isSESConfigured();
    if (!configCheck.configured) {
        return {
            success: false,
            error: configCheck.error,
            errorCode: EmailErrorCode.CREDENTIALS_ERROR,
        };
    }

    try {
        const client = getSESClient();

        const input: UpdateTemplateCommandInput = {
            Template: {
                TemplateName: template.name,
                SubjectPart: template.subject,
                TextPart: template.text,
                HtmlPart: template.html,
            },
        };

        const command = new UpdateTemplateCommand(input);
        await client.send(command);

        return { success: true };
    } catch (error) {
        const err = error as Error;
        console.error("[TemplateService] Update failed:", err.message);

        return {
            success: false,
            error: err.message,
            errorCode: err.name.includes("DoesNotExist")
                ? EmailErrorCode.TEMPLATE_NOT_FOUND
                : EmailErrorCode.UNKNOWN,
        };
    }
}

/**
 * Creates or updates an email template.
 * Tries create first, falls back to update if exists.
 */
export async function upsertEmailTemplate(
    template: EmailTemplate
): Promise<TemplateOperationResult> {
    const createResult = await createEmailTemplate(template);

    if (createResult.success) {
        return createResult;
    }

    // If already exists, try update
    if (
        createResult.error?.includes("AlreadyExists") ||
        createResult.error?.includes("already exists")
    ) {
        return updateEmailTemplate(template);
    }

    return createResult;
}

/**
 * Deletes an email template.
 */
export async function deleteEmailTemplate(
    templateName: string
): Promise<TemplateOperationResult> {
    const configCheck = isSESConfigured();
    if (!configCheck.configured) {
        return {
            success: false,
            error: configCheck.error,
            errorCode: EmailErrorCode.CREDENTIALS_ERROR,
        };
    }

    try {
        const client = getSESClient();
        const command = new DeleteTemplateCommand({
            TemplateName: templateName,
        });
        await client.send(command);

        return { success: true };
    } catch (error) {
        const err = error as Error;
        console.error("[TemplateService] Delete failed:", err.message);

        return {
            success: false,
            error: err.message,
            errorCode: err.name.includes("DoesNotExist")
                ? EmailErrorCode.TEMPLATE_NOT_FOUND
                : EmailErrorCode.UNKNOWN,
        };
    }
}

/**
 * Gets an email template by name.
 */
export async function getEmailTemplate(
    templateName: string
): Promise<TemplateGetResult> {
    const configCheck = isSESConfigured();
    if (!configCheck.configured) {
        return {
            success: false,
            error: configCheck.error,
        };
    }

    try {
        const client = getSESClient();
        const command = new GetTemplateCommand({
            TemplateName: templateName,
        });
        const response = await client.send(command);

        if (!response.Template) {
            return {
                success: false,
                error: "Template not found",
            };
        }

        return {
            success: true,
            template: {
                name: response.Template.TemplateName ?? templateName,
                subject: response.Template.SubjectPart ?? "",
                text: response.Template.TextPart,
                html: response.Template.HtmlPart,
            },
        };
    } catch (error) {
        const err = error as Error;
        return {
            success: false,
            error: err.message,
        };
    }
}

/**
 * Lists all email templates in the account.
 */
export async function listEmailTemplates(
    nextToken?: string,
    maxItems = 50
): Promise<TemplateListResult> {
    const configCheck = isSESConfigured();
    if (!configCheck.configured) {
        return {
            success: false,
            error: configCheck.error,
        };
    }

    try {
        const client = getSESClient();
        const command = new ListTemplatesCommand({
            NextToken: nextToken,
            MaxItems: maxItems,
        });
        const response = await client.send(command);

        return {
            success: true,
            templates: (response.TemplatesMetadata ?? []).map((t) => ({
                name: t.Name ?? "",
                createdAt: t.CreatedTimestamp,
            })),
            nextToken: response.NextToken,
        };
    } catch (error) {
        const err = error as Error;
        return {
            success: false,
            error: err.message,
        };
    }
}

/**
 * Tests template rendering with sample data.
 * Returns the rendered content without sending.
 */
export async function testRenderTemplate(
    templateName: string,
    testData: Record<string, unknown>
): Promise<TemplateRenderResult> {
    const validation = templateTestDataSchema.safeParse({ templateName, testData });
    if (!validation.success) {
        return {
            success: false,
            error: `Validation failed: ${validation.error.issues[0]?.message}`,
        };
    }

    const configCheck = isSESConfigured();
    if (!configCheck.configured) {
        return {
            success: false,
            error: configCheck.error,
        };
    }

    try {
        const client = getSESClient();
        const command = new TestRenderTemplateCommand({
            TemplateName: templateName,
            TemplateData: JSON.stringify(testData),
        });
        const response = await client.send(command);

        // Parse the rendered template
        // SES returns the full message, we need to extract parts
        const rendered = response.RenderedTemplate ?? "";

        return {
            success: true,
            renderedSubject: extractPart(rendered),
            renderedText: extractPart(rendered),
            renderedHtml: extractPart(rendered),
        };
    } catch (error) {
        const err = error as Error;
        return {
            success: false,
            error: err.message,
        };
    }
}

/**
 * Helper to extract parts from rendered template.
 * This is a simplified parser; actual SES output format may vary.
 */
function extractPart(rendered: string): string | undefined {
    // The rendered template contains the full email - return as-is for now
    // In production, you might want to parse the MIME structure
    return rendered || undefined;
}
