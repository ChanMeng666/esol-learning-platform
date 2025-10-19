"use client";

import { Play, Pause, RotateCcw, Volume2, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  audioUrl?: string;
  showTranscript?: boolean;
  transcript?: string;
  className?: string;
}

export function AudioPlayer({
  audioUrl,
  showTranscript = false,
  transcript,
  className,
}: AudioPlayerProps) {
  const {
    state,
    isLoading,
    error,
    togglePlay,
    seek,
    setPlaybackRate,
    reset,
  } = useAudioPlayback(audioUrl);

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
        <p className="text-destructive text-sm">
          {error}. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (!audioUrl) {
    return (
      <div className="bg-muted rounded-lg p-4 text-center">
        <p className="text-muted-foreground text-sm">
          No audio available for this question.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("bg-card border rounded-lg p-4 space-y-4", className)}>
      {/* Audio Controls */}
      <div className="space-y-3">
        {/* Play/Pause and Reset */}
        <div className="flex items-center gap-3">
          <Button
            onClick={togglePlay}
            disabled={isLoading}
            size="lg"
            className="h-12 w-12 rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : state.isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          <Button
            onClick={reset}
            variant="outline"
            size="sm"
            disabled={isLoading || state.currentTime === 0}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <div className="flex-1" />

          {/* Time Display */}
          <div className="text-sm text-muted-foreground font-mono">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </div>
        </div>

        {/* Progress Slider */}
        <div className="space-y-2">
          <Slider
            value={[state.currentTime]}
            max={state.duration || 100}
            step={0.1}
            onValueChange={(value) => seek(value[0])}
            disabled={isLoading}
            className="cursor-pointer"
          />
        </div>

        {/* Playback Speed Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Speed:</span>
            <div className="flex gap-1">
              {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                <Button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  variant={state.playbackRate === rate ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                >
                  {rate}x
                </Button>
              ))}
            </div>
          </div>

          {/* Playback Status */}
          {state.hasPlayed && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Played
            </div>
          )}
        </div>
      </div>

      {/* Transcript (shown if allowed and hasPlayed) */}
      {showTranscript && transcript && state.hasPlayed && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Transcript:</span>
          </div>
          <div className="bg-muted/50 rounded-md p-3 text-sm leading-relaxed">
            {transcript}
          </div>
        </div>
      )}

      {/* Hint to play audio first */}
      {showTranscript && transcript && !state.hasPlayed && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>Play audio first to view transcript</span>
          </div>
        </div>
      )}
    </div>
  );
}
