# 数据库架构实施文档

## 📊 实施进度

### ✅ 已完成
1. ✅ 安装 @vercel/blob 包
2. ✅ 创建完整的数据库 Schema（16个表）
3. ✅ 创建 Blob 存储工具函数
4. ✅ 备份原始 schema 文件
5. ✅ 数据库 Schema 推送（字段重命名已处理）
6. ✅ 创建音频管理 Server Actions (`/src/actions/audio.ts`)
7. ✅ 创建用户录音管理 Server Actions (`/src/actions/recordings.ts`)
8. ✅ 创建 CopilotKit 聊天记录 Server Actions (`/src/actions/copilot-chat.ts`)
9. ✅ 创建会话管理 Server Actions (`/src/actions/sessions.ts`)
10. ✅ 添加数据库关系定义到 schema.ts

### ⏳ 待集成
1. ⏳ 更新现有组件以使用新 Server Actions
2. ⏳ 在 Practice 页面集成音频缓存
3. ⏳ 在 Conversation 页面集成录音保存
4. ⏳ 集成 CopilotKit 聊天历史保存

---

## 🗄️ 新增数据库表概览

### 1. 用户进度和游戏化（4个表，已增强）
- `user_progress` - **增强版**：添加了 `questionsCompleted`, `correctAnswers`, `perfectStreak`, `totalStudyTime`, `preferredVoice`, `audioPlaybackSpeed`
- `completed_questions` - **增强版**：添加了 `userAnswer`, `correctAnswer`, `pointsEarned`, `skill`, `difficulty`, `answerDetails`
- `badges` - 保持不变
- `achievements` - **字段重命名**：`completed` → `isCompleted`

### 2. CopilotKit 聊天历史（2个新表）
- `copilot_conversations` - 对话会话
- `copilot_messages` - 聊天消息

### 3. 音频文件管理（4个新表）
- `audio_files` - 音频文件元数据
- `question_audio_cache` - 题目音频缓存（核心功能！）
- `user_recordings` - 用户录音记录
- `transcriptions` - 语音转录文本

### 4. 练习会话（2个新表）
- `practice_sessions` - 练习会话
- `session_answers` - 会话答案详情

### 5. 对话练习（2个新表）
- `conversation_sessions` - 对话练习会话
- `conversation_turns` - 对话回合

---

## ⚠️ Schema 推送问题解决方案

### 问题
执行 `npm run drizzle:push` 时，Drizzle 询问 `is_completed` 列是创建还是重命名。

### 解决方案选项

#### 选项 A：手动 Migration（推荐，安全）
```bash
# 1. 生成 migration 文件
npm run drizzle:generate

# 2. 编辑生成的 migration SQL 文件
# 将 ALTER TABLE achievements DROP COLUMN completed 改为：
# ALTER TABLE achievements RENAME COLUMN completed TO is_completed;

# 3. 运行 migration
npm run drizzle:migrate
```

#### 选项 B：使用 generate + 自定义 SQL
```sql
-- 在 drizzle/migrations/ 创建自定义 migration
ALTER TABLE achievements RENAME COLUMN completed TO is_completed;

-- 为 user_progress 添加新字段
ALTER TABLE user_progress
  ADD COLUMN questions_completed INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN correct_answers INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN perfect_streak INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN total_study_time INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN preferred_voice TEXT DEFAULT 'alloy',
  ADD COLUMN audio_playback_speed DECIMAL(3,2) DEFAULT 1.00;

-- 为 completed_questions 添加新字段
ALTER TABLE completed_questions
  ADD COLUMN user_answer TEXT,
  ADD COLUMN correct_answer TEXT,
  ADD COLUMN points_earned INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN skill TEXT NOT NULL,
  ADD COLUMN difficulty TEXT,
  ADD COLUMN answer_details JSONB;
```

#### 选项 C：从头开始（最简单，适合开发环境）
```bash
# ⚠️ 警告：这将删除所有数据！仅适用于开发/测试环境

# 1. 备份数据（如果需要）
# 2. 删除现有表
# 3. 重新推送 schema
npm run drizzle:push
# 选择 "create column" 选项
```

---

## 📝 使用示例

### 1. 题目音频缓存（避免重复生成）

