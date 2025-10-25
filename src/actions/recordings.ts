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

// ============================================================================
// TEACHER ACCESS FUNCTIONS
// ============================================================================

/**
 * Get recordings for students in teacher's classes
 * Multi-tenant: Returns recordings from teacher's organization only
 *
 * Teachers can view all recordings from students in their classes
 *
 * @param filters - Filter options
 * @param filters.classId - Filter by specific class
 * @param filters.studentId - Filter by specific student
 * @param filters.assignmentId - Filter by assignment
 * @param filters.recordingType - Filter by type
 * @param filters.dateRange - Filter by date range (7d, 30d, all)
 * @param limit - Number of recordings to fetch
 * @returns List of student recordings with metadata
 */
export async function getTeacherStudentRecordings(
  filters?: {
    classId?: bigint;
    studentId?: bigint;
    assignmentId?: bigint;
    recordingType?: string;
    dateRange?: "7d" | "30d" | "all";
  },
  limit: number = 100
) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Validate user is a teacher
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const { desc, gt, inArray } = await import("drizzle-orm");

    // Get list of student IDs teacher has access to
    let accessibleStudentIds: bigint[] = [];

    if (filters?.studentId) {
      // Validate teacher has access to this specific student
      const enrollment = await db.query.classEnrollments.findFirst({
        where: and(
          eq(schema.classEnrollments.studentId, filters.studentId),
          eq(schema.classEnrollments.status, "active")
        ),
        with: {
          class: true,
        },
      });

      if (!enrollment || enrollment.class.teacherId !== enhancedUser.id) {
        throw new Error("Access denied: Student not in your classes");
      }

      accessibleStudentIds = [filters.studentId];
    } else if (filters?.classId) {
      // Get students from specific class
      const classRecord = await db.query.classes.findFirst({
        where: and(
          eq(schema.classes.id, filters.classId),
          eq(schema.classes.teacherId, enhancedUser.id),
          eq(schema.classes.organizationId, organizationId)
        ),
      });

      if (!classRecord) {
        throw new Error("Access denied: Class not found or not yours");
      }

      const enrollments = await db.query.classEnrollments.findMany({
        where: and(
          eq(schema.classEnrollments.classId, filters.classId),
          eq(schema.classEnrollments.status, "active")
        ),
      });

      accessibleStudentIds = enrollments.map((e) => e.studentId);
    } else {
      // Get all students from all teacher's classes
      const classes = await db.query.classes.findMany({
        where: and(
          eq(schema.classes.teacherId, enhancedUser.id),
          eq(schema.classes.organizationId, organizationId),
          eq(schema.classes.isActive, true)
        ),
      });

      for (const cls of classes) {
        const enrollments = await db.query.classEnrollments.findMany({
          where: and(
            eq(schema.classEnrollments.classId, cls.id),
            eq(schema.classEnrollments.status, "active")
          ),
        });
        accessibleStudentIds.push(...enrollments.map((e) => e.studentId));
      }

      // Deduplicate
      accessibleStudentIds = Array.from(new Set(accessibleStudentIds));
    }

    if (accessibleStudentIds.length === 0) {
      return [];
    }

    // Build query conditions
    const conditions = [
      inArray(schema.userRecordings.userId, accessibleStudentIds),
      eq(schema.userRecordings.organizationId, organizationId),
    ];

    // Apply recording type filter
    if (filters?.recordingType) {
      conditions.push(eq(schema.userRecordings.recordingType, filters.recordingType));
    }

    // Apply date range filter
    if (filters?.dateRange && filters.dateRange !== "all") {
      const now = new Date();
      const daysAgo = filters.dateRange === "7d" ? 7 : 30;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      conditions.push(gt(schema.userRecordings.recordedAt, startDate));
    }

    const recordings = await db.query.userRecordings.findMany({
      where: and(...conditions),
      limit,
      orderBy: desc(schema.userRecordings.recordedAt),
      with: {
        audioFile: true,
        transcription: true,
      },
    });

    // Get student details for each recording
    const recordingsWithStudents = await Promise.all(
      recordings.map(async (recording) => {
        const student = await db.query.users.findFirst({
          where: eq(schema.users.id, recording.userId),
        });

        return {
          ...recording,
          student: {
            id: student?.id,
            fullName: student?.fullName,
            email: student?.email,
          },
        };
      })
    );

    return recordingsWithStudents;
  });
}

/**
 * Get recording details by ID (teacher access)
 * Multi-tenant: Validates teacher has access to student
 *
 * @param recordingId - Recording ID
 * @returns Recording details with audio, transcription, and student info
 */
