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
      console.log("[VoiceRecorder] 🎙️ Starting recording process...");
      console.log("[VoiceRecorder] Browser capabilities:", {
        hasNavigator: typeof navigator !== 'undefined',
        hasMediaDevices: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
        hasGetUserMedia: typeof navigator !== 'undefined' && navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices,
        hasMediaRecorder: typeof MediaRecorder !== 'undefined',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
      });

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("[VoiceRecorder] ❌ getUserMedia not supported in this browser");
        throw new Error("Your browser doesn't support audio recording. Please use Chrome, Firefox, or Safari.");
      }

      console.log("[VoiceRecorder] Requesting microphone access...");
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      console.log("[VoiceRecorder] ✅ Microphone access granted. Stream:", stream);
      console.log("[VoiceRecorder] Audio tracks:", stream.getAudioTracks().map(t => ({
        id: t.id,
        label: t.label,
        enabled: t.enabled,
        muted: t.muted,
        readyState: t.readyState
      })));

      // Create MediaRecorder
      console.log("[VoiceRecorder] 🎬 Creating MediaRecorder with audio/webm...");
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      console.log("[VoiceRecorder] MediaRecorder created. State:", mediaRecorder.state);
      console.log("[VoiceRecorder] MIME type:", mediaRecorder.mimeType);

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        console.log("[VoiceRecorder] 📦 Data available. Size:", event.data.size, "bytes");
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log("[VoiceRecorder] Chunk added. Total chunks:", chunksRef.current.length);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        console.log("[VoiceRecorder] ⏹️ Recording stopped. Creating blob from chunks...");
        console.log("[VoiceRecorder] Total chunks collected:", chunksRef.current.length);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        console.log("[VoiceRecorder] ✅ Blob created. Size:", blob.size, "bytes, Type:", blob.type);
        setState((prev) => ({ ...prev, audioBlob: blob, isRecording: false }));

        // Clean up stream
        if (streamRef.current) {
          console.log("[VoiceRecorder] 🧹 Cleaning up media stream...");
          streamRef.current.getTracks().forEach((track) => {
            console.log("[VoiceRecorder] Stopping track:", track.label);
            track.stop();
          });
          streamRef.current = null;
        }
      };

      // Start recording
      console.log("[VoiceRecorder] ▶️ Starting MediaRecorder...");
      mediaRecorder.start();
      console.log("[VoiceRecorder] ✅ MediaRecorder started. State:", mediaRecorder.state);
      setState((prev) => ({
        ...prev,
        isRecording: true,
        recordingDuration: 0,
        audioBlob: null,
        transcription: null,
        assessment: null,
      }));

      // Start timer
      console.log("[VoiceRecorder] ⏱️ Starting timer...");
      timerRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          recordingDuration: prev.recordingDuration + 1,
        }));
      }, 1000);
      console.log("[VoiceRecorder] 🎉 Recording setup complete!");
    } catch (error) {
      console.error("[VoiceRecorder] ❌ Error starting recording:", error);
      console.error("[VoiceRecorder] Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error("Failed to access microphone. Please check permissions.");
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    console.log("[VoiceRecorder] 🛑 Stop recording called. Current state:", {
      hasMediaRecorder: !!mediaRecorderRef.current,
      isRecording: state.isRecording,
      recorderState: mediaRecorderRef.current?.state
    });
    if (mediaRecorderRef.current && state.isRecording) {
      console.log("[VoiceRecorder] Stopping MediaRecorder...");
      mediaRecorderRef.current.stop();

      // Clear timer
      if (timerRef.current) {
        console.log("[VoiceRecorder] Clearing timer...");
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      console.log("[VoiceRecorder] ⚠️ Cannot stop - not recording or no MediaRecorder");
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
    console.log("[VoiceRecorder] 📝 Transcribe called. Has audio blob:", !!state.audioBlob);
    if (!state.audioBlob) {
      console.error("[VoiceRecorder] ❌ No audio blob to transcribe");
      throw new Error("No audio to transcribe");
    }

    console.log("[VoiceRecorder] Audio blob details:", {
      size: state.audioBlob.size,
      type: state.audioBlob.type
    });

    setState((prev) => ({ ...prev, isTranscribing: true }));

    try {
      // Convert webm to a format Whisper accepts (needs to be a File object)
      console.log("[VoiceRecorder] Creating File object from blob...");
      const audioFile = new File([state.audioBlob], "recording.webm", {
        type: "audio/webm",
      });
      console.log("[VoiceRecorder] File created:", {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type
      });

      const formData = new FormData();
      formData.append("audio", audioFile);
      console.log("[VoiceRecorder] FormData prepared, sending to /api/openai/transcribe...");

      const response = await fetch("/api/openai/transcribe", {
        method: "POST",
        body: formData,
      });

      console.log("[VoiceRecorder] Transcribe API response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[VoiceRecorder] ❌ Transcription API error:", errorText);
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("[VoiceRecorder] ✅ Transcription successful:", data);
      setState((prev) => ({
        ...prev,
        transcription: data.text,
        isTranscribing: false,
      }));

      return data.text;
    } catch (error) {
      setState((prev) => ({ ...prev, isTranscribing: false }));
      console.error("[VoiceRecorder] ❌ Transcription error:", error);
      console.error("[VoiceRecorder] Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error("Failed to transcribe audio. Please try again.");
    }
  }, [state.audioBlob]);

  // Assess transcription using GPT-4
  const assess = useCallback(
    async (questionText: string, level: string, rubric?: string) => {
      console.log("[VoiceRecorder] 📊 Assess called. Has transcription:", !!state.transcription);
      console.log("[VoiceRecorder] Assessment params:", { questionText, level, rubric });
      if (!state.transcription) {
        console.error("[VoiceRecorder] ❌ No transcription to assess");
        throw new Error("No transcription to assess");
      }

      setState((prev) => ({ ...prev, isAssessing: true }));

      try {
        const requestBody = {
          text: state.transcription,
          level,
          skill: "speaking",
          questionText,
          rubric,
        };
        console.log("[VoiceRecorder] Sending assessment request to /api/openai/assess:", requestBody);

        const response = await fetch("/api/openai/assess", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        console.log("[VoiceRecorder] Assessment API response:", {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[VoiceRecorder] ❌ Assessment API error:", errorText);
          throw new Error(`Assessment failed: ${response.statusText}`);
        }

        const assessment = await response.json();
        console.log("[VoiceRecorder] ✅ Assessment successful:", assessment);
        setState((prev) => ({
          ...prev,
          assessment,
          isAssessing: false,
        }));

        return assessment;
      } catch (error) {
        setState((prev) => ({ ...prev, isAssessing: false }));
        console.error("[VoiceRecorder] ❌ Assessment error:", error);
        console.error("[VoiceRecorder] Error details:", {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
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
