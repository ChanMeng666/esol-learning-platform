"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingState } from "@/components/shared/loading-state";
import { AudioPlayerWithTranscript } from "./audio-player-with-transcript";
import { getTeacherStudentRecordings } from "@/actions/recordings";
import {
  Search,
  CheckCircle2,
  Circle,
  Eye,
  FileAudio,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface RecordingData {
  id: bigint;
  recordingType: string;
  recordedAt: Date;
  student?: {
    fullName: string;
    email: string;
  };
  transcription?: {
    transcribedText: string;
  };
  metadata?: {
    teacherReviewed?: boolean;
    [key: string]: unknown;
  };
  audioUrl?: string;
}

interface RecordingListWithFiltersProps {
  classId?: bigint;
  studentId?: bigint;
  showFilters?: boolean;
}

export function RecordingListWithFilters({
  classId,
  studentId,
  showFilters = true,
}: RecordingListWithFiltersProps) {
  const [recordings, setRecordings] = useState<RecordingData[]>([]);
  const [filteredRecordings, setFilteredRecordings] = useState<RecordingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<"7d" | "30d" | "all">("all");
  const [reviewStatusFilter, setReviewStatusFilter] = useState<string>("all");
  const [selectedRecording, setSelectedRecording] = useState<RecordingData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadRecordings();
  }, [classId, studentId]);

  useEffect(() => {
    filterRecordings();
  }, [recordings, searchQuery, typeFilter, dateRangeFilter, reviewStatusFilter]);

  async function loadRecordings() {
    try {
      setLoading(true);
      const data = await getTeacherStudentRecordings(
        {
          classId,
          studentId,
          dateRange: dateRangeFilter !== "all" ? dateRangeFilter : undefined,
        },
        200
      );
      setRecordings(data);
    } catch (error) {
      console.error("Error loading recordings:", error);
      toast.error("Failed to load recordings");
    } finally {
      setLoading(false);
    }
  }

  function filterRecordings() {
    let filtered = [...recordings];

    // Search filter (by student name or transcript)
    if (searchQuery) {
      filtered = filtered.filter((recording) => {
        const studentMatch = recording.student?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const transcriptMatch = recording.transcription?.transcribedText
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        return studentMatch || transcriptMatch;
      });
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((recording) => recording.recordingType === typeFilter);
    }

    // Review status filter
    if (reviewStatusFilter !== "all") {
      filtered = filtered.filter((recording) => {
        const metadata = recording.metadata as { teacherReviewed?: boolean } | undefined;
        const isReviewed = metadata?.teacherReviewed || false;
        return reviewStatusFilter === "reviewed" ? isReviewed : !isReviewed;
      });
    }

    setFilteredRecordings(filtered);
  }

  function handleViewRecording(recording: RecordingData) {
    setSelectedRecording(recording);
    setIsDialogOpen(true);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
    setSelectedRecording(null);
    // Reload recordings to get updated review status
    loadRecordings();
  }

  function getRecordingTypeColor(type: string) {
    switch (type) {
      case "practice_answer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "conversation_turn":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pronunciation_test":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  }

  const reviewedCount = recordings.filter((r) => {
    const metadata = r.metadata as { teacherReviewed?: boolean } | undefined;
    return metadata?.teacherReviewed;
  }).length;

  const unreviewedCount = recordings.length - reviewedCount;

  if (loading) {
    return <LoadingState message="Loading recordings..." />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileAudio className="w-5 h-5" />
                Student Recordings
              </CardTitle>
              <CardDescription>
                {recordings.length} recording{recordings.length !== 1 ? "s" : ""} •{" "}
                {unreviewedCount} pending review
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {reviewedCount} Reviewed
              </Badge>
              <Badge variant="outline">
                <Circle className="w-3 h-3 mr-1" />
                {unreviewedCount} Pending
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          {showFilters && (
            <div className="flex items-center gap-4 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by student or transcript..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="practice_answer">Practice Answer</SelectItem>
                  <SelectItem value="conversation_turn">Conversation</SelectItem>
                  <SelectItem value="pronunciation_test">Pronunciation</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Select value={dateRangeFilter} onValueChange={(value: any) => setDateRangeFilter(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Review Status Filter */}
              <Select value={reviewStatusFilter} onValueChange={setReviewStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(searchQuery || typeFilter !== "all" || dateRangeFilter !== "all" || reviewStatusFilter !== "all") && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setDateRangeFilter("all");
                    setReviewStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Recordings Table */}
          {filteredRecordings.length === 0 ? (
            searchQuery || typeFilter !== "all" || dateRangeFilter !== "all" || reviewStatusFilter !== "all" ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No recordings found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setDateRangeFilter("all");
                    setReviewStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileAudio className="w-16 h-16 mx-auto mb-4" />
                <p>No recordings yet</p>
              </div>
            )
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Transcript Preview</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecordings.map((recording) => {
                  const metadata = recording.metadata as { teacherReviewed?: boolean } | undefined;
                  const isReviewed = metadata?.teacherReviewed || false;

                  return (
                    <TableRow key={recording.id.toString()}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{recording.student?.fullName}</div>
                            <div className="text-xs text-muted-foreground">
                              {recording.student?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize ${getRecordingTypeColor(recording.recordingType)}`}
                        >
                          {recording.recordingType.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {recording.transcription ? (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                            <p className="text-sm line-clamp-2">
                              {recording.transcription.transcribedText}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No transcript</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(recording.recordedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isReviewed ? (
                          <Badge variant="default">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Reviewed
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Circle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewRecording(recording)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recording Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recording Details</DialogTitle>
          </DialogHeader>
          {selectedRecording && (
            <>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <AudioPlayerWithTranscript
                recording={selectedRecording as any}
                showFeedback={true}
                onReviewComplete={handleDialogClose}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
