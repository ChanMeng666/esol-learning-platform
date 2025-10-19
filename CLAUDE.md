# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

An AI-powered NZCEL (New Zealand Certificates in English Language) exam preparation platform built with Next.js 15, React 19, and CopilotKit. The app uses client-side state management with Zustand and LocalStorage, with no traditional backend—only Next.js API routes for OpenAI integrations.

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000

# Production
npm run build            # Create optimized production build
npm start                # Run production server

# Linting
npm run lint             # Run ESLint (uses eslint.config.mjs)
```

## Architecture

### State Management: Zustand with LocalStorage Persistence

The entire application state lives in `src/lib/store/user-progress.ts`:

- **Persistence**: Uses Zustand's `persist` middleware with `name: "nzcel-user-progress"` to automatically sync to localStorage
- **Demo Data**: Initializes with realistic demo data (32 completed questions, skills at 52-74%, 3 badges, 1050 points, 5-day streak)
- **Achievement Logic**: Automatically awards achievements and bonus points when thresholds are met (see `submitAnswer` action in user-progress.ts:241-298)
- **State Actions**: All state mutations go through Zustand actions (setCurrentLevel, addPoints, updateSkillProgress, etc.)

**Important**: When modifying user progress, always use the Zustand store actions. Never manipulate localStorage directly.

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

**API Client**: All routes use `getOpenAIClient()` from `src/lib/openai.ts` (not shown but should exist). Ensure OPENAI_API_KEY is set in environment variables.

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

### Component Organization

```
src/
├── app/
│   ├── layout.tsx              # Root layout with CopilotKit provider
│   ├── page.tsx                # Landing page
│   ├── practice/page.tsx       # Practice interface (questions by skill)
│   ├── conversation/page.tsx   # Real-time voice conversation
│   └── dashboard/page.tsx      # Progress tracking & achievements
├── components/
│   ├── copilot/                # CopilotKit context & actions
│   ├── practice/               # Question cards, voice recorder, audio player
│   ├── conversation/           # Real-time conversation UI
│   ├── ui/                     # shadcn/ui components
│   └── providers.tsx           # App-level providers wrapper
├── data/                       # NZCEL levels, questions, scenarios
├── hooks/                      # Custom React hooks (voice recorder, audio playback)
├── lib/
│   └── store/                  # Zustand state management
└── types/index.ts              # TypeScript definitions
```

## Key Implementation Patterns

### 1. Question Flow
1. User selects skill on `/practice` page
2. `getQuestionsByLevelAndSkill()` fetches questions for current level
3. User answers → Submit → Update state via `submitAnswer()` action
4. Achievement logic runs automatically, awards points/badges if thresholds met
5. Confetti animation triggers on achievement completion

### 2. Voice Recording Flow
1. User clicks mic → `startRecording()` → MediaRecorder starts
2. User clicks stop → `stopRecording()` → Blob created
3. Call `transcribe()` → POST to `/api/openai/transcribe` → Get text
4. Call `assess(text, question, level)` → POST to `/api/openai/assess` → Get feedback
5. Display results, update skill progress

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

Required:
- `OPENAI_API_KEY`: For Whisper, GPT-4, and TTS
- Optional: `COPILOT_CLOUD_API_KEY` (if using CopilotKit Cloud instead of local)

## Common Pitfalls

1. **Don't bypass Zustand actions**: Always use store actions to modify state
2. **Voice recording state management**: Use refs for async callback values
3. **Achievement logic**: Already auto-runs on `submitAnswer()`, don't duplicate
4. **CopilotKit context**: Changes to NZCEL data structure require updating `copilot-context.tsx`
5. **API routes**: All OpenAI routes should use `getOpenAIClient()` helper
6. **Transcription edge cases**: Handle empty/null audio blobs gracefully

## UI & Styling

- **Framework**: TailwindCSS 4.0 with `tailwind.config.ts`
- **Components**: shadcn/ui (Radix primitives)
- **Animations**: Framer Motion for transitions, react-confetti for celebrations
- **Icons**: Lucide React
- **Toasts**: Sonner library

## Additional Notes

- The app is designed to work entirely client-side except for OpenAI API calls
- No user authentication or database—all data in LocalStorage
- NZCEL framework is complete and should not be modified without research
- Voice features require HTTPS in production (browser security)
- Consider adding tests for critical flows (voice recording, achievement logic)

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
