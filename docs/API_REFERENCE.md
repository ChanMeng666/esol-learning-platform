# API Reference

**Version:** 1.0.0
**Last Updated:** 2025-11-03
**Total APIs:** 163+

Complete API reference for the NZCEL Prep AI-Powered ESOL Learning Platform. This document is optimized for AI assistants (like Claude Code) to quickly understand and use the project's APIs.

## Table of Contents

- [Quick Start](#quick-start)
- [REST API Routes (6)](#rest-api-routes)
  - [OpenAI Integration](#openai-integration)
- [Server Actions (157)](#server-actions)
  - [Audio Management](#audio-management)
  - [User Recordings](#user-recordings)
  - [CopilotKit Chat](#copilotkit-chat)
  - [Practice Sessions](#practice-sessions)
  - [NZCEL Progress](#nzcel-progress)
  - [CEFR Progress](#cefr-progress)
  - [Module Statistics](#module-statistics)
  - [Diagnostics](#diagnostics)
  - [Teacher & Education APIs](#teacher-education-apis)
  - [User & Authentication APIs](#user-authentication-apis)
- [Multi-Tenant Architecture](#multi-tenant-architecture)
- [Error Handling](#error-handling)
- [Common Patterns](#common-patterns)

---

## Quick Start

### For Claude Code (AI Assistant)

**Where to find API information:**
1. **This file** - Complete API reference with examples
2. **`docs/api-schema.json`** - Structured metadata for quick parsing
3. **`CLAUDE.md`** - Project overview and development guidelines
4. **`src/types/index.ts`** - TypeScript type definitions

**Key concepts:**
- **Multi-tenant**: All 163 APIs enforce organization-level data isolation
- **Authentication**: Server Actions use Stack Auth via `fetchWithDrizzle()`
- **REST APIs**: Public endpoints (no auth required)
- **Data flow**: REST API → Server Actions → Database (Neon PostgreSQL)

---

## REST API Routes

All REST API routes are located in `src/app/api/openai/*/route.ts`.

### OpenAI Integration

#### POST /api/openai/transcribe

**File:** `src/app/api/openai/transcribe/route.ts`
**Description:** Speech-to-text transcription using OpenAI Whisper

**Request:**
```http
POST /api/openai/transcribe
Content-Type: multipart/form-data

audio: <audio file> (required, must be audio/* MIME type)
```

**Response (200 OK):**
```json
{
  "text": "The transcribed text content",
  "duration": 12.5
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Audio file is required"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Failed to transcribe audio",
  "details": "Error details here"
}
```

**Example Usage:**
```typescript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');

const response = await fetch('/api/openai/transcribe', {
  method: 'POST',
  body: formData,
});

const { text, duration } = await response.json();
console.log('Transcription:', text);
```

**Notes:**
- Uses Whisper-1 model
- English language setting
- Accepts any audio/* MIME type
- Returns verbose JSON format with duration

---

#### POST /api/openai/assess

**File:** `src/app/api/openai/assess/route.ts`
**Description:** AI assessment of speaking/writing responses using GPT-4 with NZCEL rubrics

**Request:**
```http
POST /api/openai/assess
Content-Type: application/json

{
  "text": "Student's response text",
  "level": "level-4-academic",
  "skill": "speaking",
  "questionText": "Describe your favorite place to visit",
  "rubric": "Optional custom rubric" (optional)
}
```

**Response (200 OK):**
```json
{
  "overallScore": 82,
  "overallFeedback": "Strong response with clear pronunciation and good vocabulary. Consider improving fluency transitions.",
  "criteria": {
    "taskAchievement": {
      "score": 85,
      "comment": "Fully addressed the question with relevant details"
    },
    "coherence": {
      "score": 80,
      "comment": "Ideas are logically organized with clear connections"
    },
    "vocabulary": {
      "score": 78,
      "comment": "Good range of vocabulary, some minor repetition"
    },
    "grammar": {
      "score": 82,
      "comment": "Accurate grammar with complex structures"
    },
    "pronunciation": {
      "score": 85,
      "comment": "Clear pronunciation with natural intonation"
    },
    "fluency": {
      "score": 80,
      "comment": "Mostly fluent with occasional hesitations"
    }
  },
  "strengths": [
    "Clear pronunciation and intonation",
    "Good use of descriptive vocabulary"
  ],
  "improvements": [
    "Work on smoother transitions between ideas",
    "Reduce hesitations for better fluency"
  ]
}
```

**Example Usage:**
```typescript
const assessment = await fetch('/api/openai/assess', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: transcription,
    level: currentLevel,
    skill: 'speaking',
    questionText: question,
  }),
});

const feedback = await assessment.json();
console.log('Overall Score:', feedback.overallScore);
```

**Notes:**
- Uses GPT-4 Turbo Preview
- NZCEL-aligned rubrics for each level
- Returns structured JSON assessment
- Criteria vary by skill (speaking vs writing)

---

#### POST /api/openai/tts

**File:** `src/app/api/openai/tts/route.ts`
**Description:** Text-to-speech audio generation using OpenAI TTS

**Request:**
```http
POST /api/openai/tts
Content-Type: application/json

{
  "text": "Text to convert to speech",
  "voiceProfile": "academic" (optional, default: "academic")
}
```

**Voice Profiles:**
- `academic` - Formal, clear speech for academic content
- `conversational` - Natural, friendly speech for casual content
- `professional` - Neutral, professional speech

**Response (200 OK):**
```
Content-Type: audio/mpeg
Content-Length: <file size>

<MP3 audio data>
```

**Example Usage:**
```typescript
const response = await fetch('/api/openai/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Hello, welcome to the NZCEL practice platform.',
    voiceProfile: 'academic',
  }),
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
```

**Notes:**
- Uses TTS-1 model
- Returns MP3 format audio
- Voice profiles map to OpenAI voices (alloy, echo, nova, etc.)
- **Important:** For questions, use `getQuestionAudio()` Server Action instead for caching

---

#### POST /api/openai/conversation

**File:** `src/app/api/openai/conversation/route.ts`
**Description:** Generate AI conversational responses for role-play scenarios

**Request:**
```http
POST /api/openai/conversation
Content-Type: application/json

{
  "messages": [
    {
      "role": "system",
      "content": "You are an ESOL conversation partner at B2 level..."
    },
    {
      "role": "user",
      "content": "Hi, I'd like to practice ordering food at a restaurant."
    },
    {
      "role": "assistant",
      "content": "Of course! Let's pretend I'm a server at a restaurant..."
    },
    {
      "role": "user",
      "content": "Could I see the menu, please?"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "response": "Certainly! Here's our menu. We have a variety of appetizers, main courses, and desserts. Would you like to hear our specials today?"
}
```

**Example Usage:**
```typescript
const response = await fetch('/api/openai/conversation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: conversationHistory }),
});

const { response: aiReply } = await response.json();
conversationHistory.push({ role: 'assistant', content: aiReply });
```

**Notes:**
- Uses GPT-4 Turbo Preview
- Temperature: 0.8 (more creative/varied)
- Max tokens: 300 (concise responses)
- Designed for real-time conversation practice

---

#### GET /api/openai/realtime

**File:** `src/app/api/openai/realtime/route.ts`
**Description:** Information endpoint for OpenAI Realtime API

**Response (200 OK):**
```json
{
  "message": "Realtime API endpoint. WebSocket connection required.",
  "note": "Use client-side WebSocket to connect to OpenAI Realtime API",
  "documentation": "https://platform.openai.com/docs/api-reference/realtime"
}
```

**Notes:**
- Placeholder endpoint
- Actual WebSocket connection handled client-side
- Use `/api/openai/realtime-client-secret` to get credentials

---

#### POST /api/openai/realtime-client-secret

**File:** `src/app/api/openai/realtime-client-secret/route.ts`
**Description:** Generate ephemeral client secrets for OpenAI Realtime API (GA)

**Request:**
```http
POST /api/openai/realtime-client-secret
Content-Type: application/json

{
  "voice": "verse" (optional, default: "verse"),
  "instructions": "Custom AI coach instructions" (optional)
}
```

**Response (200 OK):**
```json
{
  "clientSecret": "ecs_abc123...",
  "expiresAt": 1730678400,
  "model": "gpt-realtime",
  "voice": "verse"
}
```

**Example Usage:**
```typescript
// 1. Get client secret
const response = await fetch('/api/openai/realtime-client-secret', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ voice: 'verse' }),
});

const { clientSecret } = await response.json();

// 2. Connect to OpenAI Realtime API
import { createAgent } from '@openai/agents';

const agent = await createAgent({
  clientSecret,
  transport: { type: 'webrtc' },
});

await agent.connect();
```

**Notes:**
- Creates temporary tokens for client-side WebRTC connections
- Prevents direct API key exposure
- Default instructions: ESOL Speaking Coach (CEFR-aligned)
- Tokens expire after use or time limit

---

## Server Actions

All Server Actions are located in `src/actions/*.ts` and use the `"use server"` directive.

### Common Patterns

**Multi-Tenant Pattern:**
```typescript
export async function exampleAction() {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    // 1. Validate organization context
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // 2. Query with organization filter
    const data = await db.query.tableName.findFirst({
      where: and(
        eq(schema.tableName.userId, userId),
        eq(schema.tableName.organizationId, organizationId)
      ),
    });

    return data;
  });
}
```

**Error Handling:**
```typescript
try {
  const result = await someAction();
  return { success: true, data: result };
} catch (error) {
  console.error('[ActionName] Error:', error);
  throw new Error("User-friendly error message");
}
```

---

### Audio Management

**File:** `src/actions/audio.ts` (362 lines, 7 functions)

#### getQuestionAudio()

**Description:** Get or generate question audio with intelligent caching (CRITICAL FEATURE - saves 90%+ TTS costs)

```typescript
async function getQuestionAudio(
  questionId: string,
  textContent: string,
  voiceName: string = "alloy",
  voiceModel: "tts-1" | "tts-1-hd" = "tts-1"
): Promise<string>
```

**Parameters:**
- `questionId` - Unique question identifier
- `textContent` - Text to convert to speech
- `voiceName` - OpenAI voice (alloy, echo, fable, onyx, nova, shimmer)
- `voiceModel` - TTS model (tts-1 for standard, tts-1-hd for high quality)

**Returns:** `Promise<string>` - Blob URL of the audio file

**Example Usage:**
```typescript
const audioUrl = await getQuestionAudio(
  'nzcel-listening-001',
  'Listen carefully to the following question...',
  'alloy',
  'tts-1'
);

// First call: Generates audio, uploads to Blob, saves to DB (2-3s)
// Subsequent calls: Returns cached URL (0.1s) ✨
```

**Caching Logic:**
1. Calculates content hash from text + model + voice
2. Checks if cached audio exists in `question_audio_cache` table
3. If exists and active: Updates access stats, returns URL
4. If not exists: Generates new audio, uploads to Blob, saves to DB

**Multi-Tenant:** ✅ Scoped to user's organization

**Related APIs:** `updateAudioAccessCount`, `deactivateQuestionAudioCache`, `getAudioCacheStats`

---

#### deactivateQuestionAudioCache()

**Description:** Deactivate old audio cache entry when question text or voice changes

```typescript
async function deactivateQuestionAudioCache(
  questionId: string
): Promise<void>
```

**Example Usage:**
```typescript
// When updating a question
await deactivateQuestionAudioCache('nzcel-listening-001');
// Old cache marked inactive, new audio will be generated on next request
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getAudioCacheStats()

**Description:** Get cache statistics for monitoring performance

```typescript
async function getAudioCacheStats(): Promise<{
  totalCached: number;
  totalHits: number;
  totalSize: number;
  averageHitsPerAudio: number;
}>
```

**Example Response:**
```typescript
{
  totalCached: 150,        // 150 unique audio files cached
  totalHits: 4500,         // 4500 cache hits total
  totalSize: 15728640,     // 15 MB total storage
  averageHitsPerAudio: 30  // Average 30 hits per audio
}
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getAllQuestionAudio()

**Description:** Get all question audio from cache with optional date filtering

```typescript
async function getAllQuestionAudio(
  filters: { dateRange?: '7d' | '30d' | 'all' } = {},
  limit: number = 50
): Promise<Array<QuestionAudioCache & { audioFile: AudioFile }>>
```

**Example Usage:**
```typescript
const recentAudio = await getAllQuestionAudio({ dateRange: '7d' }, 20);
console.log('Recent audio files:', recentAudio.length);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getUserQuestionAudioHistory()

**Description:** Get question audio history for questions the current user has practiced

```typescript
async function getUserQuestionAudioHistory(
  filters: {
    skill?: string;
    dateRange?: '7d' | '30d' | 'all';
  } = {},
  limit: number = 50
): Promise<Array<QuestionAudioCache & { audioFile: AudioFile }>>
```

**Example Usage:**
```typescript
const listeningAudio = await getUserQuestionAudioHistory(
  { skill: 'listening', dateRange: '30d' },
  50
);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

### User Recordings

**File:** `src/actions/recordings.ts` (743 lines, 11 functions)

#### saveUserRecording()

**Description:** Save user recording with transcription, uploads to Blob storage

```typescript
async function saveUserRecording(
  audioBlob: Blob,
  transcription: string,
  questionId: string,
  sessionId: string,
  recordingType: "practice_answer" | "conversation_turn" | "pronunciation_test" = "practice_answer"
): Promise<{
  recordingId: bigint;
  audioUrl: string;
  transcription: string;
  transcriptionId: bigint;
}>
```

**Example Usage:**
```typescript
const { recordingId, audioUrl } = await saveUserRecording(
  audioBlob,
  'This is my answer to the question',
  'question-123',
  'session-456',
  'practice_answer'
);

console.log('Recording saved:', audioUrl);
```

**Storage:**
- Uploads to Vercel Blob: `audio/user-recordings/{userId}/{sessionId}/*.webm`
- Auto-expires after 90 days
- Creates records in: `audio_files`, `transcriptions`, `user_recordings` tables

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getUserRecordings()

**Description:** Get user's recording history

```typescript
async function getUserRecordings(
  limit: number = 50
): Promise<Array<UserRecording & { audioFile: AudioFile; transcription: Transcription }>>
```

**Example Response:**
```typescript
[
  {
    id: 123n,
    userId: "user_abc",
    audioFileId: 456n,
    recordingType: "practice_answer",
    questionId: "q-001",
    contextId: "session-789",
    recordedAt: "2025-11-03T10:30:00Z",
    audioFile: {
      blobUrl: "https://...",
      fileSize: 51200,
      format: "webm"
    },
    transcription: {
      transcribedText: "My recorded answer",
      wordCount: 3
    }
  }
]
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getRecordingById()

**Description:** Get recording by ID with full details

```typescript
async function getRecordingById(
  recordingId: bigint
): Promise<UserRecording & { audioFile: AudioFile; transcription: Transcription } | null>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getSessionRecordings()

**Description:** Get all recordings for a specific practice session

```typescript
async function getSessionRecordings(
  sessionId: string
): Promise<Array<UserRecording & { audioFile: AudioFile; transcription: Transcription }>>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### saveTranscription()

**Description:** Save transcription only (when audio already saved)

```typescript
async function saveTranscription(
  audioFileId: bigint,
  transcribedText: string,
  model: string = "whisper-1",
  metadata?: Record<string, unknown>
): Promise<Transcription>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getUserRecordingsWithFilters()

**Description:** Get filtered user recordings

```typescript
async function getUserRecordingsWithFilters(
  filters: {
    recordingType?: string;
    questionId?: string;
    dateRange?: '7d' | '30d' | 'all';
  },
  limit: number = 50
): Promise<Array<UserRecording & { audioFile: AudioFile; transcription: Transcription }>>
```

**Example Usage:**
```typescript
const speakingRecordings = await getUserRecordingsWithFilters(
  {
    recordingType: 'practice_answer',
    dateRange: '7d'
  },
  20
);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getTeacherStudentRecordings()

**Description:** Get recordings for students in teacher's classes (Teacher Access)

```typescript
async function getTeacherStudentRecordings(
  filters?: {
    classId?: bigint;
    studentId?: bigint;
    assignmentId?: bigint;
    recordingType?: string;
    dateRange?: '7d' | '30d' | 'all';
  },
  limit: number = 100
): Promise<Array<UserRecording & { audioFile: AudioFile; transcription: Transcription; student: StudentInfo }>>
```

**Authorization:** ⚠️ Teacher role required

**Example Usage:**
```typescript
// Get all recordings from students in class 123
const recordings = await getTeacherStudentRecordings(
  { classId: 123n },
  50
);

console.log('Student recordings:', recordings.length);
```

**Multi-Tenant:** ✅ Scoped to teacher's organization, validates class access

---

#### getTeacherAccessRecording()

**Description:** Get recording details with teacher access validation

```typescript
async function getTeacherAccessRecording(
  recordingId: bigint
): Promise<UserRecording & { audioFile: AudioFile; transcription: Transcription; student: StudentInfo }>
```

**Authorization:** ⚠️ Teacher role required

**Multi-Tenant:** ✅ Validates teacher has access to student

---

#### markRecordingReviewed()

**Description:** Mark recording as reviewed by teacher with optional feedback

```typescript
async function markRecordingReviewed(
  recordingId: bigint,
  feedback?: string
): Promise<UserRecording>
```

**Authorization:** ⚠️ Teacher role required

**Example Usage:**
```typescript
await markRecordingReviewed(
  123n,
  "Good pronunciation! Work on fluency transitions."
);
```

**Multi-Tenant:** ✅ Validates teacher has access to student

---

#### getClassRecordingStats()

**Description:** Get recording statistics for a class

```typescript
async function getClassRecordingStats(
  classId: bigint
): Promise<{
  totalRecordings: number;
  totalStudents: number;
  avgRecordingsPerStudent: number;
  recentRecordings: number;
  recordingsByType: Record<string, number>;
}>
```

**Authorization:** ⚠️ Teacher role required

**Example Response:**
```typescript
{
  totalRecordings: 45,
  totalStudents: 15,
  avgRecordingsPerStudent: 3.0,
  recentRecordings: 12,
  recordingsByType: {
    "practice_answer": 30,
    "conversation_turn": 15
  }
}
```

**Multi-Tenant:** ✅ Validates teacher has access to class

---

#### deleteUserRecording()

**Description:** Delete user recording from database and Blob storage

```typescript
async function deleteUserRecording(
  recordingId: bigint
): Promise<{ success: boolean }>
```

**Example Usage:**
```typescript
await deleteUserRecording(123n);
// Deletes: user_recordings record, audio_files record, transcriptions record, Blob file
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

### CopilotKit Chat

**File:** `src/actions/copilot-chat.ts` (321 lines, 8 functions)

#### getOrCreateConversation()

**Description:** Get or create a CopilotKit conversation session

```typescript
async function getOrCreateConversation(
  contextType: "practice" | "conversation" | "dashboard" | "general",
  contextId?: string,
  title?: string
): Promise<CopilotConversation>
```

**Example Usage:**
```typescript
const conversation = await getOrCreateConversation(
  'practice',
  'session-123',
  'NZCEL Practice - Listening'
);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### saveChatMessage()

**Description:** Save a chat message to the conversation

```typescript
async function saveChatMessage(
  conversationId: bigint,
  role: "user" | "assistant" | "system",
  content: string,
  contentType: "text" | "code" | "audio_transcript" = "text",
  metadata?: Record<string, unknown>,
  audioUrl?: string
): Promise<CopilotMessage>
```

**Example Usage:**
```typescript
await saveChatMessage(
  conversation.id,
  'user',
  'Can you explain the difference between A1 and A2 levels?',
  'text'
);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getChatHistory()

**Description:** Get chat history for a conversation

```typescript
async function getChatHistory(
  conversationId: bigint,
  limit: number = 50
): Promise<Array<CopilotMessage>>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getUserConversations()

**Description:** Get all conversations for current user

```typescript
async function getUserConversations(
  limit: number = 20
): Promise<Array<CopilotConversation>>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getConversationWithMessages()

**Description:** Get conversation with all messages

```typescript
async function getConversationWithMessages(
  conversationId: bigint
): Promise<CopilotConversation & { messages: Array<CopilotMessage> } | null>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getConversationsByContext()

**Description:** Get conversations by context type

```typescript
async function getConversationsByContext(
  contextType: "practice" | "conversation" | "dashboard" | "general",
  contextId?: string
): Promise<Array<CopilotConversation>>
```

**Example Usage:**
```typescript
const practiceConversations = await getConversationsByContext('practice');
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### deleteConversation()

**Description:** Delete a conversation and all its messages

```typescript
async function deleteConversation(
  conversationId: bigint
): Promise<boolean>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### updateConversationTitle()

**Description:** Update conversation title

```typescript
async function updateConversationTitle(
  conversationId: bigint,
  newTitle: string
): Promise<CopilotConversation>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

### Practice Sessions

**File:** `src/actions/sessions.ts` (581 lines, 12 functions)

#### createPracticeSession()

**Description:** Create a new practice session

```typescript
async function createPracticeSession(
  skill: string,
  level: string
): Promise<PracticeSession>
```

**Example Usage:**
```typescript
const session = await createPracticeSession('listening', 'level-3-general');
console.log('Session ID:', session.id);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### saveSessionAnswer()

**Description:** Save answer to a practice session

```typescript
async function saveSessionAnswer(
  sessionId: bigint,
  questionId: string,
  userAnswer: string,
  correctAnswer: string,
  isCorrect: boolean,
  pointsEarned: number,
  timeSpent?: number,
  audioRecordingId?: bigint,
  transcriptionId?: bigint,
  aiFeedback?: string
): Promise<SessionAnswer>
```

**Example Usage:**
```typescript
const answer = await saveSessionAnswer(
  session.id,
  'question-001',
  'B',
  'B',
  true,
  10,
  45,  // 45 seconds
  recordingId,
  transcriptionId,
  'Good pronunciation!'
);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### completePracticeSession()

**Description:** Complete a practice session

```typescript
async function completePracticeSession(
  sessionId: bigint
): Promise<PracticeSession>
```

**Example Usage:**
```typescript
const completed = await completePracticeSession(session.id);
console.log('Duration:', completed.duration, 'seconds');
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getPracticeSessionWithAnswers()

**Description:** Get practice session with all answers

```typescript
async function getPracticeSessionWithAnswers(
  sessionId: bigint
): Promise<PracticeSession & { answers: Array<SessionAnswer> } | null>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getRecentPracticeSessions()

**Description:** Get user's recent practice sessions

```typescript
async function getRecentPracticeSessions(
  limit: number = 20
): Promise<Array<PracticeSession>>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### createConversationSession()

**Description:** Create a new conversation session

```typescript
async function createConversationSession(
  scenarioId: string,
  scenarioTitle: string,
  targetTurns: number
): Promise<ConversationSession>
```

**Example Usage:**
```typescript
const session = await createConversationSession(
  'restaurant-b2',
  'Ordering at a Restaurant',
  6
);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### saveConversationTurn()

**Description:** Save conversation turn

```typescript
async function saveConversationTurn(
  sessionId: bigint,
  turnNumber: number,
  speaker: "user" | "assistant",
  audioUrl?: string,
  audioFileId?: bigint,
  transcription?: string,
  transcriptionId?: bigint,
  aiFeedback?: string,
  scores?: {
    pronunciation?: number;
    fluency?: number;
    grammar?: number;
    vocabulary?: number;
  }
): Promise<ConversationTurn>
```

**Example Usage:**
```typescript
await saveConversationTurn(
  session.id,
  1,
  'user',
  audioUrl,
  audioFileId,
  'Hello, I would like to order a pizza.',
  transcriptionId,
  'Good start!',
  {
    pronunciation: 85,
    fluency: 80,
    grammar: 90,
    vocabulary: 75
  }
);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### completeConversationSession()

**Description:** Complete a conversation session

```typescript
async function completeConversationSession(
  sessionId: bigint,
  totalPoints: number
): Promise<ConversationSession>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getConversationSessionWithTurns()

**Description:** Get conversation session with all turns

```typescript
async function getConversationSessionWithTurns(
  sessionId: bigint
): Promise<ConversationSession & { turns: Array<ConversationTurn> } | null>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getRecentConversationSessions()

**Description:** Get user's recent conversation sessions

```typescript
async function getRecentConversationSessions(
  limit: number = 20
): Promise<Array<ConversationSession>>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getPracticeSessionsWithFilters()

**Description:** Get practice sessions with filtering

```typescript
async function getPracticeSessionsWithFilters(
  filters: {
    skill?: string;
    level?: string;
    dateRange?: '7d' | '30d' | 'all';
  },
  limit: number = 20
): Promise<Array<PracticeSession & { answers: Array<SessionAnswer> }>>
```

**Example Usage:**
```typescript
const listeningSessions = await getPracticeSessionsWithFilters(
  {
    skill: 'listening',
    level: 'level-3-general',
    dateRange: '30d'
  },
  20
);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getConversationSessionsWithFilters()

**Description:** Get conversation sessions with filtering

```typescript
async function getConversationSessionsWithFilters(
  filters: {
    scenarioId?: string;
    dateRange?: '7d' | '30d' | 'all';
  },
  limit: number = 20
): Promise<Array<ConversationSession & { turns: Array<ConversationTurn> }>>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

### NZCEL Progress

**File:** `src/actions/user-progress.ts` (516 lines, 11 functions)

#### getUserProgress()

**Description:** Get user progress data for NZCEL learning path

```typescript
async function getUserProgress(): Promise<UserProgress | null>
```

**Example Response:**
```typescript
{
  id: "123",
  userId: "user_abc",
  organizationId: 456n,
  currentLevel: "level-3-general",
  targetLevel: "level-4-academic",
  listeningProgress: 75,
  speakingProgress: 60,
  readingProgress: 80,
  writingProgress: 70,
  totalPoints: 2500,
  questionsCompleted: 125,
  correctAnswers: 100,
  streak: 7,
  perfectStreak: 3,
  lastStudyDate: "2025-11-03"
}
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### initializeUserProgress()

**Description:** Initialize user progress for first-time users

```typescript
async function initializeUserProgress(): Promise<UserProgress>
```

**Example Usage:**
```typescript
const progress = await initializeUserProgress();
// Creates progress record and default achievements
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### updateSkillProgress()

**Description:** Update skill progress (0-100)

```typescript
async function updateSkillProgress(
  skill: "listening" | "speaking" | "reading" | "writing",
  value: number
): Promise<void>
```

**Example Usage:**
```typescript
await updateSkillProgress('listening', 85);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### updateCurrentLevel()

**Description:** Update current NZCEL level

```typescript
async function updateCurrentLevel(
  level: string
): Promise<void>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getCompletedQuestions()

**Description:** Get all completed questions for the user

```typescript
async function getCompletedQuestions(): Promise<Array<CompletedQuestion>>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getAchievements()

**Description:** Get all achievements for the user

```typescript
async function getAchievements(): Promise<Array<Achievement>>
```

**Example Response:**
```typescript
[
  {
    achievementId: "first-question",
    title: "First Steps",
    description: "Complete your first question",
    progress: 1,
    target: 1,
    isCompleted: true,
    completedAt: "2025-10-01",
    reward: 50
  },
  {
    achievementId: "ten-questions",
    title: "Getting Started",
    description: "Complete 10 questions",
    progress: 10,
    target: 10,
    isCompleted: true,
    completedAt: "2025-10-15",
    reward: 100
  },
  {
    achievementId: "hundred-questions",
    title: "NZCEL Master",
    description: "Complete 100 questions",
    progress: 75,
    target: 100,
    isCompleted: false,
    completedAt: null,
    reward: 500
  }
]
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getBadges()

**Description:** Get all badges for the user

```typescript
async function getBadges(): Promise<Array<Badge>>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### submitAnswer()

**Description:** Submit an answer and update progress (CORE FUNCTION)

```typescript
async function submitAnswer(
  questionId: string,
  isCorrect: boolean,
  points: number,
  skill: "listening" | "speaking" | "reading" | "writing" = "reading"
): Promise<{
  totalPoints: number;
  questionsCompleted: number;
  streak: number;
}>
```

**What it does:**
1. Records completed question
2. Updates total points
3. Increments questions completed count
4. Updates streak (daily study tracking)
5. Updates perfect streak (consecutive correct answers)
6. Checks and updates achievements
7. Awards bonus points for completed achievements

**Example Usage:**
```typescript
const result = await submitAnswer('question-001', true, 10, 'listening');
console.log('New streak:', result.streak);
console.log('Total points:', result.totalPoints);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### awardBadge()

**Description:** Award a badge to the user

```typescript
async function awardBadge(
  badgeId: string,
  name: string,
  description: string,
  icon: string,
  rarity: "common" | "rare" | "epic" | "legendary"
): Promise<Badge>
```

**Example Usage:**
```typescript
await awardBadge(
  'first-week',
  'Week One Complete',
  'Completed your first week of practice',
  '🎉',
  'rare'
);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### addPoints()

**Description:** Add points to user progress

```typescript
async function addPoints(
  points: number
): Promise<number | undefined>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

### CEFR Progress

**File:** `src/actions/cefr-progress.ts` (307 lines, 6 functions)

#### getCEFRProgress()

**Description:** Get user's CEFR progress, auto-creates if not exists

```typescript
async function getCEFRProgress(): Promise<{
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel | null;
  skillProgress: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
  totalPoints: number;
  questionsCompleted: number;
}>
```

**Example Response:**
```typescript
{
  currentLevel: "B1",
  targetLevel: "B2",
  skillProgress: {
    listening: 70,
    speaking: 65,
    reading: 75,
    writing: 60
  },
  totalPoints: 1200,
  questionsCompleted: 80
}
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### updateCEFRSkillProgress()

**Description:** Update CEFR skill progress (0-100)

```typescript
async function updateCEFRSkillProgress(
  skill: SkillType,
  progress: number
): Promise<{ success: boolean; skill: SkillType; progress: number }>
```

**Example Usage:**
```typescript
await updateCEFRSkillProgress('listening', 75);
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### setCEFRLevel()

**Description:** Set user's current CEFR level (A1-C2)

```typescript
async function setCEFRLevel(
  level: CEFRLevel
): Promise<{ success: boolean; level: CEFRLevel }>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### setCEFRTargetLevel()

**Description:** Set user's target CEFR level

```typescript
async function setCEFRTargetLevel(
  level: CEFRLevel | null
): Promise<{ success: boolean; targetLevel: CEFRLevel | null }>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### incrementCEFRStats()

**Description:** Increment question count and add points

```typescript
async function incrementCEFRStats(
  pointsEarned: number
): Promise<{ success: boolean; questionsCompleted: number; totalPoints: number }>
```

**Example Usage:**
```typescript
await incrementCEFRStats(10);
// Increments questionsCompleted by 1, adds 10 points
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### resetCEFRProgress()

**Description:** Reset CEFR progress (for testing)

```typescript
async function resetCEFRProgress(): Promise<{ success: boolean }>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

### Module Statistics

**File:** `src/actions/module-stats.ts` (283 lines, 5 functions)

#### getModuleProgress()

**Description:** Get or create module progress for a specific module

```typescript
async function getModuleProgress(
  moduleType: LearningPath
): Promise<ModuleProgress>
```

**Module Types:** `"general"`, `"nzcel"`, `"ielts"`, `"toefl"`, `"scenario"`

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getAllModuleProgress()

**Description:** Get all module progress for current user

```typescript
async function getAllModuleProgress(): Promise<Array<ModuleProgress>>
```

**Example Response:**
```typescript
[
  {
    moduleType: "nzcel",
    totalTime: 3600,  // 1 hour
    questionsCompleted: 50,
    pointsEarned: 500,
    lastAccessed: "2025-11-03T10:00:00Z"
  },
  {
    moduleType: "general",
    totalTime: 1800,  // 30 minutes
    questionsCompleted: 25,
    pointsEarned: 250,
    lastAccessed: "2025-11-02T15:30:00Z"
  }
]
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### updateModuleProgress()

**Description:** Update module progress

```typescript
async function updateModuleProgress(
  moduleType: LearningPath,
  timeSpent: number = 0,
  questionsCompleted: number = 0,
  pointsEarned: number = 0
): Promise<ModuleProgress>
```

**Example Usage:**
```typescript
await updateModuleProgress('general', 300, 5, 50);
// Adds 5 minutes, 5 questions, 50 points to 'general' module
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getSpeakingStats()

**Description:** Get speaking practice statistics

```typescript
async function getSpeakingStats(): Promise<{
  totalSessions: number;
  completedSessions: number;
  totalTurns: number;
  averageDuration: number;
  recentSessions: Array<ConversationSession & { durationSeconds: number | null }>;
}>
```

**Example Response:**
```typescript
{
  totalSessions: 15,
  completedSessions: 12,
  totalTurns: 48,
  averageDuration: 240,  // 4 minutes average
  recentSessions: [...]  // Last 5 sessions
}
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### getAggregatedStats()

**Description:** Get aggregated statistics across all modules

```typescript
async function getAggregatedStats(): Promise<{
  modules: Array<ModuleProgress>;
  totalPoints: number;
  totalTime: number;
  totalQuestions: number;
  nzcel: UserProgress | null;
  cefr: CEFRProgress | null;
  speaking: SpeakingStats;
  mostActiveModule: ModuleProgress | null;
}>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

### Diagnostics

**File:** `src/actions/diagnostics.ts` (121 lines, 2 functions)

#### getUserDiagnostics()

**Description:** Get current user ID and session counts for diagnostics

```typescript
async function getUserDiagnostics(): Promise<{
  currentUserId: string;
  organizationId: string;
  practiceSessionsCount: number;
  recordingsCount: number;
  conversationSessionsCount: number;
}>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

#### createSampleData()

**Description:** Create sample practice session data for testing

```typescript
async function createSampleData(): Promise<{
  success: boolean;
  message: string;
  sessionId: bigint;
}>
```

**Multi-Tenant:** ✅ Scoped to user's organization

---

### Teacher & Education APIs

**Files:** `src/actions/assignments.ts`, `src/actions/teacher-insights.ts`, `src/actions/diagnostic-tests.ts`, `src/actions/classes.ts`

**Count:** 60+ functions across 4 files

**Description:** Complete education management system for teachers, school admins, and department heads.

**Key Features:**
- **Assignment Management** - Create, distribute, grade assignments
- **Class Roster** - Manage students, enrollments, groups
- **Diagnostic Testing** - Administer and analyze diagnostic tests
- **Student Progress** - Track individual and class-wide progress
- **Analytics & Insights** - Generate performance reports
- **Submission Management** - Handle student submissions

**Common Functions:**

**Assignments:**
- `createAssignment()`
- `getTeacherAssignments()`
- `getAssignmentSubmissions()`
- `gradeSubmission()`
- `getStudentAssignments()`

**Classes:**
- `createClass()`
- `getTeacherClasses()`
- `addStudentToClass()`
- `removeStudentFromClass()`
- `getClassRoster()`

**Diagnostic Tests:**
- `createDiagnosticTest()`
- `startDiagnosticAttempt()`
- `submitDiagnosticAnswer()`
- `completeDiagnosticAttempt()`
- `getTestResults()`

**Teacher Insights:**
- `getClassProgress()`
- `getStudentInsights()`
- `getPerformanceTrends()`
- `generateReport()`

**Authorization:** ⚠️ Most functions require teacher/admin roles

**Multi-Tenant:** ✅ All functions scoped to organization with role validation

**For detailed API documentation, see:**
- `docs/architecture/DATABASE_ARCHITECTURE.md` - Complete Server Actions catalog
- Individual files in `src/actions/` - Full JSDoc comments

---

### User & Authentication APIs

**Files:** `src/actions/users.ts`, `src/actions/auth.ts`, `src/actions/organizations.ts`, `src/actions/invitations.ts`, `src/actions/registration.ts`, `src/actions/fix-user-roles.ts`, `src/actions/cleanup-users.ts`

**Count:** 40+ functions across 7 files

**Description:** Complete user lifecycle management with RBAC and multi-tenant support.

**Key Features:**
- **User Management** - CRUD operations for users
- **Role-Based Access Control** - 6 roles (student, teacher, parent, school-admin, department-head, system-admin)
- **Organization Management** - Multi-tenant organization setup
- **Invitation System** - Invite users to join organizations
- **Registration** - Onboarding new users
- **Permission Management** - Fine-grained access control
- **User Maintenance** - Cleanup, role fixing, data migration

**Common Functions:**

**Users:**
- `getEnhancedUser()`
- `updateUserProfile()`
- `getUsersByOrganization()`
- `assignUserRole()`

**Auth:**
- `hasPermission()`
- `requireRole()`
- `getUserPermissions()`

**Organizations:**
- `createOrganization()`
- `getOrganizationDetails()`
- `updateOrganization()`
- `getOrganizationMembers()`

**Invitations:**
- `createInvitationCode()`
- `validateInvitation()`
- `acceptInvitation()`
- `getOrganizationInvitations()`

**Registration:**
- `registerNewUser()`
- `setupUserAccount()`
- `verifyEmail()`

**Authorization:** ⚠️ Most admin functions require elevated roles

**Multi-Tenant:** ✅ All functions enforce organization isolation

**For detailed API documentation, see:**
- `docs/architecture/DATABASE_ARCHITECTURE.md` - Complete Server Actions catalog
- Individual files in `src/actions/` - Full JSDoc comments

---

## Multi-Tenant Architecture

**All 163+ APIs enforce organization-level data isolation.**

### Implementation

Every Server Action uses the `fetchWithDrizzle()` helper which:
1. Authenticates user via Stack Auth (`stackServerApp.getUser()`)
2. Retrieves enhanced user record from `users` table (links Stack Auth ID to organization)
3. Provides context: `{ userId, organizationId, enhancedUser }`
4. **Automatically scopes ALL database queries to user's organization**

### Requirements

✅ **All Server Actions MUST validate `organizationId` exists:**
```typescript
if (!organizationId) {
  throw new Error("Organization context required");
}
```

✅ **All INSERT operations MUST include `organizationId` field:**
```typescript
await db.insert(schema.tableName).values({
  organizationId,
  userId,
  // ... other fields
});
```

✅ **All SELECT/UPDATE/DELETE operations MUST filter by `organizationId`:**
```typescript
const data = await db.query.tableName.findFirst({
  where: and(
    eq(schema.tableName.userId, userId),
    eq(schema.tableName.organizationId, organizationId)
  ),
});
```

✅ **All 44 database tables include `organization_id` column**

### Data Isolation

- Users can ONLY access data from their own organization
- Teachers can ONLY access students in their classes (within same organization)
- Admins can ONLY manage users/data within their organization
- System admins have cross-organization access (limited use cases)

---

## Error Handling

### Common Error Patterns

**Organization Validation:**
```typescript
if (!organizationId) {
  throw new Error("Organization context required");
}
```

**Role Authorization:**
```typescript
if (enhancedUser.role !== "teacher") {
  throw new Error("Access denied: Teacher role required");
}
```

**Resource Not Found:**
```typescript
if (!resource) {
  throw new Error("Resource not found");
}
```

**General Error Handling:**
```typescript
try {
  const result = await someAction();
  return { success: true, data: result };
} catch (error) {
  console.error('[ActionName] Error:', error);
  throw new Error("User-friendly error message");
}
```

### HTTP Error Codes (REST APIs)

- **200 OK** - Success
- **400 Bad Request** - Validation error (missing/invalid parameters)
- **500 Internal Server Error** - Server error (API failure, database error)

---

## Common Patterns

### Complete Practice Flow

```typescript
// 1. Create practice session
const session = await createPracticeSession('listening', 'level-3-general');

// 2. Generate question audio (with caching)
const audioUrl = await getQuestionAudio(
  'question-001',
  'Listen to the following conversation...',
  'alloy',
  'tts-1'
);

// 3. User answers via voice recording
const recordingBlob = await recordVoice();

// 4. Transcribe user's answer
const transcription = await fetch('/api/openai/transcribe', {
  method: 'POST',
  body: formData
}).then(r => r.json());

// 5. Save recording
const { recordingId } = await saveUserRecording(
  recordingBlob,
  transcription.text,
  'question-001',
  session.sessionId
);

// 6. Assess answer
const assessment = await fetch('/api/openai/assess', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: transcription.text,
    level: 'level-3-general',
    skill: 'speaking',
    questionText: 'Describe your favorite place'
  })
}).then(r => r.json());

// 7. Save answer and update progress
await saveSessionAnswer(
  session.id,
  'question-001',
  transcription.text,
  correctAnswer,
  assessment.overallScore >= 70,
  assessment.overallScore >= 70 ? 10 : 0,
  timeSpent,
  recordingId,
  undefined,
  assessment.overallFeedback
);

// 8. Submit answer and update gamification
const progress = await submitAnswer(
  'question-001',
  assessment.overallScore >= 70,
  10,
  'listening'
);

// 9. Complete session
await completePracticeSession(session.id);
```

### Teacher Workflow

```typescript
// 1. Get teacher's classes
const classes = await getTeacherClasses();

// 2. Get class roster
const students = await getClassRoster(classes[0].id);

// 3. Create assignment
const assignment = await createAssignment({
  title: 'Listening Practice Week 1',
  classId: classes[0].id,
  dueDate: new Date('2025-11-10'),
  // ... other fields
});

// 4. Get student recordings
const recordings = await getTeacherStudentRecordings({
  classId: classes[0].id,
  dateRange: '7d'
});

// 5. Review recording
await markRecordingReviewed(
  recordings[0].id,
  'Good pronunciation! Keep practicing fluency.'
);

// 6. Get class analytics
const stats = await getClassRecordingStats(classes[0].id);
```

---

## Related Documentation

- **`docs/api-schema.json`** - Structured API metadata (easy for AI parsing)
- **`docs/architecture/DATABASE_ARCHITECTURE.md`** - Complete database schema, ERD diagrams, Server Actions catalog
- **`CLAUDE.md`** - Project overview, development guidelines, common pitfalls
- **`src/types/index.ts`** - TypeScript type definitions for all APIs

---

**End of API Reference**

*Generated for Claude Code and AI assistants to enable fast, accurate API usage.*
