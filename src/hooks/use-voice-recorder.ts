import { useState, useRef, useCallback, useEffect } from "react";
import { VoiceRecordingState } from "@/types";

/**
 * Hook for managing voice recording
 * Handles MediaRecorder API, recording state, and audio blob generation
 */
export function useVoiceRecorder() {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    recordingDuration: 0,
    audioBlob: null,
    transcription: null,
    isTranscribing: false,
    isAssessing: false,
    assessment: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setState((prev) => ({ ...prev, audioBlob: blob, isRecording: false }));

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      // Start recording
      mediaRecorder.start();
      setState((prev) => ({
        ...prev,
        isRecording: true,
        recordingDuration: 0,
        audioBlob: null,
        transcription: null,
        assessment: null,
      }));

      // Start timer
      timerRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          recordingDuration: prev.recordingDuration + 1,
        }));
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      throw new Error("Failed to access microphone. Please check permissions.");
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [state.isRecording]);

  // Reset recording
  const reset = useCallback(() => {
    if (state.isRecording) {
      stopRecording();
    }

    setState({
      isRecording: false,
      recordingDuration: 0,
      audioBlob: null,
      transcription: null,
      isTranscribing: false,
      isAssessing: false,
      assessment: null,
    });

    chunksRef.current = [];
  }, [state.isRecording, stopRecording]);

  // Transcribe audio using Whisper API
  const transcribe = useCallback(async () => {
    if (!state.audioBlob) {
      throw new Error("No audio to transcribe");
    }

    setState((prev) => ({ ...prev, isTranscribing: true }));

    try {
      // Convert webm to a format Whisper accepts (needs to be a File object)
      const audioFile = new File([state.audioBlob], "recording.webm", {
        type: "audio/webm",
      });

      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch("/api/openai/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();
      setState((prev) => ({
        ...prev,
        transcription: data.text,
        isTranscribing: false,
      }));

      return data.text;
    } catch (error) {
      setState((prev) => ({ ...prev, isTranscribing: false }));
      console.error("Transcription error:", error);
      throw new Error("Failed to transcribe audio. Please try again.");
    }
  }, [state.audioBlob]);

  // Assess transcription using GPT-4
  const assess = useCallback(
    async (questionText: string, level: string, rubric?: string) => {
      if (!state.transcription) {
        throw new Error("No transcription to assess");
      }

      setState((prev) => ({ ...prev, isAssessing: true }));

      try {
        const response = await fetch("/api/openai/assess", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: state.transcription,
            level,
            skill: "speaking",
            questionText,
            rubric,
          }),
        });

        if (!response.ok) {
          throw new Error(`Assessment failed: ${response.statusText}`);
        }

        const assessment = await response.json();
        setState((prev) => ({
          ...prev,
          assessment,
          isAssessing: false,
        }));

        return assessment;
      } catch (error) {
        setState((prev) => ({ ...prev, isAssessing: false }));
        console.error("Assessment error:", error);
        throw new Error("Failed to assess response. Please try again.");
      }
    },
    [state.transcription]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    state,
    startRecording,
    stopRecording,
    reset,
    transcribe,
    assess,
  };
}
