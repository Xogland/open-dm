/**
 * Email Services Index
 * 
 * Re-exports all email service functions.
 */

// Client utilities (needed by services)
export { isSESConfigured } from "../client";

// Core email sending
export {
    sendEmail,
    sendTemplatedEmail,
    sendBulkTemplatedEmail,
    sendSimpleEmail,
} from "./email-service";

// Template management
export {
    createEmailTemplate,
    updateEmailTemplate,
    upsertEmailTemplate,
    deleteEmailTemplate,
    getEmailTemplate,
    listEmailTemplates,
    testRenderTemplate,
    type TemplateOperationResult,
    type TemplateListResult,
    type TemplateGetResult,
    type TemplateRenderResult,
} from "./template-service";