export async function getTeacherAccessRecording(recordingId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Validate user is a teacher
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    // Get recording
    const recording = await db.query.userRecordings.findFirst({
      where: and(
        eq(schema.userRecordings.id, recordingId),
        eq(schema.userRecordings.organizationId, organizationId)
      ),
      with: {
        audioFile: true,
        transcription: true,
      },
    });

    if (!recording) {
      throw new Error("Recording not found");
    }

    // Validate teacher has access to this student
    const enrollment = await db.query.classEnrollments.findFirst({
      where: and(
        eq(schema.classEnrollments.studentId, recording.userId),
        eq(schema.classEnrollments.status, "active")
      ),
      with: {
        class: true,
      },
    });

    if (!enrollment || enrollment.class.teacherId !== enhancedUser.id) {
      throw new Error("Access denied: Student not in your classes");
    }

    // Get student details
    const student = await db.query.users.findFirst({
      where: eq(schema.users.id, recording.userId),
    });

    return {
      ...recording,
      student: {
        id: student?.id,
        fullName: student?.fullName,
        email: student?.email,
      },
    };
  });
}

/**
 * Mark recording as reviewed by teacher
 * Multi-tenant: Validates teacher access
 *
 * @param recordingId - Recording ID
 * @param feedback - Optional teacher feedback
 * @returns Updated recording
 */
export async function markRecordingReviewed(recordingId: bigint, feedback?: string) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Validate user is a teacher
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    // Get recording
    const recording = await db.query.userRecordings.findFirst({
      where: and(
        eq(schema.userRecordings.id, recordingId),
        eq(schema.userRecordings.organizationId, organizationId)
      ),
    });

    if (!recording) {
      throw new Error("Recording not found");
    }

    // Validate teacher has access to this student
    const enrollment = await db.query.classEnrollments.findFirst({
      where: and(
        eq(schema.classEnrollments.studentId, recording.userId),
        eq(schema.classEnrollments.status, "active")
      ),
      with: {
        class: true,
      },
    });

    if (!enrollment || enrollment.class.teacherId !== enhancedUser.id) {
      throw new Error("Access denied: Student not in your classes");
    }

    // Update recording metadata
    const currentMetadata = (recording.metadata as Record<string, unknown>) || {};
    const [updated] = await db
      .update(schema.userRecordings)
      .set({
        metadata: {
          ...currentMetadata,
          teacherReviewed: true,
          reviewedBy: enhancedUser.id.toString(),
          reviewedAt: new Date().toISOString(),
          teacherFeedback: feedback,
        } as Record<string, unknown>,
      })
      .where(eq(schema.userRecordings.id, recordingId))
      .returning();

    return updated;
  });
}

/**
 * Get recording statistics for a class
 * Multi-tenant: Validates teacher access to class
 *
 * @param classId - Class ID
 * @returns Recording statistics for the class
 */
export async function getClassRecordingStats(classId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Validate user is a teacher
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    // Validate teacher has access to this class
    const classRecord = await db.query.classes.findFirst({
      where: and(
        eq(schema.classes.id, classId),
        eq(schema.classes.teacherId, enhancedUser.id),
        eq(schema.classes.organizationId, organizationId)
      ),
    });

    if (!classRecord) {
      throw new Error("Access denied: Class not found or not yours");
    }

    // Get students in class
    const enrollments = await db.query.classEnrollments.findMany({
      where: and(
        eq(schema.classEnrollments.classId, classId),
        eq(schema.classEnrollments.status, "active")
      ),
    });

    const studentIds = enrollments.map((e) => e.studentId);

    if (studentIds.length === 0) {
      return {
        totalRecordings: 0,
        totalStudents: 0,
        avgRecordingsPerStudent: 0,
        recentRecordings: 0,
        recordingsByType: {},
      };
    }

    const { inArray, gt } = await import("drizzle-orm");

    // Get all recordings for these students
    const recordings = await db.query.userRecordings.findMany({
      where: and(
        inArray(schema.userRecordings.userId, studentIds),
        eq(schema.userRecordings.organizationId, organizationId)
      ),
    });

    // Calculate stats
    const totalRecordings = recordings.length;
    const avgRecordingsPerStudent = totalRecordings / studentIds.length;

    // Recent recordings (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRecordings = recordings.filter(
      (r) => new Date(r.recordedAt) > sevenDaysAgo
    ).length;

    // Group by recording type
    const recordingsByType = recordings.reduce((acc, r) => {
      acc[r.recordingType] = (acc[r.recordingType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRecordings,
      totalStudents: studentIds.length,
      avgRecordingsPerStudent: Math.round(avgRecordingsPerStudent * 10) / 10,
      recentRecordings,
      recordingsByType,
    };
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
