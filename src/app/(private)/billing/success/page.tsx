'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { PageShell } from '@/components/page-shell';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Rocket, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BillingSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const organisationId = searchParams.get('organisation_id') as Id<'organisations'> | null;

    const organisation = useQuery(
        api.organisation.getOrganisation,
        organisationId ? { id: organisationId } : 'skip'
    );

    const subscription = useQuery(
        api.subscriptions.getSubscriptionByOrganisation,
        organisationId ? { organisationId } : 'skip'
    );

    if (!organisationId) {
        return (
            <PageShell className="flex items-center justify-center min-h-[70vh]">
                <div className="text-center space-y-4">
                    <Typography variant="h2">Something went wrong</Typography>
                    <Typography variant="body">We couldn&apos;t find your organization details.</Typography>
                    <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                </div>
            </PageShell>
        );
    }

    const isProcessing = !subscription || subscription.status !== 'active';

    return (
        <PageShell className="max-w-3xl mx-auto pt-20">
            <div className="text-center space-y-8">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="flex justify-center"
                >
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-primary/20">
                        {isProcessing ? (
                            <Loader2 className="h-12 w-12 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-12 w-12" />
                        )}
                    </div>
                </motion.div>

                <div className="space-y-3">
                    <Typography variant="h1" className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        {isProcessing ? "Processing Your Upgrade..." : "You're All Set!"}
                    </Typography>
                    <Typography variant="lead" className="text-muted-foreground max-w-xl mx-auto">
                        {isProcessing
                            ? "We're finalizing your subscription. This usually takes just a few seconds."
                            : `Congratulations! ${organisation?.name} is now on the ${subscription?.planId.toUpperCase()} plan.`
                        }
                    </Typography>
                </div>

                <AnimatePresence>
                    {!isProcessing && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto"
                        >
                            <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 space-y-2">
                                <Rocket className="h-5 w-5 text-primary" />
                                <Typography variant="small" className="font-bold">Limits Unlocked</Typography>
                                <Typography variant="caption" className="text-muted-foreground">
                                    Your new limits are now active. You can create more services and receive more submissions.
                                </Typography>
                            </div>
                            <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 space-y-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                <Typography variant="small" className="font-bold">Pro Features Active</Typography>
                                <Typography variant="caption" className="text-muted-foreground">
                                    Custom branding, advanced workflows, and priority support are now available.
                                </Typography>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        size="lg"
                        onClick={() => router.push('/dashboard')}
                        className="w-full sm:w-auto px-8 h-12 text-base shadow-xl shadow-primary/20"
                    >
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => router.push('/settings/billing')}
                        className="w-full sm:w-auto px-8 h-12 text-base"
                    >
                        Manage Subscription
                    </Button>
                </div>

                {isProcessing && (
                    <p className="text-xs text-muted-foreground animate-pulse">
                        Waiting for payment confirmation...
                    </p>
                )}
            </div>

            {/* Simple CSS-based confetti or particles could be added here if needed, 
                but for now we'll stick to clean Framer Motion animations */}
        </PageShell>
    );
}
