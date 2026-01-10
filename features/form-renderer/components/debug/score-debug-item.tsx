// components/debug/ScoreDebugItem.tsx

import React from "react";
import { TrendingUp } from "lucide-react";

interface ScoreDebugItemProps {
  icon: React.ReactNode;
  label: string;
  weight: number;
  isTriggered: boolean;
  rawValue?: string | number;
}

export const ScoreDebugItem: React.FC<ScoreDebugItemProps> = ({
                                                                icon,
                                                                label,
                                                                weight,
                                                                isTriggered,
                                                                rawValue,
                                                              }) => {
  const colorClass = isTriggered
    ? "text-red-500"
    : "text-green-500";
  const scoreText = isTriggered ? `+${weight}` : "+0";

  return (
    <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-3">
        <span
          className={`w-5 h-5 flex items-center justify-center ${colorClass}`}
        >
          {icon}
        </span>
        <span className="text-sm text-foreground/80">{label}</span>
      </div>
      <div className="flex items-center space-x-3">
        {rawValue !== undefined && (
          <span className="text-xs text-muted-foreground mr-2">{rawValue}</span>
        )}
        <span
          className={`text-sm w-8 text-right ${isTriggered ? "text-destructive" : "text-muted-foreground"}`}
        >
          {scoreText}
        </span>
      </div>
    </div>
  );
};
