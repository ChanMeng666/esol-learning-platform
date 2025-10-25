"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { uploadAudioFile } from "@/lib/blob/audio-storage";
import { eq, and } from "drizzle-orm";

/**
 * Save user recording with transcription
 * Multi-tenant: Saves recording within user's organization
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
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

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
        organizationId,
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
        organizationId,
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
        organizationId,
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
 * Multi-tenant: Returns recordings from user's organization only
 *
 * @param limit - Number of recordings to fetch
 * @returns List of user recordings with metadata
 */
export async function getUserRecordings(limit: number = 50) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    return await db.query.userRecordings.findMany({
      where: and(
        eq(schema.userRecordings.userId, userId),
        eq(schema.userRecordings.organizationId, organizationId)
      ),
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
 * Multi-tenant: Returns recording from user's organization only
 *
 * @param recordingId - Recording ID
 * @returns Recording details with audio and transcription
 */
export async function getRecordingById(recordingId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    return await db.query.userRecordings.findFirst({
      where: and(
        eq(schema.userRecordings.id, recordingId),
        eq(schema.userRecordings.userId, userId),
        eq(schema.userRecordings.organizationId, organizationId)
      ),
      with: {
        audioFile: true,
        transcription: true,
      },
    });
  });
}

/**
 * Get recordings for a specific practice session
 * Multi-tenant: Returns recordings from user's organization only
 *
 * @param sessionId - Practice session ID
 * @returns All recordings in the session
 */
export async function getSessionRecordings(sessionId: string) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    return await db.query.userRecordings.findMany({
      where: and(
        eq(schema.userRecordings.contextId, sessionId),
        eq(schema.userRecordings.userId, userId),
        eq(schema.userRecordings.organizationId, organizationId)
      ),
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
 * Multi-tenant: Saves transcription within user's organization
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
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const [transcription] = await db
      .insert(schema.transcriptions)
      .values({
        organizationId,
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

// ============================================================================
// FILTERED QUERIES & DELETION (FOR HISTORY VIEWS)
// ============================================================================

/**
 * Get user recordings with filtering
 * Multi-tenant: Returns filtered recordings from user's organization only
 *
 * @param filters - Filter options
 * @param filters.recordingType - Filter by type (practice_answer, conversation_turn, etc.)
 * @param filters.questionId - Filter by question ID
 * @param filters.dateRange - Filter by date range (7d, 30d, all)
 * @param limit - Number of recordings to fetch
 * @returns Filtered list of user recordings with metadata
 */
export async function getUserRecordingsWithFilters(
  filters: {
    recordingType?: string;
    questionId?: string;
    dateRange?: "7d" | "30d" | "all";
  },
  limit: number = 50
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const { and, eq, desc, gt } = await import("drizzle-orm");
    const conditions = [
      eq(schema.userRecordings.userId, userId),
      eq(schema.userRecordings.organizationId, organizationId)
    ];

    // Apply recording type filter
    if (filters.recordingType) {
      conditions.push(eq(schema.userRecordings.recordingType, filters.recordingType));
    }

    // Apply question ID filter
    if (filters.questionId) {
      conditions.push(eq(schema.userRecordings.questionId, filters.questionId));
    }

    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== "all") {
      const now = new Date();
      const daysAgo = filters.dateRange === "7d" ? 7 : 30;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      conditions.push(gt(schema.userRecordings.recordedAt, startDate));
    }

    return await db.query.userRecordings.findMany({
      where: and(...conditions),
      limit,
      orderBy: desc(schema.userRecordings.recordedAt),
      with: {
        audioFile: true,
        transcription: true,
      },
    });
  });
}

/**
 * Delete user recording
 * Multi-tenant: Deletes recording from user's organization only
 *
 * Deletes recording from database and removes audio file from Blob storage
 *
 * @param recordingId - Recording ID to delete
 * @returns Success status
 */
export async function deleteUserRecording(recordingId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const { deleteAudioFile } = await import("@/lib/blob/audio-storage");
    const { and, eq } = await import("drizzle-orm");

    // Get recording with audio file info
    const recording = await db.query.userRecordings.findFirst({
      where: and(
        eq(schema.userRecordings.id, recordingId),
        eq(schema.userRecordings.userId, userId),
        eq(schema.userRecordings.organizationId, organizationId)
      ),
      with: {
        audioFile: true,
      },
    });

    if (!recording) {
      throw new Error("Recording not found");
    }

    // Delete from Blob storage
    if (recording.audioFile?.blobUrl) {
      try {
        await deleteAudioFile(recording.audioFile.blobUrl);
      } catch (error) {
        console.error("[DeleteRecording] Failed to delete from Blob:", error);
        // Continue with database deletion even if Blob deletion fails
      }
    }

    // Delete transcription if exists
    if (recording.transcriptionId) {
      await db
        .delete(schema.transcriptions)
        .where(and(
          eq(schema.transcriptions.id, recording.transcriptionId),
          eq(schema.transcriptions.organizationId, organizationId)
        ));
    }

    // Delete audio file record
    if (recording.audioFileId) {
      await db
        .delete(schema.audioFiles)
        .where(and(
          eq(schema.audioFiles.id, recording.audioFileId),
          eq(schema.audioFiles.organizationId, organizationId)
        ));
    }

    // Delete user recording
    await db
      .delete(schema.userRecordings)
      .where(and(
        eq(schema.userRecordings.id, recordingId),
        eq(schema.userRecordings.organizationId, organizationId)
      ));

    return { success: true };
  });
}
