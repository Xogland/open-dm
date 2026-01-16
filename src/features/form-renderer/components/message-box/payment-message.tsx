"use client";

import React, { useState, useEffect } from "react";
import { PaymentInputMessage } from "@/lib/message-types";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Loader2, LockIcon } from "lucide-react";

const CheckoutForm = ({
    message,
    onSuccess,
}: {
    message: PaymentInputMessage;
    onSuccess: (paymentId: string) => void;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsSubmitting(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message || "An unexpected error occurred.");
            setIsSubmitting(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onSuccess(paymentIntent.id);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {errorMessage && (
                <Typography variant="caption" className="text-destructive">
                    {errorMessage}
                </Typography>
            )}
            <Button
                type="submit"
                disabled={!stripe || isSubmitting}
                className="w-full"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Pay ${message.amount} ${message.currency}`
                )}
            </Button>
        </form>
    );
};

export const PaymentMessageBox = ({
    message,
    onSuccess,
}: {
    message: PaymentInputMessage;
    onSuccess: (paymentId: string) => void;
}) => {
    const [showForm, setShowForm] = useState(false);
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // We should ideally fetch this from our Convex action
        // But since this is a UI component, the caller should pass it or we fetch it here
        // For now, we assume provide a way to pass it or use a hook
        setStripePromise(loadStripe(message.publishableKey));
    }, [message.publishableKey]);

    // Loading client secret (this should be handled by the parent or via a hook)
    // For simplicity, we'll assume the client secret is obtained via an effect or passed in
    // Let's use a local effect to call our Convex action

    // NOTE: In a real implementation, you'd use a useAction or similar here
    // But since I'm just creating the component, I'll leave a placeholder for the secret

    if (!message.publishableKey) {
        return (
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 max-w-sm">
                <Typography variant="body" className="text-destructive font-medium">Stripe is not configured correctly.</Typography>
                <Typography variant="caption" className="text-destructive/80">Please contact the administrator.</Typography>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20 max-w-sm flex items-center gap-3">
                <div className="bg-green-500 rounded-full p-1">
                    <Typography className="text-white text-xs font-bold">✓</Typography>
                </div>
                <div>
                    <Typography variant="body" className="font-semibold text-green-700">Payment Successful</Typography>
                    <Typography variant="caption" className="text-green-600/80">Thank you for your payment.</Typography>
                </div>
            </div>
        );
    }

    if (!showForm) {
        return (
            <div className="bg-card border border-border shadow-sm rounded-xl p-5 max-w-sm space-y-4 transition-all hover:shadow-md">
                <div className="space-y-1">
                    <Typography variant="body" className="font-bold text-lg leading-tight">
                        {message.question}
                    </Typography>
                    {message.description && (
                        <Typography variant="caption" className="text-muted-foreground line-clamp-2">
                            {message.description}
                        </Typography>
                    )}
                </div>

                <div className="bg-muted/50 rounded-lg p-3 flex justify-between items-center border border-border/50">
                    <Typography variant="caption" className="font-medium text-muted-foreground uppercase tracking-wider">Total Amount</Typography>
                    <Typography variant="body" className="font-bold text-xl">
                        {message.currency} {message.amount}
                    </Typography>
                </div>

                <Button
                    className="w-full h-11 rounded-lg text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    onClick={() => setShowForm(true)}
                >
                    Pay Now
                </Button>

                <div className="flex items-center justify-center gap-1.5 opacity-50">
                    <LockIcon className="w-3 h-3" />
                    <Typography variant="caption" className="text-[10px] uppercase font-bold tracking-tighter">Secure Checkout</Typography>
                </div>
            </div>
        );
    }

    if (!message.clientSecret || !stripePromise) {
        return (
            <div className="bg-card border border-border shadow-sm rounded-xl p-8 max-w-sm flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <Typography variant="caption" className="text-muted-foreground animate-pulse">Initializing secure payment...</Typography>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border shadow-md rounded-xl p-6 space-y-4 max-w-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b pb-3 mb-2">
                <Typography variant="body" className="font-bold">Complete Payment</Typography>
                <Typography variant="body" className="font-bold text-primary">{message.currency} {message.amount}</Typography>
            </div>

            <Elements
                stripe={stripePromise}
                options={{
                    clientSecret: message.clientSecret,
                    appearance: {
                        theme: 'stripe',
                        variables: {
                            colorPrimary: '#000000',
                        }
                    }
                }}
            >
                <CheckoutForm
                    message={message}
                    onSuccess={(paymentId) => {
                        setIsSuccess(true);
                        onSuccess(paymentId);
                    }}
                />
            </Elements>

            <div className="flex items-center justify-center gap-2 pt-2 border-t mt-4 grayscale opacity-60">
                <Typography variant="caption" className="text-[10px] font-medium text-muted-foreground">POWERED BY</Typography>
                <div className="font-black text-xs italic tracking-tighter">Stripe</div>
            </div>
        </div>
    );
};
