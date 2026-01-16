/**
 * Common Email Templates
 * 
 * Pre-built email templates for common use cases.
 * These can be used directly or as starting points for customization.
 */

import {
    generateBaseEmailTemplate,
    generateHeadingHtml,
    generateParagraphHtml,
    generateButtonHtml,
    generateDividerHtml,
    generateCalloutHtml,
    type BaseTemplateOptions,
} from "./base-template";

// ============================================================================
// Template Data Interfaces
// ============================================================================

export interface WelcomeEmailData {
    recipientName: string;
    brandName?: string;
    loginUrl: string;
    supportEmail?: string;
}

export interface PasswordResetData {
    recipientName: string;
    brandName?: string;
    resetUrl: string;
    expiryMinutes?: number;
}

export interface NotificationEmailData {
    recipientName: string;
    brandName?: string;
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
}

export interface InvoiceEmailData {
    recipientName: string;
    brandName?: string;
    invoiceNumber: string;
    amount: string;
    dueDate: string;
    items: Array<{ description: string; amount: string }>;
    paymentUrl?: string;
}

export interface TeamInviteData {
    inviterName: string;
    teamName: string;
    brandName?: string;
    inviteUrl: string;
    expiryDays?: number;
}

// ============================================================================
// Email Template Generators
// ============================================================================

/**
 * Generates a welcome email for new users.
 */
export function generateWelcomeEmail(data: WelcomeEmailData): string {
    const {
        recipientName,
        brandName = "Open DM",
        loginUrl,
        supportEmail = "support@example.com",
    } = data;

    const content = `
    ${generateHeadingHtml(`Welcome to ${brandName}!`, { align: "center" })}
    
    ${generateParagraphHtml(`Hi ${recipientName},`, { align: "center" })}
    
    ${generateParagraphHtml(
        `Thanks for joining ${brandName}! We're excited to have you on board. Your account is now active and ready to use.`,
        { align: "center" }
    )}
    
    ${generateButtonHtml("Get Started", loginUrl)}
    
    ${generateDividerHtml()}
    
    ${generateParagraphHtml(
        `If you have any questions, feel free to reach out to us at <a href="mailto:${supportEmail}" style="color: #6366f1;">${supportEmail}</a>.`,
        { align: "center", muted: true }
    )}
  `;

    return generateBaseEmailTemplate({
        content,
        brandName,
        preheader: `Welcome to ${brandName}! Your account is ready.`,
    });
}

/**
 * Generates a password reset email.
 */
export function generatePasswordResetEmail(data: PasswordResetData): string {
    const {
        recipientName,
        brandName = "Open DM",
        resetUrl,
        expiryMinutes = 60,
    } = data;

    const content = `
    ${generateHeadingHtml("Reset Your Password", { align: "center" })}
    
    ${generateParagraphHtml(`Hi ${recipientName},`)}
    
    ${generateParagraphHtml(
        "We received a request to reset your password. Click the button below to create a new password:"
    )}
    
    ${generateButtonHtml("Reset Password", resetUrl)}
    
    ${generateCalloutHtml(
        `This link will expire in ${expiryMinutes} minutes. If you didn't request a password reset, you can safely ignore this email.`,
        { type: "warning" }
    )}
    
    ${generateDividerHtml()}
    
    ${generateParagraphHtml(
        "If the button above doesn't work, copy and paste this link into your browser:",
        { muted: true }
    )}
    
    <p style="margin: 0; font-size: 12px; color: #6b7280; word-break: break-all;">
      <a href="${resetUrl}" style="color: #6366f1;">${resetUrl}</a>
    </p>
  `;

    return generateBaseEmailTemplate({
        content,
        brandName,
        preheader: "Reset your password",
    });
}

/**
 * Generates a notification email.
 */
export function generateNotificationEmail(data: NotificationEmailData): string {
    const {
        recipientName,
        brandName = "Open DM",
        title,
        message,
        actionUrl,
        actionText = "View Details",
    } = data;

    const content = `
    ${generateHeadingHtml(title, { align: "center" })}
    
    ${generateParagraphHtml(`Hi ${recipientName},`)}
    
    ${generateParagraphHtml(message)}
    
    ${actionUrl ? generateButtonHtml(actionText, actionUrl) : ""}
  `;

    return generateBaseEmailTemplate({
        content,
        brandName,
        preheader: title,
    });
}

/**
 * Generates an invoice email.
 */
export function generateInvoiceEmail(data: InvoiceEmailData): string {
    const {
        recipientName,
        brandName = "Open DM",
        invoiceNumber,
        amount,
        dueDate,
        items,
        paymentUrl,
    } = data;

    const itemsHtml = items
        .map(
            (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            ${item.description}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
            ${item.amount}
          </td>
        </tr>
      `
        )
        .join("");

    const content = `
    ${generateHeadingHtml(`Invoice #${invoiceNumber}`, { align: "center" })}
    
    ${generateParagraphHtml(`Hi ${recipientName},`)}
    
    ${generateParagraphHtml("Here's your invoice details:")}
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
      <thead>
        <tr>
          <th style="padding: 12px 0; border-bottom: 2px solid #e5e7eb; text-align: left; font-weight: 600; color: #6b7280;">
            Description
          </th>
          <th style="padding: 12px 0; border-bottom: 2px solid #e5e7eb; text-align: right; font-weight: 600; color: #6b7280;">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr>
          <td style="padding: 16px 0; font-weight: 700; font-size: 18px;">
            Total
          </td>
          <td style="padding: 16px 0; text-align: right; font-weight: 700; font-size: 18px; color: #6366f1;">
            ${amount}
          </td>
        </tr>
      </tbody>
    </table>
    
    ${generateCalloutHtml(`Due Date: ${dueDate}`, { type: "info" })}
    
    ${paymentUrl ? generateButtonHtml("Pay Now", paymentUrl) : ""}
  `;

    return generateBaseEmailTemplate({
        content,
        brandName,
        preheader: `Invoice #${invoiceNumber} - ${amount} due ${dueDate}`,
    });
}

/**
 * Generates a team invitation email.
 */
export function generateTeamInviteEmail(data: TeamInviteData): string {
    const {
        inviterName,
        teamName,
        brandName = "Open DM",
        inviteUrl,
        expiryDays = 7,
    } = data;

    const content = `
    ${generateHeadingHtml("You're Invited!", { align: "center" })}
    
    ${generateParagraphHtml(
        `<strong>${inviterName}</strong> has invited you to join the <strong>${teamName}</strong> team on ${brandName}.`,
        { align: "center" }
    )}
    
    ${generateButtonHtml("Accept Invitation", inviteUrl)}
    
    ${generateCalloutHtml(
        `This invitation will expire in ${expiryDays} days.`,
        { type: "info" }
    )}
    
    ${generateDividerHtml()}
    
    ${generateParagraphHtml(
        "If you weren't expecting this invitation, you can safely ignore this email.",
        { muted: true, align: "center" }
    )}
  `;

    return generateBaseEmailTemplate({
        content,
        brandName,
        preheader: `${inviterName} invited you to join ${teamName}`,
    });
}

// ============================================================================
// Template Index
// ============================================================================

export const emailTemplates = {
    welcome: generateWelcomeEmail,
    passwordReset: generatePasswordResetEmail,
    notification: generateNotificationEmail,
    invoice: generateInvoiceEmail,
    teamInvite: generateTeamInviteEmail,
} as const;

export type EmailTemplateType = keyof typeof emailTemplates;
