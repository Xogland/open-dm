import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { CURRENT_PLATFORM_STATUS, PlatformStatus } from "@/constants/platform";

export function useOnboarding() {
    const router = useRouter();
    const createOrg = useMutation(api.organisation.createOrganisation);
    const addToPreregistration = useMutation(api.preregistration.addToPreregistration);
    const { setSelectedOrganization } = useUserData();

    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");
    const [debouncedHandle, setDebouncedHandle] = useState("");
    const [plan, setPlan] = useState("free");
    const [category, setCategory] = useState("");
    const [businessType, setBusinessType] = useState("");
    // const [redemptionKey, setRedemptionKey] = useState(""); // Removed
    const [loading, setLoading] = useState(false);

    // Helper to parse input
    const parseInput = (input: string): [string, string] => {
        // console.log("Parsing Input:", input);
        // key-handle (Dash separator) - Input is lowercased

        // Check for Master Key (master-xxxxxxxx-handle)
        if (input.startsWith("master-")) {
            const masterKeyRegex = /^(master-[a-z0-9]+)-(.*)$/;
            const match = input.match(masterKeyRegex);
            if (match) {
                const rawKey = match[1];
                const handlePart = match[2];
                return [rawKey.toUpperCase(), handlePart];
            }
        }

        // Standard Key (8 chars alphanumeric)
        const standardKeyRegex = /^([a-z0-9]{8})-(.*)$/;
        const match = input.match(standardKeyRegex);
        if (match) return [match[1], match[2]];

        return ["", input];
    };

    // 1. Immediate parse for Submit and pure UI feedback
    const [parsedKey, parsedHandle] = parseInput(handle);

    // 2. Debounce the RAW handle (for typing detection in UI)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedHandle(handle);
        }, 500);
        return () => clearTimeout(timer);
    }, [handle]);

    // 3. Parse the DEBOUNCED handle (for Query)
    const [queryKey, queryHandle] = parseInput(debouncedHandle);

    const checkHandleResult = useQuery(api.organisation.checkOrganisationHandle, {
        handle: queryHandle,
        key: queryKey || undefined,
    });

    const nextStep = () => {
        if (step === 1) {
            if (!name || !handle) {
                toast.error("Please fill in all fields");
                return;
            }
            if (checkHandleResult?.status === "taken") {
                toast.error("Handle is already taken");
                return;
            }
            if (checkHandleResult?.status === "reserved") {
                if (parsedKey) {
                    toast.error("Invalid redemption key.");
                    return;
                }

                if (checkHandleResult.type === "official") {
                    toast.error("This handle is strictly reserved and not available.");
                    return;
                }
                toast.error("This handle is reserved. Please enter a redemption key.");
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
                handle: parsedHandle,
                category,
                businessType,
                redemptionKey: parsedKey || undefined,
            });

            if (CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION) {
                await addToPreregistration();
            }

            toast.success("Organization created successfully!");
            setSelectedOrganization(orgId);
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to create organization");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Enforce: Lowercase, No spaces, No special chars except hyphen
        // Note: This effectively disables the 'slash' key format. 
        // We will rely on 'dash' format (key-handle) which is URL safe.
        const val = e.target.value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, ""); // Remove anything that isn't a-z, 0-9, or -
        setHandle(val);
    };

    return {
        step,
        name,
        setName,
        handle,
        setHandle: handleHandleChange,
        debouncedHandle, // This is now the raw debounced handle for UI comparison
        plan,
        setPlan,
        category,
        setCategory,
        businessType,
        setBusinessType,
        loading,
        checkHandleResult,
        redemptionKey: parsedKey, // Return immediate key for UI feedback
        nextStep,
        prevStep,
        handleSubmit,
        debugParseInput: parseInput, // Expose for debugging
    };
}
