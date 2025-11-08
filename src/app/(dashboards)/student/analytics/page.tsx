"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useContainerQuery } from "@/hooks/use-container-query";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Info
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import Server Actions
import { getUserProgress } from "@/actions/user-progress";
import { getCEFRProgress } from "@/actions/cefr-progress";

export default function StudentAnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}

function AnalyticsPageContent() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isLgUp } = useContainerQuery<HTMLDivElement>();

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        // Load real data from database
        const [nzcelProgress, cefrProgressData] = await Promise.all([
          getUserProgress(),
          getCEFRProgress()
        ]);

        // Generate skill balance and comparison from real data
        const skillBalance = generateSkillBalance(nzcelProgress, cefrProgressData);
        const skillComparison = generateSkillComparison(nzcelProgress, cefrProgressData);

        setData({
          nzcelProgress,
          cefrProgress: cefrProgressData,
          skillBalance,
          skillComparison
        });
      } catch (error) {
        console.error("Failed to load analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  const generateSkillBalance = (nzcelProgress: any, cefrProgress: any) => {
    const skills = nzcelProgress?.skillProgress || cefrProgress?.skillProgress || {
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0
    };
    return [
      { skill: "Listening", current: skills.listening || 0, target: 85 },
      { skill: "Speaking", current: skills.speaking || 0, target: 85 },
      { skill: "Reading", current: skills.reading || 0, target: 90 },
      { skill: "Writing", current: skills.writing || 0, target: 85 }
    ];
  };

  const generateSkillComparison = (nzcelProgress: any, cefrProgress: any) => {
    const nzcelSkills = nzcelProgress?.skillProgress || {};
    const cefrSkills = cefrProgress?.skillProgress || {};

    return [
      {
        skill: "Listening",
        nzcel: nzcelSkills.listening || 0,
        cefr: cefrSkills.listening || 0,
        difference: (nzcelSkills.listening || 0) - (cefrSkills.listening || 0)
      },
      {
        skill: "Speaking",
        nzcel: nzcelSkills.speaking || 0,
        cefr: cefrSkills.speaking || 0,
        difference: (nzcelSkills.speaking || 0) - (cefrSkills.speaking || 0)
      },
      {
        skill: "Reading",
        nzcel: nzcelSkills.reading || 0,
        cefr: cefrSkills.reading || 0,
        difference: (nzcelSkills.reading || 0) - (cefrSkills.reading || 0)
      },
      {
        skill: "Writing",
        nzcel: nzcelSkills.writing || 0,
        cefr: cefrSkills.writing || 0,
        difference: (nzcelSkills.writing || 0) - (cefrSkills.writing || 0)
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Analytics</h1>
        <p className="text-muted-foreground">
          Track your progress across all skills
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Currently showing skill progress based on your practice data. More detailed analytics coming soon.
        </AlertDescription>
      </Alert>

      {/* Skill Balance Chart */}
      <SkillRadarChart
        data={data.skillBalance}
        title="Skill Balance"
        description="Your current proficiency across all skills"
      />

      {/* Skill Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>NZCEL vs CEFR Progress</CardTitle>
          <CardDescription>
            Compare your progress in both learning paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.skillComparison.map((item: any) => (
              <div key={item.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.skill}</p>
                  <div className="flex items-center gap-1">
                    {item.difference > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : item.difference < 0 ? (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm font-medium ${
                      item.difference > 0 ? "text-green-600" :
                      item.difference < 0 ? "text-red-600" :
                      "text-muted-foreground"
                    }`}>
                      {Math.abs(item.difference)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">NZCEL</span>
                      <span className="text-xs font-medium">{item.nzcel}%</span>
                    </div>
                    <Progress value={item.nzcel} className="h-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">CEFR</span>
                      <span className="text-xs font-medium">{item.cefr}%</span>
                    </div>
                    <Progress value={item.cefr} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
