"use server";

import { getSESClient } from "@/features/email/client/ses-client";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { z } from "zod";

const sendEmailSchema = z.object({
    to: z.string().email(),
    subject: z.string().min(1),
    htmlBody: z.string().min(1),
    textBody: z.string().optional(),
});

export type SendEmailState = {
    success?: boolean;
    message?: string;
    error?: string;
    messageId?: string;
};

export async function sendTestEmailAction(prevState: SendEmailState, formData: FormData): Promise<SendEmailState> {
    try {
        const rawData = {
            to: formData.get("to"),
            subject: formData.get("subject"),
            htmlBody: formData.get("htmlBody"),
            textBody: formData.get("textBody"),
        };

        const validatedData = sendEmailSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                success: false,
                error: "Validation failed: " + validatedData.error.errors.map(e => e.message).join(", "),
            };
        }

        const { to, subject, htmlBody, textBody } = validatedData.data;

        const client = getSESClient();
        const fromEmail = process.env.AWS_SES_FROM_EMAIL;

        if (!fromEmail) {
            return {
                success: false,
                error: "AWS_SES_FROM_EMAIL environment variable is not set"
            };
        }

        const command = new SendEmailCommand({
            Source: fromEmail,
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Html: {
                        Data: htmlBody,
                    },
                    Text: {
                        Data: textBody || htmlBody.replace(/<[^>]*>?/gm, ""), // Simple strip tags fallback
                    },
                },
            },
        });

        const response = await client.send(command);

        return {
            success: true,
            message: "Email sent successfully",
            messageId: response.MessageId,
        };

    } catch (error) {
        console.error("Failed to send test email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}
