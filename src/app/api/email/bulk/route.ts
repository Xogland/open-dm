/**
 * Bulk Email Send API Route
 * 
 * POST /api/email/bulk
 * 
 * Server-side endpoint for sending bulk templated emails.
 * Supports up to 50 recipients per request.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendBulkEmailRequestSchema } from "@/features/email/schemas";
import { sendBulkTemplatedEmail, isSESConfigured } from "@/features/email/services";
import type { EmailAddress, BulkTemplatedEmailMessage } from "@/features/email/types";

// ============================================================================
// Types
// ============================================================================

interface BulkApiErrorResponse {
    success: false;
    error: string;
    code?: string;
}

interface BulkApiSuccessResponse {
    success: true;
    total: number;
    successful: number;
    failed: number;
    results: Array<{
        email: string;
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
}

type BulkApiResponse = BulkApiSuccessResponse | BulkApiErrorResponse;

// ============================================================================
// Helpers
// ============================================================================

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

export async function POST(request: NextRequest): Promise<NextResponse<BulkApiResponse>> {
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
        const validation = sendBulkEmailRequestSchema.safeParse(body);

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
        const from = data.from ?? getDefaultSender();

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

        // Build bulk message
        const message: BulkTemplatedEmailMessage = {
            from,
            templateName: data.templateName,
            defaultTemplateData: data.defaultTemplateData,
            destinations: data.destinations.map((dest) => ({
                to: {
                    email: dest.email,
                    name: dest.name,
                },
                templateData: dest.templateData,
            })),
            replyTo: data.replyTo,
            defaultTags: data.tags as Record<string, string> | undefined,
        };

        const result = await sendBulkTemplatedEmail(message);

        if (result.failed === result.total) {
            // All failed
            return NextResponse.json(
                {
                    success: false,
                    error: result.statuses[0]?.error ?? "All emails failed to send",
                    code: result.statuses[0]?.errorCode,
                },
                { status: 500 }
            );
        }

        const response: BulkApiSuccessResponse = {
            success: true,
            total: result.total,
            successful: result.successful,
            failed: result.failed,
            results: result.statuses.map((s) => ({
                email: s.email,
                success: s.success,
                messageId: s.messageId,
                error: s.error,
            })),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("[API/Email/Bulk] Unexpected error:", error);

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
