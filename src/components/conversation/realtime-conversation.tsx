"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, X, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import type { ConversationScenario } from "@/types";

interface RealtimeConversationProps {
  scenario: ConversationScenario;
  onEnd: () => void;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export function RealtimeConversation({ scenario, onEnd }: RealtimeConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldProcessRef = useRef(false);

  const { state, startRecording, stopRecording, reset } = useVoiceRecorder();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const speakText = useCallback(async (text: string) => {
    if (isMuted) return;

    try {
      console.log("[RealtimeConversation] 🔊 Generating speech for:", text.substring(0, 50) + "...");

      const response = await fetch("/api/openai/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.warn("[RealtimeConversation] ⚠️ TTS failed, skipping audio playback");
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      console.log("[RealtimeConversation] ✅ Playing AI speech");
    } catch (error) {
      console.warn("[RealtimeConversation] ⚠️ Failed to play speech:", error);
      // Don't show error to user - text is still displayed
    }
  }, [isMuted]);

  const processUserSpeech = useCallback(async () => {
    if (!state.audioBlob) {
      console.log("[RealtimeConversation] ⚠️ No audio blob to process");
      toast.error("No audio recorded. Please try again.");
      return;
    }

    console.log("[RealtimeConversation] 🔄 Processing user speech...");
    console.log("[RealtimeConversation] Audio blob size:", state.audioBlob.size);
    setIsProcessing(true);

    try {
      // 1. Transcribe user's speech
      toast.info("Transcribing your speech...");
      console.log("[RealtimeConversation] 📝 Transcribing audio...");

      const audioFile = new File([state.audioBlob], "recording.webm", {
        type: "audio/webm",
      });

      const formData = new FormData();
      formData.append("audio", audioFile);

      const transcribeResponse = await fetch("/api/openai/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeResponse.ok) {
        throw new Error("Transcription failed");
      }

      const { text: transcription } = await transcribeResponse.json();
      console.log("[RealtimeConversation] ✅ Transcription:", transcription);

      // Add user message to conversation
      const userMessage: Message = {
        role: "user",
        content: transcription,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      // 2. Generate AI response using GPT-4
      toast.info("AI is thinking...");
      console.log("[RealtimeConversation] 🤖 Generating AI response...");

      const conversationHistory = messages
        .filter(m => m.role !== "system")
        .map(m => ({
          role: m.role,
          content: m.content,
        }));

      conversationHistory.push({
        role: "user",
        content: transcription,
      });

      const aiResponse = await fetch("/api/openai/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are participating in a conversation practice scenario.
Scenario: ${scenario.title}
Context: ${scenario.context}
Your Role: ${scenario.aiRole}
User's Role: ${scenario.userRole}

Respond naturally as your character would. Keep responses conversational and appropriate for an NZCEL ${scenario.level} level learner. Focus on these topics: ${scenario.topics.join(", ")}.`,
            },
            ...conversationHistory,
          ],
        }),
      });

      if (!aiResponse.ok) {
        throw new Error("AI response failed");
      }

      const { response: aiText } = await aiResponse.json();
      console.log("[RealtimeConversation] ✅ AI response:", aiText);

      // Add AI message
      const aiMessage: Message = {
        role: "assistant",
        content: aiText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setTurnCount(prev => prev + 1);

      // Speak AI's response if not muted
      if (!isMuted) {
        speakText(aiText);
      }

      // Reset recording state
      reset();
      toast.success("Ready for your next response!");
    } catch (error) {
      console.error("[RealtimeConversation] ❌ Error processing speech:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process speech");
      reset();
    } finally {
      setIsProcessing(false);
    }
  }, [state.audioBlob, messages, scenario, isMuted, reset, speakText]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-process audio when recording stops
  useEffect(() => {
    if (shouldProcessRef.current && state.audioBlob && !state.isRecording) {
      console.log("[RealtimeConversation] 🎯 Auto-processing new audio blob");
      shouldProcessRef.current = false;
      processUserSpeech();
    }
  }, [state.audioBlob, state.isRecording, processUserSpeech]);

  // Initialize conversation
  useEffect(() => {
    console.log("[RealtimeConversation] 🎬 Initializing conversation...");
    console.log("[RealtimeConversation] Scenario:", scenario.title);

    // Add initial system message with scenario context
    setMessages([
      {
        role: "system",
        content: `Scenario: ${scenario.title}. Context: ${scenario.context}. You are playing the role of: ${scenario.aiRole}. The user is: ${scenario.userRole}.`,
        timestamp: new Date(),
      },
    ]);

    handleConnect();

    return () => {
      handleDisconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  const handleConnect = async () => {
    console.log("[RealtimeConversation] 🔌 Connecting to conversation server...");
    setConnectionStatus("connecting");
    toast.info("Preparing conversation...");

    // Check microphone availability
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone not supported in this browser");
      }

      console.log("[RealtimeConversation] ✅ Microphone API available");
      setIsConnected(true);
      setConnectionStatus("connected");
      toast.success("Ready! Click the microphone to speak.");

      // Add AI's initial message
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: scenario.initialPrompt,
          timestamp: new Date(),
        },
      ]);
      setTurnCount(1);
      console.log("[RealtimeConversation] Initial AI message added");

      // Speak AI's initial message if not muted
      if (!isMuted) {
        speakText(scenario.initialPrompt);
      }
    } catch (error) {
      console.error("[RealtimeConversation] ❌ Connection failed:", error);
      setConnectionStatus("error");
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };

  const handleDisconnect = () => {
    console.log("[RealtimeConversation] 🔌 Disconnecting...");
    setIsConnected(false);
    setConnectionStatus("idle");
    if (state.isRecording) {
      stopRecording();
    }
  };

  const handleToggleListen = async () => {
    console.log("[RealtimeConversation] 🎤 Toggle listen called. Connected:", isConnected, "Currently recording:", state.isRecording);

    if (!isConnected) {
      console.log("[RealtimeConversation] ❌ Not connected to server");
      toast.error("Not connected");
      return;
    }

    if (isProcessing) {
      console.log("[RealtimeConversation] ⚠️ Already processing, please wait");
      toast.error("Please wait for the current response to complete");
      return;
    }

    if (state.isRecording) {
      // Stop recording and mark for processing
      console.log("[RealtimeConversation] ⏹️ Stopping recording...");
      shouldProcessRef.current = true;
      stopRecording();
      // The useEffect will auto-process when audioBlob is ready
    } else {
      // Start recording
      console.log("[RealtimeConversation] ▶️ Starting recording...");
      try {
        await startRecording();
        toast.success("Listening... Click again when done speaking");
      } catch (error) {
        console.error("[RealtimeConversation] ❌ Failed to start recording:", error);
        toast.error("Failed to start recording. Please check microphone permissions.");
      }
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Unmuted AI voice" : "Muted AI voice");

    // Stop current audio if muting
    if (!isMuted && audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleEndConversation = () => {
    console.log("[RealtimeConversation] 🏁 Ending conversation. Turns:", turnCount);
    if (turnCount > 0) {
      toast.success(`Conversation ended. You completed ${turnCount} turns.`);
    }
    handleDisconnect();
    onEnd();
  };

  const progress = Math.min(100, (turnCount / scenario.targetTurns) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{scenario.title}</h1>
            <p className="text-muted-foreground text-sm">{scenario.context}</p>
          </div>
          <Button variant="ghost" onClick={handleEndConversation}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="font-medium">Conversation Progress</span>
              <Badge variant={turnCount >= scenario.targetTurns ? "default" : "secondary"}>
                {turnCount} / {scenario.targetTurns} turns
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <Card className="mb-6 h-[500px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Conversation</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  You: {scenario.userRole}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  AI: {scenario.aiRole}
                </Badge>
              </CardDescription>
            </div>
            <Badge
              variant={connectionStatus === "connected" ? "default" : "secondary"}
              className="text-xs"
            >
              {connectionStatus === "connected" ? "🟢 Connected" : "Connecting..."}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages
            .filter((m) => m.role !== "system")
            .map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">
                      {message.role === "user" ? "You" : "AI"}
                    </span>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">AI is responding...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleToggleMute}
              className="gap-2"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              {isMuted ? "Unmute AI" : "Mute AI"}
            </Button>

            <Button
              size="lg"
              className={`gap-2 px-8 ${state.isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : ""}`}
              onClick={handleToggleListen}
              disabled={!isConnected || isProcessing}
            >
              {state.isRecording ? (
                <>
                  <MicOff className="h-5 w-5" />
                  Stop Speaking
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  Start Speaking
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleEndConversation}
              className="gap-2"
            >
              <X className="h-5 w-5" />
              End Session
            </Button>
          </div>

          {/* Recording indicator */}
          {state.isRecording && (
            <div className="mt-4 flex items-center justify-center gap-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
              <div className="relative">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <div className="absolute inset-0 h-3 w-3 rounded-full bg-red-500 opacity-75 animate-ping" />
              </div>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                Recording... ({state.recordingDuration}s)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-6 bg-gradient-to-r from-accent to-muted/50 border-2 border-primary/30">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-sm">Tips for Success:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Click the microphone button and speak your response</li>
            <li>• Click again when you finish speaking to send your message</li>
            <li>• The AI will transcribe, respond, and speak back to you</li>
            <li>• Stay in character for your assigned role</li>
            <li>• Aim for {scenario.targetTurns} meaningful exchanges</li>
            <li>• Focus on: {scenario.topics.join(", ")}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
