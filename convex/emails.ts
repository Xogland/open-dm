"use node";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize SES Client
const sesClient = new SESClient({
    region: process.env.AWS_SES_REGION || process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    }
});

export const sendEscalation = internalAction({
    args: {
        emails: v.array(v.string()),
        submissionId: v.id("submissions"),
        orgName: v.string(),
        service: v.string(),
        workflowAnswers: v.optional(v.any()), // Rich data from form
        content: v.optional(v.string()),      // Legacy content
        senderEmail: v.optional(v.string()),  // Sender's email
    },
    handler: async (ctx, args) => {
        if (args.emails.length === 0) return;

        const fromEmail = process.env.AWS_SES_FROM_EMAIL;
        if (!fromEmail) {
            console.error("AWS_SES_FROM_EMAIL is not set, cannot send escalation email.");
            return;
        }

        const { emails, orgName, service, workflowAnswers, content, senderEmail, submissionId } = args;

        // Validation & Sanitization (Architecture Doc 7.3)
        if (emails.length > 50) {
            console.warn(`[Email] Too many recipients (${emails.length}), truncating to 50.`);
            emails.splice(50);
        }

        // Basic content escaping/sanitization could be done here if needed, 
        // but since we are sending HTML via a template, we should ensure values are safe.
        // For simplicity and matching 7.3 requirements:
        const sanitizedContent = content ? content.substring(0, 5000) : ""; // Length limit 5000 chars

        // Email Check
        console.log(`[Email] Preparing escalation email for ${emails.length} recipients regarding service: ${service}`);

        // Helper to render workflow answers based on UI logic
        let answersHtml = "";
        if (workflowAnswers && typeof workflowAnswers === "object") {
            const rows = Object.entries(workflowAnswers)
                .filter(([key]) => key !== "service")
                .map(([_, value]: any) => {
                    if (!value || !value.question) return "";
                    const { question, answer, type } = value;

                    let displayAnswer = String(answer);

                    // Formatting logic mirrored from SidePanel component
                    if (type === "multiple_choice") {
                        if (Array.isArray(answer)) {
                            displayAnswer = answer.map((a: any) => typeof a === "string" ? a : a.title).join(", ");
                        } else if (typeof answer === "object" && answer !== null) {
                            displayAnswer = answer.title || JSON.stringify(answer);
                        }
                    } else if (type === "file_upload" || type === "file") {
                        if (answer && typeof answer === "object" && answer.name) {
                            // File link would be ideal but simpler to show metadata
                            displayAnswer = `📎 ${answer.name} (${(answer.size / 1024).toFixed(1)} KB)`;
                        } else {
                            displayAnswer = "No file uploaded";
                        }
                    } else if (typeof answer === "object" && answer !== null) {
                        displayAnswer = JSON.stringify(answer);
                    }

                    return `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 40%; vertical-align: top; font-size: 14px;">${question}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #334155; font-weight: 500; font-size: 14px;">${displayAnswer}</td>
                    </tr>
                `;
                })
                .join("");

            if (rows) {
                answersHtml = `
                <div style="margin-top: 24px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #f8fafc; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 14px;">
                        Form Responses
                    </div>
                    <table style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
                        ${rows}
                    </table>
                </div>
            `;
            }
        }

        // Render message content
        let contentHtml = "";
        if (content) {
            contentHtml = `
            <div style="margin-top: 24px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                 <div style="background-color: #f8fafc; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 14px;">
                    Message Content
                </div>
                <div style="padding: 16px; color: #334155; line-height: 1.6; white-space: pre-wrap; font-size: 14px; background-color: #ffffff;">
                    ${content}
                </div>
            </div>
        `;
        }

        // Construct Email Content
        const subject = `New Submission: ${service} - ${orgName}`;
        const dashboardUrl = process.env.NEXT_PUBLIC_CONVEX_URL
            ? process.env.NEXT_PUBLIC_CONVEX_URL.replace(".convex.cloud", ".vercel.app")
            : "https://open-dm.vercel.app";

        const submissionLink = `${dashboardUrl}/inbox?submissionId=${submissionId}`;

        const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f1f5f9; }
              .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
              .header { background-color: #ffffff; padding: 24px; text-align: center; border-bottom: 1px solid #e2e8f0; }
              .content { padding: 32px 24px; }
              .footer { background-color: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; }
              .button { display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 24px; }
              .meta-item { margin-bottom: 8px; font-size: 14px; color: #64748b; }
              .meta-value { color: #0f172a; font-weight: 500; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2 style="margin: 0; color: #0f172a; font-size: 20px;">New Submission Received</h2>
              </div>
              <div class="content">
                  <p style="margin-top: 0;">Hello,</p>
                  <p>A new submission has been received for <strong>${orgName}</strong>.</p>
                  
                  <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
                      <div class="meta-item">Service: <span class="meta-value">${service}</span></div>
                      <div class="meta-item">Sender: <span class="meta-value">${senderEmail || "Anonymous"}</span></div>
                  </div>

                  ${answersHtml}
                  ${contentHtml}
                  
                  <div style="text-align: center;">
                      <a href="${submissionLink}" class="button">View in Dashboard</a>
                  </div>
              </div>
              <div class="footer">
                  <p style="margin: 0;">Powered by Open DM</p>
                  <p style="margin: 8px 0 0;">You received this email because of your notification preferences.</p>
              </div>
          </div>
      </body>
      </html>
    `;

        // Send Email via SES
        const command = new SendEmailCommand({
            Source: fromEmail,
            Destination: {
                BccAddresses: emails,
            },
            ReplyToAddresses: senderEmail ? [senderEmail] : [],
            Message: {
                Subject: { Data: subject },
                Body: {
                    Html: { Data: htmlBody },
                    Text: { Data: `New Submission for ${orgName} (${service}) from ${senderEmail || "Anonymous"}. View details in your dashboard.` },
                },
            },
        });

        try {
            const response = await sesClient.send(command);
            const messageId = response.MessageId;
            console.log(`[Email] Escalation email sent successfully to ${emails.length} recipients. MessageId: ${messageId}`);

            if (messageId && submissionId) {
                // We use any because internal isn't fully typed for cross-file actions in local context sometimes
                // but this is the standard way to call mutations from actions.
                await ctx.runMutation(internal.submission.updateSubmissionSesId, {
                    id: submissionId,
                    sesMessageId: messageId,
                });
            }
        } catch (error) {
            console.error("[Email] Failed to send escalation email:", error);
        }
    },
});
