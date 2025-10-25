import { pgTable, text, integer, timestamp, boolean, bigint, index, decimal, jsonb } from "drizzle-orm/pg-core";

// ============================================================================
// USER PROGRESS & GAMIFICATION
// ============================================================================

/**
 * User Progress Table (Enhanced)
 * Stores the main progress data for each user
 */
export const userProgress = pgTable("user_progress", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  userId: text("user_id").notNull().unique(), // Stack Auth user ID
  currentLevel: text("current_level").notNull().default("foundation"),
  targetLevel: text("target_level"),

  // Skill progress (0-100)
  listeningProgress: integer("listening_progress").notNull().default(0),
  speakingProgress: integer("speaking_progress").notNull().default(0),
  readingProgress: integer("reading_progress").notNull().default(0),
  writingProgress: integer("writing_progress").notNull().default(0),

  // Gamification stats
  totalPoints: integer("total_points").notNull().default(0),
  questionsCompleted: integer("questions_completed").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  perfectStreak: integer("perfect_streak").notNull().default(0), // consecutive correct answers
  lastStudyDate: timestamp("last_study_date", { withTimezone: true }),

  // Study time tracking
  totalStudyTime: integer("total_study_time").notNull().default(0), // in seconds

  // User preferences
  preferredVoice: text("preferred_voice").default("alloy"), // TTS voice preference
  audioPlaybackSpeed: decimal("audio_playback_speed", { precision: 3, scale: 2 }).default("1.00"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("user_progress_organization_id_idx").on(table.organizationId),
  userIdIdx: index("user_progress_user_id_idx").on(table.userId),
}));

/**
 * Completed Questions Table (Enhanced)
 * Tracks all questions completed by users
 */
export const completedQuestions = pgTable("completed_questions", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  userId: text("user_id").notNull(),
  questionId: text("question_id").notNull(),
  userAnswer: text("user_answer"),
  correctAnswer: text("correct_answer"),
  isCorrect: boolean("is_correct").notNull(),
  pointsEarned: integer("points_earned").notNull().default(0),
  timeSpent: integer("time_spent"), // seconds
  skill: text("skill").notNull(), // listening, speaking, reading, writing
  difficulty: text("difficulty"), // easy, medium, hard
  answerDetails: jsonb("answer_details"), // Extended details (options, feedback, etc.)
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("completed_questions_organization_id_idx").on(table.organizationId),
  userIdIdx: index("completed_questions_user_id_idx").on(table.userId),
  questionIdIdx: index("completed_questions_question_id_idx").on(table.questionId),
  skillIdx: index("completed_questions_skill_idx").on(table.skill),
}));

/**
 * Badges Table
 * Stores badges earned by users
 */
export const badges = pgTable("badges", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  userId: text("user_id").notNull(),
  badgeId: text("badge_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  rarity: text("rarity").notNull(), // common, rare, epic, legendary
  earnedAt: timestamp("earned_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("badges_organization_id_idx").on(table.organizationId),
  userIdIdx: index("badges_user_id_idx").on(table.userId),
}));

/**
 * Achievements Table
 * Tracks achievement progress for each user
 */
export const achievements = pgTable("achievements", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  userId: text("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  progress: integer("progress").notNull().default(0),
  target: integer("target").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  reward: integer("reward").notNull(), // points
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (table) => ({
  organizationIdIdx: index("achievements_organization_id_idx").on(table.organizationId),
  userIdIdx: index("achievements_user_id_idx").on(table.userId),
  achievementIdIdx: index("achievements_achievement_id_idx").on(table.achievementId),
}));

// ============================================================================
// COPILOTKIT CHAT HISTORY
// ============================================================================

/**
 * CopilotKit Conversations
 * Stores chat conversation sessions
 */
export const copilotConversations = pgTable("copilot_conversations", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  userId: text("user_id").notNull(),
  sessionId: text("session_id").notNull().unique(), // UUID for the conversation
  contextType: text("context_type").notNull(), // 'practice' | 'conversation' | 'dashboard' | 'general'
  contextId: text("context_id"), // Related practice/conversation session ID
  title: text("title"), // Auto-generated or user-set title
  messageCount: integer("message_count").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("copilot_conversations_organization_id_idx").on(table.organizationId),
  userIdIdx: index("copilot_conversations_user_id_idx").on(table.userId),
  contextIdx: index("copilot_conversations_context_idx").on(table.contextType, table.contextId),
  sessionIdIdx: index("copilot_conversations_session_id_idx").on(table.sessionId),
}));

/**
 * CopilotKit Messages
 * Stores individual chat messages
 */
export const copilotMessages = pgTable("copilot_messages", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  conversationId: bigint("conversation_id", { mode: "bigint" }).notNull(), // FK to copilot_conversations
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  contentType: text("content_type").notNull().default("text"), // 'text' | 'code' | 'audio_transcript'
  metadata: jsonb("metadata"), // Additional metadata (code language, confidence, etc.)
  audioUrl: text("audio_url"), // Associated audio file URL if any
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("copilot_messages_organization_id_idx").on(table.organizationId),
  conversationIdIdx: index("copilot_messages_conversation_id_idx").on(table.conversationId),
  createdAtIdx: index("copilot_messages_created_at_idx").on(table.createdAt),
}));

// ============================================================================
// AUDIO FILE MANAGEMENT
// ============================================================================

/**
 * Audio Files Metadata
 * Stores metadata for all audio files in Blob storage
 */
