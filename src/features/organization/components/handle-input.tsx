"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Loader2,
  Check,
  ShieldAlert,
  Lock,
  Info,
  Key,
  X,
} from "lucide-react";
import { APP_NAME } from "@/data/constants";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
// Actually, let's redefine HandleState here but ensure compatibility
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CheckHandleResultType {
  status: "available" | "taken" | "reserved";
  type?: "official" | "default";
  message?: string;
}

export enum HandleState {
  idle = "idle",
  typing = "typing",
  loading = "loading",
  available = "available",
  taken = "taken",
  reserved = "reserved",
  official = "official",
  error = "error",
}

interface Props {
  initialHandle?: string;
  onStatusChange?: (status: HandleState, handle: string, result?: CheckHandleResultType, redemptionKey?: string) => void;
  redemptionKey?: string;
  className?: string;
  showLabel?: boolean;
}

export default function HandleInput({
  initialHandle = "",
  onStatusChange,
  redemptionKey,
  className,
  showLabel = true
}: Props) {
  const [handle, setHandle] = useState(initialHandle);
  const [status, setStatus] = useState<HandleState>(HandleState.idle);
  const [checkResult, setCheckResult] = useState<CheckHandleResultType | undefined>(undefined);



  // Keep track of current request to cancel stale ones
  const abortControllerRef = useRef<AbortController | null>(null);

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

  async function checkAvailability(h: string, key?: string) {
    abortControllerRef.current?.abort(); // cancel previous
    abortControllerRef.current = new AbortController();
    return await fetchQuery(api.organisation.checkOrganisationHandle, {
      handle: h ?? "",
      key: key // Pass key if available for validation
    });
  }

  const runCheck = useCallback(async (val: string) => {
    // 1. Parse input for potential key
    const [parsedKey, parsedHandle] = parseInput(val);
    const cleaningHandle = parsedHandle.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

    // Use prop key if no parsed key, or parsed key if present
    const keyToUse = parsedKey || redemptionKey;

    if (!cleaningHandle || cleaningHandle.length < 3) {
      setStatus(HandleState.idle);
      onStatusChange?.(HandleState.idle, cleaningHandle, undefined, keyToUse);
      return;
    }

    setStatus(HandleState.loading);
    setCheckResult(undefined);

    try {
      const result = await checkAvailability(cleaningHandle, keyToUse);

      // Verify we are still checking the same input (though useCallback dependency on 'val' handles this mostly, state might drift)
      // Actually with the parse, 'val' is the raw input.
      if (val === handle) {
        let newStatus: HandleState = HandleState.available;

        if (result.status === "available") newStatus = HandleState.available;
        else if (result.status === "taken") newStatus = HandleState.taken;
        else if (result.status === "reserved") {
          newStatus = result.type === "official" ? HandleState.official : HandleState.reserved;
        }

        setStatus(newStatus);
        setCheckResult(result as CheckHandleResultType);
        onStatusChange?.(newStatus, cleaningHandle, result as CheckHandleResultType, keyToUse);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return; // ignore cancelled requests

      if (val === handle) {
        setStatus(HandleState.error);
        onStatusChange?.(HandleState.error, cleaningHandle, undefined, keyToUse);
      }
    }
  }, [handle, onStatusChange, redemptionKey, parseInput]);

  useEffect(() => {
    // We only trigger debounce if we are in typing state
    // But we need to detect when user typed.
    // The onChange handler sets typing.
    if (status === HandleState.typing) {
      const t = setTimeout(() => runCheck(handle), 500); // debounce
      return () => clearTimeout(t);
    }
  }, [handle, runCheck, status]);

  // Sync with prop if it changes externally (controlled component pattern support)
  useEffect(() => {
    if (initialHandle !== handle) {
      setHandle(initialHandle);
      if (initialHandle) runCheck(initialHandle);
    }
  }, [initialHandle, handle, runCheck]);

  useEffect(() => {
    if (handle?.length !== 0 && status === HandleState.idle) {
      runCheck(handle);
    }
  }, [handle, runCheck, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // Allow typing anything, we clean on check
    setHandle(val);
    setStatus(HandleState.typing);
    // We pass raw value on typing
    onStatusChange?.(HandleState.typing, val, undefined, undefined);
  };

  const [parsedKey] = parseInput(handle);
  const activeKey = parsedKey || redemptionKey;

  return (
    <div className={cn("space-y-4", className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <Label htmlFor="handle" className="text-sm ml-1">
            Unique Handle
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="inline ml-1.5 h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Unique identifier for your organization URL</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full capitalize transition-colors duration-300",
            status === HandleState.available && "bg-green-500/10 text-green-500",
            status === HandleState.taken && "bg-red-500/10 text-red-500",
            (status === HandleState.reserved || status === HandleState.official) && "bg-amber-500/10 text-amber-500",
            (status === HandleState.loading || status === HandleState.typing) && "text-muted-foreground",
            status === HandleState.idle && "opacity-0"
          )}>
            {/* Map Enum to display text if needed, or just use status string */}
            {status === HandleState.loading ? 'Checking...' : status}
          </span>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-mono select-none pointer-events-none">
          {APP_NAME.toLowerCase()}/
        </div>
        <Input
          id="handle"
          placeholder="your-handle"
          value={handle}
          onChange={handleChange}
          className={cn(
            "h-12 bg-secondary/30 border-secondary focus:bg-background transition-all pl-32 pr-12 font-mono text-base",
            status === HandleState.available && "border-green-500/50 focus:border-green-500 focus:ring-green-500/20",
            status === HandleState.taken && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
            (status === HandleState.reserved || status === HandleState.official) && "border-amber-500/50 focus:border-amber-500 focus:ring-amber-500/20",
          )}
        />

        {/* Loader / Status Icons */}
        <div className="absolute right-4 top-3.5 transition-all duration-300">
          {(status === HandleState.loading || status === HandleState.typing) && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
          {status === HandleState.available && (
            <Check className="h-5 w-5 text-green-500 animate-in zoom-in duration-300" />
          )}
          {status === HandleState.taken && (
            <X className="h-5 w-5 text-red-500 animate-in zoom-in duration-300" />
          )}
          {(status === HandleState.reserved || status === HandleState.official) && (
            <Lock className="h-5 w-5 text-amber-500 animate-in zoom-in duration-300" />
          )}
          {status === HandleState.error && (
            <AlertCircle className="h-5 w-5 text-yellow-500 animate-in zoom-in duration-300" />
          )}
        </div>
      </div>

      {/* Status Message */}
      <div className="h-6 overflow-hidden">
        {status === HandleState.available && (
          <p className="text-xs text-green-500 flex items-center animate-in slide-in-from-top-1">
            <Check className="w-3 h-3 mr-1" />
            {activeKey ? "Key valid! Handle unlocked." : "Available for registration"}
          </p>
        )}
        {status === HandleState.taken && (
          <p className="text-xs text-red-500 flex items-center animate-in slide-in-from-top-1">
            <ShieldAlert className="w-3 h-3 mr-1" /> This handle is already taken
          </p>
        )}
        {status === HandleState.official && (
          <p className="text-xs text-muted-foreground flex items-center animate-in slide-in-from-top-1">
            {activeKey ? (
              <>
                <ShieldAlert className="w-3 h-3 mr-1" />
                Invalid key for this official handle.
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3 mr-1" /> {checkResult?.message}
              </>
            )}
          </p>
        )}
        {status === HandleState.reserved && (
          <p className="text-xs text-amber-500 flex items-center animate-in slide-in-from-top-1">
            {activeKey ? (
              <>
                <ShieldAlert className="w-3 h-3 mr-1" />
                Invalid key for this handle.
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Reserved Handle. Please contact support.
              </>
            )}
          </p>
        )}
        {status === HandleState.error && (
          <p className="text-xs text-yellow-500 flex items-center animate-in slide-in-from-top-1">
            <AlertCircle className="w-3 h-3 mr-1" /> Error checking availability
          </p>
        )}
      </div>
      {/* Key Indicator */}
      {activeKey && (
        <div className="animate-in fade-in slide-in-from-top-1 pt-1">
          <Badge variant="outline" className={cn(
            "text-[10px] font-mono border-opacity-20",
            status === HandleState.available
              ? "border-green-500/30 bg-green-500/5 text-green-600"
              : "border-primary/20 bg-primary/5 text-primary"
          )}>
            <Key className="w-3 h-3 mr-1" />
            Key detected: {activeKey.substring(0, 4)}...
          </Badge>
        </div>
      )}
    </div>
  );
}
