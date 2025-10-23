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
  AlertCircle,
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

// Default ESOL Speaking Coach instructions (same as in API route)
const DEFAULT_INSTRUCTIONS = `You are a realtime voice ESOL (English for Speakers of Other Languages) speaking coach. Your main goal is to help non-native English speakers practice and improve their speaking skills at their current CEFR level (A1–C2) through short, engaging, multi-turn, spoken conversations. Always deliver feedback and exercises following CEFR criteria—coherence, fluency, vocabulary, and accuracy—while keeping responses brief, supportive, and as close to natural conversation as possible.

Respond in a warm, friendly, energetic tone, and encourage the learner with every turn. Speak clearly and quickly, never keeping the learner waiting. Immediately stop talking (barge-in) if the user starts speaking.

# ESOL Speaking Coach Guidelines

- Always tailor questions and tasks to the user's current English CEFR level (A1–C2).
- After each user utterance, provide immediate, constructive spoken feedback (CEFR-aligned: coherence, fluency, range, accuracy) in 5–20 spoken words.
- Use simple, direct prompts for lower levels (A1–A2); more complex questions, paraphrasing tasks, or discussions for higher levels (B1–C2).
- Regularly encourage, correct gently, and reinforce user progress.
- If the user requests, summarize their current level or describe specific CEFR can-do descriptors for motivation.
- For all explanations or feedback exceeding 5 seconds, pause and offer: "Want more?" before continuing.
- If a tool can more accurately or quickly answer (grammar, vocabulary, pronunciation), briefly summarize its result.
- Never claim to be human or take physical actions.

# CEFR Level Reference (for your coaching):

- A1 (Beginner): Can use very basic phrases for immediate needs, introduce self/others, and ask/answer simple personal questions.
- A2 (Elementary): Can communicate in simple, routine tasks, describe immediate environment, routine matters, and give personal info.
- B1 (Intermediate): Can manage most situations when traveling, describe experiences, briefly explain plans, opinions, or events.
- B2 (Upper-Intermediate): Can interact with fluency/spontaneity, explain a viewpoint, discuss pros/cons, handle complex topics.
- C1 (Advanced): Can express ideas fluently, spontaneously, understand implied meanings, use language flexibly and effectively.
- C2 (Proficient): Can summarize from various sources, express precisely and effortlessly, with subtle distinctions in complex topics.

This prompt is for dynamic, adaptive, expert ESOL speaking practice using CEFR standards with spoken audio output.`;

/**
 * Core component for testing OpenAI Realtime API
 *
 * Features:
 * - Real-time voice conversation using Agents SDK
 * - Transcript history display
 * - Debug event logging
 * - Session parameter controls (voice, instructions, temperature)
 */
