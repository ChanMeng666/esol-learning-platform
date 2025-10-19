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
  userIdIdx: index("user_progress_user_id_idx").on(table.userId),
}));

/**
 * Completed Questions Table (Enhanced)
 * Tracks all questions completed by users
 */
export const completedQuestions = pgTable("completed_questions", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
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
  userId: text("user_id").notNull(),
  badgeId: text("badge_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  rarity: text("rarity").notNull(), // common, rare, epic, legendary
  earnedAt: timestamp("earned_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("badges_user_id_idx").on(table.userId),
}));

/**
 * Achievements Table
 * Tracks achievement progress for each user
 */
export const achievements = pgTable("achievements", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
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
  conversationId: bigint("conversation_id", { mode: "bigint" }).notNull(), // FK to copilot_conversations
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  contentType: text("content_type").notNull().default("text"), // 'text' | 'code' | 'audio_transcript'
  metadata: jsonb("metadata"), // Additional metadata (code language, confidence, etc.)
  audioUrl: text("audio_url"), // Associated audio file URL if any
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
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
  questionIdIdx: index("question_audio_cache_question_id_idx").on(table.questionId),
  contentHashIdx: index("question_audio_cache_content_hash_idx").on(table.contentHash),
}));

/**
 * User Recordings
 * Tracks user's voice recordings
 */
export const userRecordings = pgTable("user_recordings", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
  userId: text("user_id").notNull(),
  audioFileId: bigint("audio_file_id", { mode: "bigint" }), // FK to audio_files
  recordingType: text("recording_type").notNull(), // 'practice_answer' | 'conversation_turn' | 'free_recording'
  contextId: text("context_id"), // Related session ID
  questionId: text("question_id"),
  transcriptionId: bigint("transcription_id", { mode: "bigint" }), // FK to transcriptions
  duration: integer("duration"), // seconds
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
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
  userIdIdx: index("conversation_sessions_user_id_idx").on(table.userId),
  sessionIdIdx: index("conversation_sessions_session_id_idx").on(table.sessionId),
}));

/**
 * Conversation Turns
 * Individual turns in a conversation session
 */
export const conversationTurns = pgTable("conversation_turns", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedByDefaultAsIdentity(),
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
  sessionIdIdx: index("conversation_turns_session_id_idx").on(table.sessionId),
  turnNumberIdx: index("conversation_turns_turn_number_idx").on(table.turnNumber),
}));

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
};

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
