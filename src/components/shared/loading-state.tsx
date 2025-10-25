import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "spinner" | "animation";
  fullScreen?: boolean;
}

/**
 * Loading State Component
 * Displays loading indicator with optional message
 *
 * Usage:
 * <LoadingState message="Loading students..." />
 * <LoadingState variant="animation" size="lg" fullScreen />
 */
export function LoadingState({
  message = "Loading...",
  size = "md",
  variant = "default",
  fullScreen = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: { wrapper: "w-16 h-16", text: "text-sm" },
    md: { wrapper: "w-24 h-24", text: "text-base" },
    lg: { wrapper: "w-32 h-32", text: "text-lg" },
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {variant === "animation" ? (
        <DotLottieReact
          src="/animations/loading.lottie"
          autoplay
          loop
          style={{
            width: sizeClasses[size].wrapper.includes("16")
              ? 64
              : sizeClasses[size].wrapper.includes("24")
              ? 96
              : 128,
            height: sizeClasses[size].wrapper.includes("16")
              ? 64
              : sizeClasses[size].wrapper.includes("24")
              ? 96
              : 128,
          }}
        />
      ) : variant === "spinner" ? (
        <Loader2
          className={`${sizeClasses[size].wrapper} animate-spin text-primary`}
        />
      ) : (
        <div
          className={`${sizeClasses[size].wrapper} border-4 border-t-primary border-gray-200 rounded-full animate-spin`}
        />
      )}
      {message && (
        <p className={`${sizeClasses[size].text} text-muted-foreground`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{content}</div>;
}

/**
 * Inline Loading State
 * Smaller loading indicator for inline use
 */
export function InlineLoadingState({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="w-4 h-4 animate-spin" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}

/**
 * Skeleton Loading Components
 * Placeholder components for content loading
 */
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border p-6 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="h-12 bg-gray-100 dark:bg-gray-800 border-b border-border" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 border-b border-border last:border-b-0 animate-pulse px-4 flex items-center gap-4"
        >
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/5" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="h-20 rounded-lg border border-border animate-pulse p-4"
        >
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