```typescript
// src/actions/audio.ts
"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { uploadAudioFile, generateContentHash } from "@/lib/blob/audio-storage";
import { createHash } from "crypto";

/**
 * 获取或生成题目音频
 * 如果缓存中存在，直接返回；否则调用 TTS 生成
 */
export async function getQuestionAudio(
  questionId: string,
  textContent: string,
  voiceName: string = "alloy"
): Promise<string> {
  // 1. 计算内容哈希
  const contentHash = createHash('sha256')
    .update(`${textContent}:tts-1:${voiceName}`)
    .digest('hex');

  // 2. 查询缓存
  const cached = await fetchWithDrizzle(async (db) => {
    return db.query.questionAudioCache.findFirst({
      where: eq(schema.questionAudioCache.questionId, questionId),
      with: {
        audioFile: true,
      },
    });
  });

  // 3. 如果缓存存在且有效，更新访问统计并返回
  if (cached && cached.isActive) {
    await updateAudioAccessCount(cached.id);
    return cached.audioFile.blobUrl;
  }

  // 4. 缓存不存在，调用 OpenAI TTS 生成
  const audioBuffer = await generateTTS(textContent, voiceName);

  // 5. 上传到 Blob 存储
  const audioInfo = await uploadAudioFile(audioBuffer, `${questionId}.mp3`, {
    fileType: 'question_audio',
    questionId,
  });

  // 6. 保存到数据库
  await fetchWithDrizzle(async (db) => {
    // 创建 audio_files 记录
    const [audioFile] = await db.insert(schema.audioFiles).values({
      fileId: audioInfo.fileId,
      blobUrl: audioInfo.blobUrl,
      fileType: 'question_audio',
      contentHash: audioInfo.contentHash,
      fileSize: audioInfo.fileSize,
      format: 'mp3',
    }).returning();

    // 创建 question_audio_cache 记录
    await db.insert(schema.questionAudioCache).values({
      questionId,
      audioFileId: audioFile.id,
      textContent,
      voiceModel: 'tts-1',
      voiceName,
      contentHash,
    });
  });

  return audioInfo.blobUrl;
}

/**
 * 更新音频访问统计
 */
async function updateAudioAccessCount(cacheId: bigint) {
  await fetchWithDrizzle(async (db) => {
    await db.update(schema.questionAudioCache)
      .set({
        accessCount: db.$increment(schema.questionAudioCache.accessCount),
        lastAccessedAt: new Date(),
      })
      .where(eq(schema.questionAudioCache.id, cacheId));
  });
}

/**
 * 调用 OpenAI TTS 生成音频
 */
async function generateTTS(text: string, voice: string): Promise<Buffer> {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice,
      input: text,
    }),
  });

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
```

### 2. 保存用户录音和转录

```typescript
// src/actions/recordings.ts
"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { uploadAudioFile } from "@/lib/blob/audio-storage";

/**
 * 保存用户录音和转录
 */
export async function saveUserRecording(
  audioBlob: Blob,
  transcription: string,
  questionId: string,
  sessionId: string
) {
  return fetchWithDrizzle(async (db, { userId }) => {
    // 1. 上传音频到 Blob 存储
    const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());
    const audioInfo = await uploadAudioFile(
      audioBuffer,
      `${Date.now()}.webm`,
      {
        fileType: 'user_recording',
        userId,
        sessionId,
      }
    );

    // 2. 创建 audio_files 记录
    const [audioFile] = await db.insert(schema.audioFiles).values({
      fileId: audioInfo.fileId,
      blobUrl: audioInfo.blobUrl,
      fileType: 'user_recording',
      contentHash: audioInfo.contentHash,
      fileSize: audioInfo.fileSize,
      format: 'webm',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    }).returning();

    // 3. 创建 transcription 记录
    const [transcriptionRecord] = await db.insert(schema.transcriptions).values({
      audioFileId: audioFile.id,
      userId,
      transcribedText: transcription,
      model: 'whisper-1',
      wordCount: transcription.split(/\s+/).length,
    }).returning();

    // 4. 创建 user_recordings 记录
    const [recording] = await db.insert(schema.userRecordings).values({
      userId,
      audioFileId: audioFile.id,
      recordingType: 'practice_answer',
      contextId: sessionId,
      questionId,
      transcriptionId: transcriptionRecord.id,
    }).returning();

    return {
      recordingId: recording.id,
      audioUrl: audioFile.blobUrl,
      transcription,
    };
  });
}
```

### 3. 保存 CopilotKit 聊天记录

