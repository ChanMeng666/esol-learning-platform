"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ChartRevenue } from "@/components/charts/chart-revenue";
import { ChartVisitors } from "@/components/charts/chart-visitors";
import { useAnalyticsContext } from "../layout";

export default function TeacherAnalyticsEngagementPage() {
  return (
    <ProtectedRoute>
      <EngagementContent />
    </ProtectedRoute>
  );
}

function EngagementContent() {
  const { selectedClass, timeRange } = useAnalyticsContext();

  // Mock data for engagement metrics
  const engagementData = [
    { name: "Week 1", value: 320, label: "320 activities" },
    { name: "Week 2", value: 380, label: "380 activities" },
    { name: "Week 3", value: 420, label: "420 activities" },
    { name: "Week 4", value: 450, label: "450 activities" },
  ];

  const completionRates = [
    { category: "Assignments", rate: 87, color: "hsl(var(--chart-1))" },
    { category: "Quizzes", rate: 92, color: "hsl(var(--chart-2))" },
    { category: "Practice", rate: 75, color: "hsl(var(--chart-3))" },
    { category: "Speaking", rate: 68, color: "hsl(var(--chart-4))" },
  ];

  return (
    <div className="space-y-6">
      {/* Engagement Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartRevenue
          title="Weekly Engagement Trend"
          description="Student activity levels over time"
          data={engagementData}
          config={{
            value: { label: "Activities", color: "hsl(var(--chart-1))" }
          }}
          stacked={false}
        />
        <ChartVisitors
          title="Activity Type Distribution"
          description="Breakdown by activity type"
          data={completionRates.map(item => ({
            category: item.category,
            value: item.rate,
            fill: item.color
          }))}
          config={completionRates.reduce((acc, item) => ({
            ...acc,
            [item.category]: {
              label: item.category,
              color: item.color
            }
          }), {})}
          centerLabel="Avg"
        />
      </div>

      {/* Engagement Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Most Engaged Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2-4 PM</div>
            <p className="text-xs text-muted-foreground mt-1">Peak activity window</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Avg. Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38 min</div>
            <p className="text-xs text-green-600 mt-1">+5 min from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Weekly Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground mt-1">Per student average</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Engagement Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Monday - Wednesday</p>
                <p className="text-sm text-muted-foreground">Higher engagement at start of week</p>
              </div>
              <span className="text-2xl font-bold text-green-600">+15%</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Thursday - Friday</p>
                <p className="text-sm text-muted-foreground">Gradual decline towards weekend</p>
              </div>
              <span className="text-2xl font-bold text-amber-600">-8%</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Weekend Activity</p>
                <p className="text-sm text-muted-foreground">Minimal engagement on weekends</p>
              </div>
              <span className="text-2xl font-bold text-red-600">-45%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}