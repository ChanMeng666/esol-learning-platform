"use client";

import { useEffect, useState, useRef } from "react";
import {
  getOrCreateConversation,
  saveChatMessage,
} from "@/actions/copilot-chat";

/**
 * Hook to automatically save CopilotKit chat history to database
 *
 * Usage:
 * const { conversationId } = useCopilotChatHistory({
 *   contextType: "practice",
 *   contextId: sessionId,
 * });
 */
export function useCopilotChatHistory({
  contextType,
  contextId,
  title,
}: {
  contextType: "practice" | "conversation" | "dashboard" | "general";
  contextId?: string;
  title?: string;
}) {
  const [conversationId, setConversationId] = useState<bigint | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const conversationIdRef = useRef<bigint | null>(null);

  // Initialize or get conversation
  useEffect(() => {
    const initConversation = async () => {
      try {
        console.log("[CopilotChatHistory] Initializing conversation...");
        const conversation = await getOrCreateConversation(
          contextType,
          contextId,
          title
        );
        setConversationId(conversation.id);
        conversationIdRef.current = conversation.id;
        setIsInitialized(true);
        console.log("[CopilotChatHistory] ✅ Conversation initialized:", conversation.id.toString());
      } catch (error) {
        console.error("[CopilotChatHistory] Failed to initialize conversation:", error);
      }
    };

    initConversation();
  }, [contextType, contextId, title]);

  /**
   * Save a message to the conversation
   *
   * @param role - Message role (user, assistant, system)
   * @param content - Message content
   * @param contentType - Content type (text, code, audio_transcript)
   */
  const saveMessage = async (
    role: "user" | "assistant" | "system",
    content: string,
    contentType: "text" | "code" | "audio_transcript" = "text"
  ) => {
    const currentConvId = conversationIdRef.current;
    if (!currentConvId) {
      console.warn("[CopilotChatHistory] Conversation not initialized, skipping message save");
      return;
    }

    try {
      console.log(`[CopilotChatHistory] Saving ${role} message...`);
      await saveChatMessage(
        currentConvId,
        role,
        content,
        contentType
      );
      console.log(`[CopilotChatHistory] ✅ ${role} message saved`);
    } catch (error) {
      console.error("[CopilotChatHistory] Failed to save message:", error);
    }
  };

  return {
    conversationId,
    isInitialized,
    saveMessage,
  };
}
