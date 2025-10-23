// CEFR Level Types (Common European Framework of Reference for Languages)
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// NZCEL Level Types (New Zealand Certificates in English Language)
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

// Learning Path Types
export type LearningPath = "general" | "nzcel" | "ielts" | "toefl" | "scenario";

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

// ============================================================================
// HISTORY & FILTERING TYPES
// ============================================================================

// History filter options
export interface HistoryFilters {
  skill?: SkillType;
  level?: NZCELLevel;
  recordingType?: "practice_answer" | "conversation_turn" | "pronunciation_test";
  scenarioId?: string;
  questionId?: string;
  dateRange?: "7d" | "30d" | "all";
}

// Practice session with full details
export interface PracticeSessionWithDetails {
  id: bigint;
  userId: string;
  sessionId: string;
  skill: string;
  level: string;
  startedAt: Date;
  endedAt: Date | null;
  duration: number | null;
  questionsAttempted: number;
  questionsCorrect: number;
  totalPointsEarned: number;
  isCompleted: boolean;
  answers: SessionAnswer[];
}

// Session answer details
export interface SessionAnswer {
  id: bigint;
  sessionId: bigint;
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number | null;
  audioRecordingId: bigint | null;
  transcriptionId: bigint | null;
  aiFeedback: string | null;
  answeredAt: Date;
}

// Conversation session with full details
export interface ConversationSessionWithDetails {
  id: bigint;
  userId: string;
  sessionId: string;
  scenarioId: string;
  scenarioTitle: string;
  startedAt: Date;
  endedAt: Date | null;
  isCompleted: boolean;
  targetTurns: number;
  completedTurns: number;
  totalPointsEarned: number;
  averagePronunciationScore: string | null;
  averageFluencyScore: string | null;
  turns: ConversationTurn[];
}

// Conversation turn details
export interface ConversationTurn {
  id: bigint;
  sessionId: bigint;
  turnNumber: number;
  speaker: "user" | "assistant";
  audioUrl: string | null;
  audioFileId: bigint | null;
  transcription: string | null;
  transcriptionId: bigint | null;
  aiFeedback: string | null;
  pronunciationScore: string | null;
  fluencyScore: string | null;
  grammarScore: string | null;
  vocabularyScore: string | null;
  createdAt: Date;
}

// Recording with full details
export interface RecordingWithDetails {
  id: bigint;
  userId: string;
  audioFileId: bigint;
  recordingType: string;
  contextId: string;
  questionId: string | null;
  transcriptionId: bigint | null;
  recordedAt: Date;
  audioFile: AudioFile;
  transcription: Transcription | null;
}

// Audio file metadata
export interface AudioFile {
  id: bigint;
  fileId: string;
  blobUrl: string;
  fileType: string;
  contentHash: string;
  fileSize: number;
  format: string;
  duration: number | null;
  expiresAt: Date | null;
  accessCount: number;
  lastAccessedAt: Date | null;
  createdAt: Date;
}

// Transcription metadata
export interface Transcription {
  id: bigint;
  audioFileId: bigint;
  userId: string;
  transcribedText: string;
  model: string;
  wordCount: number;
  confidence: number | null;
  metadata: Record<string, unknown> | null;
  transcribedAt: Date;
}

// ============================================================================
// CEFR & LEARNING MODULES TYPES
// ============================================================================

// CEFR Level Info (Common European Framework of Reference)
export interface CEFRLevelInfo {
  id: CEFRLevel;
  name: string;
  description: string;
  canDo: {
    listening: string;
    speaking: string;
    reading: string;
    writing: string;
  };
  equivalency: {
    nzcel?: string[];
    ielts?: string;
    toefl?: string;
    pte?: string;
    duolingo?: string;
  };
}

// Learning Module Configuration
export interface LearningModule {
  id: string;
  type: LearningPath;
  name: string;
  description: string;
  icon: string;
  route: string;
  levelSystem: "cefr" | "nzcel" | "custom";
  supportedSkills: SkillType[];
  isActive: boolean;
}

// CEFR Progress (parallel to NZCEL progress)
export interface CEFRProgress {
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel | null;
  skillProgress: SkillProgress;
  totalPoints: number;
  questionsCompleted: number;
}

// Module-specific progress tracking
export interface ModuleProgress {
  moduleType: LearningPath;
  totalTime: number; // seconds
  questionsCompleted: number;
  pointsEarned: number;
  lastAccessed: string | null;
}
