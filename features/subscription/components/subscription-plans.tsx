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
import { initiateCheckout } from "../services/subscription-service";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Bug, Info } from "lucide-react";

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

  const plans = getAllPlans();

  const handleSelectPlan = async (planId: string, cycle: BillingCycle) => {
    if (planId === "starter" && currentPlan === "starter") {
      toast("You are already on the free Starter plan.");
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
      const checkoutUrl = await initiateCheckout(
        organisationId,
        planId as SubscriptionPlan,
        cycle,
      );

      // Redirect to Lemon Squeezy checkout
      window.location.href = checkoutUrl;
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
              <span className="text-sm font-semibold text-yellow-500">
                Developer Debug Mode
              </span>
              {debugMode && (
                <Badge variant="outline" className="text-[10px] bg-yellow-500/10 text-yellow-500 border-yellow-500/20 uppercase">
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
          <span className="ml-2 text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">Save ~17%</span>
        </Label>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            currentPlan={currentPlan}
            onSelect={handleSelectPlan}
            loading={loading}
          />
        ))}
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground max-w-2xl mx-auto bg-muted/30 p-4 rounded-xl">
        <Info className="w-4 h-4" />
        <p>
          All plans include unlimited submissions. Upgrade or downgrade at any
          time. Cancel anytime with no questions asked.
        </p>
      </div>
    </div>
  );
}