export function RealtimeTest() {
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [isTestingMic, setIsTestingMic] = useState(false);

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
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

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

  // Start session
  const startSession = async () => {
    try {
      setIsConnecting(true);
      addDebugEvent("SESSION_START", "Initializing session...");

      // Get client secret
      const secret = await fetchClientSecret();

      // Create agent
      const agent = new RealtimeAgent({
        name: "ESOL Coach",
        instructions: instructions || "You are a helpful ESOL speaking coach.",
      });

      // Create session with explicit config
      // Note: GA API uses semantic_vad by default, which is better for natural conversation
      const session = new RealtimeSession(agent, {
        transport: "webrtc", // Use WebRTC for better audio quality
        // Configure session parameters
        config: {
          // Enable audio input transcription for debugging
          audio: {
            input: {
              transcription: {
                model: "gpt-4o-mini-transcribe",
              },
            },
          },
          // Note: turn_detection config here may be overridden by server
          // The GA API prefers semantic_vad
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      });
      sessionRef.current = session;

      // Set up ALL event listeners for debugging
      session.on("history_added", (item) => {
        addDebugEvent("HISTORY_ADDED", item);

        // Determine role based on item type
        const role = item.type === "message" && item.role === "user" ? "user" : "assistant";

        // Extract content from the item
        let content = "[Audio]";
        if (item.type === "message" && item.content) {
          // Extract text from content array if available
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

      session.on("audio_interrupted", (context, agent) => {
        addDebugEvent("AUDIO_INTERRUPTED", { agentName: agent.name });
      });

      session.on("error", (error) => {
        addDebugEvent("ERROR", error);
        toast.error(`Session error: ${JSON.stringify(error)}`);
      });

      session.on("transport_event", (event) => {
        // Log ALL transport events for debugging
        addDebugEvent("TRANSPORT_EVENT", { type: event.type, data: event });

        // Detect user speech from transport events
        if (event.type === "input_audio_buffer.speech_started") {
          addDebugEvent("USER_SPEECH_STARTED", "User started speaking");
          setIsSpeaking(true);
        } else if (event.type === "input_audio_buffer.speech_stopped") {
          addDebugEvent("USER_SPEECH_STOPPED", "User stopped speaking");
          setIsSpeaking(false);
        } else if (event.type === "input_audio_buffer.committed") {
          addDebugEvent("USER_AUDIO_COMMITTED", "User audio committed");
        } else if (event.type === "input_audio_buffer.append") {
          // This event shows that audio is being received
          addDebugEvent("AUDIO_INPUT_RECEIVED", "Audio data received from microphone");
        } else if (event.type === "conversation.item.input_audio_transcription.completed") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          addDebugEvent("USER_TRANSCRIPTION_COMPLETE", (event as any).data);
        } else if (event.type === "response.created") {
          addDebugEvent("RESPONSE_CREATED", "AI response created");
        } else if (event.type === "response.done") {
          addDebugEvent("RESPONSE_DONE", "AI response done");
        }
      });

      // Connect to OpenAI
      addDebugEvent("CONNECTING", "Establishing WebRTC connection...");

      // Check microphone permissions first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        addDebugEvent("MICROPHONE_PERMISSION", "Microphone access granted");
        // Stop the test stream - the SDK will create its own
        stream.getTracks().forEach(track => track.stop());
      } catch (micError) {
        addDebugEvent("MICROPHONE_ERROR", micError);
        throw new Error("Microphone permission denied. Please allow microphone access.");
      }

      await session.connect({ apiKey: secret });

      addDebugEvent("CONNECTED", "Session connected successfully");

      // Log transport layer info
      addDebugEvent("TRANSPORT_INFO", {
        type: "webrtc",
        muted: session.muted,
      });

      // IMPORTANT: The SDK may override our initial config
      // We need to update the agent after connection to ensure our settings stick
      addDebugEvent("UPDATING_AGENT", "Re-applying agent configuration...");

      // Create a fresh agent with our desired config
      const updatedAgent = new RealtimeAgent({
        name: "ESOL Coach",
        instructions: instructions || DEFAULT_INSTRUCTIONS,
      });

      // Update the session with the new agent
      await session.updateAgent(updatedAgent);

      addDebugEvent("AGENT_UPDATED", "Agent configuration applied");

      // Verify the session is ready
      addDebugEvent("SESSION_READY", {
        historyLength: session.history.length,
        currentAgent: session.currentAgent.name,
      });

      //添加一个初始消息来触发对话
      addDebugEvent("SENDING_INITIAL_MESSAGE", "Triggering initial AI greeting...");

      // Send a simple text message to start the conversation
      // SDK accepts either a string or a properly formatted message object
      session.sendMessage("Hello! I'm ready to practice English conversation.");

      setIsSessionActive(true);
      setIsConnecting(false);
      toast.success("Session started! The AI will greet you, then you can speak.");
    } catch (error) {
      addDebugEvent("CONNECTION_ERROR", (error as Error).message);
      setIsConnecting(false);
      toast.error(`Failed to start session: ${(error as Error).message}`);
    }
  };

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

  // Manual push to talk - force AI to respond
  const triggerResponse = () => {
    if (!sessionRef.current || !isSessionActive) {
      toast.error("No active session");
      return;
    }

    try {
      addDebugEvent("MANUAL_RESPONSE_TRIGGER", "Manually triggering AI response...");
      // Create a response manually
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sessionRef.current as any).createResponse();
      toast.info("Triggered AI response");
    } catch (error) {
      addDebugEvent("MANUAL_TRIGGER_ERROR", (error as Error).message);
      toast.error("Failed to trigger response");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Conversation Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice Session Controls
            </CardTitle>
            <CardDescription>
              Start a real-time voice conversation with the AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
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

            {/* Buttons */}
            <div className="flex gap-3">
              {!isSessionActive ? (
                <Button
                  onClick={startSession}
                  disabled={isConnecting}
                  size="lg"
                  className="gap-2"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start Session
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={stopSession}
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                >
                  <Square className="h-5 w-5" />
                  Stop Session
                </Button>
              )}
              <Button
                onClick={clearConversation}
                variant="outline"
                size="lg"
                disabled={isSessionActive}
              >
                Clear History
              </Button>
              {isSessionActive && (
                <Button
                  onClick={triggerResponse}
                  variant="secondary"
                  size="lg"
                  className="gap-2"
                >
                  <Mic className="h-4 w-4" />
                  Force AI Response
                </Button>
              )}
            </div>

            {isSessionActive && (
              <div className="space-y-3">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-sm font-medium mb-2">🎤 Session Active - Ready to Listen</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Speak clearly into your microphone for 3-5 seconds</li>
                    <li>The system uses semantic VAD - it waits for natural pauses</li>
                    <li>Watch Debug tab for &quot;AUDIO_INPUT_RECEIVED&quot; to confirm mic is working</li>
                    <li>If auto-detection doesn&apos;t work, click &quot;Force AI Response&quot; after speaking</li>
                    <li>Expected events: AUDIO_INPUT_RECEIVED → USER_SPEECH_STARTED → USER_SPEECH_STOPPED</li>
                  </ul>
                </div>
                {isSpeaking && (
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 animate-pulse">
                    <p className="text-sm font-medium text-green-600">
                      🎙️ Listening... (Voice detected)
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversation Transcript */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation Transcript
            </CardTitle>
            <CardDescription>
              Real-time transcript of your conversation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No messages yet. Start a session to begin.</p>
                </div>
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
                            {msg.role === "user" ? "You" : "AI Coach"}
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

      {/* Settings & Debug Panel */}
      <div className="space-y-6">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="debug">
              <Terminal className="h-4 w-4 mr-2" />
              Debug
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Session Configuration</CardTitle>
                <CardDescription className="text-xs">
                  Configure before starting session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voice Selection */}
                <div className="space-y-2">
                  <Label htmlFor="voice-select">Voice</Label>
                  <Select
                    value={voice}
                    onValueChange={setVoice}
                    disabled={isSessionActive}
                  >
                    <SelectTrigger id="voice-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="instructions">
                    Custom Instructions (Optional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Leave empty to use default ESOL coach prompt..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={6}
                    disabled={isSessionActive}
                    className="text-xs font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Default prompt is ESOL Speaking Coach for CEFR practice
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Debug Tab */}
          <TabsContent value="debug">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Debug Events</CardTitle>
                <CardDescription className="text-xs">
                  Real-time event log (last 50 events)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {debugEvents.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      <Terminal className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p>No events yet</p>
                    </div>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
