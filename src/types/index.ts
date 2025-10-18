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
  | "listening-comprehension"
  | "audio-comprehension" // Listening with audio playback
  | "voice-recording" // Speaking with voice recording
  | "realtime-conversation"; // Real-time speaking practice

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

  // Audio/Voice features
  audioUrl?: string; // Pre-recorded audio file URL
  audioScript?: string; // Text script for TTS generation
  voiceProfile?: "academic" | "professional" | "casual" | "formal"; // TTS voice profile
  allowTranscript?: boolean; // Whether to show transcript after completion

  // Speaking/Conversation features
  conversationScenario?: ConversationScenario; // For realtime conversations
  expectedDuration?: number; // Expected response duration in seconds

  // Reading features
  imageUrl?: string; // For visual questions
  passage?: string; // Reading passage text

  // Assessment rubric
  rubric?: AssessmentRubric;
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

// Audio/Voice Types
export interface AudioPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  hasPlayed: boolean; // Track if audio was played at least once
}

export interface VoiceRecordingState {
  isRecording: boolean;
  recordingDuration: number;
  audioBlob: Blob | null;
  transcription: string | null;
  isTranscribing: boolean;
  isAssessing: boolean;
  assessment: AssessmentResult | null;
}

// Conversation scenario for real-time practice
export interface ConversationScenario {
  id: string;
  level: NZCELLevel;
  title: string;
  description?: string;
  context: string; // Background info for the AI
  userRole: string; // e.g., "job applicant", "student"
  aiRole: string; // e.g., "interviewer", "professor"
  initialPrompt: string; // AI's opening line
  targetTurns: number; // Expected number of conversation turns
  difficulty: "beginner" | "intermediate" | "intermediate-advanced" | "advanced";
  topics: string[]; // Key topics covered in the scenario
  rubric?: AssessmentRubric;
}

// Assessment rubric
export interface AssessmentRubric {
  level: NZCELLevel;
  skill: SkillType;
  criteria: RubricCriterion[];
  description?: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1, sum of all weights should be 1
  levels: {
    excellent: string; // 90-100%
    good: string; // 70-89%
    satisfactory: string; // 50-69%
    needsImprovement: string; // 0-49%
  };
}

// Assessment result from OpenAI
export interface AssessmentResult {
  overallScore: number; // 0-100
  overallFeedback: string;
  criteria: {
    [key: string]: CriterionScore;
  };
  strengths: string[];
  improvements: string[];
  transcription?: string; // For speaking assessments
  estimatedLevel?: NZCELLevel; // AI's estimate of user's current level
}

export interface CriterionScore {
  score: number; // 0-100
  comment: string;
}

// TTS Request/Response
export interface TTSRequest {
  text: string;
  voiceProfile?: "academic" | "professional" | "casual" | "formal";
}

// Transcription Response
export interface TranscriptionResponse {
  text: string;
  duration?: number;
}