export const audioFiles = pgTable("audio_files", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }), // FK to organizations (nullable for system files)
  fileId: text("file_id").notNull().unique(), // Blob storage file ID
  blobUrl: text("blob_url").notNull(), // Vercel Blob URL
  fileType: text("file_type").notNull(), // 'question_audio' | 'user_recording' | 'ai_response' | 'tts_cache'
  contentHash: text("content_hash"), // SHA256 hash for deduplication
  fileSize: integer("file_size"), // bytes
  duration: integer("duration"), // seconds
  format: text("format").notNull().default("mp3"), // audio format
  sampleRate: integer("sample_rate"), // Hz
  metadata: jsonb("metadata"), // Extended metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }), // For auto-cleanup
  accessCount: integer("access_count").notNull().default(0), // Usage tracking
}, (table) => ({
  organizationIdIdx: index("audio_files_organization_id_idx").on(table.organizationId),
  fileIdIdx: index("audio_files_file_id_idx").on(table.fileId),
  contentHashIdx: index("audio_files_content_hash_idx").on(table.contentHash),
  fileTypeIdx: index("audio_files_file_type_idx").on(table.fileType),
}));

/**
 * Question Audio Cache
 * Caches generated audio for questions to avoid regeneration
 */
export const questionAudioCache = pgTable("question_audio_cache", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }), // FK to organizations (nullable for system questions)
  questionId: text("question_id").notNull().unique(),
  audioFileId: bigint("audio_file_id", { mode: "bigint" }), // FK to audio_files
  textContent: text("text_content").notNull(),
  voiceModel: text("voice_model").notNull(), // 'tts-1' | 'tts-1-hd'
  voiceName: text("voice_name").notNull(), // 'alloy' | 'echo' | etc.
  language: text("language").notNull().default("en"),
  contentHash: text("content_hash").notNull(), // Hash of text + voice config
  generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
  lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }).defaultNow().notNull(),
  accessCount: integer("access_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
}, (table) => ({
  organizationIdIdx: index("question_audio_cache_organization_id_idx").on(table.organizationId),
  questionIdIdx: index("question_audio_cache_question_id_idx").on(table.questionId),
  contentHashIdx: index("question_audio_cache_content_hash_idx").on(table.contentHash),
}));

/**
 * User Recordings
 * Tracks user's voice recordings
 */
export const userRecordings = pgTable("user_recordings", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  userId: text("user_id").notNull(),
  audioFileId: bigint("audio_file_id", { mode: "bigint" }), // FK to audio_files
  recordingType: text("recording_type").notNull(), // 'practice_answer' | 'conversation_turn' | 'free_recording'
  contextId: text("context_id"), // Related session ID
  questionId: text("question_id"),
  transcriptionId: bigint("transcription_id", { mode: "bigint" }), // FK to transcriptions
  duration: integer("duration"), // seconds
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("user_recordings_organization_id_idx").on(table.organizationId),
  userIdIdx: index("user_recordings_user_id_idx").on(table.userId),
  contextIdIdx: index("user_recordings_context_id_idx").on(table.contextId),
  audioFileIdIdx: index("user_recordings_audio_file_id_idx").on(table.audioFileId),
}));

/**
 * Transcriptions
 * Stores voice transcriptions from Whisper
 */
export const transcriptions = pgTable("transcriptions", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  audioFileId: bigint("audio_file_id", { mode: "bigint" }), // FK to audio_files
  userId: text("user_id").notNull(),
  transcribedText: text("transcribed_text").notNull(),
  language: text("language"), // Detected language
  confidence: decimal("confidence", { precision: 5, scale: 4 }), // 0-1
  model: text("model").notNull(), // 'whisper-1' etc.
  wordCount: integer("word_count"),
  processingTime: integer("processing_time"), // milliseconds
  metadata: jsonb("metadata"), // Timestamps, word-level confidence, etc.
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("transcriptions_organization_id_idx").on(table.organizationId),
  audioFileIdIdx: index("transcriptions_audio_file_id_idx").on(table.audioFileId),
  userIdIdx: index("transcriptions_user_id_idx").on(table.userId),
}));

// ============================================================================
// PRACTICE SESSIONS
// ============================================================================

/**
 * Practice Sessions
 * Tracks individual practice sessions
 */
export const practiceSessions = pgTable("practice_sessions", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  userId: text("user_id").notNull(),
  sessionId: text("session_id").notNull().unique(),
  skill: text("skill").notNull(), // 'listening' | 'speaking' | 'reading' | 'writing'
  level: text("level").notNull(),
  questionsAttempted: integer("questions_attempted").notNull().default(0),
  questionsCorrect: integer("questions_correct").notNull().default(0),
  totalPointsEarned: integer("total_points_earned").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  duration: integer("duration"), // seconds
  isCompleted: boolean("is_completed").notNull().default(false),
}, (table) => ({
  organizationIdIdx: index("practice_sessions_organization_id_idx").on(table.organizationId),
  userIdIdx: index("practice_sessions_user_id_idx").on(table.userId),
  startedAtIdx: index("practice_sessions_started_at_idx").on(table.startedAt),
  sessionIdIdx: index("practice_sessions_session_id_idx").on(table.sessionId),
}));

/**
 * Session Answers
 * Detailed answers for each question in a session
 */
export const sessionAnswers = pgTable("session_answers", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  sessionId: bigint("session_id", { mode: "bigint" }).notNull(), // FK to practice_sessions
  questionId: text("question_id").notNull(),
  userAnswer: text("user_answer"),
  correctAnswer: text("correct_answer"),
  isCorrect: boolean("is_correct").notNull(),
  pointsEarned: integer("points_earned").notNull().default(0),
  timeSpent: integer("time_spent"), // seconds
  audioRecordingId: bigint("audio_recording_id", { mode: "bigint" }), // FK to user_recordings
  transcriptionId: bigint("transcription_id", { mode: "bigint" }), // FK to transcriptions
  aiFeedback: text("ai_feedback"),
  answeredAt: timestamp("answered_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("session_answers_organization_id_idx").on(table.organizationId),
  sessionIdIdx: index("session_answers_session_id_idx").on(table.sessionId),
  questionIdIdx: index("session_answers_question_id_idx").on(table.questionId),
}));

// ============================================================================
// CONVERSATION PRACTICE
// ============================================================================

/**
 * Conversation Sessions
 * Tracks real-time conversation practice sessions
 */
