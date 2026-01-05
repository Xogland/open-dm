/**
 * Lemon Squeezy API Client
 * 
 * Type-safe client for interacting with the Lemon Squeezy API.
 * Handles subscription management, checkout creation, and API requests.
 */

import {
    LemonSqueezySubscription,
    BillingCycle,
    SubscriptionPlan
} from '../types/subscription-types';
import { getLemonSqueezyConfig, getVariantId } from '../config/env-config';

/**
 * Custom data to pass through checkout
 */
interface CheckoutCustomData {
    organisation_id: string;
    user_id?: string;
}

/**
 * Checkout creation response
 */
interface CheckoutResponse {
    data: {
        id: string;
        type: 'checkouts';
        attributes: {
            url: string;
            [key: string]: any;
        };
    };
}

/**
 * Subscription update payload
 */
interface SubscriptionUpdatePayload {
    variant_id?: string;
    pause?: {
        mode: 'void' | 'free';
    };
    cancelled?: boolean;
}

/**
 * Lemon Squeezy API Client
 */
export class LemonSqueezyClient {
    private apiKey: string;
    private storeId: string;
    private apiUrl: string;

    constructor() {
        const config = getLemonSqueezyConfig();
        this.apiKey = config.apiKey;
        this.storeId = config.storeId;
        this.apiUrl = config.apiUrl;
    }

    /**
     * Make authenticated request to Lemon Squeezy API
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.apiUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': `Bearer ${this.apiKey}`,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Lemon Squeezy API error (${response.status}): ${error}`);
        }

        return response.json();
    }

    /**
     * Get subscription details by ID
     */
    async getSubscription(subscriptionId: string): Promise<LemonSqueezySubscription> {
        const response = await this.request<{ data: LemonSqueezySubscription }>(
            `/subscriptions/${subscriptionId}`
        );
        return response.data;
    }

    /**
     * Update subscription (e.g., change plan)
     */
    async updateSubscription(
        subscriptionId: string,
        payload: SubscriptionUpdatePayload
    ): Promise<LemonSqueezySubscription> {
        const response = await this.request<{ data: LemonSqueezySubscription }>(
            `/subscriptions/${subscriptionId}`,
            {
                method: 'PATCH',
                body: JSON.stringify({
                    data: {
                        type: 'subscriptions',
                        id: subscriptionId,
                        attributes: payload,
                    },
                }),
            }
        );
        return response.data;
    }

    /**
     * Cancel subscription (enters grace period)
     */
    async cancelSubscription(subscriptionId: string): Promise<LemonSqueezySubscription> {
        return this.updateSubscription(subscriptionId, { cancelled: true });
    }

    /**
     * Resume cancelled subscription
     */
    async resumeSubscription(subscriptionId: string): Promise<LemonSqueezySubscription> {
        return this.updateSubscription(subscriptionId, { cancelled: false });
    }

    /**
     * Pause subscription
     */
    async pauseSubscription(
        subscriptionId: string,
        mode: 'void' | 'free' = 'void'
    ): Promise<LemonSqueezySubscription> {
        return this.updateSubscription(subscriptionId, {
            pause: { mode },
        });
    }

    /**
     * Unpause subscription
     */
    async unpauseSubscription(subscriptionId: string): Promise<LemonSqueezySubscription> {
        return this.updateSubscription(subscriptionId, {
            pause: undefined as any, // API expects null/undefined to unpause
        });
    }

    /**
     * Change subscription plan
     */
    async changePlan(
        subscriptionId: string,
        newPlan: SubscriptionPlan,
        billingCycle: BillingCycle
    ): Promise<LemonSqueezySubscription> {
        const variantId = getVariantId(newPlan, billingCycle);
        return this.updateSubscription(subscriptionId, {
            variant_id: variantId,
        });
    }

    /**
     * Create checkout session
     */
    async createCheckout(
        plan: SubscriptionPlan,
        billingCycle: BillingCycle,
        customData: CheckoutCustomData
    ): Promise<string> {
        const variantId = getVariantId(plan, billingCycle);

        const response = await this.request<CheckoutResponse>('/checkouts', {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    type: 'checkouts',
                    attributes: {
                        checkout_data: {
                            custom: customData,
                        },
                    },
                    relationships: {
                        store: {
                            data: {
                                type: 'stores',
                                id: this.storeId,
                            },
                        },
                        variant: {
                            data: {
                                type: 'variants',
                                id: variantId,
                            },
                        },
                    },
                },
            }),
        });

        return response.data.attributes.url;
    }
}

/**
 * Singleton instance of the Lemon Squeezy client
 */
let clientInstance: LemonSqueezyClient | null = null;

/**
 * Get or create Lemon Squeezy client instance
 */
export function getLemonSqueezyClient(): LemonSqueezyClient {
    if (!clientInstance) {
        clientInstance = new LemonSqueezyClient();
    }
    return clientInstance;
}
