import { VoiceProfile } from "./openai";

/**
 * Generate audio URL from text using OpenAI TTS API
 * Caches generated audio in memory to avoid redundant API calls
 */

const audioCache = new Map<string, string>();

export async function generateAudioFromText(
  text: string,
  voiceProfile: VoiceProfile = "academic"
): Promise<string> {
  const cacheKey = `${text}-${voiceProfile}`;

  // Return cached audio if available
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  try {
    // Call TTS API
    const response = await fetch("/api/openai/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, voiceProfile }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.statusText}`);
    }

    // Convert audio blob to object URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Cache the URL
    audioCache.set(cacheKey, audioUrl);

    return audioUrl;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw new Error("Failed to generate audio. Please try again.");
  }
}

/**
 * Preload audio for multiple questions to improve performance
 */
export async function preloadAudio(
  scripts: Array<{ text: string; voiceProfile?: VoiceProfile }>
): Promise<void> {
  const promises = scripts.map(({ text, voiceProfile }) =>
    generateAudioFromText(text, voiceProfile).catch((err) => {
      console.warn(`Failed to preload audio for: ${text.substring(0, 50)}...`, err);
    })
  );

  await Promise.all(promises);
}

/**
 * Clear audio cache to free memory
 */
export function clearAudioCache(): void {
  // Revoke all object URLs to free memory
  audioCache.forEach((url) => {
    URL.revokeObjectURL(url);
  });
  audioCache.clear();
}