export const conversationSessions = pgTable("conversation_sessions", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  userId: text("user_id").notNull(),
  sessionId: text("session_id").notNull().unique(),
  scenarioId: text("scenario_id").notNull(),
  scenarioTitle: text("scenario_title").notNull(),
  targetTurns: integer("target_turns").notNull(),
  completedTurns: integer("completed_turns").notNull().default(0),
  totalPointsEarned: integer("total_points_earned").notNull().default(0),
  averagePronunciationScore: decimal("average_pronunciation_score", { precision: 5, scale: 2 }),
  averageFluencyScore: decimal("average_fluency_score", { precision: 5, scale: 2 }),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  isCompleted: boolean("is_completed").notNull().default(false),
}, (table) => ({
  organizationIdIdx: index("conversation_sessions_organization_id_idx").on(table.organizationId),
  userIdIdx: index("conversation_sessions_user_id_idx").on(table.userId),
  sessionIdIdx: index("conversation_sessions_session_id_idx").on(table.sessionId),
}));

/**
 * Conversation Turns
 * Individual turns in a conversation session
 */
export const conversationTurns = pgTable("conversation_turns", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  sessionId: bigint("session_id", { mode: "bigint" }).notNull(), // FK to conversation_sessions
  turnNumber: integer("turn_number").notNull(),
  speaker: text("speaker").notNull(), // 'user' | 'ai'
  audioUrl: text("audio_url"),
  audioFileId: bigint("audio_file_id", { mode: "bigint" }), // FK to audio_files
  transcription: text("transcription"),
  transcriptionId: bigint("transcription_id", { mode: "bigint" }), // FK to transcriptions
  aiFeedback: text("ai_feedback"),
  pronunciationScore: decimal("pronunciation_score", { precision: 5, scale: 2 }),
  fluencyScore: decimal("fluency_score", { precision: 5, scale: 2 }),
  grammarScore: decimal("grammar_score", { precision: 5, scale: 2 }),
  vocabularyScore: decimal("vocabulary_score", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("conversation_turns_organization_id_idx").on(table.organizationId),
  sessionIdIdx: index("conversation_turns_session_id_idx").on(table.sessionId),
  turnNumberIdx: index("conversation_turns_turn_number_idx").on(table.turnNumber),
}));

// ============================================================================
// RELATIONS
// ============================================================================

import { relations } from "drizzle-orm";

/**
 * Question Audio Cache Relations
 */
export const questionAudioCacheRelations = relations(questionAudioCache, ({ one }) => ({
  audioFile: one(audioFiles, {
    fields: [questionAudioCache.audioFileId],
    references: [audioFiles.id],
  }),
}));

/**
 * User Recordings Relations
 */
export const userRecordingsRelations = relations(userRecordings, ({ one }) => ({
  audioFile: one(audioFiles, {
    fields: [userRecordings.audioFileId],
    references: [audioFiles.id],
  }),
  transcription: one(transcriptions, {
    fields: [userRecordings.transcriptionId],
    references: [transcriptions.id],
  }),
}));

/**
 * Transcriptions Relations
 */
export const transcriptionsRelations = relations(transcriptions, ({ one }) => ({
  audioFile: one(audioFiles, {
    fields: [transcriptions.audioFileId],
    references: [audioFiles.id],
  }),
}));

/**
 * Copilot Conversations Relations
 */
export const copilotConversationsRelations = relations(copilotConversations, ({ many }) => ({
  messages: many(copilotMessages),
}));

/**
 * Copilot Messages Relations
 */
export const copilotMessagesRelations = relations(copilotMessages, ({ one }) => ({
  conversation: one(copilotConversations, {
    fields: [copilotMessages.conversationId],
    references: [copilotConversations.id],
  }),
}));

/**
 * Practice Sessions Relations
 */
export const practiceSessionsRelations = relations(practiceSessions, ({ many }) => ({
  answers: many(sessionAnswers),
}));

/**
 * Session Answers Relations
 */
export const sessionAnswersRelations = relations(sessionAnswers, ({ one }) => ({
  session: one(practiceSessions, {
    fields: [sessionAnswers.sessionId],
    references: [practiceSessions.id],
  }),
}));

/**
 * Conversation Sessions Relations
 */
export const conversationSessionsRelations = relations(conversationSessions, ({ many }) => ({
  turns: many(conversationTurns),
}));

/**
 * Conversation Turns Relations
 */
export const conversationTurnsRelations = relations(conversationTurns, ({ one }) => ({
  session: one(conversationSessions, {
    fields: [conversationTurns.sessionId],
    references: [conversationSessions.id],
  }),
  audioFile: one(audioFiles, {
    fields: [conversationTurns.audioFileId],
    references: [audioFiles.id],
  }),
  transcription: one(transcriptions, {
    fields: [conversationTurns.transcriptionId],
    references: [transcriptions.id],
  }),
}));

// ============================================================================
// CEFR & MULTI-MODULE SUPPORT
// ============================================================================

/**
 * CEFR Progress Table
 * Tracks user progress for CEFR-based general practice (parallel to NZCEL progress)
 */
export const cefrProgress = pgTable("cefr_progress", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  userId: text("user_id").notNull().unique(), // Stack Auth user ID
  currentLevel: text("current_level").notNull().default("A1"), // A1-C2
  targetLevel: text("target_level"), // A1-C2

  // Skill progress (0-100)
  listeningProgress: integer("listening_progress").notNull().default(0),
  speakingProgress: integer("speaking_progress").notNull().default(0),
  readingProgress: integer("reading_progress").notNull().default(0),
  writingProgress: integer("writing_progress").notNull().default(0),

  // Stats
  totalPoints: integer("total_points").notNull().default(0),
  questionsCompleted: integer("questions_completed").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("cefr_progress_organization_id_idx").on(table.organizationId),
  userIdIdx: index("cefr_progress_user_id_idx").on(table.userId),
}));

/**
 * Module Progress Table
 * Tracks overall progress and activity for each learning module/path
 */
