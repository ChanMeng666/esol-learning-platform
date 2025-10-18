"use client";

import { Mic, Square, RotateCcw, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

export function VoiceRecorder({
  onRecordingComplete,
  maxDuration = 300, // 5 minutes default
  className,
}: VoiceRecorderProps) {
  const { state, startRecording, stopRecording, reset } = useVoiceRecorder();

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-stop at max duration
  if (state.isRecording && state.recordingDuration >= maxDuration) {
    stopRecording();
    if (state.audioBlob) {
      onRecordingComplete?.(state.audioBlob);
    }
  }

  const handleStartRecording = async () => {
    console.log("[VoiceRecorderComponent] 🔴 Start Recording button clicked");
    try {
      await startRecording();
      console.log("[VoiceRecorderComponent] ✅ Recording started successfully");
    } catch (error) {
      console.error("[VoiceRecorderComponent] ❌ Recording error:", error);
    }
  };

  const handleStopRecording = () => {
    console.log("[VoiceRecorderComponent] ⏹️ Stop Recording button clicked");
    stopRecording();
  };

  return (
    <Card className={cn("bg-card border", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6">
          {/* Recording indicator */}
          {state.isRecording && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-4 w-4 rounded-full bg-red-500 animate-pulse" />
                <div className="absolute inset-0 h-4 w-4 rounded-full bg-red-500 opacity-75 animate-ping" />
              </div>
              <span className="text-sm font-medium text-red-600">Recording...</span>
            </div>
          )}

          {/* Waveform visualization placeholder */}
          <div className="w-full h-24 bg-muted/30 rounded-lg flex items-center justify-center">
            {state.isRecording ? (
              <div className="flex items-end gap-1 h-16">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            ) : state.audioBlob ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="h-5 w-5" />
                Recording saved ({formatTime(state.recordingDuration)})
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Click the microphone to start recording
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="text-2xl font-mono font-semibold">
            {formatTime(state.recordingDuration)} / {formatTime(maxDuration)}
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-3">
            {!state.isRecording ? (
              <>
                <Button
                  onClick={handleStartRecording}
                  size="lg"
                  className="h-16 w-16 rounded-full"
                  disabled={state.isTranscribing || state.isAssessing}
                >
                  <Mic className="h-6 w-6" />
                </Button>

                {state.audioBlob && (
                  <Button
                    onClick={reset}
                    variant="outline"
                    size="sm"
                    disabled={state.isTranscribing || state.isAssessing}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={handleStopRecording}
                size="lg"
                variant="destructive"
                className="h-16 w-16 rounded-full"
              >
                <Square className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* Loading states */}
          {(state.isTranscribing || state.isAssessing) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {state.isTranscribing ? "Transcribing..." : "Assessing your response..."}
            </div>
          )}

          {/* Tips */}
          <div className="text-xs text-muted-foreground text-center max-w-md">
            💡 <strong>Tip:</strong> Speak clearly and at a natural pace. You can record multiple times
            until you&apos;re satisfied with your response.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
