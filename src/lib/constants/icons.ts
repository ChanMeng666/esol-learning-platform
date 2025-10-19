/**
 * Icon mapping for the NZCEL Prep application
 * Using Lucide React icons to replace emojis for a more professional look
 */

import {
  Headphones,
  Mic,
  BookOpen,
  PenTool,
  Trophy,
  Award,
  Star,
  Lightbulb,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

/**
 * Skill type icons mapping
 */
export const SKILL_ICONS = {
  listening: Headphones,
  speaking: Mic,
  reading: BookOpen,
  writing: PenTool,
} as const;

/**
 * Achievement and badge icons
 */
export const ACHIEVEMENT_ICONS = {
  trophy: Trophy,
  award: Award,
  star: Star,
  target: Target,
  trending: TrendingUp,
} as const;

/**
 * Feedback and status icons
 */
export const FEEDBACK_ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  hint: Lightbulb,
  spark: Zap,
} as const;

/**
 * Helper function to get skill icon component
 */
export function getSkillIcon(skill: keyof typeof SKILL_ICONS) {
  return SKILL_ICONS[skill];
}

/**
 * Helper function to get achievement icon component
 */
export function getAchievementIcon(type: keyof typeof ACHIEVEMENT_ICONS) {
  return ACHIEVEMENT_ICONS[type];
}

/**
 * Helper function to get feedback icon component
 */
export function getFeedbackIcon(type: keyof typeof FEEDBACK_ICONS) {
  return FEEDBACK_ICONS[type];
}