export const moduleProgress = pgTable("module_progress", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  userId: text("user_id").notNull(),
  moduleType: text("module_type").notNull(), // general, nzcel, ielts, toefl, scenario

  // Aggregated stats
  totalTime: integer("total_time").notNull().default(0), // seconds
  questionsCompleted: integer("questions_completed").notNull().default(0),
  pointsEarned: integer("points_earned").notNull().default(0),
  lastAccessed: timestamp("last_accessed", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("module_progress_organization_id_idx").on(table.organizationId),
  userIdModuleIdx: index("module_progress_user_id_module_idx").on(table.userId, table.moduleType),
}));

// ============================================================================
// MULTI-TENANCY & ORGANIZATION MANAGEMENT
// ============================================================================

/**
 * Organizations Table
 * Stores schools/institutions using the platform
 */
export const organizations = pgTable("organizations", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // URL-friendly identifier

  // Configuration
  settings: jsonb("settings"), // School-level configuration
  // settings structure:
  // {
  //   allowed_level_systems: ["nzcel", "cefr"],
  //   use_shared_question_bank: true,
  //   custom_branding: {...},
  //   features_enabled: {...}
  // }

  // Subscription
  subscriptionTier: text("subscription_tier").notNull().default("basic"), // basic, pro, enterprise
  maxStudents: integer("max_students"), // Student limit based on subscription

  // Status
  isActive: boolean("is_active").notNull().default(true),

  // Metadata
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  address: text("address"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("organizations_slug_idx").on(table.slug),
  isActiveIdx: index("organizations_is_active_idx").on(table.isActive),
}));

/**
 * Users Table (Enhanced)
 * Central user table that extends Stack Auth with organization and role info
 */
export const users = pgTable("users", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  stackUserId: text("stack_user_id").notNull().unique(), // Stack Auth user ID

  // Basic info
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),

  // Role-based access control
  role: text("role").notNull(), // system_admin, school_admin, department_head, teacher, student, parent

  // Status
  isActive: boolean("is_active").notNull().default(true),

  // Additional metadata
  metadata: jsonb("metadata"), // Avatar, phone, preferences, etc.

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("users_organization_id_idx").on(table.organizationId),
  stackUserIdIdx: index("users_stack_user_id_idx").on(table.stackUserId),
  roleIdx: index("users_role_idx").on(table.role),
  emailIdx: index("users_email_idx").on(table.email),
}));

/**
 * Departments Table
 * Represents teaching departments/groups within a school
 */
export const departments = pgTable("departments", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations

  name: text("name").notNull(),
  description: text("description"),

  headTeacherId: bigint("head_teacher_id", { mode: "bigint" }), // FK to users (department_head role)

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("departments_organization_id_idx").on(table.organizationId),
  headTeacherIdIdx: index("departments_head_teacher_id_idx").on(table.headTeacherId),
}));

/**
 * Grade Levels Table
 * School-defined grade levels/year groups
 */
export const gradeLevels = pgTable("grade_levels", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations

  name: text("name").notNull(), // e.g., "Year 10", "Grade 3"
  orderIndex: integer("order_index").notNull(), // For sorting

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("grade_levels_organization_id_idx").on(table.organizationId),
  orderIdx: index("grade_levels_order_idx").on(table.orderIndex),
}));

/**
 * Classes Table
 * Represents individual classes/classrooms
 */
export const classes = pgTable("classes", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  departmentId: bigint("department_id", { mode: "bigint" }), // FK to departments (optional)
  gradeLevelId: bigint("grade_level_id", { mode: "bigint" }), // FK to grade_levels (optional)

  name: text("name").notNull(), // Class name
  teacherId: bigint("teacher_id", { mode: "bigint" }).notNull(), // FK to users (primary teacher)

  academicYear: text("academic_year").notNull(), // e.g., "2024-2025"

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("classes_organization_id_idx").on(table.organizationId),
  teacherIdIdx: index("classes_teacher_id_idx").on(table.teacherId),
  gradeLevelIdIdx: index("classes_grade_level_id_idx").on(table.gradeLevelId),
  departmentIdIdx: index("classes_department_id_idx").on(table.departmentId),
}));

/**
 * Class Teachers Table
 * Supports multiple teachers per class (primary, assistant, substitute)
 */
export const classTeachers = pgTable("class_teachers", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  classId: bigint("class_id", { mode: "bigint" }).notNull(), // FK to classes
  teacherId: bigint("teacher_id", { mode: "bigint" }).notNull(), // FK to users

  role: text("role").notNull(), // primary_teacher, assistant_teacher, substitute_teacher

  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  classIdIdx: index("class_teachers_class_id_idx").on(table.classId),
  teacherIdIdx: index("class_teachers_teacher_id_idx").on(table.teacherId),
}));

/**
 * Class Enrollments Table
 * Tracks student enrollment in classes
 */
export const classEnrollments = pgTable("class_enrollments", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  classId: bigint("class_id", { mode: "bigint" }).notNull(), // FK to classes
  studentId: bigint("student_id", { mode: "bigint" }).notNull(), // FK to users

  status: text("status").notNull().default("active"), // active, completed, dropped, transferred

  enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (table) => ({
  classIdIdx: index("class_enrollments_class_id_idx").on(table.classId),
  studentIdIdx: index("class_enrollments_student_id_idx").on(table.studentId),
  statusIdx: index("class_enrollments_status_idx").on(table.status),
}));

/**
 * Student Groups Table
 * Custom student groups created by teachers for flexible task assignment
 */
export const studentGroups = pgTable("student_groups", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  createdByTeacherId: bigint("created_by_teacher_id", { mode: "bigint" }).notNull(), // FK to users

  name: text("name").notNull(),
  description: text("description"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("student_groups_organization_id_idx").on(table.organizationId),
  createdByTeacherIdIdx: index("student_groups_created_by_teacher_id_idx").on(table.createdByTeacherId),
}));

/**
 * Student Group Members Table
 * Associates students with custom groups
 */
