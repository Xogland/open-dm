"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  PencilLine,
  XCircle,
} from "lucide-react";
import { APP_NAME } from "@/data/constants";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export enum HandleState {
  idle = "idle",
  typing = "typing",
  loading = "loading",
  available = "available",
  taken = "taken",
  error = "error",
}

interface Props {
  initialHandle?: string;
  onStatusChange?: (status: HandleState, handle: string) => void;
}

export default function HandleInput({
  initialHandle = "",
  onStatusChange,
}: Props) {
  const [handle, setHandle] = useState(initialHandle);
  const [status, setStatus] = useState<HandleState>(HandleState.idle);

  useEffect(() => {
    if (handle?.length !== 0) {
      runCheck();
    }
  }, []);
  // Keep track of current request to cancel stale ones
  const abortControllerRef = useRef<AbortController | null>(null);

  async function checkAvailability(h: string) {
    abortControllerRef.current?.abort(); // cancel previous
    abortControllerRef.current = new AbortController();
    return await fetchQuery(api.organisation.checkOrganisationHandle, {
      handle: h ?? "",
    });
  }

  const runCheck = useCallback(async () => {
    const currentHandle = handle.trim();

    if (!currentHandle || currentHandle.length < 3) {
      setStatus(HandleState.idle);
      onStatusChange?.(HandleState.idle, currentHandle);
      return;
    }

    setStatus(HandleState.loading);

    try {
      const isTaken = await checkAvailability(currentHandle);

      if (currentHandle === handle.trim()) {
        const newStatus = isTaken ? HandleState.taken : HandleState.available;
        setStatus(newStatus);
        onStatusChange?.(newStatus, currentHandle);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return; // ignore cancelled requests

      if (currentHandle === handle.trim()) {
        setStatus(HandleState.error);
        onStatusChange?.(HandleState.error, currentHandle);
      }
    }
  }, [handle, onStatusChange]);

  useEffect(() => {
    if (status === HandleState.typing) {
      const t = setTimeout(() => runCheck(), 500); // debounce
      return () => clearTimeout(t);
    }
  }, [handle, runCheck, status]);

  return (
    <div>
      <div className="w-full flex flex-row items-center bg-secondary rounded-md shadow-md px-4 border border-secondary-foreground/30">
        <Label htmlFor="handle" className="text-secondary-foreground">
          {APP_NAME.toLowerCase()}/
        </Label>
        <Input
          id="handle"
          placeholder="your handle"
          value={handle}
          onChange={(e) => {
            setHandle(e.target.value);
            setStatus(HandleState.typing);
            onStatusChange?.(HandleState.typing, e.target.value);
          }}
          className="w-full rounded-none py-0 px-0 border-none shadow-none focus:ring-0 focus-visible:ring-0"
        />

        {/* Loader / Status Icons */}
        {status === HandleState.typing && (
          <PencilLine className="ml-2 w-4 h-4 text-gray-400" />
        )}
        {status === HandleState.loading && (
          <Loader2 className="ml-2 w-4 h-4 animate-spin text-gray-500" />
        )}
        {status === HandleState.available && (
          <CheckCircle2 className="ml-2 w-4 h-4 text-green-500" />
        )}
        {status === HandleState.taken && (
          <XCircle className="ml-2 w-4 h-4 text-red-500" />
        )}
        {status === HandleState.error && (
          <AlertCircle className="ml-2 w-4 h-4 text-yellow-500" />
        )}
      </div>
    </div>
  );
}
