# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A comprehensive **AI-Powered ESOL Learning Platform** built with Next.js 15, React 19, CopilotKit, Neon PostgreSQL, and Stack Auth. The platform offers multiple integrated learning paths for English language learners:

- **🎤 AI Speaking Coach** - Real-time voice conversation using OpenAI Realtime API (GA) with natural two-way dialogue
- **📚 General English Practice** - CEFR-aligned practice for all four skills (A1-C2 levels)
- **🎓 NZCEL Exam Preparation** - Comprehensive prep for New Zealand Certificates in English Language (13 levels)
- **🌍 Scenario-Based Learning** - Real-world context practice (workplace, travel, academic) - *Coming Soon*
- **📝 IELTS/TOEFL Preparation** - Targeted exam preparation - *Coming Soon*

The platform features a complete backend with database persistence, intelligent audio caching, user authentication, cloud storage, and **parallel progress tracking** for multiple learning systems (NZCEL and CEFR).

**Architecture**: Full-stack with Next.js Server Actions, Neon PostgreSQL (43 tables), Stack Auth authentication, Vercel Blob storage, and OpenAI integrations (TTS, Whisper, GPT-4, Realtime API). **Multi-tenant architecture** with organization-based data isolation.

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000

# Production
npm run build            # Create optimized production build
npm start                # Run production server

# Database
npm run drizzle:generate # Generate migration files
npm run drizzle:migrate  # Run migrations
npm run drizzle:push     # Push schema directly (development)
                         # ⚠️ IMPORTANT: This command requires manual terminal execution
                         # It cannot be automated via Server Actions or API routes

