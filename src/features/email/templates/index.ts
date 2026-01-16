/**
 * Email Templates Barrel Export
 */

// Base template utilities
export {
    generateBaseEmailTemplate,
    generateButtonHtml,
    generateHeadingHtml,
    generateParagraphHtml,
    generateDividerHtml,
    generateCalloutHtml,
    type BaseTemplateOptions,
} from "./base-template";

// Common templates
export {
    generateWelcomeEmail,
    generatePasswordResetEmail,
    generateNotificationEmail,
    generateInvoiceEmail,
    generateTeamInviteEmail,
    emailTemplates,
    type EmailTemplateType,
    type WelcomeEmailData,
    type PasswordResetData,
    type NotificationEmailData,
    type InvoiceEmailData,
    type TeamInviteData,
} from "./common-templates";