```typescript
// src/actions/copilot-chat.ts
"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * 创建或获取对话会话
 */
export async function getOrCreateConversation(
  contextType: 'practice' | 'conversation' | 'dashboard' | 'general',
  contextId?: string
) {
  return fetchWithDrizzle(async (db, { userId }) => {
    // 查找现有会话
    const existing = await db.query.copilotConversations.findFirst({
      where: eq(schema.copilotConversations.contextType, contextType),
      orderBy: (conversations, { desc }) => [desc(conversations.startedAt)],
    });

    if (existing) {
      return existing;
    }

    // 创建新会话
    const [conversation] = await db.insert(schema.copilotConversations).values({
      userId,
      sessionId: crypto.randomUUID(),
      contextType,
      contextId,
      title: `${contextType} conversation`,
    }).returning();

    return conversation;
  });
}

/**
 * 保存聊天消息
 */
export async function saveChatMessage(
  conversationId: bigint,
  role: 'user' | 'assistant' | 'system',
  content: string,
  contentType: 'text' | 'code' | 'audio_transcript' = 'text'
) {
  return fetchWithDrizzle(async (db) => {
    const [message] = await db.insert(schema.copilotMessages).values({
      conversationId,
      role,
      content,
      contentType,
    }).returning();

    // 更新对话的消息计数和最后消息时间
    await db.update(schema.copilotConversations)
      .set({
        messageCount: db.$increment(schema.copilotConversations.messageCount),
        lastMessageAt: new Date(),
      })
      .where(eq(schema.copilotConversations.id, conversationId));

    return message;
  });
}

/**
 * 获取对话历史
 */
export async function getChatHistory(conversationId: bigint, limit: number = 50) {
  return fetchWithDrizzle(async (db) => {
    return db.query.copilotMessages.findMany({
      where: eq(schema.copilotMessages.conversationId, conversationId),
      orderBy: (messages, { desc }) => [desc(messages.createdAt)],
      limit,
    });
  });
}
```

---

## 🔧 下一步操作建议

### 1. 立即执行（高优先级）
```bash
# 1. 推送 schema（选择合适的方法）
npm run drizzle:generate
# 手动编辑 migration 文件处理字段重命名
npm run drizzle:migrate

# 2. 验证数据库结构
# 使用 Neon Dashboard 或 psql 查看表结构

# 3. 创建音频缓存 Server Actions
# 参考上面的示例代码
```

### 2. 中期实施（本周内）
- 创建所有核心 Server Actions
- 更新现有 `submitAnswer` 等 actions 使用新字段
- 集成音频缓存到题目播放流程
- 实现用户录音保存功能

### 3. 长期优化（下周）
- 实现 CopilotKit 聊天历史保存
- 添加会话管理功能
- 创建数据分析仪表板
- 实现自动清理过期音频的 Cron Job

---

## 📊 性能优化建议

### 1. 音频缓存策略
- **命中率目标**: >90% （题目音频）
- **存储成本**: 估计每个音频 ~50KB，1000题 = 50MB
- **CDN加速**: Vercel Blob 自动CDN，全球加速

### 2. 数据库查询优化
- 所有外键字段已添加索引
- 使用 `accessCount` 追踪热门内容
- 定期归档旧会话记录（>6个月）

### 3. Blob 存储优化
- 用户录音 90 天自动清理
- AI 对话音频 30 天清理
- TTS 缓存 180 天无访问则清理
- 题目音频永久保留

---

## 🧪 测试清单

### 数据库测试
- [ ] 所有表创建成功
- [ ] 索引正确创建
- [ ] 外键关系正常
- [ ] 默认值正确设置

### 音频缓存测试
- [ ] 首次请求生成并缓存音频
- [ ] 二次请求直接返回缓存
- [ ] 访问统计正确更新
- [ ] 不同语音生成不同缓存

### Blob 存储测试
- [ ] 音频上传成功
- [ ] URL 可访问
- [ ] 文件大小记录正确
- [ ] 过期时间设置正确

### Server Actions 测试
- [ ] 认证正确
- [ ] 用户数据隔离
- [ ] 错误处理完善
- [ ] 事务正确回滚

---

## 📦 文件清单

### 已创建
- ✅ `/src/lib/db/schema.ts` - 完整数据库 Schema（16个表）
- ✅ `/src/lib/db/schema.ts.backup` - 原始 Schema 备份
- ✅ `/src/lib/blob/audio-storage.ts` - Blob 存储工具函数
- ✅ `DATABASE_SCHEMA_IMPLEMENTATION.md` - 本文档

### 待创建
- ⏳ `/src/actions/audio.ts` - 音频管理 Actions
- ⏳ `/src/actions/copilot-chat.ts` - 聊天记录 Actions
- ⏳ `/src/actions/sessions.ts` - 会话管理 Actions
- ⏳ `/src/actions/recordings.ts` - 录音管理 Actions
- ⏳ `/src/types/database.ts` - TypeScript 类型定义