export const studentGroupMembers = pgTable("student_group_members", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  studentGroupId: bigint("student_group_id", { mode: "bigint" }).notNull(), // FK to student_groups
  studentId: bigint("student_id", { mode: "bigint" }).notNull(), // FK to users

  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  studentGroupIdIdx: index("student_group_members_group_id_idx").on(table.studentGroupId),
  studentIdIdx: index("student_group_members_student_id_idx").on(table.studentId),
}));

/**
 * Parent-Student Relationships Table
 * Links parents/guardians to students
 */
export const parentStudentRelationships = pgTable("parent_student_relationships", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  parentId: bigint("parent_id", { mode: "bigint" }).notNull(), // FK to users (parent role)
  studentId: bigint("student_id", { mode: "bigint" }).notNull(), // FK to users (student role)

  relationshipType: text("relationship_type").notNull(), // parent, guardian, other
  isPrimary: boolean("is_primary").notNull().default(false), // Primary contact

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  parentIdIdx: index("parent_student_relationships_parent_id_idx").on(table.parentId),
  studentIdIdx: index("parent_student_relationships_student_id_idx").on(table.studentId),
}));

// ============================================================================
// DIAGNOSTIC TESTING SYSTEM
// ============================================================================

/**
 * Diagnostic Tests Table
 * Defines diagnostic tests for initial placement and progress assessment
 */
export const diagnosticTests = pgTable("diagnostic_tests", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }), // FK to organizations (null = system-level test)

  name: text("name").notNull(),
  description: text("description"),

  // Test configuration
  levelSystem: text("level_system").notNull(), // nzcel, cefr
  testType: text("test_type").notNull(), // initial_placement, progress_check, final_assessment
  targetSkills: text("target_skills").array(), // ["listening", "speaking", "reading", "writing"]

  estimatedDuration: integer("estimated_duration"), // Estimated duration in minutes

  // Status
  isActive: boolean("is_active").notNull().default(true),
  isSystemTest: boolean("is_system_test").notNull().default(false), // System-level test vs school-custom

  // Creator
  createdByUserId: bigint("created_by_user_id", { mode: "bigint" }), // FK to users

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("diagnostic_tests_organization_id_idx").on(table.organizationId),
  levelSystemIdx: index("diagnostic_tests_level_system_idx").on(table.levelSystem),
  isActiveIdx: index("diagnostic_tests_is_active_idx").on(table.isActive),
}));

/**
 * Diagnostic Test Sections Table
 * Breaks down diagnostic tests into sections by skill
 */
export const diagnosticTestSections = pgTable("diagnostic_test_sections", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  diagnosticTestId: bigint("diagnostic_test_id", { mode: "bigint" }).notNull(), // FK to diagnostic_tests

  skillType: text("skill_type").notNull(), // listening, speaking, reading, writing
  sectionName: text("section_name").notNull(),

  // Level range for this section
  levelRangeMin: text("level_range_min").notNull(), // e.g., "A1" or "foundation"
  levelRangeMax: text("level_range_max").notNull(), // e.g., "C2" or "level-6-advanced"

  totalQuestions: integer("total_questions").notNull(),
  passingThreshold: decimal("passing_threshold", { precision: 3, scale: 2 }), // 0.00-1.00

  orderIndex: integer("order_index").notNull(), // Section order
  instructions: text("instructions"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  diagnosticTestIdIdx: index("diagnostic_test_sections_test_id_idx").on(table.diagnosticTestId),
  orderIdx: index("diagnostic_test_sections_order_idx").on(table.orderIndex),
}));

/**
 * Diagnostic Test Questions Table
 * Stores questions for diagnostic tests
 */
export const diagnosticTestQuestions = pgTable("diagnostic_test_questions", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  testSectionId: bigint("test_section_id", { mode: "bigint" }).notNull(), // FK to diagnostic_test_sections

  // Question content
  questionType: text("question_type").notNull(), // multiple_choice, fill_in_blank, speaking_prompt, essay, listening_comprehension
  questionText: text("question_text").notNull(),
  options: jsonb("options"), // For multiple choice: ["A", "B", "C", "D"]
  correctAnswer: text("correct_answer"), // For auto-graded questions

  // Difficulty
  difficultyLevel: text("difficulty_level").notNull(), // Target level (e.g., "B1" or "level-3-general")
  points: integer("points").notNull().default(1),

  // Assessment
  rubric: jsonb("rubric"), // Assessment criteria for open-ended questions

  // Media
  audioUrl: text("audio_url"), // For listening questions
  imageUrl: text("image_url"), // For visual questions

  orderIndex: integer("order_index").notNull(),
  metadata: jsonb("metadata"), // Additional question data

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  testSectionIdIdx: index("diagnostic_test_questions_section_id_idx").on(table.testSectionId),
  orderIdx: index("diagnostic_test_questions_order_idx").on(table.orderIndex),
}));

/**
 * Student Diagnostic Attempts Table
 * Tracks each attempt a student makes at a diagnostic test
 */
export const studentDiagnosticAttempts = pgTable("student_diagnostic_attempts", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  studentId: bigint("student_id", { mode: "bigint" }).notNull(), // FK to users
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  diagnosticTestId: bigint("diagnostic_test_id", { mode: "bigint" }).notNull(), // FK to diagnostic_tests

  attemptNumber: integer("attempt_number").notNull().default(1), // 1st, 2nd, 3rd attempt

  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  isCompleted: boolean("is_completed").notNull().default(false),

  totalDuration: integer("total_duration"), // Actual time spent in seconds

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  studentIdIdx: index("student_diagnostic_attempts_student_id_idx").on(table.studentId),
  diagnosticTestIdIdx: index("student_diagnostic_attempts_test_id_idx").on(table.diagnosticTestId),
  isCompletedIdx: index("student_diagnostic_attempts_is_completed_idx").on(table.isCompleted),
}));

/**
 * Diagnostic Question Responses Table
 * Stores student responses to diagnostic test questions
 */
