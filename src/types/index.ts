// NZCEL Level Types
export type NZCELLevel =
  | "foundation"
  | "level-1"
  | "level-2"
  | "level-3-general"
  | "level-3-applied"
  | "level-3-academic"
  | "level-4-general"
  | "level-4-employment"
  | "level-4-academic"
  | "level-5-general"
  | "level-5-employment"
  | "level-5-academic"
  | "level-6-advanced";

// Skill Types
export type SkillType = "listening" | "speaking" | "reading" | "writing";

// Question Types
export type QuestionType =
  | "multiple-choice"
  | "fill-in-blank"
  | "essay"
  | "speaking-prompt"
  | "listening-comprehension";

export interface Question {
  id: string;
  level: NZCELLevel;
  skill: SkillType;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer?: string | string[]; // For MCQ or fill-in-blank
  points: number;
  explanation?: string;
  audioUrl?: string; // For listening questions
  imageUrl?: string; // For visual questions
}

// NZCEL Level Info
export interface NZCELLevelInfo {
  id: NZCELLevel;
  name: string;
  description: string;
  strategicPurpose: string;
  graduateOutcomes: {
    listening: string;
    speaking: string;
    reading: string;
    writing: string;
  };
  pathways: string[];
  equivalency: {
    ielts?: string;
    toefl?: string;
    pte?: string;
    cefr?: string;
  };
}

// User Progress Types
export interface SkillProgress {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
}

export interface UserProgress {
  currentLevel: NZCELLevel;
  targetLevel: NZCELLevel | null;
  skillProgress: SkillProgress;
  completedQuestions: string[]; // Question IDs
  totalPoints: number;
  streak: number;
  lastStudyDate: string | null;
  badges: Badge[];
  achievements: Achievement[];
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: number; // points
}

// Answer Submission
export interface AnswerSubmission {
  questionId: string;
  userAnswer: string | string[];
  timeSpent: number; // seconds
  isCorrect?: boolean;
}

// Study Session
export interface StudySession {
  id: string;
  startedAt: string;
  endedAt?: string;
  level: NZCELLevel;
  skill: SkillType;
  questionsAnswered: AnswerSubmission[];
  pointsEarned: number;
}
