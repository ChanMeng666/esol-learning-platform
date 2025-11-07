import { put, del, head, list } from '@vercel/blob';
import { createHash } from 'crypto';

/**
 * Audio File Storage Utilities for Vercel Blob
 * Handles uploading, caching, and managing audio files
 */

export interface UploadAudioOptions {
  fileType: 'question_audio' | 'user_recording' | 'ai_response' | 'tts_cache' | 'speaking_user' | 'speaking_ai';
  questionId?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface AudioFileInfo {
  blobUrl: string;
  fileId: string;
  contentHash: string;
  fileSize: number;
}

/**
 * Generate SHA256 hash for content
 * Used for deduplication
 */
export function generateContentHash(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Generate Blob path based on file type
 */
function generateBlobPath(options: UploadAudioOptions, filename: string): string {
  const { fileType, questionId, userId, sessionId } = options;

  switch (fileType) {
    case 'question_audio':
      return `audio/questions/${questionId}_${filename}`;

    case 'user_recording':
      return `audio/user-recordings/${userId}/${sessionId}/${filename}`;

    case 'ai_response':
      return `audio/ai-responses/${sessionId}/${filename}`;

    case 'tts_cache':
      return `audio/tts-cache/${filename}`;

    case 'speaking_user':
      return `audio/speaking/${userId}/${sessionId}/user_${filename}`;

    case 'speaking_ai':
      return `audio/speaking-ai/${sessionId}/ai_${filename}`;

    default:
      return `audio/misc/${filename}`;
  }
}

/**
 * Upload audio file to Vercel Blob
 * Returns URL and metadata
 */
export async function uploadAudioFile(
  audioData: Buffer | Blob,
  filename: string,
  options: UploadAudioOptions
): Promise<AudioFileInfo> {
  try {
    // Generate content hash
    const buffer = audioData instanceof Blob
      ? Buffer.from(await audioData.arrayBuffer())
      : audioData;

    const contentHash = generateContentHash(buffer);

    // Generate blob path
    const blobPath = generateBlobPath(options, filename);

    // Upload to Vercel Blob
    const blob = await put(blobPath, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: getContentType(filename),
    });

    return {
      blobUrl: blob.url,
      fileId: getFileIdFromUrl(blob.url),
      contentHash,
      fileSize: buffer.length,
    };
  } catch (error) {
    console.error('Failed to upload audio file:', error);
    throw new Error('Audio upload failed');
  }
}

/**
 * Delete audio file from Blob storage
 */
export async function deleteAudioFile(blobUrl: string): Promise<void> {
  try {
    await del(blobUrl);
  } catch (error) {
    console.error('Failed to delete audio file:', error);
    throw new Error('Audio deletion failed');
  }
}

/**
 * Check if audio file exists in Blob storage
 */
export async function audioFileExists(blobUrl: string): Promise<boolean> {
  try {
    const blob = await head(blobUrl);
    return !!blob;
  } catch (error) {
    return false;
  }
}

/**
 * List audio files by prefix
 */
export async function listAudioFiles(prefix: string): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix });
    return blobs.map((blob) => blob.url);
  } catch (error) {
    console.error('Failed to list audio files:', error);
    return [];
  }
}

/**
 * Get file extension and MIME type
 */
function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'webm':
      return 'audio/webm';
    case 'ogg':
      return 'audio/ogg';
    case 'm4a':
      return 'audio/mp4';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Extract file ID from Blob URL
 */
function getFileIdFromUrl(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

/**
 * Calculate expiry date for audio files
 * Based on file type retention policy
 */
export function calculateExpiryDate(fileType: string): Date | null {
  const now = new Date();

  switch (fileType) {
    case 'user_recording':
      // 90 days retention
      now.setDate(now.getDate() + 90);
      return now;

    case 'ai_response':
      // 30 days retention
      now.setDate(now.getDate() + 30);
      return now;

    case 'tts_cache':
      // 180 days retention if not accessed
      now.setDate(now.getDate() + 180);
      return now;

    case 'speaking_user':
      // 90 days retention for student speaking recordings
      now.setDate(now.getDate() + 90);
      return now;

    case 'speaking_ai':
      // 30 days retention for AI responses
      now.setDate(now.getDate() + 30);
      return now;

    case 'question_audio':
      // Permanent (no expiry)
      return null;

    default:
      // 60 days default
      now.setDate(now.getDate() + 60);
      return now;
  }
}

/**
 * Clean up expired audio files
 * Should be called by a cron job
 */
export async function cleanupExpiredFiles(): Promise<number> {
  try {
    // Placeholder for future implementation
    // const { blobs } = await list({ limit: 1000 });
    const deletedCount = 0;

    // Note: Future implementation will:
    // 1. Query database for files where expires_at < now
    // 2. Delete those files from blob storage
    // 3. Delete database records
    // 4. Return count of deleted files

    return deletedCount;
  } catch {
    console.error('Failed to cleanup expired files');
    return 0;
  }
}