export const diagnosticQuestionResponses = pgTable("diagnostic_question_responses", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  attemptId: bigint("attempt_id", { mode: "bigint" }).notNull(), // FK to student_diagnostic_attempts
  questionId: bigint("question_id", { mode: "bigint" }).notNull(), // FK to diagnostic_test_questions

  // Student response
  studentAnswer: text("student_answer"),
  audioRecordingId: bigint("audio_recording_id", { mode: "bigint" }), // FK to user_recordings
  transcriptionId: bigint("transcription_id", { mode: "bigint" }), // FK to transcriptions

  // Scoring
  isCorrect: boolean("is_correct"),
  pointsEarned: integer("points_earned").notNull().default(0),
  aiAssessment: jsonb("ai_assessment"), // AI-generated assessment for open-ended questions

  timeSpent: integer("time_spent"), // Time spent on this question in seconds

  answeredAt: timestamp("answered_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  attemptIdIdx: index("diagnostic_question_responses_attempt_id_idx").on(table.attemptId),
  questionIdIdx: index("diagnostic_question_responses_question_id_idx").on(table.questionId),
}));

/**
 * Student Diagnostic Results Table
 * Stores aggregated results and recommendations from diagnostic tests
 */
export const studentDiagnosticResults = pgTable("student_diagnostic_results", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  studentId: bigint("student_id", { mode: "bigint" }).notNull(), // FK to users
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  attemptId: bigint("attempt_id", { mode: "bigint" }).notNull(), // FK to student_diagnostic_attempts
  diagnosticTestId: bigint("diagnostic_test_id", { mode: "bigint" }).notNull(), // FK to diagnostic_tests

  levelSystem: text("level_system").notNull(), // nzcel, cefr

  // Overall assessment
  overallLevel: text("overall_level").notNull(), // e.g., "B1" or "level-3-general"

  // Skill-specific levels
  skillLevels: jsonb("skill_levels").notNull(), // {"listening": "B1", "speaking": "A2", "reading": "B1", "writing": "B1"}
  skillScores: jsonb("skill_scores").notNull(), // {"listening": 75, "speaking": 65, "reading": 78, "writing": 72}

  // Insights
  strengths: text("strengths").array(), // Array of strength areas
  areasForImprovement: text("areas_for_improvement").array(), // Array of areas needing work
  recommendedNextSteps: text("recommended_next_steps").array(), // Learning recommendations

  // Scores
  totalScore: integer("total_score").notNull(),
  percentageScore: decimal("percentage_score", { precision: 5, scale: 2 }).notNull(),

  // Teacher review
  reviewedByTeacherId: bigint("reviewed_by_teacher_id", { mode: "bigint" }), // FK to users
  teacherComments: text("teacher_comments"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),

  completedAt: timestamp("completed_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  studentIdIdx: index("student_diagnostic_results_student_id_idx").on(table.studentId),
  organizationIdIdx: index("student_diagnostic_results_organization_id_idx").on(table.organizationId),
  levelSystemIdx: index("student_diagnostic_results_level_system_idx").on(table.levelSystem),
  completedAtIdx: index("student_diagnostic_results_completed_at_idx").on(table.completedAt),
}));

// ============================================================================
// TEACHER ASSIGNMENT MANAGEMENT
// ============================================================================

/**
 * Assignments Table
 * Teacher-created tasks assigned to students
 */
export const assignments = pgTable("assignments", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  createdByTeacherId: bigint("created_by_teacher_id", { mode: "bigint" }).notNull(), // FK to users

  // Assignment details
  title: text("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),

  // Assignment configuration
  assignmentType: text("assignment_type").notNull(), // speaking_practice, writing_task, listening_exercise, reading_comprehension, diagnostic_test, custom
  targetSkill: text("target_skill"), // listening, speaking, reading, writing (nullable for diagnostic tests)
  targetLevel: text("target_level"), // NZCEL or CEFR level

  // Requirements (JSON structure)
  requirements: jsonb("requirements"), // Flexible requirements object
  // Example structure:
  // {
  //   min_duration: 300,           // Minimum practice time in seconds
  //   min_questions: 5,            // Minimum number of questions
  //   topic: "seasons",            // Specific topic
  //   daily_target: 5,             // Daily practice goal (e.g., 5 minutes per day)
  //   specific_questions: [...],   // Array of specific question IDs
  //   diagnostic_test_id: 123      // ID of diagnostic test (for diagnostic assignments)
  // }

  // Timing
  dueDate: timestamp("due_date", { withTimezone: true }),
  isRecurring: boolean("is_recurring").notNull().default(false),
  recurringPattern: jsonb("recurring_pattern"), // {frequency: "daily", days: [1,2,3,4,5]}

  // Rewards
  pointsReward: integer("points_reward"),

  // Status
  status: text("status").notNull().default("active"), // draft, active, completed, archived

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("assignments_organization_id_idx").on(table.organizationId),
  createdByTeacherIdIdx: index("assignments_created_by_teacher_id_idx").on(table.createdByTeacherId),
  statusIdx: index("assignments_status_idx").on(table.status),
  dueDateIdx: index("assignments_due_date_idx").on(table.dueDate),
}));

/**
 * Assignment Targets Table
 * Defines who an assignment is assigned to (student, class, group, grade)
 */
export const assignmentTargets = pgTable("assignment_targets", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  assignmentId: bigint("assignment_id", { mode: "bigint" }).notNull(), // FK to assignments

  targetType: text("target_type").notNull(), // student, class, student_group, grade_level
  targetId: bigint("target_id", { mode: "bigint" }).notNull(), // ID of the target (student/class/group/grade)

  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  assignmentIdIdx: index("assignment_targets_assignment_id_idx").on(table.assignmentId),
  targetTypeIdx: index("assignment_targets_target_type_idx").on(table.targetType),
  targetIdIdx: index("assignment_targets_target_id_idx").on(table.targetId),
}));

/**
 * Assignment Student Status Table
 * Tracks individual student progress on assignments
 */
