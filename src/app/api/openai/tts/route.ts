import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, VOICE_PROFILES, VoiceProfile } from "@/lib/openai";

/**
 * Text-to-Speech API endpoint
 * Generates audio from text using OpenAI TTS
 *
 * POST /api/openai/tts
 * Body: { text: string, voiceProfile?: VoiceProfile }
 * Returns: Audio file (mp3)
 */
export async function POST(request: NextRequest) {
  try {
    const { text, voiceProfile = "academic" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();
    const profile = VOICE_PROFILES[voiceProfile as VoiceProfile] || VOICE_PROFILES.academic;

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: profile.voice,
      input: text,
      speed: profile.speed,
    });

    // Convert to Uint8Array (compatible with Edge/Cloudflare Workers)
    const arrayBuffer = await mp3.arrayBuffer();
    const audioData = new Uint8Array(arrayBuffer);

    // Return audio file
    return new NextResponse(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate speech",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
