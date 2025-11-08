"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useInsightsContext } from "../layout";
import {
  Lightbulb,
  Target,
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MessageSquare,
  Award,
  BarChart3
} from "lucide-react";

export default function TeacherInsightsRecommendationsPage() {
  return (
    <ProtectedRoute>
      <RecommendationsContent />
    </ProtectedRoute>
  );
}

function RecommendationsContent() {
  const { selectedClass, timeframe } = useInsightsContext();

  // Mock recommendations data
  const recommendations = {
    immediate: [
      {
        id: "1",
        priority: "high",
        title: "Schedule one-on-one sessions with at-risk students",
        description: "3 students need immediate intervention to prevent falling further behind",
        impact: "High impact on student retention",
        timeRequired: "3 hours total",
        students: ["Mike Johnson", "Tom Davis", "Lisa Wong"],
        actions: [
          "Book 30-minute sessions this week",
          "Prepare personalized learning plans",
          "Contact parents for support"
        ]
      },
      {
        id: "2",
        priority: "high",
        title: "Introduce more writing templates and structures",
        description: "Writing scores are 25% below target across the class",
        impact: "Will improve essay structure and confidence",
        timeRequired: "2 hours prep",
        actions: [
          "Create essay planning templates",
          "Provide paragraph structure guides",
          "Schedule peer review sessions"
        ]
      },
    ],
    shortTerm: [
      {
        id: "3",
        priority: "medium",
        title: "Implement daily vocabulary challenges",
        description: "Boost vocabulary retention with gamified daily practice",
        impact: "15-20% improvement in vocabulary tests",
        timeRequired: "15 minutes daily",
        implementation: "Next week"
      },
      {
        id: "4",
        priority: "medium",
        title: "Create study groups for collaborative learning",
        description: "Pair stronger students with those needing support",
        impact: "Improved peer learning and engagement",
        timeRequired: "1 hour setup",
        implementation: "Within 2 weeks"
      },
      {
        id: "5",
        priority: "medium",
        title: "Add more visual learning materials",
        description: "40% of your class are visual learners",
        impact: "Better comprehension for visual learners",
        timeRequired: "3 hours prep",
        implementation: "Next unit"
      },
    ],
    longTerm: [
      {
        id: "6",
        priority: "low",
        title: "Develop personalized learning paths",
        description: "Create individualized progression tracks based on student strengths",
        impact: "Significant long-term improvement",
        timeline: "Next semester"
      },
      {
        id: "7",
        priority: "low",
        title: "Integrate more technology tools",
        description: "Explore AI-powered practice apps and online resources",
        impact: "Enhanced self-study capabilities",
        timeline: "Over next 3 months"
      },
    ],
    curriculum: [
      {
        title: "Adjust pacing for Module 4",
        reason: "45% completion rate suggests content is too dense",
        suggestion: "Split into two smaller modules with review sessions"
      },
      {
        title: "Add more speaking practice to Module 5",
        reason: "Speaking scores lag behind other skills",
        suggestion: "Include 2 additional conversation exercises per week"
      },
      {
        title: "Simplify grammar explanations",
        reason: "Students struggle with complex grammar rules",
        suggestion: "Use more visual aids and real-world examples"
      },
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "default";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <Target className="h-4 w-4" />;
      case "low":
        return <Clock className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Recommendations Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Immediate Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">{recommendations.immediate.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Require urgent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Short-term Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold">{recommendations.shortTerm.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Within 2 weeks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Long-term Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{recommendations.longTerm.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Strategic improvements</p>
          </CardContent>
        </Card>
      </div>

      {/* Immediate Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Immediate Actions Required
        </h3>
        {recommendations.immediate.map((rec) => (
          <Card key={rec.id} className="border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                  <CardDescription>{rec.description}</CardDescription>
                </div>
                <Badge variant={getPriorityColor(rec.priority) as any}>
                  {getPriorityIcon(rec.priority)}
                  <span className="ml-1">High Priority</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Impact</p>
                  <p className="text-sm text-muted-foreground">{rec.impact}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Time Required</p>
                  <p className="text-sm text-muted-foreground">{rec.timeRequired}</p>
                </div>
              </div>

              {rec.students && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Affected Students</p>
                  <div className="flex gap-2 flex-wrap">
                    {rec.students.map((student) => (
                      <Badge key={student} variant="outline" className="text-xs">
                        {student}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Action Steps</p>
                <ul className="space-y-1">
                  {rec.actions!.map((action, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full">Start Implementation</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Short-term Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-amber-600" />
          Short-term Improvements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.shortTerm.map((rec) => (
            <Card key={rec.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{rec.title}</CardTitle>
                  <Badge variant={getPriorityColor(rec.priority) as any} className="text-xs">
                    {rec.priority}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{rec.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Expected Impact</p>
                  <p className="text-sm">{rec.impact}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-medium text-muted-foreground">Time</p>
                    <p>{rec.timeRequired}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Start</p>
                    <p>{rec.implementation}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Add to Calendar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Long-term Strategic Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Long-term Strategic Plans
          </CardTitle>
          <CardDescription>Goals for sustained improvement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.longTerm.map((rec) => (
              <div key={rec.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {rec.timeline}
                  </Badge>
                </div>
                <p className="text-xs text-blue-600">Impact: {rec.impact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Curriculum Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Curriculum Adjustments
          </CardTitle>
          <CardDescription>Suggested changes to course content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.curriculum.map((item, idx) => (
              <div key={idx} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-amber-600">Reason: {item.reason}</p>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="text-sm">
                    <span className="font-medium">Suggestion:</span> {item.suggestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Suggested Implementation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <span className="text-sm font-bold text-red-600">W1</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">This Week</p>
                <p className="text-xs text-muted-foreground">
                  One-on-one sessions, Writing templates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <span className="text-sm font-bold text-amber-600">W2</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Next Week</p>
                <p className="text-xs text-muted-foreground">
                  Vocabulary challenges, Study groups
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">M1</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Next Month</p>
                <p className="text-xs text-muted-foreground">
                  Visual materials, Curriculum adjustments
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}