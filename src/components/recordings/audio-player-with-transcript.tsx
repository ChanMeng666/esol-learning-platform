"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  MessageSquare,
  User,
  Calendar,
  FileAudio,
} from "lucide-react";
import { toast } from "sonner";
import { markRecordingReviewed } from "@/actions/recordings";

interface AudioPlayerWithTranscriptProps {
  recording: {
    id: bigint;
    audioFile: {
      blobUrl: string;
      format: string;
      fileSize: number;
    };
    transcription?: {
      transcribedText: string;
      wordCount: number;
      model: string;
    };
    recordingType: string;
    recordedAt: Date;
    questionId?: string;
    metadata?: Record<string, unknown>;
    student?: {
      id: bigint;
      fullName: string;
      email: string;
    };
  };
  showFeedback?: boolean;
  onReviewComplete?: () => void;
}

export function AudioPlayerWithTranscript({
  recording,
  showFeedback = false,
  onReviewComplete,
}: AudioPlayerWithTranscriptProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // Check if already reviewed
    const metadata = recording.metadata as { teacherReviewed?: boolean; teacherFeedback?: string } | undefined;
    if (metadata?.teacherReviewed) {
      setIsReviewed(true);
      setFeedback(metadata.teacherFeedback || "");
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [recording]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
      audio.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audio.muted = false;
    }
  };

  const handleMarkReviewed = async () => {
    try {
      setIsSubmittingFeedback(true);
      await markRecordingReviewed(recording.id, feedback || undefined);
      setIsReviewed(true);
      toast.success("Recording marked as reviewed");
      if (onReviewComplete) {
        onReviewComplete();
      }
    } catch (error) {
      console.error("Error marking recording as reviewed:", error);
      toast.error("Failed to mark as reviewed");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileAudio className="w-5 h-5 text-primary" />
              <CardTitle>Student Recording</CardTitle>
              {isReviewed && (
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Reviewed
                </Badge>
              )}
            </div>
            <CardDescription>
              <div className="flex flex-col gap-1">
                {recording.student && (
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{recording.student.fullName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(recording.recordedAt).toLocaleString()}</span>
                </div>
                <Badge variant="outline" className="w-fit capitalize">
                  {recording.recordingType.replace("_", " ")}
                </Badge>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Player */}
        <div className="space-y-4">
          <audio ref={audioRef} src={recording.audioFile.blobUrl} preload="metadata" />

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRestart}
              disabled={!duration}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              variant="default"
              size="lg"
              onClick={togglePlayPause}
              disabled={!duration}
              className="flex-1 max-w-xs"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Play
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              disabled={!duration}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Transcript */}
        {recording.transcription && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-semibold">Transcript</h4>
              <Badge variant="outline" className="text-xs">
                {recording.transcription.wordCount} words
              </Badge>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">
                {recording.transcription.transcribedText}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Transcribed using {recording.transcription.model}
            </p>
          </div>
        )}

        {/* Teacher Feedback Section */}
        {showFeedback && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-semibold">Teacher Feedback</h4>
            </div>
            <Textarea
              placeholder="Add feedback for the student (optional)..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={isReviewed}
              rows={4}
              className="resize-none"
            />
            {!isReviewed && (
              <Button
                onClick={handleMarkReviewed}
                disabled={isSubmittingFeedback}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {isSubmittingFeedback ? "Saving..." : "Mark as Reviewed"}
              </Button>
            )}
            {isReviewed && feedback && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {feedback}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Recording Metadata */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 bg-muted rounded">
            <p className="text-muted-foreground text-xs">Format</p>
            <p className="font-medium uppercase">{recording.audioFile.format}</p>
          </div>
          <div className="p-2 bg-muted rounded">
            <p className="text-muted-foreground text-xs">File Size</p>
            <p className="font-medium">
              {(recording.audioFile.fileSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
