"use client";

import { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryFiltersComponent } from "@/components/history/history-filters";
import { AudioPlayerCard } from "@/components/history/audio-player-card";
import { EmptyState } from "@/components/history/empty-state";
import { getUserRecordingsWithFilters, deleteUserRecording } from "@/actions/recordings";
import { ALL_QUESTIONS } from "@/data/questions";
import type { HistoryFilters } from "@/types";

interface Recording {
  id: bigint;
  questionId: string | null;
  recordedAt: Date;
  audioFile: {
    blobUrl: string;
  };
  transcription: {
    transcribedText: string;
  } | null;
}

export function RecordingHistoryList() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [filters, setFilters] = useState<HistoryFilters>({ dateRange: "all" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecordings();
  }, [filters]);

  const loadRecordings = async () => {
    setIsLoading(true);
    try {
      const data = await getUserRecordingsWithFilters(
        {
          recordingType: filters.recordingType,
          dateRange: filters.dateRange,
        },
        100
      );
      setRecordings(data as Recording[]);
    } catch (error) {
      console.error("[RecordingHistory] Failed to load recordings:", error);
      toast.error("Failed to load recordings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (recordingId: bigint) => {
    try {
      await deleteUserRecording(recordingId);
      toast.success("Recording deleted successfully");

      // Remove from local state
      setRecordings((prev) => prev.filter((r) => r.id !== recordingId));
    } catch (error) {
      console.error("[RecordingHistory] Failed to delete recording:", error);
      toast.error("Failed to delete recording");
    }
  };

  const getQuestionText = (questionId: string | null) => {
    if (!questionId) return "Practice Recording";
    const question = ALL_QUESTIONS.find((q) => q.id === questionId);
    return question?.question || `Question ${questionId}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HistoryFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          showDateRangeFilter
          showRecordingTypeFilter
          showSkillFilter={false}
          showLevelFilter={false}
        />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="space-y-6">
        <HistoryFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          showDateRangeFilter
          showRecordingTypeFilter
          showSkillFilter={false}
          showLevelFilter={false}
        />
        <EmptyState
          icon={Mic}
          title="No Recordings Yet"
          description="Your voice recordings will appear here. Start practicing speaking questions to create recordings."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HistoryFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        showDateRangeFilter
        showRecordingTypeFilter
        showSkillFilter={false}
        showLevelFilter={false}
      />

      <div className="space-y-4">
        {recordings.map((recording) => (
          <AudioPlayerCard
            key={recording.id.toString()}
            audioUrl={recording.audioFile.blobUrl}
            title={getQuestionText(recording.questionId)}
            subtitle={recording.questionId ? `Question ID: ${recording.questionId}` : undefined}
            transcription={recording.transcription?.transcribedText}
            recordingDate={recording.recordedAt}
            onDelete={() => handleDelete(recording.id)}
            showDeleteButton
            showDownloadButton
          />
        ))}
      </div>
    </div>
  );
}
