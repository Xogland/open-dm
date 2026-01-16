// components/debug/DebugPanel.tsx

import React from "react";
import {
  AlertCircle,
  CheckCircle,
  Clipboard,
  EyeOff,
  Keyboard,
  MousePointer,
  Trash,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { CgBrowser } from "react-icons/cg";
import { ScoreDebugItem } from "./score-debug-item";
import { Button } from "@/components/ui/button";
import {
  BOT_THRESHOLD,
  BOT_WEIGHTS,
  SubmissionResult,
} from "@/data/bot-detector-config"; // Adjust path

interface DebugPanelProps {
  submissionData: SubmissionResult;
  onRemove: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ submissionData, onRemove }) => {
  const { score, isBot, tracking } = submissionData;
  const { signals, behavioralData } = tracking;

  // Helper for paste count total
  const totalPastes = Object.values(behavioralData.pasteCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="w-full flex flex-col bg-card border border-border rounded-2xl shadow-xl overflow-hidden self-start sticky top-8 max-h-[calc(100vh-4rem)] shrink-0">
      <div
        className={`p-6 ${isBot ? "bg-destructive/10 border-b-2 border-destructive" : "bg-primary/10 border-b-2 border-primary"} rounded-t-2xl`}
      >
        <h3 className="text-xl text-foreground flex items-center mb-2">
          <AlertCircle size={20} className="mr-2 text-destructive" />
          Detection Analysis
          <Button variant="ghost" size="icon" className="ml-auto" onClick={onRemove}>
            <Trash size={16} className="text-destructive" />
          </Button>
        </h3>
        <div className="flex justify-between items-center pt-2">
          <div className="text-sm">Bot Score:</div>
          <div
            className={`text-2xl ${isBot ? "text-destructive" : "text-primary"}`}
          >
            {score}
          </div>
        </div>
        <div className="flex justify-between items-center pt-1">
          <div className="text-sm">Threshold:</div>
          <div className="text-lg text-muted-foreground">
            {BOT_THRESHOLD}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row">
        <div className="p-4 space-y-1 flex-1">
          <h4 className="text-md mb-2 flex items-center text-secondary-foreground">
            <TrendingUp size={16} className="mr-2" /> Suspicion Breakdown
            (Weights)
          </h4>

          <ScoreDebugItem
            icon={<EyeOff size={16} />}
            label="Honeypot Triggered"
            weight={BOT_WEIGHTS.honeypotTrap}
            isTriggered={signals.honeypotTrap}
          />
          <ScoreDebugItem
            icon={<Zap size={16} />}
            label="Fast Submission (< 3s)"
            weight={BOT_WEIGHTS.fastSubmit}
            isTriggered={signals.fastSubmit}
            rawValue={`${tracking.ttsInMs}ms`}
          />
          <ScoreDebugItem
            icon={<Clipboard size={16} />}
            label="Multiple Pastes (>= 2)"
            weight={BOT_WEIGHTS.highPasteCount}
            isTriggered={signals.highPasteCount}
            rawValue={`Count: ${totalPastes}`}
          />
          <ScoreDebugItem
            icon={<Keyboard size={16} />}
            label="Robotic Typing (Low StDev)"
            weight={BOT_WEIGHTS.roboticTyping}
            isTriggered={signals.roboticTyping}
            rawValue={behavioralData.keystrokeAnalysis.stdDevDelta}
          />
          <ScoreDebugItem
            icon={<MousePointer size={16} />}
            label="Low Mouse Movement"
            weight={BOT_WEIGHTS.lowMouseMovement}
            isTriggered={signals.lowMouseMovement}
            rawValue={`Moves: ${behavioralData.mouseMovementCount}`}
          />
          <ScoreDebugItem
            icon={<CheckCircle size={16} />}
            label="Fast Checkbox Click (< 500ms)"
            weight={BOT_WEIGHTS.fastCheckbox}
            isTriggered={signals.fastCheckbox}
            rawValue={behavioralData.timeToClickCheckbox}
          />
          <ScoreDebugItem
            icon={<TrendingDown size={16} />}
            label="Fast Inter-Field Entry (< 100ms)"
            weight={BOT_WEIGHTS.fastFieldEntry}
            isTriggered={signals.fastFieldEntry}
            rawValue={behavioralData.avgInterFieldTime}
          />
          <ScoreDebugItem
            icon={<CgBrowser size={16} />}
            label="Tab Switching (Visibility changes)"
            weight={BOT_WEIGHTS.tabSwitching}
            isTriggered={signals.tabSwitching}
            rawValue={`Count: ${behavioralData.visibilityChanges}`}
          />
        </div>

        <div className="p-4 pt-0 flex-1 h-full">
          <h4 className="text-md mt-4 mb-2">
            Raw Tracking Data:
          </h4>
          <pre className="bg-muted/30 p-3 rounded-lg overflow-auto text-xs border border-border whitespace-pre-wrap">
            {JSON.stringify(behavioralData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
