"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { uploadAudioFile } from "@/lib/blob/audio-storage";
import { eq } from "drizzle-orm";

/**
 * Save user recording with transcription
 *
 * Used when user submits a speaking/pronunciation answer
 *
 * @param audioBlob - User's audio recording as Blob
 * @param transcription - Whisper transcription text
 * @param questionId - Related question ID
 * @param sessionId - Practice session ID
 * @param recordingType - Type of recording (practice_answer, conversation_turn, etc.)
 * @returns Recording info with URLs
 */
export async function saveUserRecording(
  audioBlob: Blob,
  transcription: string,
  questionId: string,
  sessionId: string,
  recordingType: "practice_answer" | "conversation_turn" | "pronunciation_test" = "practice_answer"
) {
  return fetchWithDrizzle(async (db, { userId }) => {
    // 1. Convert Blob to Buffer for upload
    const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());

    // 2. Upload audio to Vercel Blob storage
    const audioInfo = await uploadAudioFile(
      audioBuffer,
      `${Date.now()}.webm`,
      {
        fileType: "user_recording",
        userId,
        sessionId,
      }
    );

    // 3. Create audio_files record
    const [audioFile] = await db
      .insert(schema.audioFiles)
      .values({
        fileId: audioInfo.fileId,
        blobUrl: audioInfo.blobUrl,
        fileType: "user_recording",
        contentHash: audioInfo.contentHash,
        fileSize: audioInfo.fileSize,
        format: "webm",
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      })
      .returning();

    // 4. Create transcription record
    const [transcriptionRecord] = await db
      .insert(schema.transcriptions)
      .values({
        audioFileId: audioFile.id,
        userId,
        transcribedText: transcription,
        model: "whisper-1",
        wordCount: transcription.split(/\s+/).filter(Boolean).length,
      })
      .returning();

    // 5. Create user_recordings record
    const [recording] = await db
      .insert(schema.userRecordings)
      .values({
        userId,
        audioFileId: audioFile.id,
        recordingType,
        contextId: sessionId,
        questionId,
        transcriptionId: transcriptionRecord.id,
      })
      .returning();

    return {
      recordingId: recording.id,
      audioUrl: audioFile.blobUrl,
      transcription,
      transcriptionId: transcriptionRecord.id,
    };
  });
}

/**
 * Get user's recording history
 *
 * @param limit - Number of recordings to fetch
 * @returns List of user recordings with metadata
 */
export async function getUserRecordings(limit: number = 50) {
  return fetchWithDrizzle(async (db, { userId }) => {
    return await db.query.userRecordings.findMany({
      where: eq(schema.userRecordings.userId, userId),
      limit,
      orderBy: (recordings, { desc }) => [desc(recordings.recordedAt)],
      with: {
        audioFile: true,
        transcription: true,
      },
    });
  });
}

/**
 * Get recording by ID with full details
 *
 * @param recordingId - Recording ID
 * @returns Recording details with audio and transcription
 */
export async function getRecordingById(recordingId: bigint) {
  return fetchWithDrizzle(async (db) => {
    return await db.query.userRecordings.findFirst({
      where: eq(schema.userRecordings.id, recordingId),
      with: {
        audioFile: true,
        transcription: true,
      },
    });
  });
}

/**
 * Get recordings for a specific practice session
 *
 * @param sessionId - Practice session ID
 * @returns All recordings in the session
 */
export async function getSessionRecordings(sessionId: string) {
  return fetchWithDrizzle(async (db) => {
    return await db.query.userRecordings.findMany({
      where: eq(schema.userRecordings.contextId, sessionId),
      orderBy: (recordings, { asc }) => [asc(recordings.recordedAt)],
      with: {
        audioFile: true,
        transcription: true,
      },
    });
  });
}

/**
 * Save transcription only (when audio already saved)
 *
 * @param audioFileId - Audio file ID
 * @param transcribedText - Transcription text
 * @param model - Transcription model used
 * @param metadata - Additional metadata
 * @returns Transcription record
 */
export async function saveTranscription(
  audioFileId: bigint,
  transcribedText: string,
  model: string = "whisper-1",
  metadata?: Record<string, unknown>
) {
  return fetchWithDrizzle(async (db, { userId }) => {
    const [transcription] = await db
      .insert(schema.transcriptions)
      .values({
        audioFileId,
        userId,
        transcribedText,
        model,
        wordCount: transcribedText.split(/\s+/).filter(Boolean).length,
        metadata: metadata as Record<string, unknown> | undefined,
      })
      .returning();

    return transcription;
  });
}
