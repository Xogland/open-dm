import { useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export type HandleStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'reserved' | 'official';

export interface CheckHandleResult {
    status: "available" | "taken" | "reserved";
    type?: "official" | "default";
    message?: string;
}

export function useHandleValidation(initialHandle: string = "") {
    const [handle, setHandle] = useState(initialHandle);
    const [debouncedHandle, setDebouncedHandle] = useState(initialHandle);

    // Helper to parse input
    const parseInput = useCallback((input: string): [string, string] => {
        // Check for Master Key (master-xxxxxxxx-handle)
        if (input.startsWith("master")) {
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
    }, []);

    // 1. Immediate parse for return values
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

    const isTyping = handle !== debouncedHandle;
    const isThinking = !isTyping && debouncedHandle && checkHandleResult === undefined;

    let status: HandleStatus = 'idle';

    if (!handle) status = 'idle';
    else if (isTyping) status = 'typing';
    else if (isThinking) status = 'checking';
    else if (checkHandleResult?.status === 'available') status = 'available';
    else if (checkHandleResult?.status === 'taken') status = 'taken';
    else if (checkHandleResult?.status === 'reserved') {
        status = checkHandleResult.type === 'official' ? 'official' : 'reserved';
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Enforce: Lowercase, No spaces, No special chars except hyphen
        const val = e.target.value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, "");
        setHandle(val);
    };

    return {
        handle,
        setHandle: handleChange,
        setHandleValue: setHandle, // Direct setter if needed
        debouncedHandle,
        parsedHandle,
        redemptionKey: parsedKey,
        status,
        checkHandleResult: checkHandleResult as CheckHandleResult | undefined,
        isTyping,
        isThinking
    };
}
