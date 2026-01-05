/**
 * Webhook Signature Validator
 * 
 * Validates webhook requests from Lemon Squeezy using HMAC SHA-256 signatures.
 * This is critical for security to ensure webhooks are authentic.
 */

import crypto from 'crypto';
import { WebhookEvent, WebhookEventType } from '../types/subscription-types';

/**
 * Validate webhook signature from Lemon Squeezy
 * 
 * @param payload - Raw request body as string
 * @param signature - X-Signature header value
 * @param secret - Webhook signing secret
 * @returns true if signature is valid
 */
export function validateWebhookSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    try {
        // Create HMAC SHA-256 hash
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(payload);
        const digest = hmac.digest('hex');

        // Compare signatures using timing-safe comparison
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(digest)
        );
    } catch (error) {
        console.error('Error validating webhook signature:', error);
        return false;
    }
}

/**
 * Parse and validate webhook event structure
 * 
 * @param rawBody - Raw request body as string
 * @returns Parsed webhook event
 * @throws Error if payload is invalid
 */
export function parseWebhookEvent(rawBody: string): WebhookEvent {
    try {
        const parsed = JSON.parse(rawBody);

        // Validate required fields
        if (!parsed.meta || !parsed.meta.event_name) {
            throw new Error('Invalid webhook payload: missing meta.event_name');
        }

        if (!parsed.data) {
            throw new Error('Invalid webhook payload: missing data');
        }

        return parsed as WebhookEvent;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON in webhook payload');
        }
        throw error;
    }
}

/**
 * Type guard for subscription events
 */
export function isSubscriptionEvent(eventType: WebhookEventType): boolean {
    return eventType.startsWith('subscription_');
}

/**
 * Type guard for order events
 */
export function isOrderEvent(eventType: WebhookEventType): boolean {
    return eventType.startsWith('order_');
}

/**
 * Extract organisation ID from webhook custom data
 */
export function getOrganisationIdFromWebhook(event: WebhookEvent): string | null {
    return event.meta.custom_data?.organisation_id || null;
}

/**
 * Extract user ID from webhook custom data
 */
export function getUserIdFromWebhook(event: WebhookEvent): string | null {
    return event.meta.custom_data?.user_id || null;
}
