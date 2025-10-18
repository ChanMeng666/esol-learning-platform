import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export const runtime = "edge";

interface ConversationMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Conversation API endpoint
 * Uses GPT-4 to generate conversational responses for role-play scenarios
 *
 * POST /api/openai/conversation
 * Body: {
 *   messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }>
 * }
 * Returns: {
 *   response: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Missing required field: messages (array)" },
        { status: 400 }
      );
    }

    console.log("[ConversationAPI] Generating AI response for conversation");
    console.log("[ConversationAPI] Message count:", messages.length);

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: messages as ConversationMessage[],
      temperature: 0.8, // More creative/varied responses for conversation
      max_tokens: 300, // Keep responses concise and conversational
    });

    const response = completion.choices[0].message.content || "";

    console.log("[ConversationAPI] ✅ Response generated:", response.substring(0, 100) + "...");

    return NextResponse.json({ response });
  } catch (error) {
    console.error("[ConversationAPI] ❌ Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
