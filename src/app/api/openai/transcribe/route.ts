import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

/**
 * Speech-to-Text API endpoint
 * Transcribes audio using OpenAI Whisper
 *
 * POST /api/openai/transcribe
 * Body: FormData with 'audio' file
 * Returns: { text: string, duration?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!audioFile.type.startsWith("audio/")) {
      return NextResponse.json(
        { error: "File must be an audio file" },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
      response_format: "verbose_json",
    });

    return NextResponse.json({
      text: transcription.text,
      duration: transcription.duration,
    });
  } catch (error) {
    console.error("Transcription Error:", error);
    return NextResponse.json(
      {
        error: "Failed to transcribe audio",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
