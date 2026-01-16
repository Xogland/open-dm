/**
 * Subscription Plans Component
 *
 * Displays all available subscription plans with pricing toggle.
 */

"use client";

import { useState } from "react";
import { PlanCard } from "./plan-card";
import { getAllPlans } from "../config/plan-config";
import { BillingCycle, SubscriptionPlan } from "../types/subscription-types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Bug, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { useQuery } from "convex/react";
import {
  cancelSubscriptionAction,
  updateSubscriptionAction,
  createCheckoutAction
} from "../actions/subscription-actions";

interface SubscriptionPlansProps {
  organisationId: Id<"organisations">;
  currentPlan?: SubscriptionPlan;
  debugMode?: boolean;
}

export function SubscriptionPlans({
  organisationId,
  currentPlan,
  debugMode = false,
}: SubscriptionPlansProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const showDebugToggle = searchParams.get("debug") === "true" || debugMode;

  const toggleDebug = useMutation(api.organisation.toggleDebugMode);
  const fakeUpdatePlan = useMutation(api.organisation.fakeUpdatePlan);
  const switchToFree = useMutation(api.subscriptions.switchToFree);
  const plans = getAllPlans();
  const subscription = useQuery(api.subscriptions.getSubscriptionByOrganisation, { organisationId });
  const isTrialEligible = !subscription; // If no subscription record exists, they are eligible for a trial

  const handleSelectPlan = async (planId: string, cycle: BillingCycle) => {
    if (planId === "free") {
      if (currentPlan === "free") {
        toast("You are already on the Free plan.");
        return;
      }

      setLoading(true);
      try {
        // 1. If there's an active LS subscription, cancel it
        if (subscription && (subscription.status === 'active' || subscription.status === 'on_trial')) {
          const result = await cancelSubscriptionAction(subscription.lemonSqueezyId);
          if (!result.success) {
            toast.error(`Failed to cancel current subscription: ${result.error}`);
            setLoading(false);
            return;
          }
        }

        // 2. Switch to free plan in Convex
        await switchToFree({ organisationId });
        toast.success("Successfully switched to Free plan.");
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error switching to free plan:", error);
        toast.error(`Failed to switch to free plan: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);

    // If debug mode is on, bypass checkout and update plan directly
    if (debugMode) {
      try {
        await fakeUpdatePlan({
          organisationId,
          plan: planId,
          status: "active",
        });
        toast.success(`Debug: Plan updated to ${planId} successfully!`);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error faking plan update:", error);
        toast.error("Failed to update plan in debug mode.");
        setLoading(false);
        return;
      }
    }

    try {
      // PRORATION LOGIC:
      // If the user already has an active paid subscription, update it instead of creating a new checkout
      if (subscription && (subscription.status === 'active' || subscription.status === 'on_trial')) {
        const result = await updateSubscriptionAction(
          subscription.lemonSqueezyId,
          planId as SubscriptionPlan,
          cycle
        );

        if (result.success) {
          toast.success(`Your plan has been updated to ${planId}. Prorated changes are applied.`);
          setLoading(false);
          return;
        }

        // If it failed specifically because it's the same plan, just ignore it
        if (result.error?.includes('already assigned')) {
          toast.info(`You are already on the ${planId} plan.`);
          setLoading(false);
          return;
        }

        // Otherwise fallback to checkout or show error
        console.error("Plan update failed:", result.error);
      }

      const result = await createCheckoutAction(
        organisationId,
        planId as SubscriptionPlan,
        cycle,
      );

      if (!result.success || !result.url) {
        toast.error(result.error || "Failed to initiate checkout.");
        setLoading(false);
        return;
      }

      // Redirect to Lemon Squeezy checkout
      window.location.href = result.url;
    } catch (error) {
      console.error("Error initiating checkout:", error);
      toast.error("Failed to initiate checkout. Please try again.");
      setLoading(false);
    }

  };

  const handleToggleDebug = async (enabled: boolean) => {
    try {
      await toggleDebug({ organisationId, enabled });
      toast.success(`Debug mode ${enabled ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to toggle debug mode");
    }
  };

  return (
    <div className="space-y-8">
      {/* Debug Mode Toggle (Hidden by default, shown with ?debug=true) */}
      {showDebugToggle && (
        <div className="flex items-center justify-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl gap-4 max-w-xl mx-auto">
          <Bug className="w-5 h-5 text-yellow-500" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-yellow-500">
                Developer Debug Mode
              </span>
              {debugMode && (
                <Badge variant="outline" className="text-[10px] bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Bypasses payments and allows instant plan switching for testing.
            </p>
          </div>
          <Switch
            checked={debugMode}
            onCheckedChange={handleToggleDebug}
          />
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Label htmlFor="billing-toggle" className="text-sm">
          Monthly
        </Label>
        <Switch
          id="billing-toggle"
          checked={billingCycle === "annual"}
          onCheckedChange={(checked) =>
            setBillingCycle(checked ? "annual" : "monthly")
          }
        />
        <Label htmlFor="billing-toggle" className="text-sm">
          Annual
          <span className="ml-2 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Save ~17%</span>
        </Label>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans
          .filter((plan) => plan.id !== "free")
          .sort((a, b) => {
            const order: SubscriptionPlan[] = ["beginner", "pro", "max"];
            return order.indexOf(a.id) - order.indexOf(b.id);
          })
          .map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              currentPlan={currentPlan}
              onSelect={handleSelectPlan}
              isTrialEligible={isTrialEligible}
              loading={loading}
            />
          ))}
      </div>

      {/* Free Plan - Rendered below */}
      <div className="max-w-6xl mx-auto">
        {plans
          .filter((plan) => plan.id === "free")
          .map((plan) => (
            <div key={plan.id} className="mt-8 border-t border-border pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-card/50 border border-border/50 rounded-2xl gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Typography variant="subheading">{plan.name}</Typography>
                    {currentPlan === 'free' && (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">Current Plan</Badge>
                    )}
                  </div>
                  <Typography variant="body">{plan.description}</Typography>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {plan.ui.displayFeatures?.slice(0, 4).map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary/40" />
                        <Typography variant="caption">{f}</Typography>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="text-right hidden md:block">
                    <Typography variant="stat" className="text-xl">Free</Typography>
                    <Typography variant="caption">Forever</Typography>
                  </div>
                  <PlanCard
                    plan={plan}
                    billingCycle={billingCycle}
                    currentPlan={currentPlan}
                    onSelect={handleSelectPlan}
                    isTrialEligible={isTrialEligible}
                    loading={loading}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
