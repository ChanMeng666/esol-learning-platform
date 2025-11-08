/**
 * CEFR Level Types (Common European Framework of Reference for Languages)
 *
 * Six proficiency levels used internationally for language assessment:
 * - A1 (Beginner/Elementary) - Basic phrases and simple interactions
 * - A2 (Pre-intermediate) - Routine tasks and familiar situations
 * - B1 (Intermediate) - Main points of clear standard input, travel situations
 * - B2 (Upper-intermediate) - Complex text on concrete and abstract topics
 * - C1 (Advanced) - Wide range of demanding texts, spontaneous expression
 * - C2 (Proficiency) - Effortless understanding and expression
 *
 * @see getCEFRProgress() - Server Action to get user's CEFR progress
 * @see updateCEFRSkillProgress() - Server Action to update skill progress
 * @see docs/data/cefr-levels.ts - Complete CEFR level definitions
 */
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

/**
 * NZCEL Level Types (New Zealand Certificates in English Language)
 *
 * 13 levels from foundation to advanced, used for NZCEL exam preparation:
 * - foundation - Basic communication skills
 * - level-1 - Elementary level
 * - level-2 - Pre-intermediate level
 * - level-3-* - Intermediate (general/applied/academic pathways)
 * - level-4-* - Upper-intermediate (general/employment/academic pathways)
 * - level-5-* - Advanced (general/employment/academic pathways)
 * - level-6-advanced - Highest proficiency level
 *
 * @see getUserProgress() - Server Action to get user's NZCEL progress
 * @see updateCurrentLevel() - Server Action to update current level
 * @see docs/data/nzcel-levels.ts - Complete NZCEL level definitions
 */
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

/**
 * Learning Path Types
 *
 * Different learning modules available in the platform:
 * - general - CEFR-aligned general English practice (A1-C2)
 * - nzcel - NZCEL exam preparation (13 levels)
 * - ielts - IELTS exam prep (coming soon)
 * - toefl - TOEFL exam prep (coming soon)
 * - scenario - Real-world scenario practice (coming soon)
 *
 * @see getModuleProgress() - Server Action to get module-specific progress
 * @see updateModuleProgress() - Server Action to update module stats
 */
export type LearningPath = "general" | "nzcel" | "ielts" | "toefl" | "scenario";

/**
 * Skill Types
 *
 * Four core language skills assessed across all learning paths:
 * - listening - Audio comprehension
 * - speaking - Voice production and conversation
 * - reading - Text comprehension
 * - writing - Text production
 *
 * @see updateSkillProgress() - Server Action to update skill progress (NZCEL)
 * @see updateCEFRSkillProgress() - Server Action to update skill progress (CEFR)
 */
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

/**
 * Skill Progress (0-100 scale)
 *
 * Tracks progress for each of the four language skills.
 * Used in both NZCEL and CEFR progress tracking.
 *
 * @example
 * ```typescript
 * const skillProgress = {
 *   listening: 75,  // 75% proficiency
 *   speaking: 60,
 *   reading: 80,
 *   writing: 70
 * };
 * ```
 */
export interface SkillProgress {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
}

/**
 * User Progress (NZCEL Learning Path)
 *
 * Complete progress tracking for NZCEL exam preparation.
 * Includes skill progress, gamification, and study statistics.
 *
 * Multi-tenant: All queries automatically filter by organizationId
 *
 * @see getUserProgress() - Get current user's NZCEL progress
 * @see submitAnswer() - Submit answer and update progress
 * @see updateSkillProgress() - Update specific skill progress
 *
 * @example
 * ```typescript
 * const progress = await getUserProgress();
 * console.log(`Level: ${progress.currentLevel}`);
 * console.log(`Streak: ${progress.streak} days`);
 * console.log(`Points: ${progress.totalPoints}`);
 * ```
 */
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

