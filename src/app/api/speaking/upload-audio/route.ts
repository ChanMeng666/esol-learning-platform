import { NextRequest, NextResponse } from "next/server";
import { uploadAudioFile } from "@/lib/blob/audio-storage";

/**
 * API route to upload audio files to Vercel Blob
 * This is needed because the BLOB_READ_WRITE_TOKEN is only available on the server
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get("audio") as Blob;
    const fileName = formData.get("fileName") as string;
    const fileType = formData.get("fileType") as string;
    const userId = formData.get("userId") as string;
    const sessionId = formData.get("sessionId") as string;

    if (!audioBlob) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    if (!fileName) {
      return NextResponse.json(
        { error: "No file name provided" },
        { status: 400 }
      );
    }

    console.log(`[UploadAudio API] Uploading ${fileName}, size: ${audioBlob.size} bytes`);

    // Upload to Vercel Blob
    const audioFileInfo = await uploadAudioFile(audioBlob, fileName, {
      fileType: fileType as any,
      userId,
      sessionId,
    });

    console.log(`[UploadAudio API] Upload successful: ${audioFileInfo.blobUrl}`);

    return NextResponse.json({
      success: true,
      blobUrl: audioFileInfo.blobUrl,
      fileSize: audioFileInfo.fileSize,
    });
  } catch (error) {
    console.error("[UploadAudio API] Upload failed:", error);
    return NextResponse.json(
      {
        error: "Audio upload failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
