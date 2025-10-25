"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Get or create a CopilotKit conversation session
 * Multi-tenant: Creates conversation within user's organization
 *
 * Creates a new conversation or returns existing one for the context
 *
 * @param contextType - Where the chat is happening (practice, conversation, dashboard, general)
 * @param contextId - Related session/practice ID (optional)
 * @param title - Conversation title (optional, auto-generated if not provided)
 * @returns Conversation record
 */
export async function getOrCreateConversation(
  contextType: "practice" | "conversation" | "dashboard" | "general",
  contextId?: string,
  title?: string
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Try to find existing active conversation for this context
    const existing = await db.query.copilotConversations.findFirst({
      where: and(
        eq(schema.copilotConversations.userId, userId),
        eq(schema.copilotConversations.organizationId, organizationId),
        eq(schema.copilotConversations.contextType, contextType),
        contextId
          ? eq(schema.copilotConversations.contextId, contextId)
          : undefined
      ),
      orderBy: desc(schema.copilotConversations.startedAt),
    });

    if (existing) {
      return existing;
    }

    // Create new conversation
    const sessionId = crypto.randomUUID();
    const [conversation] = await db
      .insert(schema.copilotConversations)
      .values({
        organizationId,
        userId,
        sessionId,
        contextType,
        contextId,
        title: title || `${contextType} conversation - ${new Date().toLocaleDateString()}`,
      })
      .returning();

    return conversation;
  });
}

/**
 * Save a chat message to the conversation
 * Multi-tenant: Saves message within user's organization
 *
 * @param conversationId - Conversation ID
 * @param role - Message role (user, assistant, system)
 * @param content - Message content
 * @param contentType - Content type (text, code, audio_transcript)
 * @param metadata - Additional metadata
 * @param audioUrl - Associated audio URL (optional)
 * @returns Message record
 */
export async function saveChatMessage(
  conversationId: bigint,
  role: "user" | "assistant" | "system",
  content: string,
  contentType: "text" | "code" | "audio_transcript" = "text",
  metadata?: Record<string, unknown>,
  audioUrl?: string
) {
  return fetchWithDrizzle(async (db, { organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Insert message
    const [message] = await db
      .insert(schema.copilotMessages)
      .values({
        organizationId,
        conversationId,
        role,
        content,
        contentType,
        metadata: metadata as Record<string, unknown> | undefined,
        audioUrl,
      })
      .returning();

    // Update conversation stats
    const conversation = await db.query.copilotConversations.findFirst({
      where: and(
        eq(schema.copilotConversations.id, conversationId),
        eq(schema.copilotConversations.organizationId, organizationId)
      ),
    });

    if (conversation) {
      await db
        .update(schema.copilotConversations)
        .set({
          messageCount: conversation.messageCount + 1,
          lastMessageAt: new Date(),
        })
        .where(and(
          eq(schema.copilotConversations.id, conversationId),
          eq(schema.copilotConversations.organizationId, organizationId)
        ));
    }

    return message;
  });
}

/**
 * Get chat history for a conversation
 * Multi-tenant: Returns messages from user's organization only
 *
 * @param conversationId - Conversation ID
 * @param limit - Number of messages to fetch
 * @returns List of messages
 */
export async function getChatHistory(
  conversationId: bigint,
  limit: number = 50
) {
  return fetchWithDrizzle(async (db, { organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    return await db.query.copilotMessages.findMany({
      where: and(
        eq(schema.copilotMessages.conversationId, conversationId),
        eq(schema.copilotMessages.organizationId, organizationId)
      ),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      limit,
    });
  });
}

/**
 * Get all conversations for current user
 * Multi-tenant: Returns conversations from user's organization only
 *
 * @param limit - Number of conversations to fetch
 * @returns List of conversations with message count
 */
export async function getUserConversations(limit: number = 20) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    return await db.query.copilotConversations.findMany({
      where: and(
        eq(schema.copilotConversations.userId, userId),
        eq(schema.copilotConversations.organizationId, organizationId)
      ),
      orderBy: (conversations, { desc }) => [desc(conversations.lastMessageAt)],
      limit,
    });
  });
}

/**
 * Get conversation with all messages
 * Multi-tenant: Returns conversation from user's organization only
 *
 * @param conversationId - Conversation ID
 * @returns Conversation with full message history
 */
export async function getConversationWithMessages(conversationId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const conversation = await db.query.copilotConversations.findFirst({
      where: and(
        eq(schema.copilotConversations.id, conversationId),
        eq(schema.copilotConversations.userId, userId),
        eq(schema.copilotConversations.organizationId, organizationId)
      ),
      with: {
        messages: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          orderBy: (messages: any, { asc }: any) => [asc(messages.createdAt)],
        },
      },
    });

    return conversation;
  });
}

/**
 * Get conversations by context
 * Multi-tenant: Returns conversations from user's organization only
 *
 * Useful for showing chat history related to specific practice/conversation sessions
 *
 * @param contextType - Context type
 * @param contextId - Context ID (optional)
 * @returns List of related conversations
 */
export async function getConversationsByContext(
  contextType: "practice" | "conversation" | "dashboard" | "general",
  contextId?: string
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    return await db.query.copilotConversations.findMany({
      where: and(
        eq(schema.copilotConversations.userId, userId),
        eq(schema.copilotConversations.organizationId, organizationId),
        eq(schema.copilotConversations.contextType, contextType),
        contextId
          ? eq(schema.copilotConversations.contextId, contextId)
          : undefined
      ),
      orderBy: (conversations, { desc }) => [desc(conversations.startedAt)],
    });
  });
}

/**
 * Delete a conversation and all its messages
 * Multi-tenant: Deletes conversation from user's organization only
 *
 * @param conversationId - Conversation ID
 * @returns Success boolean
 */
export async function deleteConversation(conversationId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Verify ownership
    const conversation = await db.query.copilotConversations.findFirst({
      where: and(
        eq(schema.copilotConversations.id, conversationId),
        eq(schema.copilotConversations.userId, userId),
        eq(schema.copilotConversations.organizationId, organizationId)
      ),
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    // Delete messages first (cascade would handle this, but being explicit)
    await db
      .delete(schema.copilotMessages)
      .where(and(
        eq(schema.copilotMessages.conversationId, conversationId),
        eq(schema.copilotMessages.organizationId, organizationId)
      ));

    // Delete conversation
    await db
      .delete(schema.copilotConversations)
      .where(and(
        eq(schema.copilotConversations.id, conversationId),
        eq(schema.copilotConversations.organizationId, organizationId)
      ));

    return true;
  });
}

/**
 * Update conversation title
 * Multi-tenant: Updates conversation within user's organization only
 *
 * @param conversationId - Conversation ID
 * @param newTitle - New title
 * @returns Updated conversation
 */
export async function updateConversationTitle(
  conversationId: bigint,
  newTitle: string
) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const [updated] = await db
      .update(schema.copilotConversations)
      .set({ title: newTitle })
      .where(
        and(
          eq(schema.copilotConversations.id, conversationId),
          eq(schema.copilotConversations.userId, userId),
          eq(schema.copilotConversations.organizationId, organizationId)
        )
      )
      .returning();

    return updated;
  });
}
