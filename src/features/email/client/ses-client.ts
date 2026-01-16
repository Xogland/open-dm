/**
 * Amazon SES Client Factory
 * 
 * Singleton pattern for SES client initialization with proper
 * credential management and configuration validation.
 */

import {
    SESClient,
    type SESClientConfig,
} from "@aws-sdk/client-ses";
import {
    SESv2Client,
    type SESv2ClientConfig,
} from "@aws-sdk/client-sesv2";
import { sesConfigSchema } from "../schemas";
import type { SESConfig } from "../types";

// ============================================================================
// Client Cache
// ============================================================================

let sesClientInstance: SESClient | null = null;
let sesV2ClientInstance: SESv2Client | null = null;
let currentConfig: SESConfig | null = null;

// ============================================================================
// Configuration Validation
// ============================================================================

/**
 * Validates SES configuration from environment variables.
 * Fails fast if required variables are missing.
 */
function validateEnvConfig(): SESConfig {
    const config = {
        region: process.env.AWS_SES_REGION || process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        endpoint: process.env.AWS_SES_ENDPOINT, // For LocalStack testing
    };

    const result = sesConfigSchema.safeParse(config);

    if (!result.success) {
        const issues = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; ");
        throw new Error(
            `Invalid AWS SES configuration: ${issues}. ` +
            `Ensure AWS_SES_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are set.`
        );
    }

    return result.data;
}

/**
 * Creates SES client configuration object.
 */
function createClientConfig(config: SESConfig): SESClientConfig {
    const clientConfig: SESClientConfig = {
        region: config.region,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
        },
        // Retry configuration
        maxAttempts: 3,
    };

    // Optional: custom endpoint for testing
    if (config.endpoint) {
        clientConfig.endpoint = config.endpoint;
    }

    return clientConfig;
}

// ============================================================================
// Client Factory Functions
// ============================================================================

/**
 * Gets or creates the SES v1 client (for SendEmail, SendTemplatedEmail).
 * Uses singleton pattern with lazy initialization.
 * 
 * @param forceNew - Force creation of new client (useful for testing)
 * @returns Configured SESClient instance
 */
export function getSESClient(forceNew = false): SESClient {
    if (sesClientInstance && !forceNew) {
        return sesClientInstance;
    }

    const config = validateEnvConfig();
    const clientConfig = createClientConfig(config);

    sesClientInstance = new SESClient(clientConfig);
    currentConfig = config;

    return sesClientInstance;
}

/**
 * Gets or creates the SES v2 client (for advanced features).
 * Uses singleton pattern with lazy initialization.
 * 
 * @param forceNew - Force creation of new client
 * @returns Configured SESv2Client instance
 */
export function getSESV2Client(forceNew = false): SESv2Client {
    if (sesV2ClientInstance && !forceNew) {
        return sesV2ClientInstance;
    }

    const config = validateEnvConfig();
    const clientConfig = createClientConfig(config) as SESv2ClientConfig;

    sesV2ClientInstance = new SESv2Client(clientConfig);
    currentConfig = config;

    return sesV2ClientInstance;
}

/**
 * Gets the current SES configuration.
 * Initializes client if not already done.
 */
export function getSESConfig(): SESConfig {
    if (!currentConfig) {
        getSESClient(); // Initialize to populate currentConfig
    }
    return currentConfig!;
}

/**
 * Destroys the current client instances.
 * Useful for testing or connection reset.
 */
export function destroySESClients(): void {
    if (sesClientInstance) {
        sesClientInstance.destroy();
        sesClientInstance = null;
    }
    if (sesV2ClientInstance) {
        sesV2ClientInstance.destroy();
        sesV2ClientInstance = null;
    }
    currentConfig = null;
}

/**
 * Checks if SES clients are properly configured.
 * Returns validation status without throwing.
 */
export function isSESConfigured(): { configured: boolean; error?: string } {
    try {
        validateEnvConfig();
        return { configured: true };
    } catch (error) {
        return {
            configured: false,
            error: error instanceof Error ? error.message : "Unknown configuration error",
        };
    }
}

// ============================================================================
// Exports
// ============================================================================

export {
    SESClient,
    SESv2Client,
};