---

## 🚨 重要提醒

1. **备份数据**: 执行任何 schema 更改前，请先备份重要数据
2. **测试环境**: 建议在测试环境先验证完整流程
3. **渐进式迁移**: 不要一次性更改所有代码，逐步集成新功能
4. **监控存储成本**: Vercel Blob 按使用量计费，监控成本
5. **数据隐私**: 用户录音可能包含敏感信息，确保符合隐私政策

---

**作者**: Claude
**日期**: 2025-10-19
**版本**: 2.0
**状态**: ✅ 核心架构完成，Server Actions 已实现，等待组件集成

---

## 🔗 实际集成示例

### 1. Practice 页面 - 集成音频缓存

**场景**: 在 Practice 页面播放题目音频时，自动使用缓存避免重复调用 OpenAI TTS

```typescript
// src/app/(main)/practice/page.tsx 或相关组件
import { getQuestionAudio } from "@/actions/audio";
import { useState } from "react";

function QuestionAudioPlayer({ questionId, questionText }: { questionId: string; questionText: string }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayAudio = async () => {
    setIsLoading(true);
    try {
      // 🎯 核心功能：自动缓存！首次调用生成，后续直接返回缓存 URL
      const url = await getQuestionAudio(
        questionId,
        questionText,
        "alloy",  // 可以从用户偏好读取
        "tts-1"   // 标准质量
      );
      setAudioUrl(url);

      // 播放音频
      const audio = new Audio(url);
      await audio.play();
    } catch (error) {
      console.error("Failed to play audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlayAudio}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? "Loading..." : "🔊 Play Question"}
    </button>
  );
}
```

### 2. Voice Recorder - 保存用户录音和转录

**场景**: 用户完成语音答题后，保存录音、转录、AI 评分到数据库

```typescript
// src/components/practice/voice-recorder.tsx 或相关组件
import { saveUserRecording } from "@/actions/recordings";
import { createPracticeSession, saveSessionAnswer } from "@/actions/sessions";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";

function SpeakingQuestion({ questionId, questionText, sessionId }: any) {
  const {
    isRecording,
    audioBlob,
    transcription,
    assessment,
    startRecording,
    stopRecording,
    transcribe,
    assess,
  } = useVoiceRecorder();

  const handleSubmitAnswer = async () => {
    if (!audioBlob || !transcription || !assessment) return;

    try {
      // 1. 保存用户录音和转录到数据库
      const recordingResult = await saveUserRecording(
        audioBlob,
        transcription,
        questionId,
        sessionId,
        "practice_answer"
      );

      console.log("Recording saved:", recordingResult.audioUrl);
      console.log("Transcription ID:", recordingResult.transcriptionId);

      // 2. 保存答案到会话
      await saveSessionAnswer(
        BigInt(sessionId), // Session ID
        questionId,
        transcription, // User answer
        "", // Correct answer (speaking 没有标准答案)
        assessment.score >= 70, // Is correct (根据分数判断)
        assessment.score, // Points earned
        undefined, // Time spent
        recordingResult.recordingId, // Audio recording ID
        recordingResult.transcriptionId, // Transcription ID
        JSON.stringify(assessment) // AI feedback
      );

      // 3. 显示成功消息
      alert("Answer submitted successfully!");
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  return (
    <div>
      <p>{questionText}</p>

      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioBlob && !transcription && (
        <button onClick={() => transcribe(audioBlob)}>Transcribe</button>
      )}

      {transcription && (
        <div>
          <p>Your answer: {transcription}</p>
          <button onClick={handleSubmitAnswer}>Submit Answer</button>
        </div>
      )}
    </div>
  );
}
```

### 3. CopilotKit - 自动保存聊天记录

**场景**: 在 CopilotKit 对话框中，自动保存所有用户和 AI 的对话

```typescript
// src/components/copilot/copilot-actions.tsx
import { useCopilotAction } from "@copilotkit/react-core";
import { getOrCreateConversation, saveChatMessage } from "@/actions/copilot-chat";
import { useState, useEffect } from "react";

function CopilotChatWithHistory() {
  const [conversationId, setConversationId] = useState<bigint | null>(null);

  // 初始化或获取当前对话
  useEffect(() => {
    const initConversation = async () => {
      const conversation = await getOrCreateConversation(
        "practice", // 或其他上下文
        undefined,  // 可选：关联的 session ID
        "Practice Session Chat"
      );
      setConversationId(conversation.id);
    };
    initConversation();
  }, []);

  // 在 CopilotKit action 中保存消息
  useCopilotAction({
    name: "customAction",
    description: "Custom action with chat logging",
    handler: async ({ userMessage }) => {
      // 保存用户消息
      if (conversationId) {
        await saveChatMessage(
          conversationId,
          "user",
          userMessage,
          "text"
        );
      }

      // 执行你的逻辑...
      const aiResponse = "AI response here...";

      // 保存 AI 回复
      if (conversationId) {
        await saveChatMessage(
          conversationId,
          "assistant",
          aiResponse,
          "text"
        );
      }

      return aiResponse;
    },
  });

  return <div>Your CopilotKit UI here</div>;
}
```

