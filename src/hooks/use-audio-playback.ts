import { useState, useEffect, useRef, useCallback } from "react";
import { AudioPlaybackState } from "@/types";

/**
 * Hook for managing audio playback state
 * Supports play/pause, speed control, seeking, and playback tracking
 */
export function useAudioPlayback(audioUrl?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    hasPlayed: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Event listeners
    const handleLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration }));
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleEnded = () => {
      setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
      audio.currentTime = 0;
    };

    const handleError = () => {
      setError("Failed to load audio");
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    setIsLoading(true);

    // Cleanup
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.pause();
    };
  }, [audioUrl]);

  // Play audio
  const play = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setState((prev) => ({ ...prev, isPlaying: true, hasPlayed: true }));
    } catch (err) {
      setError("Failed to play audio");
      console.error("Audio play error:", err);
    }
  }, []);

  // Pause audio
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  // Seek to specific time
  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
    setState((prev) => ({ ...prev, currentTime: time }));
  }, [state.duration]);

  // Set playback speed
  const setPlaybackRate = useCallback((rate: number) => {
    if (!audioRef.current) return;
    const newRate = Math.max(0.5, Math.min(2.0, rate));
    audioRef.current.playbackRate = newRate;
    setState((prev) => ({ ...prev, playbackRate: newRate }));
  }, []);

  // Reset to beginning
  const reset = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setState((prev) => ({ ...prev, currentTime: 0, isPlaying: false }));
  }, []);

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    const newTime = audioRef.current.currentTime + seconds;
    seek(newTime);
  }, [seek]);

  return {
    state,
    isLoading,
    error,
    play,
    pause,
    togglePlay,
    seek,
    setPlaybackRate,
    reset,
    skip,
  };
}
