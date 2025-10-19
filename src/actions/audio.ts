"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { uploadAudioFile, calculateExpiryDate } from "@/lib/blob/audio-storage";
import { getOpenAIClient } from "@/lib/openai";
import { createHash } from "crypto";

/**
 * Get or generate question audio with intelligent caching
 *
 * This is the core function to avoid repeated OpenAI TTS calls:
 * 1. Check if audio exists in cache (question_audio_cache table)
 * 2. If exists and active, update access stats and return URL
 * 3. If not exists, generate new audio, upload to Blob, save to DB
 *
 * @param questionId - Unique question identifier
 * @param textContent - Text to convert to speech
 * @param voiceName - OpenAI voice name (alloy, echo, nova, etc.)
 * @param voiceModel - TTS model (tts-1 or tts-1-hd)
 * @returns Blob URL of the audio file
 */
export async function getQuestionAudio(
  questionId: string,
  textContent: string,
  voiceName: string = "alloy",
  voiceModel: "tts-1" | "tts-1-hd" = "tts-1"
): Promise<string> {
  // 1. Calculate content hash for this specific audio configuration
  const contentHash = createHash("sha256")
    .update(`${textContent}:${voiceModel}:${voiceName}`)
    .digest("hex");

  // 2. Query cache for existing audio
  const cached = await fetchWithDrizzle(async (db) => {
    return await db.query.questionAudioCache.findFirst({
      where: and(
        eq(schema.questionAudioCache.questionId, questionId),
        eq(schema.questionAudioCache.contentHash, contentHash)
      ),
      with: {
        audioFile: true,
      },
    });
  });

  // 3. If cache exists and is active, update stats and return
  if (cached && cached.isActive && cached.audioFile) {
    await updateAudioAccessCount(cached.id);
    return cached.audioFile.blobUrl;
  }

  // 4. Cache miss - generate new audio with OpenAI TTS
  const audioBuffer = await generateTTS(textContent, voiceName, voiceModel);

  // 5. Upload to Vercel Blob storage
  const audioInfo = await uploadAudioFile(
    audioBuffer,
    `${questionId}.mp3`,
    {
      fileType: "question_audio",
      questionId,
    }
  );

  // 6. Save to database (audio_files + question_audio_cache)
  await fetchWithDrizzle(async (db) => {
    // Insert into audio_files table
    const [audioFile] = await db
      .insert(schema.audioFiles)
      .values({
        fileId: audioInfo.fileId,
        blobUrl: audioInfo.blobUrl,
        fileType: "question_audio",
        contentHash: audioInfo.contentHash,
        fileSize: audioInfo.fileSize,
        format: "mp3",
        expiresAt: calculateExpiryDate("question_audio"), // Permanent (null)
      })
      .returning();

    // Insert into question_audio_cache table
    await db.insert(schema.questionAudioCache).values({
      questionId,
      audioFileId: audioFile.id,
      textContent,
      voiceModel,
      voiceName,
      contentHash,
    });
  });

  return audioInfo.blobUrl;
}

/**
 * Generate audio using OpenAI Text-to-Speech API
 *
 * @param text - Text to convert to speech
 * @param voice - Voice name (alloy, echo, fable, onyx, nova, shimmer)
 * @param model - TTS model (tts-1 for standard, tts-1-hd for high quality)
 * @returns Audio data as Buffer
 */
async function generateTTS(
  text: string,
  voice: string = "alloy",
  model: "tts-1" | "tts-1-hd" = "tts-1"
): Promise<Buffer> {
  const openai = getOpenAIClient();

  const response = await openai.audio.speech.create({
    model,
    voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
    input: text,
    response_format: "mp3",
  });

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Update audio access statistics
 *
 * Called when cached audio is accessed to track usage
 *
 * @param cacheId - ID of the question_audio_cache record
 */
async function updateAudioAccessCount(cacheId: bigint): Promise<void> {
  await fetchWithDrizzle(async (db) => {
    const currentCache = await db.query.questionAudioCache.findFirst({
      where: eq(schema.questionAudioCache.id, cacheId),
    });

    if (currentCache) {
      await db
        .update(schema.questionAudioCache)
        .set({
          accessCount: currentCache.accessCount + 1,
          lastAccessedAt: new Date(),
        })
        .where(eq(schema.questionAudioCache.id, cacheId));
    }
  });
}

/**
 * Deactivate old audio cache entry
 *
 * Use when question text or voice changes - marks old cache as inactive
 * without deleting (keeps history)
 *
 * @param questionId - Question identifier
 */
export async function deactivateQuestionAudioCache(
  questionId: string
): Promise<void> {
  await fetchWithDrizzle(async (db) => {
    await db
      .update(schema.questionAudioCache)
      .set({
        isActive: false,
      })
      .where(eq(schema.questionAudioCache.questionId, questionId));
  });
}

/**
 * Get cache statistics for monitoring
 *
 * @returns Cache stats (total cached, total hits, storage used)
 */
export async function getAudioCacheStats() {
  return await fetchWithDrizzle(async (db) => {
    const cacheEntries = await db.query.questionAudioCache.findMany({
      where: eq(schema.questionAudioCache.isActive, true),
      with: {
        audioFile: true,
      },
    });

    const totalCached = cacheEntries.length;
    const totalHits = cacheEntries.reduce(
      (sum, entry) => sum + entry.accessCount,
      0
    );
    const totalSize = cacheEntries.reduce(
      (sum, entry) => sum + (entry.audioFile?.fileSize || 0),
      0
    );

    return {
      totalCached,
      totalHits,
      totalSize,
      averageHitsPerAudio: totalCached > 0 ? totalHits / totalCached : 0,
    };
  });
}
