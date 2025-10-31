"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Progress } from "@/components/ui/progress";
import { getTeacherClasses } from "@/actions/classes";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Users,
  BookOpen,
  MessageSquare,
  Zap,
  Award,
  Clock,
  Calendar,
  BarChart3,
  Activity
} from "lucide-react";
import { toast } from "sonner";

interface Insight {
  id: string;
  type: "success" | "warning" | "info" | "suggestion";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  actionable: boolean;
  timestamp: Date;
}

interface StudentInsight {
  studentName: string;
  studentId: string;
  insights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    predictedGrade: string;
    riskLevel: "low" | "medium" | "high";
  };
}

export default function TeacherInsightsPage() {
  return (
    <ProtectedRoute>
      <InsightsPageContent />
    </ProtectedRoute>
  );
}

function InsightsPageContent() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("week");

  useEffect(() => {
    const loadData = async () => {
      try {
        const classData = await getTeacherClasses();
        setClasses(classData || []);
        if (classData && classData.length > 0) {
          setSelectedClass(classData[0]);
        }

        // Mock insights data
        setInsights(generateMockInsights());
      } catch (error) {
        console.error("Failed to load insights:", error);
        toast.error("Failed to load insights");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const generateMockInsights = (): Insight[] => [
    {
      id: "1",
      type: "success",
      title: "Excellent Class Engagement",
      description: "Your class showed 25% higher engagement this week compared to the department average",
      impact: "high",
      category: "engagement",
      actionable: false,
      timestamp: new Date()
    },
    {
      id: "2",
      type: "warning",
      title: "Writing Skills Need Attention",
      description: "30% of students are struggling with essay structure. Consider dedicating a session to writing frameworks",
      impact: "high",
      category: "performance",
      actionable: true,
      timestamp: new Date()
    },
    {
      id: "3",
      type: "info",
      title: "Optimal Learning Time Detected",
      description: "Students show peak performance during morning sessions (9-11 AM)",
      impact: "medium",
      category: "patterns",
      actionable: true,
      timestamp: new Date()
    },
    {
      id: "4",
      type: "suggestion",
      title: "Peer Learning Opportunity",
      description: "Pairing strong students with struggling ones could improve overall class performance by 15%",
      impact: "medium",
      category: "strategy",
      actionable: true,
      timestamp: new Date()
    }
  ];

  const studentInsights: StudentInsight[] = [
    {
      studentName: "Alex Chen",
      studentId: "1",
      insights: {
        strengths: ["Excellent speaking skills", "Consistent homework submission", "Active participation"],
        weaknesses: ["Grammar accuracy", "Written expression"],
        recommendations: ["Provide additional grammar exercises", "Encourage journal writing"],
        predictedGrade: "A",
        riskLevel: "low"
      }
    },
    {
      studentName: "Mike Johnson",
      studentId: "2",
      insights: {
        strengths: ["Good reading comprehension", "Improving vocabulary"],
        weaknesses: ["Low attendance", "Missing assignments", "Speaking confidence"],
        recommendations: ["Schedule one-on-one meeting", "Provide makeup work", "Encourage participation"],
        predictedGrade: "C",
        riskLevel: "high"
      }
    },
    {
      studentName: "Sarah Kim",
      studentId: "3",
      insights: {
        strengths: ["Strong writing skills", "Critical thinking", "Leadership in group work"],
        weaknesses: ["Pronunciation", "Listening comprehension"],
        recommendations: ["Suggest language lab sessions", "Provide listening practice materials"],
        predictedGrade: "B+",
        riskLevel: "medium"
      }
    }
  ];

  const learningPatterns = [
    { pattern: "Visual Learning Preference", percentage: 45, description: "Students respond better to visual aids" },
    { pattern: "Morning Peak Performance", percentage: 68, description: "Higher scores on morning assessments" },
    { pattern: "Collaborative Success", percentage: 72, description: "Group activities show better outcomes" },
    { pattern: "Digital Engagement", percentage: 85, description: "Online resources have high usage rates" }
  ];

  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "info": return <Info className="h-5 w-5 text-blue-600" />;
      case "suggestion": return <Lightbulb className="h-5 w-5 text-purple-600" />;
    }
  };

  const getInsightBgColor = (type: Insight["type"]) => {
    switch (type) {
      case "success": return "bg-green-50 dark:bg-green-900/20";
      case "warning": return "bg-amber-50 dark:bg-amber-900/20";
      case "info": return "bg-blue-50 dark:bg-blue-900/20";
      case "suggestion": return "bg-purple-50 dark:bg-purple-900/20";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600";
      case "medium": return "text-amber-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Generating insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Teaching Insights</h1>
        <p className="text-muted-foreground">
          AI-powered insights and recommendations for your teaching
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedClass?.id?.toString()} onValueChange={(value) => {
          const classItem = classes.find(c => c.id.toString() === value);
          setSelectedClass(classItem);
        }}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classItem) => (
              <SelectItem key={classItem.id.toString()} value={classItem.id.toString()}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="semester">This Semester</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Insights Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Student Insights</TabsTrigger>
          <TabsTrigger value="patterns">Learning Patterns</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Key Insights */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Key Insights This Week</h3>
            <div className="grid gap-4">
              {insights.map((insight) => (
                <Card key={insight.id} className={getInsightBgColor(insight.type)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {insight.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                        {insight.actionable && (
                          <Button variant="link" className="h-auto p-0 mt-2 text-xs">
                            Take Action →
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Class Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold">+12%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Overall improvement this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">At-Risk Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="text-2xl font-bold">3</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Need immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Engagement Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold">8.5/10</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Above department average</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Student Insights Tab */}
        <TabsContent value="students" className="mt-6 space-y-6">
          <div className="space-y-4">
            {studentInsights.map((student) => (
              <Card key={student.studentId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{student.studentName}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">Predicted: {student.insights.predictedGrade}</Badge>
                          <span className={`text-sm font-medium ${getRiskColor(student.insights.riskLevel)}`}>
                            {student.insights.riskLevel} risk
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Full Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Strengths */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {student.insights.strengths.map((strength, index) => (
                          <li key={index} className="text-xs text-muted-foreground">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {student.insights.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-xs text-muted-foreground">
                            • {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-1">
                        <Lightbulb className="h-4 w-4 text-purple-600" />
                        Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {student.insights.recommendations.map((rec, index) => (
                          <li key={index} className="text-xs text-muted-foreground">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Learning Patterns Tab */}
        <TabsContent value="patterns" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detected Learning Patterns</CardTitle>
              <CardDescription>
                Patterns identified from student behavior and performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningPatterns.map((pattern) => (
                  <div key={pattern.pattern} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{pattern.pattern}</p>
                        <p className="text-sm text-muted-foreground">{pattern.description}</p>
                      </div>
                      <span className="text-2xl font-bold">{pattern.percentage}%</span>
                    </div>
                    <Progress value={pattern.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time-based Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Best Learning Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Morning (9-12 PM)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20 h-2" />
                      <span className="text-xs font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Afternoon (12-3 PM)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-20 h-2" />
                      <span className="text-xs font-medium">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Evening (3-6 PM)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={72} className="w-20 h-2" />
                      <span className="text-xs font-medium">72%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interactive Exercises</span>
                    <Badge variant="default">High</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Video Content</span>
                    <Badge variant="default">High</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Written Assignments</span>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Solo Practice</span>
                    <Badge variant="outline">Low</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-6 space-y-6">
          {/* Teaching Strategies */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Teaching Strategies</CardTitle>
              <CardDescription>
                Personalized recommendations based on your class performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold">Implement Flipped Classroom</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Students show strong self-study capabilities. Consider assigning video lectures for homework
                    and using class time for interactive problem-solving.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">Learn More</Button>
                    <Button size="sm" variant="outline">Schedule Implementation</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Increase Peer Interaction</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Data shows students learn 30% faster when working in pairs. Consider implementing
                    regular peer review sessions and group discussions.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">View Examples</Button>
                    <Button size="sm" variant="outline">Create Groups</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold">Gamification Elements</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your students respond well to competition. Consider adding leaderboards, badges,
                    or point systems to increase engagement.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">Setup Gamification</Button>
                    <Button size="sm" variant="outline">View Templates</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Immediate Action Items</CardTitle>
              <CardDescription>
                Priority tasks to improve class outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { task: "Schedule one-on-one with Mike Johnson", priority: "high", due: "Tomorrow" },
                  { task: "Create additional writing exercises", priority: "medium", due: "This week" },
                  { task: "Review and adjust quiz difficulty", priority: "medium", due: "This week" },
                  { task: "Plan peer learning session", priority: "low", due: "Next week" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{item.task}</p>
                        <p className="text-xs text-muted-foreground">Due: {item.due}</p>
                      </div>
                    </div>
                    <Badge variant={
                      item.priority === "high" ? "destructive" :
                      item.priority === "medium" ? "default" :
                      "secondary"
                    }>
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}