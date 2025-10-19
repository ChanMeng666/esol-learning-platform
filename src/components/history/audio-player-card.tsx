"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/components/audio/audio-player";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AudioPlayerCardProps {
  audioUrl: string;
  title: string;
  subtitle?: string;
  transcription?: string;
  feedback?: string;
  recordingDate: Date;
  onDelete?: () => Promise<void>;
  showDeleteButton?: boolean;
  showDownloadButton?: boolean;
}

export function AudioPlayerCard({
  audioUrl,
  title,
  subtitle,
  transcription,
  feedback,
  recordingDate,
  onDelete,
  showDeleteButton = true,
  showDownloadButton = true,
}: AudioPlayerCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recording-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[AudioPlayer] Download failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error("[AudioPlayer] Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
            <Badge variant="outline" className="mt-2">
              {new Date(recordingDate).toLocaleDateString()} {new Date(recordingDate).toLocaleTimeString()}
            </Badge>
          </div>
          <div className="flex gap-2">
            {showDownloadButton && (
              <Button variant="ghost" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            )}
            {showDeleteButton && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Recording</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this recording? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Audio Player */}
        <AudioPlayer audioUrl={audioUrl} />

        {/* Transcription */}
        {transcription && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Transcription</h4>
            <p className="text-sm text-muted-foreground italic">&quot;{transcription}&quot;</p>
          </div>
        )}

        {/* AI Feedback */}
        {feedback && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="text-sm font-semibold mb-2 text-primary">AI Feedback</h4>
            <p className="text-sm">{feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
