"use client";

import { useEffect, useRef } from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { useCopilotChatHistory } from "@/hooks/use-copilot-chat-history";

/**
 * CopilotChatMonitor - Automatically saves all CopilotKit chat messages to database
 *
 * This component monitors the CopilotKit message stream and persists all
 * user and assistant messages to the database for history tracking.
 *
 * Usage: Add to the component tree inside CopilotKit provider
 */
export function CopilotChatMonitor() {
  const { messages } = useCopilotChat();
  const { saveMessage, isInitialized } = useCopilotChatHistory({
    contextType: "general",
    title: "NZCEL Study Assistant Chat",
  });

  // Track which messages have been saved
  const savedMessageIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only process messages after conversation is initialized
    if (!isInitialized || messages.length === 0) {
      return;
    }

    // Process new messages
    messages.forEach((message) => {
      // Create unique ID for this message
      const messageId = `${message.role}-${message.id || message.createdAt || Date.now()}`;

      // Skip if already saved
      if (savedMessageIds.current.has(messageId)) {
        return;
      }

      // Only save user and assistant messages (skip system, function, etc.)
      if (message.role === "user" || message.role === "assistant") {
        // Determine content type
        let contentType: "text" | "code" | "audio_transcript" = "text";
        const content = message.content || "";

        // Check if message contains code
        if (content.includes("```") || content.includes("`")) {
          contentType = "code";
        }

        // Save message to database
        saveMessage(message.role, content, contentType).then(() => {
          console.log(`[CopilotChatMonitor] ✅ Saved ${message.role} message`);
          savedMessageIds.current.add(messageId);
        }).catch((error) => {
          console.error(`[CopilotChatMonitor] Failed to save ${message.role} message:`, error);
        });
      }
    });
  }, [messages, isInitialized, saveMessage]);

  // This component is invisible - it only monitors and saves
  return null;
}
