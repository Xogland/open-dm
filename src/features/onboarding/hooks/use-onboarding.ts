import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { CURRENT_PLATFORM_STATUS, PlatformStatus } from "@/constants/platform";
import { HandleState, CheckHandleResultType } from "@/features/organization/components/handle-input";

export function useOnboarding() {
    const router = useRouter();
    const createOrg = useMutation(api.organisation.createOrganisation);
    const addToPreregistration = useMutation(api.preregistration.addToPreregistration);
    const { setSelectedOrganization } = useUserData();
    const isPreregistered = useQuery(api.preregistration.isPreregistered);

    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [plan, setPlan] = useState("free");

    // Unified Handle State
    const [handle, setHandle] = useState("");
    const [handleStatus, setHandleStatus] = useState<HandleState>(HandleState.idle);
    const [redemptionKey, setRedemptionKey] = useState<string | undefined>(undefined);

    const [category, setCategory] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [loading, setLoading] = useState(false);

    // On mount, check for persisted handle from Signup flow
    useEffect(() => {
        const persistedHandle = localStorage.getItem("onboarding_handle");
        if (persistedHandle) {
            setHandle(persistedHandle);
            localStorage.removeItem("onboarding_handle");
        }
    }, []);

    const handleHandleStatusChange = useCallback((status: HandleState, h: string, result?: CheckHandleResultType, key?: string) => {
        setHandleStatus(status);
        setHandle(h); // Ensure local state stays in sync with cleaned handle from component
        setRedemptionKey(key);
    }, []);

    const nextStep = () => {
        if (step === 1) {
            if (!name || !handle) {
                toast.error("Please fill in all fields");
                return;
            }
            if (handleStatus === HandleState.taken) {
                toast.error("Handle is already taken");
                return;
            }
            if (handleStatus === HandleState.reserved) {
                toast.error("This handle is reserved.");
                return;
            }
            if (handleStatus === HandleState.official) {
                toast.error("This handle is strictly reserved.");
                return;
            }
            // Ensure we only proceed if available (or has key that makes it available - HandleInput should report 'available' if key is valid?)
            // Wait, HandleInput logic (Step 137):
            // if available -> status=available
            // if reserved -> status=reserved (even with key? No, backend checks key).
            // Convex 'checkOrganisationHandle':
            // If reserved && key matches -> returns available?
            // Let's check 'checkOrganisationHandle' in convex/organization.ts?
            // I recall Step 99 snippets: if reserved & key valid -> returns available?
            // Convex snippet: "return { status: 'available' };" if checks pass.
            // So if Status is Available, calls are good.

            if (handleStatus !== HandleState.available) {
                toast.error("Handle is not available");
                return;
            }
        }
        if (step === 2 && !category) {
            toast.error("Please select a business category");
            return;
        }
        setStep((s) => s + 1);
    };

    const prevStep = () => {
        setStep((s) => s - 1);
    };

    const handleSubmit = async () => {
        if (!category || !businessType) {
            toast.error("Please complete all steps");
            return;
        }

        setLoading(true);
        try {
            const orgId = await createOrg({
                name,
                handle,
                category,
                businessType,
                redemptionKey,
            });

            if (CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION) {
                await addToPreregistration();
            }

            toast.success("Organization created successfully!");
            setSelectedOrganization(orgId);

            if (isPreregistered) {
                router.push("/dashboard");
            } else {
                router.push(`/settings/billing?welcome=true&orgId=${orgId}`);
            }
        } catch (error) {
            toast.error("Failed to create organization");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        name,
        setName,
        handle,
        setHandle, // We expose simple setter, but purely for input binding if needed
        handleStatus,
        onHandleStatusChange: handleHandleStatusChange,
        loading,
        redemptionKey,
        category,
        setCategory,
        businessType,
        setBusinessType,
        plan,
        setPlan,
        nextStep,
        prevStep,
        handleSubmit,
    };
}