# Linting
npm run lint             # Run ESLint (uses eslint.config.mjs)
```

## Architecture

### Database Layer: Neon PostgreSQL with Drizzle ORM

The application uses a **Neon PostgreSQL** serverless database with **Drizzle ORM** for type-safe queries. All database operations are performed through **Next.js Server Actions** with **Stack Auth** authentication.

**⚠️ Database Management Important Notes**:
- **Database Provider**: Neon PostgreSQL (serverless, auto-scaling)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Changes**: Use `npm run drizzle:push` for development (requires manual terminal execution)
- **Production Migrations**: Always use `drizzle:generate` + `drizzle:migrate` workflow
- **No Automated Schema Push**: `npx drizzle-kit push` cannot be automated via Server Actions or API routes

**Schema Location**: `src/lib/db/schema.ts` (1371 lines, **43 tables**)

**Key Tables** (Organized by Category):
1. **Organizations & User Management** (5 tables): `organizations`, `users`, `departments`, `classes`, `grade_level`
2. **User Progress - NZCEL** (4 tables): `user_progress`, `completed_questions`, `badges`, `achievements`
3. **User Progress - CEFR & Modules** (2 tables): `cefr_progress`, `module_progress`
4. **CopilotKit Chat** (2 tables): `copilot_conversations`, `copilot_messages`
5. **Audio Management** (4 tables): `audio_files`, `question_audio_cache`, `user_recordings`, `transcriptions`
6. **Practice Sessions** (2 tables): `practice_sessions`, `session_answers`
7. **Conversation Practice** (2 tables): `conversation_sessions`, `conversation_turns`
8. **Education & Class Management** (7 tables): `assignments`, `assignment_submissions`, `student_class_enrollments`, `teacher_class_assignments`, `class_schedules`, `attendance_records`, `student_notes`
9. **Diagnostic Testing** (4 tables): `diagnostic_tests`, `diagnostic_test_sections`, `diagnostic_test_questions`, `diagnostic_test_results`
10. **Gamification & Engagement** (4 tables): `leaderboards`, `learning_paths`, `learning_path_milestones`, `user_learning_paths`
11. **Permissions & Access Control** (3 tables): `organization_question_access`, `organization_settings`, `user_roles`
12. **Notifications & Communication** (2 tables): `notifications`, `feedback_requests`

**Multi-Tenant Authentication & Data Isolation**: All Server Actions use `fetchWithDrizzle()` helper from `src/lib/db/index.ts` which:
- Authenticates user via Stack Auth (`stackServerApp.getUser()`)
- Retrieves enhanced user record from `users` table (links Stack Auth ID to organization)
- Provides context: `{ userId, organizationId, enhancedUser }`
- **Automatically scopes ALL database queries to user's organization**
- Enforces data isolation between organizations (shared database, organization-based filtering)

**Multi-Tenant Pattern**:
```typescript
export async function fetchWithDrizzle<T>(
  callback: (db: DrizzleDb, context: {
    userId: string;
    organizationId: bigint;
    enhancedUser: EnhancedUser;
  }) => Promise<T>
): Promise<T>
```

**Critical Requirements**:
1. All Server Actions MUST validate `organizationId` exists: `if (!organizationId) throw new Error("Organization context required")`
2. All INSERT operations MUST include `organizationId` field
3. All SELECT/UPDATE/DELETE operations MUST filter by `organizationId` using `and()` helper
4. Never query the database directly from client components—always use Server Actions in `src/actions/`

### State Management: Zustand with LocalStorage Cache

The platform uses **two parallel progress tracking systems**:

**1. NZCEL Progress** (`src/lib/store/user-progress.ts`)
- Tracks NZCEL-specific progress (13 levels, Foundation-Level 6)
- Client-side caching for fast UI updates
- Persisted to localStorage

**2. CEFR Progress** (`src/lib/store/cefr-progress.ts`) **(NEW)**
- Tracks CEFR-aligned general practice (A1-C2)
- Parallel to NZCEL but independent data
- Same caching strategy with localStorage persistence

**Key Features**:
- **Purpose**: Fast UI updates without waiting for database queries
- **Persistence**: Uses Zustand's `persist` middleware with localStorage
- **Sync Strategy**: Server Actions update both database AND Zustand store
- **Demo Data**: Initializes with realistic demo data for development

**Important**: Server Actions are the source of truth. Zustand stores are caches only.

### CopilotKit AI Integration

The AI integration has two key components:

**1. Context Providers** (`src/components/copilot/copilot-context.tsx`)
- Uses `useCopilotReadable` to expose app state to the AI
- Provides: current/target levels, skill progress, gamification stats, achievements/badges, complete NZCEL framework
- This allows the AI sidebar to give context-aware responses

**2. Action Handlers** (`src/components/copilot/copilot-actions.tsx`)
- Uses `useCopilotAction` to define 12+ AI-executable actions
- Key actions: `generatePracticeQuestion`, `checkAnswer`, `recommendNextExercise`, `explainNZCELLevel`, `adjustDifficulty`, `awardBadge`, `updateSkillProgress`, `provideWritingFeedback`, `suggestConversationScenario`, `assessPronunciation`, `createStudyPlan`, `getExamTips`
- These actions enable the AI to interact with the app state and provide adaptive learning experiences

**Setup**: CopilotKit is initialized in `src/app/layout.tsx` and wraps the entire app. The CopilotSidebar is always available.

### Server Actions: Database Operations

All database operations are performed through Next.js Server Actions located in `src/actions/`:

**`src/actions/audio.ts`** (200 lines) - Audio management and intelligent caching
- `getQuestionAudio()` - **CRITICAL FEATURE**: Caches OpenAI TTS audio to avoid repeated API calls
  - First call: generates audio, uploads to Blob, saves to database (2-3s)
  - Subsequent calls: returns cached URL (0.1s) ✨
  - **Cost savings**: 90%+ reduction in TTS API calls
- `generateTTS()` - Calls OpenAI Text-to-Speech API
- `updateAudioAccessCount()` - Tracks cache hit statistics
- `getAudioCacheStats()` - Provides cache performance monitoring

**`src/actions/recordings.ts`** (177 lines) - User recording and transcription management
- `saveUserRecording()` - Saves user voice recordings, transcriptions, and metadata
- `getUserRecordings()` - Fetches user's recording history
- `getRecordingById()` - Retrieves specific recording with full details
- `getSessionRecordings()` - Gets all recordings for a practice session

**`src/actions/copilot-chat.ts`** (254 lines) - CopilotKit chat history persistence
- `getOrCreateConversation()` - Creates or retrieves conversation sessions with context
- `saveChatMessage()` - Persists individual chat messages
- `getChatHistory()` - Retrieves messages for a conversation
- `getUserConversations()` - Lists all conversations for current user

**`src/actions/sessions.ts`** (380 lines) - Practice and conversation session tracking
- `createPracticeSession()` - Creates new practice session
- `saveSessionAnswer()` - Records individual question answers
- `completePracticeSession()` - Marks session as complete
- `createConversationSession()` - Creates conversation practice session
- `saveConversationTurn()` - Records individual conversation turns

**`src/actions/user-progress.ts`** (407 lines) - NZCEL progress and gamification
- `getUserProgress()` - Fetches current user's NZCEL progress data
- `updateSkillProgress()` - Updates skill progress (0-100)
- `submitAnswer()` - Core action that records answers, updates points, streaks, achievements
- `awardBadge()` - Awards a badge to user
- `getAchievements()` - Fetches all achievements with progress

**`src/actions/cefr-progress.ts`** - CEFR progress tracking ✨
- `getCEFRProgress()` - Fetches user's CEFR progress (auto-creates if not exists)
- `updateCEFRSkillProgress()` - Updates CEFR skill progress (0-100)
- `setCEFRLevel()` - Sets user's current CEFR level (A1-C2)
- `setCEFRTargetLevel()` - Sets user's target CEFR level
- `incrementCEFRStats()` - Increments question count and points for CEFR
- `resetCEFRProgress()` - Resets CEFR progress (for testing)

**`src/actions/module-stats.ts`** - Module statistics tracking ✨
- `getModuleStats()` - Fetches aggregated statistics for a specific learning module
- `updateModuleStats()` - Updates module usage stats (time, questions, points)
- `getAllModuleStats()` - Fetches stats for all modules (for dashboard overview)

**Multi-Tenant Implementation Pattern** (Applied to all 58+ Server Actions):
```typescript
export async function exampleServerAction() {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    // 1. Validate organization context
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // 2. INSERT - include organizationId
    const [record] = await db
      .insert(schema.tableName)
      .values({
        organizationId,  // REQUIRED
        userId,
        // ... other fields
      })
      .returning();

    // 3. SELECT/UPDATE/DELETE - filter by organizationId
    const data = await db.query.tableName.findFirst({
      where: and(
        eq(schema.tableName.userId, userId),
        eq(schema.tableName.organizationId, organizationId)  // REQUIRED
      ),
    });

    return data;
  });
}
```

**Important Patterns**:
1. All Server Actions use `fetchWithDrizzle()` for authenticated database access
2. **All functions validate `organizationId` exists** (58+ validations implemented)
3. Actions return organization-scoped data only (isolated by `organizationId`)
4. Error handling with try/catch and descriptive error messages
5. TypeScript types for all parameters and return values
6. **All 43 tables include `organization_id` column** for multi-tenant data isolation

### Vercel Blob Storage: Audio File Management

**Location**: `src/lib/blob/audio-storage.ts` (217 lines)

Audio files are stored in Vercel Blob with organized directory structure:
- `audio/questions/{questionId}_*.mp3` - Question audio (permanent)
- `audio/user-recordings/{userId}/{sessionId}/*.webm` - User recordings (90-day expiry)
- `audio/ai-responses/{sessionId}/*.mp3` - AI response audio (30-day expiry)

**Key Functions**:
- `uploadAudioFile()` - Uploads audio to Vercel Blob with organized directory structure
- `deleteAudioFile()` - Removes audio file from Blob storage
- `generateContentHash()` - Creates SHA256 hash for deduplication
- `calculateExpiryDate()` - Calculates auto-cleanup dates based on file type

**Important**: All audio URLs from Blob storage are CDN-accelerated and publicly accessible.

### Voice & Speaking Features

The app has two voice interaction systems:

**1. Voice Recording Hook** (`src/hooks/use-voice-recorder.ts`)
- Manages MediaRecorder API for capturing audio
- Handles transcription via `/api/openai/transcribe` (Whisper)
- Handles assessment via `/api/openai/assess` (GPT-4)
- **Critical logging**: Extensively logged for debugging (search for `[VoiceRecorder]` prefix)
- State includes: `isRecording`, `recordingDuration`, `audioBlob`, `transcription`, `isTranscribing`, `isAssessing`, `assessment`

**2. Real-time Conversation** (`src/components/conversation/realtime-conversation.tsx`)
- Implements two-way voice conversation for speaking practice
- Uses MediaRecorder → Whisper transcription → GPT-4 response → TTS playback
- **Important timing issue**: There was a recent bug fix (commit b5f2d01) related to transcription state timing—ensure state updates happen before processing audio
- **React closure bug**: Fixed in commit ac7d14e—be careful with stale closures when dealing with async audio processing

### OpenAI API Routes

Located in `src/app/api/openai/`:

- **`/transcribe`**: Whisper speech-to-text (accepts FormData with audio file)
- **`/assess`**: GPT-4 assessment for speaking/writing (accepts JSON with text, level, skill, questionText, rubric)
- **`/tts`**: Text-to-speech for AI responses
- **`/conversation`**: Chat completions for conversation scenarios
- **`/realtime`**: Realtime API integration (if used)

**API Client**: All routes use `getOpenAIClient()` from `src/lib/openai.ts`. Ensure OPENAI_API_KEY is set in environment variables.

**Important**: Most TTS calls should go through `getQuestionAudio()` Server Action instead of calling `/tts` directly, to take advantage of intelligent caching.

### NZCEL Data Structure

**Levels**: 13 levels defined in `src/data/nzcel-levels.ts`:
- Foundation → Level 1 → Level 2 → Level 3 (General/Applied/Academic) → Level 4 (General/Employment/Academic) → Level 5 (General/Employment/Academic) → Level 6 (Advanced)
- Each level has: id, name, description, strategicPurpose, graduateOutcomes (listening/speaking/reading/writing), pathways, equivalency

**Questions**: Managed in `src/data/questions.ts`:
- Helper functions: `getQuestionsByLevelAndSkill()`, `getRandomQuestion()`
- Questions have: id, level, skill, type, question text, options, correctAnswer, points, explanation

**Conversation Scenarios**: `src/data/conversation-scenarios.ts`:
- Functions: `getScenariosByLevel()`, `getRandomScenario()`
- Used for real-time speaking practice

### CEFR Data Structure (NEW)

**Levels**: 6 levels defined in `src/data/cefr-levels.ts`:
- A1 (Elementary) → A2 (Pre-intermediate) → B1 (Intermediate) → B2 (Upper-intermediate) → C1 (Advanced) → C2 (Proficiency)
- Each level has: id, name, description, canDo (listening/speaking/reading/writing), equivalency (NZCEL, IELTS, TOEFL, PTE, Duolingo)
- Helper functions: `getCEFRLevelById()`, `getNextCEFRLevel()`, `mapNZCELtoCEFR()`

**Questions**: `src/data/cefr-questions.ts`:
- Sample questions organized by CEFR level and skill type
- Helper functions: `getCEFRQuestionsByLevelAndSkill()`, `getRandomCEFRQuestion()`, `getCEFRQuestionCount()`
- Maps CEFR levels to NZCEL levels internally for consistency

**Learning Modules**: `src/data/learning-modules.ts`:
- Configuration for all learning paths (general, nzcel, ielts, toefl, scenario)
- Helper functions: `getActiveModules()`, `getModuleById()`, `getModulesByType()`

### Component Organization

```
src/
├── app/
│   ├── (main)/                     # Main route group (protected)
│   │   ├── page.tsx                # Landing page (ESOL Platform - Multi-path entry)
│   │   ├── speaking/               # AI Speaking Coach (OpenAI Realtime API) ✨
│   │   │   └── page.tsx            # Real-time voice conversation interface
│   │   ├── practice/
│   │   │   ├── page.tsx            # Redirect to /practice/nzcel/skills
│   │   │   ├── general/            # CEFR-aligned general practice ✨
│   │   │   │   └── page.tsx        # General English practice (A1-C2)
│   │   │   ├── nzcel/              # NZCEL exam prep module ✨
│   │   │   │   ├── page.tsx        # NZCEL landing page
│   │   │   │   ├── skills/         # Skills practice
│   │   │   │   └── conversation/   # Conversation practice
│   │   │   └── scenarios/          # Scenario learning (coming soon)
│   │   ├── conversation/           # Redirect to /practice/nzcel/conversation
│   │   ├── dashboard/              # Multi-module progress dashboard ✨
│   │   │   └── page.tsx            # Tabs: Overview, NZCEL, General, Speaking
│   │   └── test-realtime/          # Realtime API debug page
│   ├── handler/[...stack]/         # Stack Auth routes
│   ├── api/openai/                 # OpenAI API routes
│   │   ├── transcribe/             # Whisper STT
│   │   ├── assess/                 # GPT-4 assessment
│   │   ├── tts/                    # Text-to-speech
│   │   ├── conversation/           # Chat completions
│   │   └── realtime/               # Realtime API integration
│   └── layout.tsx                  # Root layout (Stack Auth + CopilotKit)
├── actions/                        # Server Actions (database operations)
│   ├── audio.ts                    # Audio caching & TTS
│   ├── recordings.ts               # User recordings
│   ├── copilot-chat.ts             # Chat history
│   ├── sessions.ts                 # Session tracking
│   ├── user-progress.ts            # NZCEL progress & gamification
│   ├── cefr-progress.ts            # CEFR progress tracking ✨
│   ├── module-stats.ts             # Module statistics ✨
│   └── diagnostics.ts              # Diagnostic tools ✨
├── components/
│   ├── copilot/                    # CopilotKit context & actions
│   ├── practice/                   # Question cards, voice recorder
│   ├── conversation/               # Real-time conversation UI
│   ├── speaking/                   # AI Speaking Coach components ✨
│   ├── dashboard/                  # Dashboard tab components ✨
│   │   ├── overview-tab.tsx        # Multi-module overview
│   │   ├── nzcel-tab.tsx           # NZCEL progress
│   │   ├── general-practice-tab.tsx# CEFR progress
│   │   └── speaking-tab.tsx        # Speaking stats
│   ├── navigation/                 # Navbar with dropdown menus
│   ├── ui/                         # shadcn/ui components (25+)
│   └── providers.tsx               # App-level providers
├── lib/
│   ├── db/
│   │   ├── schema.ts               # Drizzle schema (43 tables, 1371 lines) ✨
│   │   └── index.ts                # fetchWithDrizzle helper (multi-tenant)
│   ├── blob/
│   │   └── audio-storage.ts        # Vercel Blob utilities
│   ├── store/                      # Zustand state management
│   │   ├── user-progress.ts        # NZCEL progress store
│   │   └── cefr-progress.ts        # CEFR progress store ✨
│   ├── stack.ts                    # Stack Auth config
│   └── openai.ts                   # OpenAI client
├── data/                           # Content and configuration
│   ├── nzcel-levels.ts             # NZCEL 13 levels
│   ├── questions.ts                # NZCEL questions
│   ├── conversation-scenarios.ts   # NZCEL scenarios
│   ├── cefr-levels.ts              # CEFR 6 levels ✨
│   ├── cefr-questions.ts           # CEFR questions ✨
│   └── learning-modules.ts         # Module configuration ✨
├── hooks/                          # Custom React hooks
│   ├── use-voice-recorder.ts
│   ├── use-audio-playback.ts
│   └── use-copilot-chat-history.ts
└── types/index.ts                  # TypeScript definitions (CEFRLevel, LearningModule, etc.) ✨
```

## Key Implementation Patterns

### 1. Question Flow with Database Persistence
1. User selects skill on `/practice` page
2. `createPracticeSession()` creates session in database
3. `getQuestionsByLevelAndSkill()` fetches questions for current level
4. User answers → Call `saveSessionAnswer()` Server Action
5. `submitAnswer()` in `user-progress.ts` updates:
   - completed_questions table
   - user_progress (points, streak, questions_completed)
   - achievements progress
   - Zustand store (client cache)
6. Achievement logic runs automatically, awards points/badges if thresholds met
7. Confetti animation triggers on achievement completion
8. `completePracticeSession()` marks session as complete

### 2. Voice Recording Flow with Database Persistence
1. User clicks mic → `startRecording()` → MediaRecorder starts
2. User clicks stop → `stopRecording()` → Blob created
3. Call `transcribe()` → POST to `/api/openai/transcribe` → Get text
4. Call `assess(text, question, level)` → POST to `/api/openai/assess` → Get feedback
5. **NEW**: Call `saveUserRecording()` Server Action:
   - Uploads audio to Vercel Blob
   - Creates audio_files record
   - Creates transcriptions record
   - Creates user_recordings record
   - Links to practice session
6. Display results, update skill progress
7. **NEW**: Call `saveSessionAnswer()` with recording and transcription IDs

**Critical**: The transcription state must be set BEFORE processing the audio blob. See commit b5f2d01 for reference.

### 3. Real-time Conversation Flow
1. Select scenario → Start conversation
2. User speaks → Record → Stop
3. Transcribe user speech (Whisper)
4. Send to GPT-4 for AI response
5. Convert AI text to speech (TTS)
6. Play audio while showing transcript
7. Repeat until target turns reached

**Watch out for**: React closure issues with audio state. Always use refs for values that change during async operations.

### 4. Gamification System
- Points awarded per question (varies by difficulty)
- Streak tracking: increments if studied yesterday, resets if gap > 1 day
- 6 achievements with progressive targets (1, 10, 50, 100 questions; 7-day streak; 10 perfect answers)
- Badges awarded via `addBadge()` action (rarity: common/rare/epic/legendary)
- Confetti animations on achievement completion

## Important TypeScript Types

Key types in `src/types/index.ts`:

```typescript
type NZCELLevel = "foundation" | "level-1" | "level-2" | "level-3-general" | ... | "level-6";
type SkillType = "listening" | "speaking" | "reading" | "writing";
type QuestionType = "multiple-choice" | "fill-in-blank" | "essay" | "speaking-prompt";

interface VoiceRecordingState {
  isRecording: boolean;
  recordingDuration: number;
  audioBlob: Blob | null;
  transcription: string | null;
  isTranscribing: boolean;
  isAssessing: boolean;
  assessment: Assessment | null;
}
```

## Recent Bug Fixes (Learn from these)

1. **Transcription state timing** (b5f2d01): Ensure `isTranscribing` state updates complete before accessing `transcription` value
2. **React closure bug** (ac7d14e): Use refs (`shouldProcessRef`) for values accessed in async callbacks to avoid stale closures
3. **Speaking feedback disabled** (47c1616): Button state must check all required conditions before enabling

## Testing

No formal test suite currently exists. Manual testing workflow:

1. Test each skill (listening, speaking, reading, writing) on `/practice`
2. Test voice recording permissions and transcription
3. Test real-time conversation flow end-to-end
4. Verify achievement triggers at thresholds
5. Check LocalStorage persistence (clear storage, reload, verify state)

## Environment Variables

Required in `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://..."  # From Neon

# Authentication
STACK_SECRET_SERVER_KEY="..."
NEXT_PUBLIC_STACK_PROJECT_ID="..."
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="..."

# Storage
BLOB_READ_WRITE_TOKEN="..."  # From Vercel

# AI APIs
OPENAI_API_KEY="..."
COPILOT_CLOUD_API_KEY="..."  # Optional, for CopilotKit Cloud
```

**Setup Steps**:
1. Create Neon database → Copy DATABASE_URL
2. Create Stack Auth project → Copy all STACK_* keys
3. Create Vercel project → Enable Blob → Copy BLOB_READ_WRITE_TOKEN
4. Get OpenAI API key from platform.openai.com

## Common Pitfalls

1. **Never query database directly from client**: Always use Server Actions in `src/actions/`
2. **Always use fetchWithDrizzle**: Never create raw Drizzle client instances
3. **Multi-tenant requirements** (⚠️ CRITICAL):
   - All Server Actions MUST validate `organizationId`: `if (!organizationId) throw new Error("Organization context required")`
   - All INSERT operations MUST include `organizationId` field
   - All queries MUST filter by `organizationId` using `and(eq(schema.table.organizationId, organizationId))`
   - Never assume single-tenant—all data is organization-scoped
4. **Audio caching**: Use `getQuestionAudio()` instead of calling TTS API directly
5. **Organization data isolation**: Server Actions automatically scope to user's organization (not just userId)
6. **Zustand is cache only**: Server Actions are the source of truth
7. **Voice recording state management**: Use refs for async callback values
8. **Achievement logic**: Already auto-runs on `submitAnswer()`, don't duplicate
9. **CopilotKit context**: Changes to NZCEL data structure require updating `copilot-context.tsx`
10. **API routes**: All OpenAI routes should use `getOpenAIClient()` helper
11. **Transcription edge cases**: Handle empty/null audio blobs gracefully
12. **Database migrations**:
    - Development: Use `npm run drizzle:push` (requires manual terminal execution)
    - Production: Use `drizzle:generate` + `drizzle:migrate` workflow
    - ⚠️ CRITICAL: `drizzle:push` CANNOT be automated via Server Actions or API routes
    - Database: Neon PostgreSQL (serverless) with Drizzle ORM
    - All 43 tables have `organization_id` column for multi-tenant isolation

## UI & Styling

- **Framework**: TailwindCSS 4.0 with `tailwind.config.ts`
- **Components**: shadcn/ui (Radix primitives)
- **Animations**: Framer Motion for transitions, react-confetti for celebrations
- **Icons**: Lucide React
- **Toasts**: Sonner library

## Additional Notes

- The platform is **full-stack** with complete backend (database, authentication, file storage)
- **Multi-tenant architecture** with organization-based data isolation (43 tables, all scoped by `organization_id`)
- **Multi-module architecture** supports parallel learning paths (NZCEL, CEFR, Speaking, Scenarios)
- **Dual progress tracking**: NZCEL and CEFR systems operate independently but share gamification
- **Enhanced user system**: Links Stack Auth IDs to organizations via `users` table for multi-tenant support
- User data persists across devices via cloud database (Neon PostgreSQL)
- **Complete data isolation**: All 58+ Server Actions enforce organization-level filtering
- Audio caching reduces API costs by 90%+ for repeated questions
- All user recordings and transcriptions are permanently stored (organization-scoped)
- Complete session tracking enables learning analytics across all modules
- **AI Speaking Coach** uses OpenAI Realtime API (GA) for natural two-way conversations
- Dashboard provides unified view of progress across all learning paths
- NZCEL framework is complete and should not be modified without research
- Voice features require HTTPS in production (browser security)
- Database migrations should be tested in development before production deployment
- **Module system** allows easy addition of new learning paths (IELTS, TOEFL planned)
- **Education features**: Assignments, class management, diagnostic testing, attendance tracking (all multi-tenant)

## Database Documentation

For comprehensive database architecture documentation, see:
- **[DATABASE_ARCHITECTURE.md](DATABASE_ARCHITECTURE.md)** - Complete schema, ERD diagrams, Server Actions catalog, data flow, integration examples
- **[DATABASE_SCHEMA_IMPLEMENTATION.md](DATABASE_SCHEMA_IMPLEMENTATION.md)** - Implementation guide with real-world integration examples
- **[STACK_AUTH_INTEGRATION.md](STACK_AUTH_INTEGRATION.md)** - Stack Auth setup and migration guide

## Development Guidelines

### Language Requirements

**CRITICAL**: All user-facing content, code strings, and comments MUST be in English only. No Chinese characters allowed in:
- UI components and pages
- Error messages and toasts
- Code comments and documentation
- Console logs (except debug prefixes like `[VoiceRecorder]`)

### Security Standards

**⚠️ NEVER commit API keys or secrets**:
- Do NOT expose `OPENAI_API_KEY` or any credentials in code or documentation
- Always check for exposed secrets before EVERY commit
- Use environment variables (`.env.local`) for all sensitive data
- Add `.env.local` to `.gitignore` (already configured)

### Code Style & Standards

**Function-level Documentation**:
- Add JSDoc comments following Google's open source style guide
- Include parameter descriptions, return types, and usage examples for complex functions

**TypeScript**:
- Use strict type checking
- Define interfaces in `src/types/index.ts`
- Avoid `any` types unless absolutely necessary

**Comments & Strings**:
- All code comments in English
- All user-facing strings in English
- Use descriptive variable and function names

### Git & Commit Standards

**Commit Message Format** (Angular Convention):
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
- `feat(practice): add voice recording for speaking questions`
- `fix(conversation): resolve transcription state timing issue`
- `refactor(store): extract achievement logic to separate module`

**GitHub CLI Available**:
- Use `gh pr create`, `gh issue create`, etc. for GitHub operations
- Prefer CLI over manual web interface

### Testing Strategy

**Test Every Milestone**:
- Create minimal, focused tests to verify each feature
- Test in the project folder (`src/__tests__/` or colocated)
- Run full manual testing workflow after each milestone:
  1. Voice recording and transcription
  2. Achievement triggers
  3. State persistence
  4. API route responses

**Testing Philosophy**:
- Minimal tests that prove functionality
- Avoid over-testing or creating unnecessary test files
- Focus on critical user flows

### Development Workflow

**Working Directory**:
- ALWAYS verify you are in `/home/chanmeng/nzcel-prep` before editing
- Confirm file paths before making changes

**Problem-Solving Approach**:
- Find the root cause, don't work around issues
- Seek the optimal solution, not the quickest patch
- Ask for help if truly blocked (don't hack around it)

**Efficiency Guidelines**:
- Minimize code changes—only modify what's necessary
- Use token-efficient implementations
- Stay focused on the user's exact request—no extra features
- Don't create unnecessary documentation files unless requested

### Code Organization Principles

**Modularization**:
- Separate UI, logic, and data components
- Ensure loose coupling between modules
- Extract shared logic into reusable hooks/utilities

**Component Design**:
- Keep components small and focused (single responsibility)
- Extract common patterns into shared components
- Use composition over inheritance

**Code Quality Standards**:
- **Robustness**: Handle edge cases and errors gracefully
- **Extensibility**: Design for future additions without breaking changes
- **Maintainability**: Write self-documenting code with clear structure
- **Performance**: Optimize re-renders, avoid unnecessary computations

### Communication with User

**Language**: Respond in Chinese (中文) when communicating with the user

**Code Output**: All generated code must use English for strings and comments

**Clarity**: Explain what you're doing in conversation—don't silently create files

**No Extra Files**: Don't create README updates, documentation, or extra markdown files unless explicitly requested
