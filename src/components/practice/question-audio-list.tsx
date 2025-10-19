"use client";

import { useState, useEffect } from "react";
import { Volume2, Calendar, BarChart3, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/history/empty-state";
import { AudioPlayer } from "@/components/audio/audio-player";
import { getUserQuestionAudioHistory } from "@/actions/audio";

interface QuestionAudioEntry {
  id: bigint;
  questionId: string;
  textContent: string;
  voiceModel: string;
  voiceName: string;
  generatedAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
  audioFile: {
    id: bigint;
    blobUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  } | null;
}

export function QuestionAudioList() {
  const [audioEntries, setAudioEntries] = useState<QuestionAudioEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAudioHistory();
  }, []);

  const loadAudioHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getUserQuestionAudioHistory({}, 50);
      console.log("[QuestionAudioList] Loaded audio entries:", data);
      setAudioEntries(data as QuestionAudioEntry[]);
    } catch (error) {
      console.error("[QuestionAudioList] Failed to load audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getVoiceDisplayName = (voiceName: string) => {
    const names: Record<string, string> = {
      alloy: "Alloy (Neutral)",
      echo: "Echo (Male)",
      fable: "Fable (British)",
      onyx: "Onyx (Deep)",
      nova: "Nova (Female)",
      shimmer: "Shimmer (Soft)",
    };
    return names[voiceName] || voiceName;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (audioEntries.length === 0) {
    return (
      <EmptyState
        icon={Volume2}
        title="No Question Audio Yet"
        description="Practice listening questions to build your audio library. Question audio will be saved automatically for you to review later."
        actionLabel="Start Practicing"
        onAction={() => window.location.href = "/practice"}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Question Audio Library</h2>
          <p className="text-sm text-muted-foreground">
            {audioEntries.length} audio file{audioEntries.length !== 1 ? "s" : ""} from your practice sessions
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAudioHistory}>
          Refresh
        </Button>
      </div>

      {audioEntries.map((entry) => (
          <Card key={entry.id.toString()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    Question {entry.questionId.substring(0, 8)}...
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(entry.generatedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      Played {entry.accessCount} times
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{getVoiceDisplayName(entry.voiceName)}</Badge>
                  <Badge variant="outline">{entry.voiceModel}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Text Content */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm italic">&quot;{entry.textContent}&quot;</p>
              </div>

              {/* Audio Player */}
              {entry.audioFile && (
                <div className="space-y-3">
                  <AudioPlayer
                    audioUrl={entry.audioFile.blobUrl}
                    fileName={`${entry.audioFile.fileName} (${formatFileSize(entry.audioFile.fileSize)})`}
                  />
                  <div className="flex justify-end">
                    <a
                      href={entry.audioFile.blobUrl}
                      download={entry.audioFile.fileName}
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
      ))}
    </div>
  );
}
