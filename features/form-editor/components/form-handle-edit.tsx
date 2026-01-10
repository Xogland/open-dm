import { Input } from "@/components/ui/input";
import React, { useCallback, useEffect, useState } from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react"; // Icons for feedback
import { Button } from "@/components/ui/button";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

// Define possible states for the slug input field
type SlugState =
  | "idle"
  | "typing"
  | "checking"
  | "available"
  | "error"
  | "taken";

export function FormHandleEdit({
  currentSlug,
  formId,
}: {
  currentSlug: string;
  formId: Id<"forms">;
}) {
  const [inputValue, setInputValue] = useState(currentSlug);
  const [slugState, setSlugState] = useState<SlugState>("idle");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isSlugValid = slugState === "available";
  const isSlugChanged = inputValue !== currentSlug;
  const canUpdate = isSlugChanged && isSlugValid && !isUpdating;

  // const updateSlug = useMutation(api.form.updateFormId); // NOT SUPPORTED IN BACKEND

  // Debounced function to check availability - NOW USING CONVEX fetchQuery
  const checkSlugAvailability = useCallback(
    async (slug: string, signal: AbortSignal) => {
      // 1. Basic validation
      if (slug.length < 3) {
        setSlugState("error");
        setErrorMessage("Slug must be at least 3 characters long.");
        return;
      }
      if (!/^[a-z0-9-]+$/.test(slug)) {
        setSlugState("error");
        setErrorMessage(
          "Slug can only contain lowercase letters, numbers, and hyphens.",
        );
        return;
      }

      // 2. If same as currentSlug, reset state
      if (slug === currentSlug) {
        setSlugState("idle");
        setErrorMessage("");
        return;
      }

      // 3. API Check using Convex's fetchQuery
      try {
        console.log(`Checking availability of slug: ${slug}`);

        // Perform the actual API call to check if the ID exists
        const isTaken = await fetchQuery(api.organisation.checkOrganisationHandle, {
          handle: slug,
        });

        // Crucial Check: Prevent stale state updates if the input changed
        // or the component unmounted while the query was running.
        if (signal.aborted) {
          console.log("Check was cancelled after API returned");
          return;
        }

        const isAvailable = !isTaken;

        console.log(`Slug is ${isAvailable ? "" : "not "}available.`);
        if (isAvailable) {
          setSlugState("available");
        } else {
          setSlugState("taken");
          setErrorMessage(`"${slug}" is already taken.`);
        }
      } catch (error) {
        console.error("API Check Error:", error);
        setSlugState("error");
        setErrorMessage("An unexpected error occurred during check.");
      }
    },
    [currentSlug],
  );

  // Effect to handle the debouncing and API cancellation
  useEffect(() => {
    let handler: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();

    // 1. If slug is unchanged, reset to idle and exit
    if (inputValue === currentSlug) {
      setSlugState("idle");
      setErrorMessage("");
      return;
    }

    // 2. If currently typing, set a debounce timer to transition to 'checking'
    if (slugState === "typing") {
      handler = setTimeout(() => {
        // Debounce period ended, now transition to the 'checking' state
        setSlugState("checking");
      }, 500);
    }

    // 3. If state is 'checking', execute the API call
    else if (slugState === "checking") {
      // Pass the AbortController signal to the async check function
      checkSlugAvailability(inputValue, controller.signal);
    }

    // 4. Cleanup function
    return () => {
      if (handler) {
        clearTimeout(handler);
      }
      // Abort the API request flow if the input changes or the component unmounts
      controller.abort();
    };
  }, [inputValue, currentSlug, slugState, checkSlugAvailability]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow lowercase letters, numbers, and hyphens to be entered
    const rawValue = e.target.value;
    const sanitizedValue = rawValue.toLowerCase().replace(/[^a-z0-9-]/g, "");

    setInputValue(sanitizedValue);

    if (sanitizedValue !== currentSlug) {
      // Reset to typing to start the debounce cycle
      setSlugState("typing");
      setErrorMessage(""); // Clear previous errors/messages while typing
    } else {
      // If the user types and returns to the original slug
      setSlugState("idle");
      setErrorMessage("");
    }
  };

  // Handle the final update action (Mock Update)
  const handleUpdate = async () => {
    if (!canUpdate) return;

    setIsUpdating(true);
    setErrorMessage("");

    try {
      console.log(`Updating slug to: ${inputValue}`);

      // Backend does not support handle updates yet
      // await updateSlug({
      //   id: formId,
      //   slug: inputValue,
      // });
      alert("Organization handle cannot be changed at this time.");
      console.log("Slug updated successfully.");
      // In a real app, you'd navigate or update the currentSlug prop here
      setSlugState("idle");
    } catch (error) {
      setSlugState("error");
      setErrorMessage("Failed to save the new slug. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getFeedbackMessage = () => {
    if (errorMessage) {
      return (
        <p className={`text-xs mt-1 text-red-500 flex items-center`}>
          <XCircle className="w-3 h-3 mr-1" />
          {errorMessage}
        </p>
      );
    }

    if (slugState === "available") {
      return (
        <p className="text-xs text-green-500 mt-1 flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" />
          Slug is available!
        </p>
      );
    }

    // Default URL preview or when typing
    return (
      <p className="text-xs text-muted-foreground mt-1">
        Used in the form URL:{" "}
        <span className="font-mono text-foreground">{`OpenDM.io/${inputValue || "[slug]"}`}</span>
      </p>
    );
  };

  // --- Rendered Component ---
  return (
    <div className="pt-1">
      <label
        htmlFor="form-slug"
        className="text-sm text-foreground block mb-2"
      >
        🔗 Form Slug (URL Handle)
      </label>

      {/* Input Group */}
      <div
        className={`flex items-center border rounded-lg bg-background overflow-hidden transition-all duration-200 ${(slugState === "available" &&
            "border-green-500 focus-within:ring-green-500/50") ||
          ((slugState === "taken" || slugState === "error") &&
            "border-red-500 focus-within:ring-red-500/50") ||
          (slugState === "checking" && "border-primary/50")
          } focus-within:ring-2 border-input`}
      >
        {/* URL Prefix */}
        <span className="pl-3 pr-2 text-sm text-muted-foreground bg-accent/30 h-9 flex items-center border-r border-border">
          OpenDM.io/
        </span>

        {/* Input Field */}
        <Input
          id="form-slug"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="e.g., mymainform"
          className="flex-1 border-none rounded-none h-9 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Feedback Message / URL Preview */}
      {getFeedbackMessage()}

      {/* Update Button Section - Only visible if slug is changed or needs fixing */}
      {isSlugChanged && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleUpdate}
            // Button is disabled unless it's available AND not currently loading
            disabled={!canUpdate}
            className="w-full sm:w-auto transition-all duration-200"
          >
            {isUpdating || slugState === "checking" ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUpdating ? "Saving..." : "Checking..."}
              </div>
            ) : (
              "Update Slug"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