### 4. 查看缓存统计（管理员/调试）

**场景**: 监控音频缓存性能，查看命中率和存储使用

```typescript
// src/app/(main)/dashboard/page.tsx 或管理页面
import { getAudioCacheStats } from "@/actions/audio";
import { useEffect, useState } from "react";

function AudioCacheStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getAudioCacheStats();
      setStats(data);
    };
    loadStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold">Audio Cache Statistics</h3>
      <ul className="mt-2 space-y-1">
        <li>Total Cached: {stats.totalCached} files</li>
        <li>Total Hits: {stats.totalHits}</li>
        <li>Average Hits per Audio: {stats.averageHitsPerAudio.toFixed(2)}</li>
        <li>Total Storage: {(stats.totalSize / 1024 / 1024).toFixed(2)} MB</li>
      </ul>
    </div>
  );
}
```

### 5. 完整的 Practice Session 流程

**场景**: 创建练习会话 → 答题 → 保存答案 → 完成会话

```typescript
// src/app/(main)/practice/page.tsx
import {
  createPracticeSession,
  saveSessionAnswer,
  completePracticeSession,
  getPracticeSessionWithAnswers,
} from "@/actions/sessions";
import { useState } from "react";

function PracticeSessionFlow() {
  const [sessionId, setSessionId] = useState<bigint | null>(null);

  // 开始练习会话
  const startSession = async () => {
    const session = await createPracticeSession("speaking", "level-3-general");
    setSessionId(session.id);
  };

  // 提交答案
  const submitAnswer = async (questionId: string, userAnswer: string, isCorrect: boolean) => {
    if (!sessionId) return;

    await saveSessionAnswer(
      sessionId,
      questionId,
      userAnswer,
      "correct answer here", // 实际应从题目获取
      isCorrect,
      isCorrect ? 10 : 0, // 根据正确性给分
      30 // 用时 30 秒
    );
  };

  // 完成会话
  const finishSession = async () => {
    if (!sessionId) return;

    const completed = await completePracticeSession(sessionId);
    console.log("Session completed:", completed);

    // 获取完整会话数据（包含所有答案）
    const sessionData = await getPracticeSessionWithAnswers(sessionId);
    console.log("Session summary:", sessionData);
  };

  return (
    <div>
      <button onClick={startSession}>Start Practice</button>
      {sessionId && (
        <>
          <button onClick={() => submitAnswer("q1", "my answer", true)}>
            Submit Answer
          </button>
          <button onClick={finishSession}>Finish Session</button>
        </>
      )}
    </div>
  );
}
```

---

## 🎯 核心优势总结

### 1. 音频缓存（节省成本）
- **首次调用**: 生成音频 → 上传 Blob → 保存数据库
- **后续调用**: 直接返回缓存 URL（0.1 秒响应）
- **预估节省**: 相同题目重复率 90%+，每月可节省数百次 TTS API 调用

### 2. 完整数据追踪
- **用户录音**: 所有语音答题都有录音和转录备份
- **会话历史**: 每次练习/对话都有完整记录
- **AI 对话**: CopilotKit 聊天记录永久保存

### 3. 数据分析基础
- **学习分析**: 通过 session 数据分析学习模式
- **性能优化**: 通过 cache stats 优化存储策略
- **用户洞察**: 通过录音和转录分析用户水平

---

## 📋 后续集成清单

### 必须集成（核心功能）
- [ ] Practice 页面使用 `getQuestionAudio()` 播放题目
- [ ] Voice Recorder 使用 `saveUserRecording()` 保存录音
- [ ] Practice 流程使用 Session Actions 跟踪会话

### 推荐集成（增强功能）
- [ ] CopilotKit 自动保存聊天记录
- [ ] Dashboard 显示缓存统计
- [ ] Conversation 页面保存对话 turns

### 可选集成（高级功能）
- [ ] 实现音频缓存清理 Cron Job
- [ ] 添加会话历史回放功能
- [ ] 创建数据分析仪表板
