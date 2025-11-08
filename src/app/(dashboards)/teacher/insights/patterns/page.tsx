"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useInsightsContext } from "../context";
import {
  BarChart3,
  Brain,
  Clock,
  Calendar,
  TrendingUp,
  Activity,
  Users,
  BookOpen,
  Headphones,
  PenTool,
  MessageSquare,
  Eye
} from "lucide-react";

export default function TeacherInsightsPatternsPage() {
  return (
    <ProtectedRoute>
      <PatternsContent />
    </ProtectedRoute>
  );
}

function PatternsContent() {
  const { selectedClass, timeframe } = useInsightsContext();

  // Mock learning patterns data
  const learningPatterns = {
    timePatterns: {
      mostActiveTime: "2-4 PM",
      leastActiveTime: "8-10 AM",
      peakDays: ["Tuesday", "Thursday"],
      lowDays: ["Monday", "Friday"],
    },
    skillPatterns: {
      strongest: { skill: "Listening", score: 85, trend: "+8%" },
      weakest: { skill: "Writing", score: 68, trend: "-2%" },
      mostImproved: { skill: "Speaking", score: 75, trend: "+15%" },
      leastImproved: { skill: "Grammar", score: 72, trend: "+1%" },
    },
    engagementPatterns: {
      preferredContent: ["Video lessons", "Interactive quizzes", "Group activities"],
      avoidedContent: ["Long reading passages", "Essay writing", "Solo presentations"],
      averageSessionDuration: "42 minutes",
      sessionsPerWeek: 4.2,
    },
    learningStyles: [
      { style: "Visual Learners", percentage: 40, count: 10 },
      { style: "Auditory Learners", percentage: 28, count: 7 },
      { style: "Kinesthetic Learners", percentage: 20, count: 5 },
      { style: "Reading/Writing", percentage: 12, count: 3 },
    ],
  };

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case "Listening":
        return <Headphones className="h-4 w-4" />;
      case "Speaking":
        return <MessageSquare className="h-4 w-4" />;
      case "Reading":
        return <Eye className="h-4 w-4" />;
      case "Writing":
        return <PenTool className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time-Based Learning Patterns
          </CardTitle>
          <CardDescription>When your students learn best</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Peak Learning Time</p>
              <p className="text-lg font-bold text-green-600">{learningPatterns.timePatterns.mostActiveTime}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lowest Activity</p>
              <p className="text-lg font-bold text-amber-600">{learningPatterns.timePatterns.leastActiveTime}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Best Days</p>
              <div className="flex gap-1">
                {learningPatterns.timePatterns.peakDays.map(day => (
                  <Badge key={day} variant="outline" className="text-xs">
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Challenging Days</p>
              <div className="flex gap-1">
                {learningPatterns.timePatterns.lowDays.map(day => (
                  <Badge key={day} variant="secondary" className="text-xs">
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">💡 Insight:</span> Schedule important lessons and assessments during peak times (Tuesday/Thursday, 2-4 PM) for better engagement.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skill Development Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Skill Development Patterns
          </CardTitle>
          <CardDescription>How different skills are progressing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strongest Skill */}
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSkillIcon(learningPatterns.skillPatterns.strongest.skill)}
                  <span className="font-medium">Strongest Skill</span>
                </div>
                <Badge variant="default" className="bg-green-600">
                  {learningPatterns.skillPatterns.strongest.skill}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{learningPatterns.skillPatterns.strongest.score}%</span>
                <span className="text-sm text-green-600">{learningPatterns.skillPatterns.strongest.trend}</span>
              </div>
              <Progress value={learningPatterns.skillPatterns.strongest.score} className="h-2" />
            </div>

            {/* Weakest Skill */}
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSkillIcon(learningPatterns.skillPatterns.weakest.skill)}
                  <span className="font-medium">Needs Attention</span>
                </div>
                <Badge variant="destructive">
                  {learningPatterns.skillPatterns.weakest.skill}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{learningPatterns.skillPatterns.weakest.score}%</span>
                <span className="text-sm text-red-600">{learningPatterns.skillPatterns.weakest.trend}</span>
              </div>
              <Progress value={learningPatterns.skillPatterns.weakest.score} className="h-2" />
            </div>

            {/* Most Improved */}
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Most Improved</span>
                </div>
                <Badge variant="secondary">
                  {learningPatterns.skillPatterns.mostImproved.skill}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{learningPatterns.skillPatterns.mostImproved.score}%</span>
                <span className="text-sm text-purple-600 font-bold">{learningPatterns.skillPatterns.mostImproved.trend}</span>
              </div>
              <Progress value={learningPatterns.skillPatterns.mostImproved.score} className="h-2" />
            </div>

            {/* Least Improved */}
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Slow Progress</span>
                </div>
                <Badge variant="outline">
                  {learningPatterns.skillPatterns.leastImproved.skill}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{learningPatterns.skillPatterns.leastImproved.score}%</span>
                <span className="text-sm text-gray-600">{learningPatterns.skillPatterns.leastImproved.trend}</span>
              </div>
              <Progress value={learningPatterns.skillPatterns.leastImproved.score} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Content Engagement Patterns
          </CardTitle>
          <CardDescription>What content resonates with your students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-green-600">Preferred Content Types</h4>
              <div className="space-y-2">
                {learningPatterns.engagementPatterns.preferredContent.map((content, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span className="text-sm">{content}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-amber-600">Less Engaging Content</h4>
              <div className="space-y-2">
                {learningPatterns.engagementPatterns.avoidedContent.map((content, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <div className="h-2 w-2 bg-amber-500 rounded-full" />
                    <span className="text-sm">{content}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
              <p className="text-xl font-bold">{learningPatterns.engagementPatterns.averageSessionDuration}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Sessions per Week</p>
              <p className="text-xl font-bold">{learningPatterns.engagementPatterns.sessionsPerWeek}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Styles Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Learning Styles Distribution
          </CardTitle>
          <CardDescription>How your students prefer to learn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningPatterns.learningStyles.map((style) => (
              <div key={style.style} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{style.style}</span>
                    <Badge variant="outline" className="text-xs">
                      {style.count} students
                    </Badge>
                  </div>
                  <span className="text-sm font-bold">{style.percentage}%</span>
                </div>
                <Progress value={style.percentage} className="h-2" />
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">💡 Teaching Tip:</span> With 40% visual learners, incorporate more diagrams, videos, and visual aids in your lessons for better comprehension.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pattern Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Key Pattern Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">1</span>
              </div>
              <div>
                <p className="font-medium text-sm">Optimize lesson timing</p>
                <p className="text-xs text-muted-foreground">
                  Schedule challenging content on Tuesday/Thursday afternoons when engagement peaks
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-amber-600">2</span>
              </div>
              <div>
                <p className="font-medium text-sm">Focus on writing skills</p>
                <p className="text-xs text-muted-foreground">
                  Writing is the weakest area - consider more structured practice and templates
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium text-sm">Leverage preferred content types</p>
                <p className="text-xs text-muted-foreground">
                  Use more videos and interactive quizzes to maintain high engagement
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}