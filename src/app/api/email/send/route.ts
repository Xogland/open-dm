/**
 * Email Send API Route
 * 
 * POST /api/email/send
 * 
 * Server-side endpoint for sending emails via Amazon SES.
 * This keeps AWS credentials secure on the server.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendEmailRequestSchema } from "@/features/email/schemas";
import { sendEmail, sendTemplatedEmail, isSESConfigured } from "@/features/email/services";
import type { EmailAddress, EmailMessage, TemplatedEmailMessage } from "@/features/email/types";

// ============================================================================
// Types
// ============================================================================

interface ApiErrorResponse {
    success: false;
    error: string;
    code?: string;
}

interface ApiSuccessResponse {
    success: true;
    messageId?: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// ============================================================================
// Helpers
// ============================================================================

/**
 * Normalizes email input to EmailAddress format.
 */
function normalizeAddress(
    input: string | { email: string; name?: string }
): EmailAddress {
    if (typeof input === "string") {
        return { email: input };
    }
    return input;
}

/**
 * Normalizes an array of email inputs.
 */
function normalizeAddresses(
    input: (string | { email: string; name?: string })[]
): EmailAddress[] {
    return input.map(normalizeAddress);
}

/**
 * Gets default sender from environment.
 */
function getDefaultSender(): EmailAddress | null {
    const email = process.env.AWS_SES_FROM_EMAIL;
    if (!email) return null;

    return {
        email,
        name: process.env.AWS_SES_FROM_NAME,
    };
}

// ============================================================================
// Route Handler
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        // Check SES configuration
        const configCheck = isSESConfigured();
        if (!configCheck.configured) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Email service not configured",
                    code: "CONFIGURATION_ERROR",
                },
                { status: 503 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = sendEmailRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: validation.error.issues[0]?.message ?? "Invalid request",
                    code: "VALIDATION_ERROR",
                },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Determine sender
        const from = data.from
            ? normalizeAddress(data.from)
            : getDefaultSender();

        if (!from) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No sender specified and AWS_SES_FROM_EMAIL not configured",
                    code: "MISSING_SENDER",
                },
                { status: 400 }
            );
        }

        // Handle templated email
        if (data.templateName && data.templateData) {
            const to = Array.isArray(data.to) ? data.to : [data.to];

            const message: TemplatedEmailMessage = {
                from,
                to: normalizeAddresses(to),
                templateName: data.templateName,
                templateData: data.templateData,
                cc: data.cc ? normalizeAddresses(data.cc) : undefined,
                bcc: data.bcc ? normalizeAddresses(data.bcc) : undefined,
                replyTo: data.replyTo ? normalizeAddresses(data.replyTo) : undefined,
                tags: data.tags as Record<string, string> | undefined,
            };

            const result = await sendTemplatedEmail(message);

            if (!result.success) {
                return NextResponse.json(
                    {
                        success: false,
                        error: result.error ?? "Failed to send email",
                        code: result.errorCode,
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                messageId: result.messageId,
            });
        }

        // Handle regular email
        const to = Array.isArray(data.to) ? data.to : [data.to];

        const message: EmailMessage = {
            from,
            to: normalizeAddresses(to),
            subject: data.subject,
            content: data.content,
            cc: data.cc ? normalizeAddresses(data.cc) : undefined,
            bcc: data.bcc ? normalizeAddresses(data.bcc) : undefined,
            replyTo: data.replyTo ? normalizeAddresses(data.replyTo) : undefined,
            tags: data.tags as Record<string, string> | undefined,
        };

        const result = await sendEmail(message);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error ?? "Failed to send email",
                    code: result.errorCode,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            messageId: result.messageId,
        });
    } catch (error) {
        console.error("[API/Email] Unexpected error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
                code: "INTERNAL_ERROR",
            },
            { status: 500 }
        );
    }
}

// ============================================================================
// Health Check
// ============================================================================

export async function GET(): Promise<NextResponse> {
    const configCheck = isSESConfigured();

    return NextResponse.json({
        service: "email",
        provider: "amazon-ses",
        configured: configCheck.configured,
        error: configCheck.error,
    });
}
