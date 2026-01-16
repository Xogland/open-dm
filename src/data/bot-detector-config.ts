// config.ts

// --- Configuration & Constants ---
export const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Technical Support",
  "Billing Question",
  "Partnership Proposal",
  "Website Feedback",
];
export const BOT_THRESHOLD = 100;

// --- Type Definitions ---
export type FormField = "name" | "email" | "cc" | "subject" | "content";

export type PasteFieldItems = Record<FormField, number>;

// --- Bot Scoring Weights ---
export const BOT_WEIGHTS = {
  honeypotTrap: 100, // Instant Bot
  fastSubmit: 50, // Very Suspicious
  highPasteCount: 40, // Multiple pastes
  roboticTyping: 30, // Inhumanly consistent keystrokes
  lowMouseMovement: 20,
  fastCheckbox: 15,
  fastFieldEntry: 15,
  tabSwitching: 5,
};

export type BotSignal = keyof typeof BOT_WEIGHTS;

export interface KeystrokeAnalysis {
  count: number;
  stdDevDelta: number | string;
  isSuspicious: boolean;
}

export interface BehavioralData {
  pasteCounts: PasteFieldItems;
  keystrokeAnalysis: KeystrokeAnalysis;
  fieldFocusTimestamps: Record<string, number>;
  fieldEntryOrder: string[];
  avgInterFieldTime: string;
  mouseMovementCount: number;
  timeToClickCheckbox: string;
  visibilityChanges: number;
}

export interface TrackingData {
  ttsInMs: number;
  timeOfCompletion: string;
  userAgent: string;
  signals: Record<BotSignal, boolean>;
  behavioralData: BehavioralData;
}

export interface SubmissionResult {
  score: number;
  isBot: boolean;
  tracking: TrackingData;
}
