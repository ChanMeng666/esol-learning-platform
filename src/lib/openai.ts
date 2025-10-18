import OpenAI from "openai";

// Singleton OpenAI client instance
let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not configured. Please add it to your .env.local file."
      );
    }

    openaiInstance = new OpenAI({
      apiKey,
    });
  }

  return openaiInstance;
}

// Voice options for different scenarios
export const VOICE_PROFILES = {
  // Academic lecturer (clear, authoritative)
  academic: {
    voice: "alloy" as const,
    speed: 0.95,
  },
  // Workplace/professional (friendly, clear)
  professional: {
    voice: "echo" as const,
    speed: 1.0,
  },
  // Social/casual (warm, conversational)
  casual: {
    voice: "nova" as const,
    speed: 1.0,
  },
  // Formal announcements (clear, measured)
  formal: {
    voice: "onyx" as const,
    speed: 0.9,
  },
} as const;

export type VoiceProfile = keyof typeof VOICE_PROFILES;
