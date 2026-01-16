// useBotDetector.ts

import { useCallback, useEffect, useState } from "react";
import {
  BOT_THRESHOLD,
  BOT_WEIGHTS,
  FormField,
  KeystrokeAnalysis,
  PasteFieldItems,
  SubmissionResult,
  TrackingData,
} from "@/data/bot-detector-config";

interface BotDetectionState {
  startTime: number;
  pasteCounts: PasteFieldItems;
  keyPressTimestamps: number[];
  fieldFocusTimestamps: Record<string, number>;
  fieldEntryOrder: string[];
  mouseMovementCount: number;
  checkboxClickTime: number | null;
  visibilityChanges: number;
}

const initialDetectionState: BotDetectionState = {
  startTime: Date.now(),
  pasteCounts: {
    email: 0,
    cc: 0,
    subject: 0,
    content: 0,
    name: 0,
  },
  keyPressTimestamps: [],
  fieldFocusTimestamps: {},
  fieldEntryOrder: [],
  mouseMovementCount: 0,
  checkboxClickTime: null,
  visibilityChanges: 0,
};

export const useBotDetector = () => {
  const [state, setState] = useState<BotDetectionState>(initialDetectionState);
  const [honeypotValue, setHoneypotValue] = useState("");

  // --- Handlers (Memoized) ---
  const handlePaste = useCallback((field: FormField) => {
    setState((prev) => ({
      ...prev,
      pasteCounts: {
        ...prev.pasteCounts,
        [field]: prev.pasteCounts[field] + 1,
      },
    }));
  }, []);

  const handleKeyDown = useCallback(() => {
    setState((prev) => ({
      ...prev,
      keyPressTimestamps: [...prev.keyPressTimestamps, Date.now()],
    }));
  }, []);

  const handleFocus = useCallback((field: string) => {
    const now = Date.now();
    setState((prev) => {
      const isNewFocus = !prev.fieldFocusTimestamps[field];
      return {
        ...prev,
        fieldFocusTimestamps: {
          ...prev.fieldFocusTimestamps,
          [field]: prev.fieldFocusTimestamps[field] ?? now,
        },
        fieldEntryOrder: isNewFocus
          ? [...prev.fieldEntryOrder, field]
          : prev.fieldEntryOrder,
      };
    });
  }, []);

  const handleMouseMove = useCallback(() => {
    setState((prev) => ({
      ...prev,
      mouseMovementCount: prev.mouseMovementCount + 1,
    }));
  }, []);

  // Checkbox logic is simplified as it wasn't connected in the original component
  const handleCheckboxClick = useCallback(() => {
    if (!state.checkboxClickTime) {
      setState((prev) => ({ ...prev, checkboxClickTime: Date.now() }));
    }
  }, [state.checkboxClickTime]);

  // --- Effect for Visibility Change Listener ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setState((prev) => ({
          ...prev,
          visibilityChanges: prev.visibilityChanges + 1,
        }));
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // --- Reset Handler ---
  const reset = useCallback(() => {
    setState({ ...initialDetectionState, startTime: Date.now() });
    setHoneypotValue("");
    console.clear();
  }, []);

  // --- Score Calculation Logic ---
  const calculateScore = useCallback(
    (endTime: number): SubmissionResult => {
      const {
        startTime,
        pasteCounts,
        keyPressTimestamps,
        fieldEntryOrder,
        fieldFocusTimestamps,
        mouseMovementCount,
        checkboxClickTime,
        visibilityChanges,
      } = state;

      const ttsInMs = endTime - startTime;
      let botScore = 0;
      const signals: Record<keyof typeof BOT_WEIGHTS, boolean> = {
        fastCheckbox: false,
        fastFieldEntry: false,
        fastSubmit: false,
        highPasteCount: false,
        lowMouseMovement: false,
        roboticTyping: false,
        tabSwitching: false,
        honeypotTrap: false,
      };

      // 1. Honeypot Trap
      const isBotSuspect = honeypotValue !== "";
      signals.honeypotTrap = isBotSuspect;
      if (isBotSuspect) botScore += BOT_WEIGHTS.honeypotTrap;

      // 2. Fast Submit
      const fastSubmit = ttsInMs < 3000;
      signals.fastSubmit = fastSubmit;
      if (fastSubmit) botScore += BOT_WEIGHTS.fastSubmit;

      // 3. Paste Analysis
      const totalPastes = Object.values(pasteCounts).reduce(
        (sum, count) => sum + count,
        0,
      );
      const isPasteSuspicious = totalPastes >= 2;
      signals.highPasteCount = isPasteSuspicious;
      if (isPasteSuspicious) botScore += BOT_WEIGHTS.highPasteCount;

      // 4. Keystroke Analysis
      const keystrokeAnalysis: KeystrokeAnalysis = {
        count: keyPressTimestamps.length,
        stdDevDelta: 0,
        isSuspicious: false,
      };
      if (keyPressTimestamps.length > 1) {
        const deltas = keyPressTimestamps
          .slice(1)
          .map((t, i) => t - keyPressTimestamps[i]);
        const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
        const stdDev = Math.sqrt(
          deltas.map((d) => Math.pow(d - mean, 2)).reduce((a, b) => a + b, 0) /
            (deltas.length || 1),
        );
        keystrokeAnalysis.stdDevDelta = stdDev;
        if (stdDev < 15 && deltas.length > 10) {
          keystrokeAnalysis.isSuspicious = true;
        }
      }
      signals.roboticTyping = keystrokeAnalysis.isSuspicious;
      if (keystrokeAnalysis.isSuspicious) botScore += BOT_WEIGHTS.roboticTyping;

      // 5. Mouse Movement Analysis
      const isMouseMovementSuspicious = mouseMovementCount < 25;
      signals.lowMouseMovement = isMouseMovementSuspicious;
      if (isMouseMovementSuspicious) botScore += BOT_WEIGHTS.lowMouseMovement;

      // 6. Checkbox Interaction Analysis (Using a dummy time for now)
      const timeToClickCheckbox = checkboxClickTime
        ? checkboxClickTime - startTime
        : null;
      const isCheckboxTimeSuspicious =
        timeToClickCheckbox !== null && timeToClickCheckbox < 500;
      signals.fastCheckbox = isCheckboxTimeSuspicious;
      if (isCheckboxTimeSuspicious) botScore += BOT_WEIGHTS.fastCheckbox;

      // 7. Inter-Field Timing Analysis
      const interFieldTimings: number[] = [];
      if (fieldEntryOrder.length > 1) {
        for (let i = 1; i < fieldEntryOrder.length; i++) {
          const fieldA = fieldEntryOrder[i - 1];
          const fieldB = fieldEntryOrder[i];
          const timeA = fieldFocusTimestamps[fieldA];
          const timeB = fieldFocusTimestamps[fieldB];
          if (timeA && timeB) interFieldTimings.push(timeB - timeA);
        }
      }
      const avgInterFieldTime =
        interFieldTimings.reduce((a, b) => a + b, 0) /
        (interFieldTimings.length || 1);
      const isInterFieldTimeSuspicious =
        interFieldTimings.length > 1 && avgInterFieldTime < 100;
      signals.fastFieldEntry = isInterFieldTimeSuspicious;
      if (isInterFieldTimeSuspicious) botScore += BOT_WEIGHTS.fastFieldEntry;

      // 8. Visibility Changes
      const tabSwitching = visibilityChanges > 0;
      signals.tabSwitching = tabSwitching;
      if (tabSwitching) botScore += BOT_WEIGHTS.tabSwitching;

      // --- Final Classification ---
      const isBot = botScore >= BOT_THRESHOLD;

      const trackingData: TrackingData = {
        // Summary
        ttsInMs,
        timeOfCompletion: new Date(endTime).toISOString(),
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "N/A",

        // Bot Signals (Binary)
        signals,

        // Behavioral Data (Raw)
        behavioralData: {
          pasteCounts,
          keystrokeAnalysis: {
            count: keystrokeAnalysis.count,
            stdDevDelta:
              (keystrokeAnalysis.stdDevDelta as number).toFixed(2) + "ms",
            isSuspicious: keystrokeAnalysis.isSuspicious,
          },
          fieldFocusTimestamps,
          fieldEntryOrder,
          avgInterFieldTime: avgInterFieldTime.toFixed(2) + "ms",
          mouseMovementCount,
          timeToClickCheckbox:
            timeToClickCheckbox !== null ? timeToClickCheckbox + "ms" : "N/A",
          visibilityChanges,
        },
      };

      return {
        score: botScore,
        isBot: isBot,
        tracking: trackingData,
      };
    },
    [state, honeypotValue],
  );

  return {
    detectionState: state,
    honeypotValue,
    setHoneypotValue,
    handlers: {
      handlePaste,
      handleKeyDown,
      handleFocus,
      handleMouseMove,
      handleCheckboxClick,
    },
    calculateScore,
    reset,
  };
};
