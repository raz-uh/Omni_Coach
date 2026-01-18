
export enum CoachStatus {
  OBSERVING = "observing",
  CORRECTION_NEEDED = "correction_needed",
  PERFECT_FORM = "perfect_form",
  SAFETY_ALERT = "SAFETY ALERT"
}

export interface CoachFeedback {
  status: "observing" | "correction_needed" | "perfect_form" | "SAFETY ALERT";
  cue: string;
  joint_focus: string[];
  reasoning: string;
}

export interface FatiguePoint {
  timestamp: string;
  description: string;
}

export interface SessionSummary {
  overallScore: number;
  biomechanicalBreakdown: string;
  fatigueDetection: FatiguePoint[];
  efficiencyScore: number;
  internalCue: string;
  externalCue: string;
  keyTakeaway: string;
  improvementAreas: string[];
  consistencyRating: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  idealFormHints: string[];
  musclesTargeted: string[];
}

export const EXERCISES: Exercise[] = [
  {
    id: "squat",
    name: "Barbell Squat",
    description: "Compound lower-body movement focusing on hips and knees.",
    idealFormHints: ["Neutral spine", "Weight in heels", "Thighs parallel to floor", "Hips back"],
    musclesTargeted: ["Quads", "Glutes", "Hamstrings", "Core"]
  },
  {
    id: "deadlift",
    name: "Deadlift",
    description: "Posterior chain movement requiring rigid lumbar support.",
    idealFormHints: ["Flat back", "Bar close to shins", "Chest up", "Engage lats"],
    musclesTargeted: ["Hamstrings", "Glutes", "Lower Back", "Traps"]
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    description: "Vertical push for shoulder development.",
    idealFormHints: ["Core braced", "Glutes tight", "Full lockout", "Biceps near ears"],
    musclesTargeted: ["Deltoids", "Triceps", "Upper Chest", "Core"]
  },
  {
    id: "pushup",
    name: "Push-up",
    description: "Horizontal push focusing on chest, triceps, and core.",
    idealFormHints: ["Elbows at 45 degrees", "Plank position", "Full range of motion"],
    musclesTargeted: ["Pectorals", "Triceps", "Front Delts", "Core"]
  }
];
