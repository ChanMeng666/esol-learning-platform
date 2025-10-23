# OpenAI Realtime API Implementation Guide

**Complete tutorial for implementing AI real-time voice conversation using OpenAI Realtime API (GA) with Agents SDK**

> ✅ **Production-Ready** | Tested and Working
> 📅 Last Updated: 2025-10-23
> 🔧 OpenAI SDK: `@openai/agents` (Agents SDK)
> 🎯 API Version: GA (General Availability) - `/v1/realtime/client_secrets`

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Step 1: Install Dependencies](#step-1-install-dependencies)
5. [Step 2: Create API Route for Client Secret](#step-2-create-api-route-for-client-secret)
6. [Step 3: Create Realtime Component](#step-3-create-realtime-component)
7. [Step 4: Create Test Page](#step-4-create-test-page)
8. [Key Configuration Details](#key-configuration-details)
9. [Critical Implementation Notes](#critical-implementation-notes)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Best Practices](#best-practices)
12. [Common Pitfalls](#common-pitfalls)

---

## Overview

This guide shows you how to implement **real-time voice conversation** with OpenAI's Realtime API using the **Agents SDK**. The implementation supports:

- ✅ Two-way voice conversation (user speaks → AI responds with voice)
- ✅ Automatic voice activity detection (VAD)
- ✅ Real-time transcription
- ✅ Conversation history tracking
- ✅ Debug event logging
- ✅ Manual response triggering (fallback)

**Key Features:**
- Uses WebRTC for low-latency audio streaming
- Secure client-side implementation (API key never exposed)
- Full event logging for debugging
- Production-ready error handling

---

## Architecture

```
┌─────────────────┐
│  Next.js Client │
│   (Browser)     │
└────────┬────────┘
         │
         │ 1. Request client secret
         ▼
┌─────────────────┐
│   API Route     │
│ /api/openai/    │
│ realtime-client-│
│    secret       │
└────────┬────────┘
         │
         │ 2. POST /v1/realtime/client_secrets
         ▼
┌─────────────────┐
│  OpenAI API     │
│   (Backend)     │
└────────┬────────┘
         │
         │ 3. Return ephemeral token
         ▼
┌─────────────────┐
│  RealtimeSession│ ◄─── 4. WebRTC Connection
│   (Agents SDK)  │
└─────────────────┘
         │
         │ 5. Audio streaming & events
         ▼
┌─────────────────┐
│   User + AI     │
│  Conversation   │
└─────────────────┘
```

**Flow:**
1. Client requests ephemeral client secret from Next.js API route
2. API route calls OpenAI `/v1/realtime/client_secrets` with API key
3. OpenAI returns temporary token (expires in ~60 seconds)
4. Client uses token to establish WebRTC connection via `RealtimeSession`
5. Bidirectional audio streaming begins

**Security:** API key stays on server, client only gets temporary token.

---

## Prerequisites

- **Node.js** 18+ with Next.js 14+
- **OpenAI API Key** with Realtime API access
- **HTTPS** (required in production for microphone access)
- **Modern browser** with WebRTC support (Chrome, Edge, Firefox, Safari)
- **Audio hardware:**
  - Working microphone
  - Headphones/earphones (⚠️ **CRITICAL** - see [Troubleshooting](#audio-feedback-issues))

---

## Step 1: Install Dependencies

Install the OpenAI Agents SDK:

```bash
npm install @openai/agents
```

**Package versions used:**
- `@openai/agents`: Latest (2025-01)
- `next`: 15.5.6
- `react`: 19.x

---

## Step 2: Create API Route for Client Secret

Create `/src/app/api/openai/realtime-client-secret/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

// Default system instructions for the AI
const DEFAULT_INSTRUCTIONS = `You are a helpful AI assistant.
Speak clearly and naturally. Be concise and friendly.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Parse request body for custom configuration
    const body = await request.json().catch(() => ({}));
    const {
      voice = "verse", // Options: alloy, echo, fable, onyx, nova, shimmer, verse
      instructions = DEFAULT_INSTRUCTIONS,
    } = body;

    // Build session configuration for GA API
    // IMPORTANT: Only basic parameters supported when creating client secrets
    // Advanced config (turn_detection, transcription) must be set via SDK after connection
    const sessionConfig = {
      session: {
        type: "realtime" as const,
        model: "gpt-realtime",
        audio: {
          output: { voice },
        },
        instructions,
      },
    };

    // Call OpenAI GA API to generate client secret
    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionConfig),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI Realtime API Error:", error);
      return NextResponse.json(
        { error: "Failed to create realtime session", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the client secret and configuration
    return NextResponse.json({
      clientSecret: data.value,
      expiresAt: data.expires_at,
      model: "gpt-realtime",
      voice,
    });
  } catch (error) {
    console.error("Realtime Client Secret Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Key Points:**

1. **Only basic parameters allowed** in `/v1/realtime/client_secrets`:
   - ✅ `type`, `model`, `audio.output.voice`, `instructions`
   - ❌ `turn_detection`, `temperature`, `max_output_tokens`

2. **Advanced configs** must be set via SDK after connection (see Step 3)

3. **Environment variable:** `OPENAI_API_KEY` must be set in `.env.local`

---

## Step 3: Create Realtime Component

Create `/src/components/test/realtime-test.tsx`:

### 3.1 Imports and Types

```typescript
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Mic,
  Play,
  Square,
  Loader2,
  MessageSquare,
  Settings,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface DebugEvent {
  type: string;
  timestamp: Date;
  data: unknown;
}

const VOICE_OPTIONS = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
  { value: "verse", label: "Verse (Default)" },
];

const DEFAULT_INSTRUCTIONS = `You are a helpful AI assistant.
Speak clearly and naturally. Be concise and friendly.`;
```

### 3.2 Component State

```typescript
export function RealtimeTest() {
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Conversation state
  const [messages, setMessages] = useState<Message[]>([]);
  const [debugEvents, setDebugEvents] = useState<DebugEvent[]>([]);

  // Configuration state
  const [voice, setVoice] = useState("verse");
  const [instructions, setInstructions] = useState("");

  // Refs
  const sessionRef = useRef<RealtimeSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const debugEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    scrollToBottom(debugEndRef);
  }, [debugEvents, scrollToBottom]);

  // Add debug event
  const addDebugEvent = useCallback((type: string, data: unknown) => {
    console.log(`[RealtimeTest] ${type}:`, data);
    setDebugEvents((prev) => [
      ...prev.slice(-50), // Keep last 50 events
      { type, timestamp: new Date(), data },
    ]);
  }, []);
```

### 3.3 Fetch Client Secret

```typescript
  // Fetch client secret from API
  const fetchClientSecret = async () => {
    try {
      addDebugEvent("API_CALL", "Fetching client secret...");
      const response = await fetch("/api/openai/realtime-client-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voice,
          instructions: instructions || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch client secret");
      }

      const data = await response.json();
      addDebugEvent("CLIENT_SECRET_RECEIVED", {
        voice: data.voice,
        model: data.model,
        expiresAt: data.expiresAt,
      });

      return data.clientSecret;
    } catch (error) {
      addDebugEvent("ERROR", { message: (error as Error).message });
      throw error;
    }
  };
```

### 3.4 Start Session (⚠️ CRITICAL)

```typescript
  // Start session
  const startSession = async () => {
    try {
      setIsConnecting(true);
      addDebugEvent("SESSION_START", "Initializing session...");

      // Get client secret
      const secret = await fetchClientSecret();

      // Create agent
      const agent = new RealtimeAgent({
        name: "AI Assistant",
        instructions: instructions || DEFAULT_INSTRUCTIONS,
      });

      // Create session with explicit config
      // IMPORTANT: GA API uses semantic_vad by default
      const session = new RealtimeSession(agent, {
        transport: "webrtc", // Use WebRTC for low latency
        config: {
          // Enable audio input transcription for debugging
          audio: {
            input: {
              transcription: {
                model: "gpt-4o-mini-transcribe",
              },
            },
          },
          // VAD configuration (may be overridden by server to semantic_vad)
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500,
          },
        },
      });
      sessionRef.current = session;

      // Set up event listeners BEFORE connecting
      session.on("history_added", (item) => {
        addDebugEvent("HISTORY_ADDED", item);

        const role = item.type === "message" && item.role === "user" ? "user" : "assistant";

        let content = "[Audio]";
        if (item.type === "message" && item.content) {
          const textContent = item.content.find((c: unknown) => {
            const content = c as Record<string, unknown>;
            return content.type === "input_text" || content.type === "text";
          });
          if (textContent && typeof textContent === "object" && "text" in textContent) {
            content = (textContent as { text: string }).text;
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            role,
            content,
            timestamp: new Date(),
          },
        ]);
      });

      session.on("history_updated", (history) => {
        addDebugEvent("HISTORY_UPDATED", { itemCount: history.length });
      });

      session.on("agent_start", (context, agent) => {
        addDebugEvent("AGENT_START", { agentName: agent.name });
      });

      session.on("agent_end", (context, agent, output) => {
        addDebugEvent("AGENT_END", { agentName: agent.name, output });
      });

      session.on("audio_start", (context, agent) => {
        addDebugEvent("AUDIO_START", { agentName: agent.name });
      });

      session.on("audio_stopped", (context, agent) => {
        addDebugEvent("AUDIO_STOPPED", { agentName: agent.name });
      });

      session.on("error", (error) => {
        addDebugEvent("ERROR", error);
        toast.error(`Session error: ${JSON.stringify(error)}`);
      });

      // CRITICAL: Monitor ALL transport events for debugging
      session.on("transport_event", (event) => {
        addDebugEvent("TRANSPORT_EVENT", { type: event.type, data: event });

        // Detect user speech
        if (event.type === "input_audio_buffer.speech_started") {
          addDebugEvent("USER_SPEECH_STARTED", "User started speaking");
          setIsSpeaking(true);
        } else if (event.type === "input_audio_buffer.speech_stopped") {
          addDebugEvent("USER_SPEECH_STOPPED", "User stopped speaking");
          setIsSpeaking(false);
        } else if (event.type === "input_audio_buffer.committed") {
          addDebugEvent("USER_AUDIO_COMMITTED", "User audio committed");
        } else if (event.type === "input_audio_buffer.append") {
          // ⚠️ CRITICAL: This confirms audio is being received from microphone
          addDebugEvent("AUDIO_INPUT_RECEIVED", "Audio data received from microphone");
        } else if (event.type === "conversation.item.input_audio_transcription.completed") {
          addDebugEvent("USER_TRANSCRIPTION_COMPLETE", event.data);
        } else if (event.type === "response.created") {
          addDebugEvent("RESPONSE_CREATED", "AI response created");
        } else if (event.type === "response.done") {
          addDebugEvent("RESPONSE_DONE", "AI response done");
        }
      });

      // Connect to OpenAI
      addDebugEvent("CONNECTING", "Establishing WebRTC connection...");

      // CRITICAL: Check microphone permissions BEFORE connecting
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        addDebugEvent("MICROPHONE_PERMISSION", "Microphone access granted");
        // Stop test stream - SDK will create its own
        stream.getTracks().forEach(track => track.stop());
      } catch (micError) {
        addDebugEvent("MICROPHONE_ERROR", micError);
        throw new Error("Microphone permission denied. Please allow microphone access.");
      }

      await session.connect({ apiKey: secret });

      addDebugEvent("CONNECTED", "Session connected successfully");

      // Log transport info
      addDebugEvent("TRANSPORT_INFO", {
        type: "webrtc",
        muted: session.muted,
      });

      // IMPORTANT: SDK may override initial config
      // Re-apply agent configuration after connection
      addDebugEvent("UPDATING_AGENT", "Re-applying agent configuration...");

      const updatedAgent = new RealtimeAgent({
        name: "AI Assistant",
        instructions: instructions || DEFAULT_INSTRUCTIONS,
      });

      await session.updateAgent(updatedAgent);

      addDebugEvent("AGENT_UPDATED", "Agent configuration applied");

      // Check if session is muted and unmute if necessary
      addDebugEvent("CHECKING_MUTE_STATUS", { muted: session.muted });

      if (session.muted) {
        addDebugEvent("UNMUTING_SESSION", "Session is muted, unmuting...");
        session.muted = false;
        addDebugEvent("SESSION_UNMUTED", { muted: session.muted });
      }

      // Verify session is ready
      addDebugEvent("SESSION_READY", {
        historyLength: session.history.length,
        currentAgent: session.currentAgent.name,
      });

      // CRITICAL: Send initial message to trigger AI greeting
      addDebugEvent("SENDING_INITIAL_MESSAGE", "Triggering initial AI greeting...");

      // SDK accepts simple string for user messages
      session.sendMessage("Hello! I'm ready to start our conversation.");

      setIsSessionActive(true);
      setIsConnecting(false);
      toast.success("Session started! The AI will greet you, then you can speak.");
    } catch (error) {
      addDebugEvent("CONNECTION_ERROR", (error as Error).message);
      setIsConnecting(false);
      toast.error(`Failed to start session: ${(error as Error).message}`);
    }
  };
```

### 3.5 Stop Session and Utilities

```typescript
  // Stop session
  const stopSession = async () => {
    try {
      addDebugEvent("SESSION_STOP", "Stopping session...");

      if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
      }

      setIsSessionActive(false);
      addDebugEvent("DISCONNECTED", "Session stopped");
      toast.info("Session ended");
    } catch (error) {
      addDebugEvent("DISCONNECT_ERROR", (error as Error).message);
      toast.error("Failed to stop session");
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setDebugEvents([]);
    addDebugEvent("CLEARED", "Conversation and debug logs cleared");
  };

  // Manual response trigger (fallback if VAD doesn't work)
  const triggerResponse = () => {
    if (!sessionRef.current || !isSessionActive) {
      toast.error("No active session");
      return;
    }

    try {
      addDebugEvent("MANUAL_RESPONSE_TRIGGER", "Manually triggering AI response...");
      sessionRef.current.createResponse();
      toast.info("Triggered AI response");
    } catch (error) {
      addDebugEvent("MANUAL_TRIGGER_ERROR", (error as Error).message);
      toast.error("Failed to trigger response");
    }
  };
```

### 3.6 UI Component (Basic Structure)

```typescript
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Conversation Panel */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Voice Session Controls</CardTitle>
            <CardDescription>
              Start a real-time voice conversation with the AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <Badge variant={isSessionActive ? "default" : "secondary"}>
                {isSessionActive ? "🟢 Connected" : "⚪ Not Connected"}
              </Badge>
              {isSpeaking && (
                <Badge variant="outline" className="animate-pulse">
                  🎤 Speaking...
                </Badge>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3">
              {!isSessionActive ? (
                <Button
                  onClick={startSession}
                  disabled={isConnecting}
                  size="lg"
                >
                  {isConnecting ? "Connecting..." : "Start Session"}
                </Button>
              ) : (
                <>
                  <Button onClick={stopSession} variant="destructive" size="lg">
                    Stop Session
                  </Button>
                  <Button onClick={triggerResponse} variant="secondary" size="lg">
                    Force AI Response
                  </Button>
                </>
              )}
              <Button
                onClick={clearConversation}
                variant="outline"
                size="lg"
                disabled={isSessionActive}
              >
                Clear History
              </Button>
            </div>

            {/* Usage Instructions */}
            {isSessionActive && (
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium mb-2">🎤 Session Active</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Speak clearly into your microphone for 3-5 seconds</li>
                  <li>System uses semantic VAD - waits for natural pauses</li>
                  <li>Watch Debug tab for "AUDIO_INPUT_RECEIVED"</li>
                  <li>If auto-detection fails, click "Force AI Response"</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversation Transcript */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  No messages yet. Start a session to begin.
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold">
                            {msg.role === "user" ? "You" : "AI"}
                          </span>
                          <span className="text-xs opacity-70">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Debug Panel */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Debug Events</CardTitle>
            <CardDescription>Real-time event log (last 50)</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {debugEvents.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No events yet</p>
              ) : (
                <div className="space-y-2 font-mono text-xs">
                  {debugEvents.map((event, idx) => (
                    <div key={idx} className="p-2 bg-muted rounded border">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-[10px]">
                          {event.type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground break-all">
                        {JSON.stringify(event.data, null, 2)}
                      </div>
                    </div>
                  ))}
                  <div ref={debugEndRef} />
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Step 4: Create Test Page

Create `/src/app/(main)/test-realtime/page.tsx`:

```typescript
"use client";

import { RealtimeTest } from "@/components/test/realtime-test";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic } from "lucide-react";

export default function TestRealtimePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Mic className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary">
                Realtime Voice Test
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                OpenAI Realtime API with Agents SDK
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary">OpenAI Agents SDK</Badge>
            <Badge variant="outline">GA API</Badge>
            <Badge variant="outline">gpt-realtime</Badge>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">About This Test</CardTitle>
            <CardDescription>
              This page demonstrates OpenAI Realtime API integration.
              Click "Start Session" to begin a voice conversation with the AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-24">Features:</span>
              <span className="text-muted-foreground">
                Real-time voice conversation, transcript history, debug logs, parameter controls
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-24">Requirements:</span>
              <span className="text-muted-foreground">
                Microphone access required. Use headphones to prevent audio feedback.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Realtime Test Component */}
        <RealtimeTest />
      </div>
    </div>
  );
}
```

---

## Key Configuration Details

### Voice Activity Detection (VAD)

OpenAI GA API supports two VAD types:

1. **`server_vad`** (Traditional)
   - Detects silence duration
   - Faster response time
   - May cut off speech prematurely

2. **`semantic_vad`** (Default in GA API) ✅
   - Waits for semantic/natural pauses
   - Better for natural conversation
   - Slightly longer response time

**Configuration:**

```typescript
turn_detection: {
  type: "server_vad",
  threshold: 0.5,           // 0.3 = more sensitive, 0.7 = less sensitive
  prefix_padding_ms: 300,   // Audio buffer before speech
  silence_duration_ms: 500, // Silence time to trigger end
}
```

**Note:** The server may override this to `semantic_vad` in GA API. This is expected and works well.

### Audio Transcription

Enable transcription for debugging:

```typescript
audio: {
  input: {
    transcription: {
      model: "gpt-4o-mini-transcribe",
    },
  },
}
```

### Transport Options

- **`webrtc`** (Recommended) - Low latency, better audio quality
- **`websocket`** - Fallback option, higher latency

---

## Critical Implementation Notes

### ⚠️ 1. Event Listeners MUST Be Set Before `connect()`

```typescript
// ❌ WRONG - Events set after connection
await session.connect({ apiKey: secret });
session.on("transport_event", handleEvent); // May miss early events

// ✅ CORRECT - Events set before connection
session.on("transport_event", handleEvent);
await session.connect({ apiKey: secret });
```

### ⚠️ 2. Microphone Permission Check

Always check microphone permission before connecting:

```typescript
try {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach(track => track.stop());
} catch (error) {
  throw new Error("Microphone permission denied");
}
```

### ⚠️ 3. Re-apply Agent Configuration After Connection

The SDK may send `session.update` events that override initial config:

```typescript
await session.connect({ apiKey: secret });

// IMPORTANT: Re-apply agent configuration
const updatedAgent = new RealtimeAgent({
  name: "AI Assistant",
  instructions: FULL_INSTRUCTIONS,
});

await session.updateAgent(updatedAgent);
```

### ⚠️ 4. Initial Message to Trigger Conversation

Send an initial message to trigger the first AI response:

```typescript
session.sendMessage("Hello! I'm ready to start our conversation.");
```

### ⚠️ 5. Monitor `input_audio_buffer.append` Events

This is the **MOST CRITICAL** diagnostic event:

```typescript
if (event.type === "input_audio_buffer.append") {
  // ✅ Microphone is working and audio is being sent
  console.log("Audio input confirmed");
}
```

If you don't see this event:
- Microphone is not accessible
- Browser permissions not granted
- WebRTC connection failed

---

## Troubleshooting Guide

### Issue: No AI Response After Speaking

**Symptoms:**
- AI greets you initially
- You speak but AI doesn't respond
- No `USER_SPEECH_STARTED` events in debug log

**Diagnosis Steps:**

1. **Check for `AUDIO_INPUT_RECEIVED` events:**
   ```
   ✅ Events present → Microphone working, VAD issue
   ❌ No events → Microphone/WebRTC problem
   ```

2. **If no audio input events:**
   - Check browser console for microphone errors
   - Verify microphone permissions in browser settings
   - Try different browser (Chrome/Edge recommended)
   - Check system audio input settings

3. **If audio input events exist but no VAD detection:**
   - Speak louder and more clearly
   - Speak for longer (3-5 seconds minimum)
   - Use complete sentences
   - Click "Force AI Response" button after speaking

**Solution:**
- Use headphones/earphones (prevents audio feedback)
- Speak complete sentences with natural pauses
- Ensure microphone is not muted in system settings
- Try adjusting `threshold` value (lower = more sensitive)

### Issue: Audio Feedback/Echo

**Symptoms:**
- AI hears its own voice
- Infinite conversation loop
- Multiple responses to single input

**Solution:**
- **✅ ALWAYS use headphones or earphones**
- Mute system speakers
- Use push-to-talk (Force AI Response button)

### Issue: `session.sendClientEvent is not a function`

**Cause:** Using incorrect SDK method

**Solution:** Do NOT use `sendClientEvent()`. It doesn't exist in Agents SDK.

For session updates, use:
```typescript
await session.updateAgent(newAgent);
```

### Issue: Connection Fails with 400 Error

**Common Errors:**

1. **"Unknown parameter: 'temperature'"**
   - **Cause:** Trying to set `temperature` in API route
   - **Fix:** Remove from `sessionConfig` - not supported in `/v1/realtime/client_secrets`

2. **"Unknown parameter: 'turn_detection'"**
   - **Cause:** Trying to set `turn_detection` in API route
   - **Fix:** Move to SDK config in `RealtimeSession` constructor

3. **"Invalid API key"**
   - **Cause:** `OPENAI_API_KEY` not set or incorrect
   - **Fix:** Check `.env.local` file

### Issue: Session Connects but No Audio Playback

**Symptoms:**
- Debug shows `AUDIO_START` events
- Transcript appears
- No sound from speakers

**Solutions:**
- Check browser audio permissions
- Verify system volume is not muted
- Try different browser
- Check browser console for Web Audio API errors

---

## Best Practices

### 1. Event Logging

Always log ALL transport events during development:

```typescript
session.on("transport_event", (event) => {
  console.log(`[Transport] ${event.type}:`, event);

  // Store in debug state for UI display
  addDebugEvent("TRANSPORT_EVENT", { type: event.type, data: event });
});
```

### 2. Error Handling

Wrap all async operations in try-catch:

```typescript
try {
  await session.connect({ apiKey: secret });
} catch (error) {
  console.error("Connection failed:", error);
  addDebugEvent("CONNECTION_ERROR", error);
  toast.error(`Failed to connect: ${error.message}`);
}
```

### 3. Cleanup

Always close session on component unmount:

```typescript
useEffect(() => {
  return () => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }
  };
}, []);
```

### 4. User Feedback

Provide clear visual feedback for all states:

```typescript
{isSessionActive && (
  <Badge variant="default">🟢 Connected</Badge>
)}

{isSpeaking && (
  <Badge variant="outline" className="animate-pulse">
    🎤 Speaking...
  </Badge>
)}
```

### 5. Manual Fallback

Always provide manual trigger button as fallback:

```typescript
<Button onClick={triggerResponse}>
  Force AI Response
</Button>
```

---

## Common Pitfalls

### ❌ 1. Setting Advanced Config in API Route

```typescript
// ❌ WRONG - Will return 400 error
const sessionConfig = {
  session: {
    type: "realtime",
    model: "gpt-realtime",
    turn_detection: { /* ... */ }, // Not supported in /client_secrets
    temperature: 0.7,              // Not supported in /client_secrets
  },
};
```

```typescript
// ✅ CORRECT - Only basic params
const sessionConfig = {
  session: {
    type: "realtime",
    model: "gpt-realtime",
    audio: { output: { voice } },
    instructions,
  },
};
```

### ❌ 2. Not Using Headphones

**Problem:** AI hears its own output through microphone → infinite loop

**Solution:** Always use headphones during testing and in production

### ❌ 3. Forgetting Microphone Permissions

```typescript
// ❌ WRONG - No permission check
await session.connect({ apiKey: secret });

// ✅ CORRECT - Check first
await navigator.mediaDevices.getUserMedia({ audio: true });
await session.connect({ apiKey: secret });
```

### ❌ 4. Not Monitoring Audio Input

```typescript
// ❌ WRONG - No diagnostic for audio input
session.on("transport_event", (event) => {
  if (event.type === "response.created") {
    console.log("Response created");
  }
});

// ✅ CORRECT - Monitor audio input
session.on("transport_event", (event) => {
  if (event.type === "input_audio_buffer.append") {
    console.log("✅ Audio input confirmed");
  }
  if (event.type === "response.created") {
    console.log("Response created");
  }
});
```

### ❌ 5. Expecting Instant Response

**Problem:** User speaks 1 word and expects immediate response

**Reality:** Semantic VAD waits for natural pause (2-3 seconds of silence)

**Solution:** Educate users or use manual trigger button

---

## Expected Event Flow

### Successful Session Flow

```
SESSION_START
  ↓
API_CALL
  ↓
CLIENT_SECRET_RECEIVED
  ↓
CONNECTING
  ↓
MICROPHONE_PERMISSION ✅
  ↓
CONNECTED ✅
  ↓
UPDATING_AGENT
  ↓
AGENT_UPDATED ✅
  ↓
SESSION_READY ✅
  ↓
SENDING_INITIAL_MESSAGE
  ↓
[AI Response]
  ↓
RESPONSE_CREATED
  ↓
AGENT_START
  ↓
AUDIO_START
  ↓
HISTORY_ADDED
  ↓
AUDIO_STOPPED
  ↓
AGENT_END
  ↓
[User Speaks]
  ↓
AUDIO_INPUT_RECEIVED 👈 CRITICAL
  ↓
USER_SPEECH_STARTED
  ↓
USER_SPEECH_STOPPED
  ↓
USER_AUDIO_COMMITTED
  ↓
RESPONSE_CREATED
  ↓
[Repeat conversation cycle]
```

### Debugging Checklist

1. ✅ `MICROPHONE_PERMISSION` - Browser has mic access
2. ✅ `CONNECTED` - WebRTC connection established
3. ✅ `AGENT_UPDATED` - Configuration applied
4. ✅ `SENDING_INITIAL_MESSAGE` - Initial trigger sent
5. ✅ `AUDIO_INPUT_RECEIVED` - Mic audio being sent (MOST CRITICAL)
6. ✅ `USER_SPEECH_STARTED` - VAD detected speech
7. ✅ `RESPONSE_CREATED` - AI generating response

---

## Environment Variables

Required in `.env.local`:

```bash
# OpenAI API Key (required)
OPENAI_API_KEY=sk-proj-...

# Optional: API base URL (if using proxy)
# OPENAI_API_BASE=https://api.openai.com/v1
```

---

## Browser Compatibility

| Browser | WebRTC Support | Tested |
|---------|---------------|--------|
| Chrome 90+ | ✅ Full | ✅ Yes |
| Edge 90+ | ✅ Full | ✅ Yes |
| Firefox 88+ | ✅ Full | ⚠️ Partial |
| Safari 15+ | ✅ Full | ⚠️ Partial |
| Mobile Chrome | ✅ Full | ❌ No |
| Mobile Safari | ⚠️ Limited | ❌ No |

**Recommendation:** Use Chrome or Edge for best experience.

---

## Production Deployment

### Required Changes

1. **HTTPS Required:**
   - Browser APIs require HTTPS for microphone access
   - Use Vercel/Netlify for automatic HTTPS

2. **Environment Variables:**
   - Set `OPENAI_API_KEY` in production environment
   - Never expose API key to client

3. **Rate Limiting:**
   - Consider adding rate limiting to API route
   - Monitor OpenAI API usage

4. **Error Monitoring:**
   - Add error tracking (Sentry, etc.)
   - Log failed sessions for debugging

5. **User Instructions:**
   - Provide clear onboarding for microphone permissions
   - Show visual feedback for all states
   - Include troubleshooting guide in UI

---

## Cost Considerations

**OpenAI Realtime API Pricing (as of 2025-01):**
- Input audio: ~$0.06 per minute
- Output audio: ~$0.24 per minute
- Transcription: ~$0.01 per minute

**Cost-Saving Tips:**
- Implement session timeouts (5-10 minutes)
- Add user confirmation before starting session
- Monitor usage via OpenAI dashboard
- Consider caching common responses

---

## Next Steps

After implementing basic functionality:

1. **Add User Authentication**
   - Track usage per user
   - Implement session limits

2. **Enhance UI**
   - Add voice activity visualization
   - Show real-time transcription
   - Add conversation export

3. **Advanced Features**
   - Custom functions/tools
   - Multi-turn conversation context
   - Voice clone integration
   - Language selection

4. **Analytics**
   - Track conversation quality
   - Monitor success/failure rates
   - User satisfaction metrics

---

## Resources

- [OpenAI Realtime API Docs](https://platform.openai.com/docs/guides/realtime)
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-sdk)
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## Changelog

### 2025-10-23 - Initial Release
- Complete implementation guide
- Tested and verified working
- Added comprehensive troubleshooting section
- Documented all critical issues and solutions

---

## Support

If you encounter issues not covered in this guide:

1. Check Debug events tab for specific error messages
2. Review browser console for JavaScript errors
3. Verify all environment variables are set
4. Test with different browser/device
5. Check OpenAI API status page

---

## Credits

This guide is based on production implementation in the NZCEL Prep application.

**Key Learnings:**
- Semantic VAD is default in GA API (and works well)
- Headphones are CRITICAL to prevent feedback
- `AUDIO_INPUT_RECEIVED` event is the key diagnostic
- Manual trigger button is essential fallback
- Event listeners must be set before connection

---

**End of Guide**

This guide should enable you to implement OpenAI Realtime API voice conversations in any Next.js project. Follow the steps carefully, pay attention to the critical notes, and use the troubleshooting guide when issues arise.

Good luck! 🎉