/**
 * Conversation Scenario for Real-time Speaking Practice
 *
 * Defines a structured conversation scenario for AI speaking coach.
 * Used with OpenAI Realtime API for natural two-way dialogue.
 *
 * @see createConversationSession() - Start a conversation session
 * @see saveConversationTurn() - Save individual conversation turns
 * @see docs/data/conversation-scenarios.ts - Available scenarios
 *
 * @example
 * ```typescript
 * const scenario: ConversationScenario = {
 *   id: 'restaurant-b2',
 *   level: 'level-4-academic',
 *   title: 'Ordering at a Restaurant',
 *   context: 'You are at a formal restaurant...',
 *   userRole: 'customer',
 *   aiRole: 'server',
 *   initialPrompt: 'Good evening! Welcome to our restaurant.',
 *   targetTurns: 6,
 *   difficulty: 'intermediate-advanced',
 *   topics: ['ordering food', 'dietary restrictions', 'recommendations']
 * };
 *
 * const session = await createConversationSession(
 *   scenario.id,
 *   scenario.title,
 *   scenario.targetTurns
 * );
 * ```
 */
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

/**
 * Assessment Result from OpenAI GPT-4
 *
 * Detailed AI-generated assessment for speaking/writing responses.
 * Uses NZCEL-aligned rubrics and criteria.
 *
 * @see POST /api/openai/assess - REST API endpoint to get assessment
 *
 * @example
 * ```typescript
 * const assessment = await fetch('/api/openai/assess', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     text: userResponse,
 *     level: 'level-3-general',
 *     skill: 'speaking',
 *     questionText: 'Describe your favorite place'
 *   })
 * }).then(r => r.json());
 *
 * console.log('Score:', assessment.overallScore);
 * console.log('Feedback:', assessment.overallFeedback);
 * console.log('Strengths:', assessment.strengths);
 * ```
 */
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

/**
 * Individual Criterion Score
 *
 * Score and feedback for a specific assessment criterion
 * (e.g., pronunciation, fluency, grammar, vocabulary, etc.)
 */
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

// ============================================================================
// MULTI-TENANCY & ORGANIZATION MANAGEMENT TYPES
// ============================================================================

/**
 * User Role Types (RBAC - Role-Based Access Control)
 *
 * Six roles with hierarchical permissions:
 * - system_admin - Full platform access across all organizations
 * - school_admin - Organization-wide admin (school/institution level)
 * - department_head - Department management and teacher oversight
 * - teacher - Class management, assignments, student insights
 * - student - Learning activities, practice, assignments
 * - parent - View child progress and performance
 *
 * @see hasPermission() - Check if user has specific permission
 * @see requireRole() - Enforce role requirement in Server Actions
 * @see docs/architecture/DATABASE_ARCHITECTURE.md - RBAC documentation
 */
export type UserRole = "system_admin" | "school_admin" | "department_head" | "teacher" | "student" | "parent";

/**
 * Organization/School
 *
 * Multi-tenant organization entity. All users belong to one organization.
 * Data isolation enforced at database level (all 44 tables have organization_id).
 *
 * @multiTenant All queries automatically filter by organizationId
 *
 * @see getOrganizationDetails() - Get organization information
 * @see updateOrganization() - Update organization settings
 *
 * @example
 * ```typescript
 * const org: Organization = {
 *   id: 123n,
 *   name: "Wellington High School",
 *   slug: "wellington-hs",
 *   settings: {
 *     allowed_level_systems: ["nzcel", "cefr"],
 *     use_shared_question_bank: true
 *   },
 *   subscriptionTier: "pro",
 *   maxStudents: 500,
 *   isActive: true
 * };
 * ```
 */