export const assignmentStudentStatus = pgTable("assignment_student_status", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  assignmentId: bigint("assignment_id", { mode: "bigint" }).notNull(), // FK to assignments
  studentId: bigint("student_id", { mode: "bigint" }).notNull(), // FK to users

  // Status tracking
  status: text("status").notNull().default("assigned"), // assigned, in_progress, completed, overdue, excused

  // Timing
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),

  // Progress
  progressPercentage: integer("progress_percentage").notNull().default(0), // 0-100
  timeSpent: integer("time_spent").notNull().default(0), // Cumulative time in seconds

  // Teacher feedback
  teacherViewed: boolean("teacher_viewed").notNull().default(false),
  teacherFeedback: text("teacher_feedback"),
  teacherScore: integer("teacher_score"), // Optional teacher-assigned score
  feedbackGivenAt: timestamp("feedback_given_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  assignmentIdIdx: index("assignment_student_status_assignment_id_idx").on(table.assignmentId),
  studentIdIdx: index("assignment_student_status_student_id_idx").on(table.studentId),
  statusIdx: index("assignment_student_status_status_idx").on(table.status),
}));

/**
 * Assignment Submissions Table
 * Records student submissions for assignments
 */
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  assignmentId: bigint("assignment_id", { mode: "bigint" }).notNull(), // FK to assignments
  studentId: bigint("student_id", { mode: "bigint" }).notNull(), // FK to users
  studentStatusId: bigint("student_status_id", { mode: "bigint" }).notNull(), // FK to assignment_student_status

  // Submission type
  submissionType: text("submission_type").notNull(), // practice_session, diagnostic_test, custom_content

  // Links to related records
  practiceSessionId: bigint("practice_session_id", { mode: "bigint" }), // FK to practice_sessions
  diagnosticAttemptId: bigint("diagnostic_attempt_id", { mode: "bigint" }), // FK to student_diagnostic_attempts

  // Custom content (for non-session submissions)
  content: jsonb("content"), // Flexible content object for custom submissions

  // Media references
  audioRecordingIds: bigint("audio_recording_ids", { mode: "bigint" }).array(), // Array of recording IDs
  transcriptionIds: bigint("transcription_ids", { mode: "bigint" }).array(), // Array of transcription IDs

  // Performance metrics
  questionsCompleted: integer("questions_completed").notNull().default(0),
  questionsCorrect: integer("questions_correct"),
  totalPointsEarned: integer("total_points_earned").notNull().default(0),

  // AI assessment
  aiAssessment: jsonb("ai_assessment"), // AI-generated feedback and scoring

  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  assignmentIdIdx: index("assignment_submissions_assignment_id_idx").on(table.assignmentId),
  studentIdIdx: index("assignment_submissions_student_id_idx").on(table.studentId),
  submissionTypeIdx: index("assignment_submissions_submission_type_idx").on(table.submissionType),
}));

// ============================================================================
// TEACHER INSIGHTS & ANALYTICS
// ============================================================================

/**
 * Teacher Insights Table
 * Auto-generated insights and recommendations for teachers
 */
export const teacherInsights = pgTable("teacher_insights", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  teacherId: bigint("teacher_id", { mode: "bigint" }).notNull(), // FK to users

  // Insight configuration
  insightType: text("insight_type").notNull(), // common_errors, difficult_topics, student_engagement, skill_distribution, recommended_focus_areas, class_performance_summary

  // Scope of insight
  scopeType: text("scope_type").notNull(), // student, class, student_group, grade_level, department
  scopeId: bigint("scope_id", { mode: "bigint" }).notNull(), // ID of the scope entity

  // Time period
  timePeriodStart: timestamp("time_period_start", { withTimezone: true, mode: "date" }),
  timePeriodEnd: timestamp("time_period_end", { withTimezone: true, mode: "date" }),

  // Insight data (JSON structure)
  data: jsonb("data").notNull(), // Flexible data structure
  // Example structure:
  // {
  //   summary: "...",
  //   details: {...},
  //   recommendations: [...],
  //   metrics: {...}
  // }

  generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }), // Teacher viewed it
  isDismissed: boolean("is_dismissed").notNull().default(false),
}, (table) => ({
  organizationIdIdx: index("teacher_insights_organization_id_idx").on(table.organizationId),
  teacherIdIdx: index("teacher_insights_teacher_id_idx").on(table.teacherId),
  insightTypeIdx: index("teacher_insights_insight_type_idx").on(table.insightType),
  scopeTypeIdx: index("teacher_insights_scope_type_idx").on(table.scopeType),
  scopeIdIdx: index("teacher_insights_scope_id_idx").on(table.scopeId),
}));

/**
 * Class Analytics Table
 * Daily/weekly aggregated class performance data
 */
export const classAnalytics = pgTable("class_analytics", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  classId: bigint("class_id", { mode: "bigint" }).notNull(), // FK to classes
  date: timestamp("date", { withTimezone: true, mode: "date" }).notNull(), // Data date

  // Student counts
  totalStudents: integer("total_students").notNull(),
  activeStudents: integer("active_students").notNull(), // Active this week

  // Average progress
  avgListeningProgress: decimal("avg_listening_progress", { precision: 5, scale: 2 }),
  avgSpeakingProgress: decimal("avg_speaking_progress", { precision: 5, scale: 2 }),
  avgReadingProgress: decimal("avg_reading_progress", { precision: 5, scale: 2 }),
  avgWritingProgress: decimal("avg_writing_progress", { precision: 5, scale: 2 }),

  // Aggregated stats
  totalTimeSpent: integer("total_time_spent").notNull().default(0), // Class cumulative time in seconds
  totalQuestionsCompleted: integer("total_questions_completed").notNull().default(0),
  averageAccuracy: decimal("average_accuracy", { precision: 5, scale: 2 }), // 0.00-1.00

  // Highlights
  topPerformers: bigint("top_performers", { mode: "bigint" }).array(), // Top 5 student IDs
  needsAttention: bigint("needs_attention", { mode: "bigint" }).array(), // Students needing attention

  generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  classIdIdx: index("class_analytics_class_id_idx").on(table.classId),
  dateIdx: index("class_analytics_date_idx").on(table.date),
}));

// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================================================

/**
 * Role Permissions Table
 * Defines permissions for each role
 */
export const rolePermissions = pgTable("role_permissions", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),

  role: text("role").notNull(), // system_admin, school_admin, department_head, teacher, student, parent
  resource: text("resource").notNull(), // Resource type (e.g., 'students', 'assignments', 'diagnostic_tests')
  action: text("action").notNull(), // create, read, update, delete, assign, review

  // Permission scope
  scope: text("scope").notNull(), // system, organization, department, class, own

  // Additional conditions (JSON)
  conditions: jsonb("conditions"), // Flexible conditions
  // Example:
  // {
  //   must_be_assigned: true,
  //   only_own_students: true,
  //   require_approval: true
  // }

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  roleIdx: index("role_permissions_role_idx").on(table.role),
  resourceIdx: index("role_permissions_resource_idx").on(table.resource),
  actionIdx: index("role_permissions_action_idx").on(table.action),
}));

/**
 * User Permissions Table
 * Special permissions granted to specific users (override role permissions)
 */
export const userPermissions = pgTable("user_permissions", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  userId: bigint("user_id", { mode: "bigint" }).notNull(), // FK to users
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations

  permissionType: text("permission_type").notNull(), // grant, deny
  resource: text("resource").notNull(),
  action: text("action").notNull(),

  // Who granted this permission
  grantedByUserId: bigint("granted_by_user_id", { mode: "bigint" }).notNull(), // FK to users
  grantedAt: timestamp("granted_at", { withTimezone: true }).defaultNow().notNull(),

  // Expiration
  expiresAt: timestamp("expires_at", { withTimezone: true }),
}, (table) => ({
  userIdIdx: index("user_permissions_user_id_idx").on(table.userId),
  organizationIdIdx: index("user_permissions_organization_id_idx").on(table.organizationId),
}));

// ============================================================================
// QUESTION BANK MANAGEMENT
// ============================================================================

/**
 * Question Banks Table
 * Manages question banks (system-level and school-custom)
 */
export const questionBanks = pgTable("question_banks", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }), // FK to organizations (null = system-level)

  name: text("name").notNull(),
  description: text("description"),

  levelSystem: text("level_system").notNull(), // nzcel, cefr, custom

  // Bank type
  isSystemBank: boolean("is_system_bank").notNull().default(false), // System vs school-custom
  isPublic: boolean("is_public").notNull().default(false), // Can other schools access it?

  createdByUserId: bigint("created_by_user_id", { mode: "bigint" }), // FK to users

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("question_banks_organization_id_idx").on(table.organizationId),
  isSystemBankIdx: index("question_banks_is_system_bank_idx").on(table.isSystemBank),
}));

/**
 * Question Bank Questions Table
 * Stores questions in question banks
 */
export const questionBankQuestions = pgTable("question_bank_questions", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  questionBankId: bigint("question_bank_id", { mode: "bigint" }).notNull(), // FK to question_banks

  questionId: text("question_id").notNull(), // Unique question identifier
  questionData: jsonb("question_data").notNull(), // Full question object (matches Question interface)

  // Quick filters
  skillType: text("skill_type").notNull(), // listening, speaking, reading, writing
  difficultyLevel: text("difficulty_level").notNull(), // Target level
  tags: text("tags").array(), // Custom tags for filtering

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  questionBankIdIdx: index("question_bank_questions_bank_id_idx").on(table.questionBankId),
  questionIdIdx: index("question_bank_questions_question_id_idx").on(table.questionId),
  skillTypeIdx: index("question_bank_questions_skill_type_idx").on(table.skillType),
  difficultyLevelIdx: index("question_bank_questions_difficulty_level_idx").on(table.difficultyLevel),
}));

/**
 * Organization Question Access Table
 * Controls which organizations can access which question banks
 */
export const organizationQuestionAccess = pgTable("organization_question_access", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  organizationId: bigint("organization_id", { mode: "bigint" }).notNull(), // FK to organizations
  questionBankId: bigint("question_bank_id", { mode: "bigint" }).notNull(), // FK to question_banks

  accessType: text("access_type").notNull(), // full_access, read_only, no_access

  grantedAt: timestamp("granted_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  organizationIdIdx: index("organization_question_access_organization_id_idx").on(table.organizationId),
  questionBankIdIdx: index("organization_question_access_question_bank_id_idx").on(table.questionBankId),
}));

// ============================================================================
// SCHEMA EXPORT
// ============================================================================

// Export all tables as a single object for Drizzle ORM
export const schema = {
  // User & Progress
  userProgress,
  completedQuestions,
  badges,
  achievements,

  // Chat History
  copilotConversations,
  copilotMessages,

  // Audio Management
  audioFiles,
  questionAudioCache,
  userRecordings,
  transcriptions,

  // Sessions
  practiceSessions,
  sessionAnswers,
  conversationSessions,
  conversationTurns,

  // CEFR & Multi-Module
  cefrProgress,
  moduleProgress,

  // Multi-Tenancy & Organization Management
  organizations,
  users,
  departments,
  gradeLevels,
  classes,
  classTeachers,
  classEnrollments,
  studentGroups,
  studentGroupMembers,
  parentStudentRelationships,

  // Diagnostic Testing System
  diagnosticTests,
  diagnosticTestSections,
  diagnosticTestQuestions,
  studentDiagnosticAttempts,
  diagnosticQuestionResponses,
  studentDiagnosticResults,

  // Teacher Assignment Management
  assignments,
  assignmentTargets,
  assignmentStudentStatus,
  assignmentSubmissions,

  // Teacher Insights & Analytics
  teacherInsights,
  classAnalytics,

  // Role-Based Access Control (RBAC)
  rolePermissions,
  userPermissions,

  // Question Bank Management
  questionBanks,
  questionBankQuestions,
  organizationQuestionAccess,
};
