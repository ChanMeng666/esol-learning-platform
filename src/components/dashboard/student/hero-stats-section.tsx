import { Trophy, Clock, BookOpen } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

interface HeroStatsSectionProps {
  totalPoints: number;
  totalTime: number; // in seconds
  totalQuestions: number;
  trend?: {
    points?: { value: number; label: string };
    time?: { value: number; label: string };
    questions?: { value: number; label: string };
  };
}

/**
 * Hero Stats Section Component
 *
 * Displays three key statistics in a responsive grid:
 * 1. Total Points - Across all learning modules
 * 2. Study Time - Total learning hours formatted as "Xh Ym"
 * 3. Questions Completed - Total practice exercises done
 *
 * Props-based component (no internal data fetching) for reusability.
 *
 * @example
 * ```tsx
 * <HeroStatsSection
 *   totalPoints={1250}
 *   totalTime={7200} // 2 hours in seconds
 *   totalQuestions={85}
 *   trend={{
 *     points: { value: 12.5, label: "vs last week" },
 *     time: { value: 8.3, label: "vs last week" },
 *     questions: { value: 15.7, label: "vs last week" }
 *   }}
 * />
 * ```
 */
export function HeroStatsSection({
  totalPoints,
  totalTime,
  totalQuestions,
  trend,
}: HeroStatsSectionProps) {
  // Format time in hours and minutes
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Points"
        value={totalPoints.toLocaleString()}
        description="Across all modules"
        icon={Trophy}
        trend={trend?.points}
        variant="primary"
      />
      <StatCard
        title="Study Time"
        value={formatTime(totalTime)}
        description="Total learning hours"
        icon={Clock}
        trend={trend?.time}
        variant="success"
      />
      <StatCard
        title="Questions Completed"
        value={totalQuestions.toLocaleString()}
        description="Practice exercises done"
        icon={BookOpen}
        trend={trend?.questions}
        variant="default"
      />
    </div>
  );
}
