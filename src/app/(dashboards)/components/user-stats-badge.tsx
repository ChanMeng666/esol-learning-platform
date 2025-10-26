"use client";

import { Trophy, Flame, Users, ClipboardList, Building2, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserProgress } from "@/lib/store/user-progress";
import { useUser } from "@stackframe/stack";

/**
 * User statistics badge component
 * Displays different statistics based on user role
 */
export function UserStatsBadge() {
  const { totalPoints, streak } = useUserProgress();
  const user = useUser();
  const role = (user?.clientMetadata?.role as string) || "student";

  // Student: Show points and streak
  if (role === "student") {
    return (
      <>
        <Badge variant="outline" className="gap-1.5 hidden sm:flex">
          <Trophy className="h-4 w-4" />
          <span className="font-semibold">{totalPoints}</span>
        </Badge>
        <Badge
          variant="outline"
          className="gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 border-transparent text-white hover:from-orange-600 hover:to-red-600"
        >
          <Flame className="h-4 w-4" />
          <span className="font-semibold">{streak}</span>
        </Badge>
      </>
    );
  }

  // Teacher: Show student count and pending assignments (mock data for now)
  if (role === "teacher") {
    return (
      <>
        <Badge variant="outline" className="gap-1.5 hidden sm:flex">
          <Users className="h-4 w-4" />
          <span className="font-semibold">0</span>
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <ClipboardList className="h-4 w-4" />
          <span className="font-semibold">0</span>
        </Badge>
      </>
    );
  }

  // Parent: Show children count (mock data for now)
  if (role === "parent") {
    return (
      <Badge variant="outline" className="gap-1.5">
        <Users className="h-4 w-4" />
        <span className="font-semibold">0</span>
      </Badge>
    );
  }

  // School Admin: Show organization stats (mock data for now)
  if (role === "school_admin") {
    return (
      <>
        <Badge variant="outline" className="gap-1.5 hidden sm:flex">
          <Building2 className="h-4 w-4" />
          <span className="font-semibold">0</span>
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <Users className="h-4 w-4" />
          <span className="font-semibold">0</span>
        </Badge>
      </>
    );
  }

  // System Admin: Show system health (mock data for now)
  if (role === "system_admin") {
    return (
      <>
        <Badge variant="outline" className="gap-1.5 hidden sm:flex">
          <Building2 className="h-4 w-4" />
          <span className="font-semibold">0</span>
        </Badge>
        <Badge
          variant="outline"
          className="gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 border-transparent text-white hover:from-green-600 hover:to-emerald-600"
        >
          <Activity className="h-4 w-4" />
          <span className="font-semibold">OK</span>
        </Badge>
      </>
    );
  }

  // Default: No badge
  return null;
}