export interface Organization {
  id: bigint;
  name: string;
  slug: string;
  settings: {
    allowed_level_systems?: ("nzcel" | "cefr")[];
    use_shared_question_bank?: boolean;
    custom_branding?: Record<string, unknown>;
    features_enabled?: Record<string, boolean>;
  };
  subscriptionTier: "basic" | "pro" | "enterprise";
  maxStudents: number | null;
  isActive: boolean;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Enhanced User (extends Stack Auth with organization context)
 *
 * Links Stack Auth user ID to organization and adds role information.
 * All Server Actions receive EnhancedUser via fetchWithDrizzle() context.
 *
 * @multiTenant All user operations scoped to their organization
 *
 * @see getEnhancedUser() - Get enhanced user record
 * @see updateUserProfile() - Update user information
 *
 * @example
 * ```typescript
 * export async function exampleAction() {
 *   return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
 *     console.log('User role:', enhancedUser.role);
 *     console.log('Organization:', enhancedUser.organizationId);
 *
 *     // Validate role
 *     if (enhancedUser.role !== "teacher") {
 *       throw new Error("Access denied: Teacher role required");
 *     }
 *
 *     // Proceed with operation
 *   });
 * }
 * ```
 */
export interface EnhancedUser {
  id: bigint;
  organizationId: bigint;
  stackUserId: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

// Department
export interface Department {
  id: bigint;
  organizationId: bigint;
  name: string;
  description: string | null;
  headTeacherId: bigint | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Grade Level
export interface GradeLevel {
  id: bigint;
  organizationId: bigint;
  name: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

// Class
export interface Class {
  id: bigint;
  organizationId: bigint;
  departmentId: bigint | null;
  gradeLevelId: bigint | null;
  name: string;
  teacherId: bigint;
  academicYear: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Class Teacher (supports multiple teachers per class)
export interface ClassTeacher {
  id: bigint;
  classId: bigint;
  teacherId: bigint;
  role: "primary_teacher" | "assistant_teacher" | "substitute_teacher";
  assignedAt: Date;
}

// Class Enrollment
export interface ClassEnrollment {
  id: bigint;
  classId: bigint;
  studentId: bigint;
  status: "active" | "completed" | "dropped" | "transferred";
  enrolledAt: Date;
  completedAt: Date | null;
}

// Student Group
export interface StudentGroup {
  id: bigint;
  organizationId: bigint;
  createdByTeacherId: bigint;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Parent-Student Relationship
export interface ParentStudentRelationship {
  id: bigint;
  parentId: bigint;
  studentId: bigint;
  relationshipType: "parent" | "guardian" | "other";
  isPrimary: boolean;
  createdAt: Date;
}

// ============================================================================
// DIAGNOSTIC TESTING TYPES
// ============================================================================

export type DiagnosticTestType = "initial_placement" | "progress_check" | "final_assessment";
export type DiagnosticLevelSystem = "nzcel" | "cefr";

export interface DiagnosticTest {
  id: bigint;
  organizationId: bigint | null; // null for system tests
  name: string;
  description: string | null;
  levelSystem: DiagnosticLevelSystem;
  testType: DiagnosticTestType;
  targetSkills: SkillType[];
  estimatedDuration: number | null; // minutes
  isActive: boolean;
  isSystemTest: boolean;
  createdByUserId: bigint | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiagnosticTestSection {
  id: bigint;
  diagnosticTestId: bigint;
  skillType: SkillType;
  sectionName: string;
  levelRangeMin: string; // e.g., "A1" or "foundation"
  levelRangeMax: string; // e.g., "C2" or "level-6-advanced"
  totalQuestions: number;
  passingThreshold: number | null; // 0.00-1.00
  orderIndex: number;
  instructions: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiagnosticTestQuestion {
  id: bigint;
  testSectionId: bigint;
  questionType: QuestionType;
  questionText: string;
  options: unknown | null; // JSON
  correctAnswer: string | null;
  difficultyLevel: string;
  points: number;
  rubric: unknown | null; // JSON
  audioUrl: string | null;
  imageUrl: string | null;
  orderIndex: number;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentDiagnosticAttempt {
  id: bigint;
  studentId: bigint;
  organizationId: bigint;
  diagnosticTestId: bigint;
  attemptNumber: number;
  startedAt: Date;
  completedAt: Date | null;
  isCompleted: boolean;
  totalDuration: number | null; // seconds
  createdAt: Date;
}

export interface DiagnosticQuestionResponse {
  id: bigint;
  attemptId: bigint;
  questionId: bigint;
  studentAnswer: string | null;
  audioRecordingId: bigint | null;
  transcriptionId: bigint | null;
  isCorrect: boolean | null;
  pointsEarned: number;
  aiAssessment: unknown | null; // JSON
  timeSpent: number | null; // seconds
  answeredAt: Date;
}

export interface StudentDiagnosticResult {
  id: bigint;
  studentId: bigint;
  organizationId: bigint;
  attemptId: bigint;
  diagnosticTestId: bigint;
  levelSystem: DiagnosticLevelSystem;
  overallLevel: string;
  skillLevels: Record<string, string>; // {"listening": "B1", ...}
  skillScores: Record<string, number>; // {"listening": 75, ...}
  strengths: string[];
  areasForImprovement: string[];
  recommendedNextSteps: string[];
  totalScore: number;
  percentageScore: number;
  reviewedByTeacherId: bigint | null;
  teacherComments: string | null;
  reviewedAt: Date | null;
  completedAt: Date;
  createdAt: Date;
}

// ============================================================================
// TEACHER ASSIGNMENT MANAGEMENT TYPES
// ============================================================================

export type AssignmentType = "speaking_practice" | "writing_task" | "listening_exercise" | "reading_comprehension" | "diagnostic_test" | "custom";
export type AssignmentStatus = "draft" | "active" | "completed" | "archived";
export type AssignmentTargetType = "student" | "class" | "student_group" | "grade_level";
export type AssignmentStudentStatusType = "assigned" | "in_progress" | "completed" | "overdue" | "excused";
export type AssignmentSubmissionType = "practice_session" | "diagnostic_test" | "custom_content";

export interface Assignment {
  id: bigint;
  organizationId: bigint;
  createdByTeacherId: bigint;
  title: string;
  description: string | null;
  instructions: string | null;
  assignmentType: AssignmentType;
  targetSkill: SkillType | null;
  targetLevel: string | null;
  requirements: {
    min_duration?: number;
    min_questions?: number;
    topic?: string;
    daily_target?: number;
    specific_questions?: string[];
    diagnostic_test_id?: number;
  } | null;
  dueDate: Date | null;
  isRecurring: boolean;
  recurringPattern: {
    frequency?: "daily" | "weekly";
    days?: number[];
  } | null;
  pointsReward: number | null;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentTarget {
  id: bigint;
  assignmentId: bigint;
  targetType: AssignmentTargetType;
  targetId: bigint;
  assignedAt: Date;
}

export interface AssignmentStudentStatus {
  id: bigint;
  assignmentId: bigint;
  studentId: bigint;
  status: AssignmentStudentStatusType;
  assignedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  progressPercentage: number;
  timeSpent: number;
  teacherViewed: boolean;
  teacherFeedback: string | null;
  teacherScore: number | null;
  feedbackGivenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentSubmission {
  id: bigint;
  assignmentId: bigint;
  studentId: bigint;
  studentStatusId: bigint;
  submissionType: AssignmentSubmissionType;
  practiceSessionId: bigint | null;
  diagnosticAttemptId: bigint | null;
  content: Record<string, unknown> | null;
  audioRecordingIds: bigint[];
  transcriptionIds: bigint[];
  questionsCompleted: number;
  questionsCorrect: number | null;
  totalPointsEarned: number;
  aiAssessment: Record<string, unknown> | null;
  submittedAt: Date;
}

// ============================================================================
// TEACHER INSIGHTS & ANALYTICS TYPES
// ============================================================================

export type InsightType = "common_errors" | "difficult_topics" | "student_engagement" | "skill_distribution" | "recommended_focus_areas" | "class_performance_summary";
export type InsightScopeType = "student" | "class" | "student_group" | "grade_level" | "department";

export interface TeacherInsight {
  id: bigint;
  organizationId: bigint;
  teacherId: bigint;
  insightType: InsightType;
  scopeType: InsightScopeType;
  scopeId: bigint;
  timePeriodStart: Date | null;
  timePeriodEnd: Date | null;
  data: {
    summary?: string;
    details?: Record<string, unknown>;
    recommendations?: string[];
    metrics?: Record<string, unknown>;
  };
  generatedAt: Date;
  acknowledgedAt: Date | null;
  isDismissed: boolean;
}

export interface ClassAnalytics {
  id: bigint;
  organizationId: bigint;
  classId: bigint;
  date: Date;
  totalStudents: number;
  activeStudents: number;
  avgListeningProgress: number | null;
  avgSpeakingProgress: number | null;
  avgReadingProgress: number | null;
  avgWritingProgress: number | null;
  totalTimeSpent: number;
  totalQuestionsCompleted: number;
  averageAccuracy: number | null;
  topPerformers: bigint[];
  needsAttention: bigint[];
  generatedAt: Date;
}

// ============================================================================
// RBAC TYPES
// ============================================================================

export type PermissionAction = "create" | "read" | "update" | "delete" | "assign" | "review";
export type PermissionScope = "system" | "organization" | "department" | "class" | "own";
export type PermissionType = "grant" | "deny";

export interface RolePermission {
  id: bigint;
  role: UserRole;
  resource: string;
  action: PermissionAction;
  scope: PermissionScope;
  conditions: Record<string, unknown> | null;
  createdAt: Date;
}

export interface UserPermission {
  id: bigint;
  userId: bigint;
  organizationId: bigint;
  permissionType: PermissionType;
  resource: string;
  action: PermissionAction;
  grantedByUserId: bigint;
  grantedAt: Date;
  expiresAt: Date | null;
}

// ============================================================================
// QUESTION BANK MANAGEMENT TYPES
// ============================================================================

export type QuestionBankLevelSystem = "nzcel" | "cefr" | "custom";
export type QuestionBankAccessType = "full_access" | "read_only" | "no_access";

export interface QuestionBank {
  id: bigint;
  organizationId: bigint | null;
  name: string;
  description: string | null;
  levelSystem: QuestionBankLevelSystem;
  isSystemBank: boolean;
  isPublic: boolean;
  createdByUserId: bigint | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionBankQuestion {
  id: bigint;
  questionBankId: bigint;
  questionId: string;
  questionData: Question; // Full question object
  skillType: SkillType;
  difficultyLevel: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationQuestionAccess {
  id: bigint;
  organizationId: bigint;
  questionBankId: bigint;
  accessType: QuestionBankAccessType;
  grantedAt: Date;
}

// ============================================================================
// DASHBOARD OPTIMIZATION TYPES
// ============================================================================

/**
 * Todo Item for Student Dashboard
 *
 * Represents a single actionable todo item for students.
 * Sourced from assignments, achievements, and diagnostic suggestions.
 *
 * @see getStudentTodoItems() - Server Action to fetch all todo items
 *
 * @example
 * ```typescript
 * const todos = await getStudentTodoItems();
 * // Returns items like:
 * // - Incomplete assignments (due soon)
 * // - Achievements nearly complete (progress > 80%)
 * // - Recommended practice based on diagnostic results
 * ```
 */
export interface TodoItem {
  id: string;
  type: "assignment" | "achievement" | "recommendation";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate?: Date;
  progress?: number; // 0-100 for achievements
  actionUrl: string; // Where to navigate when clicked
  metadata?: {
    assignmentId?: bigint;
    achievementId?: string;
    skillType?: SkillType;
    level?: string;
  };
}

/**
 * Diagnostic Suggestion for Student Dashboard
 *
 * AI-generated learning recommendations based on diagnostic test results.
 * Highlights strengths and suggests targeted practice areas.
 *
 * @see getDiagnosticSuggestions() - Server Action to fetch suggestions
 *
 * @example
 * ```typescript
 * const suggestion = await getDiagnosticSuggestions();
 * // Returns:
 * // {
 * //   currentLevel: "B1",
 * //   strengths: ["Good vocabulary", "Clear pronunciation"],
 * //   weaknesses: ["Grammar accuracy", "Complex sentences"],
 * //   recommendations: [{
 * //     skill: "writing",
 * //     focus: "grammar",
 * //     description: "Practice conditional sentences",
 * //     actionUrl: "/practice/general?skill=writing&level=B1"
 * //   }]
 * // }
 * ```
 */
export interface DiagnosticSuggestion {
  currentLevel: string; // CEFR or NZCEL level
  levelSystem: DiagnosticLevelSystem;
  strengths: string[];
  weaknesses: string[]; // areasForImprovement
  recommendations: DiagnosticRecommendation[];
  completedAt: Date;
  nextAssessmentDue?: Date;
}

export interface DiagnosticRecommendation {
  skill: SkillType;
  focus: string; // e.g., "grammar", "pronunciation", "vocabulary"
  description: string;
  estimatedDuration?: number; // minutes
  actionUrl: string;
}

/**
 * Priority Assignment for Teacher Dashboard
 *
 * Assignment with calculated priority based on due date and status.
 * Used to show teachers the most urgent items first.
 *
 * @see getPriorityAssignments() - Server Action with priority sorting
 *
 * @example
 * ```typescript
 * const assignments = await getPriorityAssignments();
 * // Sorted by:
 * // 1. Due today (red badge)
 * // 2. Pending grading (orange badge)
 * // 3. Active assignments (green badge)
 * ```
 */
export interface PriorityAssignment extends Assignment {
  priority: "urgent" | "high" | "normal";
  priorityReason: string; // e.g., "Due in 2 hours", "15 submissions to grade"
  studentsAssigned: number;
  studentsCompleted: number;
  studentsInProgress: number;
  submissionsToReview: number;
}

/**
 * Student Needs Attention for Teacher Dashboard
 *
 * Identifies students requiring immediate teacher attention.
 * Based on class analytics and AI-generated insights.
 *
 * @see getStudentsNeedAttention() - Server Action to fetch list
 *
 * @example
 * ```typescript
 * const students = await getStudentsNeedAttention();
 * // Returns students with:
 * // - Low engagement (no activity in 7+ days)
 * // - Poor performance (< 50% accuracy)
 * // - Incomplete assignments (> 3 overdue)
 * ```
 */
export interface StudentNeedAttention {
  studentId: bigint;
  studentName: string;
  className: string;
  classId: bigint;
  reasons: AttentionReason[];
  lastActivity?: Date;
  averageScore?: number; // 0-100
  overdueAssignments: number;
  recommendedAction: string;
}

export interface AttentionReason {
  type: "low_engagement" | "poor_performance" | "overdue_assignments" | "skill_decline" | "other";
  severity: "critical" | "warning" | "info";
  description: string;
  metric?: number; // Optional numeric value (e.g., days inactive, accuracy %)
}

/**
 * Teacher Insight with Enhanced Data
 *
 * Extends base TeacherInsight with computed fields for dashboard display.
 *
 * @see getTeacherInsightsSummary() - Server Action for dashboard
 */
export interface TeacherInsightDashboard extends TeacherInsight {
  isNew: boolean; // Not yet acknowledged
  isActionable: boolean; // Requires teacher action
  studentsAffected?: number;
  estimatedImpact?: "high" | "medium" | "low";
}
