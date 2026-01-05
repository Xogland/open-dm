/**
 * Environment Configuration for Lemon Squeezy
 * 
 * Type-safe access to environment variables for the subscription system.
 * Supports both sandbox and production environments.
 */

import { BillingCycle, SubscriptionPlan } from '../types/subscription-types';

/**
 * Environment type
 */
export type LemonSqueezyEnvironment = 'sandbox' | 'production';

/**
 * Lemon Squeezy environment configuration
 */
interface LemonSqueezyConfig {
    apiKey: string;
    storeId: string;
    webhookSecret: string;
    environment: LemonSqueezyEnvironment;
    apiUrl: string;
    variantIds: Record<SubscriptionPlan, Record<BillingCycle, string>>;
}

/**
 * Get environment variable with validation
 */
function getEnvVar(key: string, required: boolean = true): string {
    const value = process.env[key];

    if (required && !value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value || '';
}

/**
 * Get Lemon Squeezy configuration from environment variables
 */
export function getLemonSqueezyConfig(): LemonSqueezyConfig {
    const environment = (getEnvVar('LEMON_SQUEEZY_ENVIRONMENT', false) || 'sandbox') as LemonSqueezyEnvironment;

    return {
        apiKey: getEnvVar('LEMON_SQUEEZY_API_KEY'),
        storeId: getEnvVar('LEMON_SQUEEZY_STORE_ID'),
        webhookSecret: getEnvVar('LEMON_SQUEEZY_WEBHOOK_SECRET'),
        environment,
        apiUrl: environment === 'production'
            ? 'https://api.lemonsqueezy.com/v1'
            : 'https://api.lemonsqueezy.com/v1', // Lemon Squeezy uses same URL for both

        variantIds: {
            starter: {
                monthly: getEnvVar('LEMON_SQUEEZY_STARTER_MONTHLY_VARIANT_ID', false),
                annual: getEnvVar('LEMON_SQUEEZY_STARTER_ANNUAL_VARIANT_ID', false),
            },
            professional: {
                monthly: getEnvVar('LEMON_SQUEEZY_PROFESSIONAL_MONTHLY_VARIANT_ID'),
                annual: getEnvVar('LEMON_SQUEEZY_PROFESSIONAL_ANNUAL_VARIANT_ID'),
            },
            enterprise: {
                monthly: getEnvVar('LEMON_SQUEEZY_ENTERPRISE_MONTHLY_VARIANT_ID'),
                annual: getEnvVar('LEMON_SQUEEZY_ENTERPRISE_ANNUAL_VARIANT_ID'),
            },
        },
    };
}

/**
 * Get variant ID for a specific plan and billing cycle
 */
export function getVariantId(plan: SubscriptionPlan, cycle: BillingCycle): string {
    const config = getLemonSqueezyConfig();
    const variantId = config.variantIds[plan][cycle];

    if (!variantId) {
        throw new Error(`No variant ID configured for ${plan} ${cycle}`);
    }

    return variantId;
}

/**
 * Check if we're in sandbox mode
 */
export function isSandboxMode(): boolean {
    return getLemonSqueezyConfig().environment === 'sandbox';
}

/**
 * Get the webhook URL for the current environment
 */
export function getWebhookUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/api/webhooks/lemon-squeezy`;
}
