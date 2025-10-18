"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
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
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    // Add initial system message with scenario context
    setMessages([
      {
        role: "system",
        content: `Scenario: ${scenario.title}. Context: ${scenario.context}. You are playing the role of: ${scenario.aiRole}. The user is: ${scenario.userRole}.`,
        timestamp: new Date(),
      },
    ]);

    // Simulate connection (in real implementation, this would connect to OpenAI Realtime API)
    handleConnect();

    return () => {
      // Cleanup on unmount
      handleDisconnect();
    };
  }, [scenario]);

  const handleConnect = async () => {
    setConnectionStatus("connecting");
    toast.info("Connecting to conversation server...");

    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus("connected");
      toast.success("Connected! You can start speaking.");

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
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsListening(false);
    setConnectionStatus("idle");
  };

  const handleToggleListen = () => {
    if (!isConnected) {
      toast.error("Not connected to server");
      return;
    }

    if (isListening) {
      // Stop listening
      setIsListening(false);
      toast.info("Stopped listening");
    } else {
      // Start listening
      setIsListening(true);
      toast.success("Listening... speak now");
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Unmuted AI voice" : "Muted AI voice");
  };

  // Simulate receiving a message (in real implementation, this would come from Realtime API)
  const simulateAIResponse = (userMessage: string) => {
    setTimeout(() => {
      const responses = [
        "That's an interesting point. Could you elaborate on that?",
        "I see. How does that relate to your main objective?",
        "Good question. Let me explain that in more detail...",
        "I understand your perspective. Have you considered alternative approaches?",
        "That makes sense. What challenges do you anticipate with this approach?",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: randomResponse,
          timestamp: new Date(),
        },
      ]);
      setTurnCount(prev => prev + 1);
    }, 1000);
  };

  // Simulate user message (in real implementation, this would come from speech recognition)
  const handleUserSpeak = () => {
    if (!isListening) return;

    const simulatedUserMessage = "This is a simulated user response from speech recognition.";

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: simulatedUserMessage,
        timestamp: new Date(),
      },
    ]);

    setIsListening(false);
    simulateAIResponse(simulatedUserMessage);
  };

  const handleEndConversation = () => {
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
              className={`gap-2 px-8 ${isListening ? "bg-red-600 hover:bg-red-700" : ""}`}
              onClick={handleToggleListen}
              disabled={!isConnected}
            >
              {isListening ? (
                <>
                  <MicOff className="h-5 w-5" />
                  Stop Speaking
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

          {/* Demo Note */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-xs text-blue-900 dark:text-blue-100">
              <strong>Demo Mode:</strong> This is a simulation. In the full implementation, this
              would connect to OpenAI&apos;s Realtime API for live voice conversation with
              speech-to-text and text-to-speech capabilities.
            </p>
          </div>

          {isListening && (
            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleUserSpeak}
                className="w-full"
              >
                Simulate Speech Input (Demo)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-6 bg-gradient-to-r from-accent to-muted/50 border-2 border-primary/30">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-sm">Tips for Success:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Speak clearly and at a natural pace</li>
            <li>• Stay in character for your assigned role</li>
            <li>• Aim for {scenario.targetTurns} meaningful exchanges</li>
            <li>• Focus on: {scenario.topics.join(", ")}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
