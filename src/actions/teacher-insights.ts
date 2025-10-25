"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc, gte, sql } from "drizzle-orm";
import { getOpenAIClient } from "@/lib/openai";

/**
 * Generate AI insights for a class
 * Multi-tenant: Validates teacher access to class
 *
 * Analyzes class performance, identifies trends, and provides actionable recommendations
 *
 * @param classId - Class ID to analyze
 * @returns AI-generated insights and recommendations
 */
export async function generateClassInsights(classId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Validate teacher access
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const classRecord = await db.query.classes.findFirst({
      where: and(
        eq(schema.classes.id, classId),
        eq(schema.classes.teacherId, enhancedUser.id),
        eq(schema.classes.organizationId, organizationId)
      ),
    });

    if (!classRecord) {
      throw new Error("Class not found or access denied");
    }

    // Gather class data
    const enrollments = await db.query.classEnrollments.findMany({
      where: and(
        eq(schema.classEnrollments.classId, classId),
        eq(schema.classEnrollments.status, "active")
      ),
    });

    const studentIds = enrollments.map((e) => e.studentId);

    if (studentIds.length === 0) {
      return {
        summary: "No students enrolled in this class yet.",
        insights: [],
        recommendations: [],
        metrics: null,
      };
    }

    const { inArray } = await import("drizzle-orm");

    // Get student progress data
    const progressData = await db.query.userProgress.findMany({
      where: inArray(schema.userProgress.userId, studentIds),
    });

    // Get practice sessions
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSessions = await db.query.practiceSessions.findMany({
      where: and(
        inArray(schema.practiceSessions.userId, studentIds),
        gte(schema.practiceSessions.startedAt, thirtyDaysAgo)
      ),
    });

    // Get diagnostic results
    const diagnosticResults = await db.query.studentDiagnosticResults.findMany({
      where: inArray(schema.studentDiagnosticResults.studentId, studentIds),
      orderBy: [desc(schema.studentDiagnosticResults.completedAt)],
    });

    // Calculate aggregate metrics
    const metrics = calculateClassMetrics(progressData, recentSessions, diagnosticResults);

    // Generate AI insights
    const aiInsights = await generateAIAnalysis(
      classRecord,
      metrics,
      studentIds.length
    );

    return {
      summary: aiInsights.summary,
      insights: aiInsights.insights,
      recommendations: aiInsights.recommendations,
      metrics,
      generatedAt: new Date(),
    };
  });
}

/**
 * Generate AI insights for a student
 * Multi-tenant: Validates teacher access to student
 *
 * Analyzes individual student performance and learning patterns
 *
 * @param studentId - Student ID to analyze
 * @returns AI-generated insights and recommendations
 */
export async function generateStudentInsights(studentId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Validate teacher access
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    // Validate teacher has access to this student
    const enrollment = await db.query.classEnrollments.findFirst({
      where: and(
        eq(schema.classEnrollments.studentId, studentId),
        eq(schema.classEnrollments.status, "active")
      ),
      with: {
        class: true,
      },
    });

    if (!enrollment || enrollment.class.teacherId !== enhancedUser.id) {
      throw new Error("Access denied: Student not in your classes");
    }

    const student = await db.query.users.findFirst({
      where: eq(schema.users.id, studentId),
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // Get student progress
    const progress = await db.query.userProgress.findFirst({
      where: and(
        eq(schema.userProgress.userId, studentId),
        eq(schema.userProgress.organizationId, organizationId)
      ),
    });

    // Get recent sessions
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSessions = await db.query.practiceSessions.findMany({
      where: and(
        eq(schema.practiceSessions.userId, studentId),
        gte(schema.practiceSessions.startedAt, thirtyDaysAgo)
      ),
      orderBy: [desc(schema.practiceSessions.startedAt)],
      limit: 20,
    });

    // Get diagnostic history
    const diagnosticResults = await db.query.studentDiagnosticResults.findMany({
      where: eq(schema.studentDiagnosticResults.studentId, studentId),
      orderBy: [desc(schema.studentDiagnosticResults.completedAt)],
      limit: 5,
    });

    // Get assignment performance
    const assignmentStatuses = await db.query.assignmentStudentStatus.findMany({
      where: eq(schema.assignmentStudentStatus.studentId, studentId),
      orderBy: [desc(schema.assignmentStudentStatus.updatedAt)],
      limit: 10,
    });

    // Calculate student metrics
    const metrics = calculateStudentMetrics(
      progress,
      recentSessions,
      diagnosticResults,
      assignmentStatuses
    );

    // Generate AI insights
    const aiInsights = await generateStudentAIAnalysis(
      student,
      metrics,
      recentSessions,
      diagnosticResults
    );

    return {
      student: {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
      },
      summary: aiInsights.summary,
      strengths: aiInsights.strengths,
      challenges: aiInsights.challenges,
      recommendations: aiInsights.recommendations,
      metrics,
      generatedAt: new Date(),
    };
  });
}

/**
 * Get aggregated insights for teacher's dashboard
 * Multi-tenant: Returns insights for teacher's organization
 *
 * Provides overview of all classes and students
 *
 * @returns Aggregated insights across all classes
 */
export async function getTeacherDashboardInsights() {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Validate teacher role
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    // Get teacher's classes
    const classes = await db.query.classes.findMany({
      where: and(
        eq(schema.classes.teacherId, enhancedUser.id),
        eq(schema.classes.organizationId, organizationId),
        eq(schema.classes.isActive, true)
      ),
    });

    // Get all student IDs
    let allStudentIds: bigint[] = [];
    for (const cls of classes) {
      const enrollments = await db.query.classEnrollments.findMany({
        where: and(
          eq(schema.classEnrollments.classId, cls.id),
          eq(schema.classEnrollments.status, "active")
        ),
      });
      allStudentIds.push(...enrollments.map((e) => e.studentId));
    }

    // Deduplicate
    allStudentIds = Array.from(new Set(allStudentIds));

    if (allStudentIds.length === 0) {
      return {
        totalClasses: classes.length,
        totalStudents: 0,
        insights: [],
        alerts: [],
      };
    }

    const { inArray } = await import("drizzle-orm");

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSessions = await db.query.practiceSessions.findMany({
      where: and(
        inArray(schema.practiceSessions.userId, allStudentIds),
        gte(schema.practiceSessions.startedAt, sevenDaysAgo)
      ),
    });

    // Get progress data
    const progressData = await db.query.userProgress.findMany({
      where: inArray(schema.userProgress.userId, allStudentIds),
    });

    // Identify students who need attention
    const studentsNeedingAttention = identifyStudentsNeedingAttention(
      allStudentIds,
      progressData,
      recentSessions
    );

    // Generate insights
    const insights = [
      {
        type: "engagement",
        title: "Student Engagement",
        description: `${recentSessions.length} practice sessions completed in the last 7 days`,
        trend: calculateEngagementTrend(recentSessions),
      },
      {
        type: "performance",
        title: "Average Progress",
        description: calculateAverageProgress(progressData),
        trend: "stable",
      },
    ];

    // Generate alerts for students needing attention
    const alerts = studentsNeedingAttention.map((studentId) => ({
      type: "warning",
      studentId,
      message: "Student showing signs of disengagement or struggling",
    }));

    return {
      totalClasses: classes.length,
      totalStudents: allStudentIds.length,
      activeStudents: new Set(recentSessions.map((s) => s.userId.toString())).size,
      insights,
      alerts,
      generatedAt: new Date(),
    };
  });
}

/**
 * Generate insights for an assignment
 * Multi-tenant: Validates teacher access to assignment
 *
 * @param assignmentId - Assignment ID to analyze
 * @returns Assignment insights and completion patterns
 */
export async function generateAssignmentInsights(assignmentId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Validate teacher access
    if (enhancedUser.role !== "teacher") {
      throw new Error("Access denied: Teacher role required");
    }

    const assignment = await db.query.assignments.findFirst({
      where: and(
        eq(schema.assignments.id, assignmentId),
        eq(schema.assignments.createdByTeacherId, enhancedUser.id),
        eq(schema.assignments.organizationId, organizationId)
      ),
    });

    if (!assignment) {
      throw new Error("Assignment not found or access denied");
    }

    // Get student statuses
    const statuses = await db.query.assignmentStudentStatus.findMany({
      where: eq(schema.assignmentStudentStatus.assignmentId, assignmentId),
    });

    // Calculate metrics
    const completed = statuses.filter((s) => s.status === "completed").length;
    const inProgress = statuses.filter((s) => s.status === "in_progress").length;
    const notStarted = statuses.filter((s) => s.status === "assigned").length;
    const overdue = statuses.filter((s) => s.status === "overdue").length;

    const avgProgress =
      statuses.reduce((sum, s) => sum + s.progressPercentage, 0) / (statuses.length || 1);

    const avgTimeSpent =
      statuses.reduce((sum, s) => sum + s.timeSpent, 0) / (statuses.length || 1);

    // Get submissions
    const submissions = await db.query.assignmentSubmissions.findMany({
      where: eq(schema.assignmentSubmissions.assignmentId, assignmentId),
    });

    const avgScore =
      submissions.reduce((sum, s) => sum + (s.totalPointsEarned || 0), 0) /
      (submissions.length || 1);

    // Generate insights
    const insights = [];

    // Completion rate insight
    const completionRate = (completed / statuses.length) * 100;
    if (completionRate < 50) {
      insights.push({
        type: "warning",
        title: "Low Completion Rate",
        description: `Only ${completionRate.toFixed(0)}% of students have completed this assignment. Consider extending the deadline or providing additional support.`,
      });
    } else if (completionRate >= 80) {
      insights.push({
        type: "success",
        title: "High Completion Rate",
        description: `${completionRate.toFixed(0)}% of students have completed this assignment. Great engagement!`,
      });
    }

    // Overdue insight
    if (overdue > 0) {
      insights.push({
        type: "alert",
        title: "Overdue Submissions",
        description: `${overdue} student${overdue !== 1 ? "s are" : " is"} past the deadline. Consider reaching out for support.`,
      });
    }

    // Performance insight
    if (submissions.length > 0) {
      if (avgScore < 60) {
        insights.push({
          type: "warning",
          title: "Low Average Score",
          description: `Average score is ${avgScore.toFixed(1)}. Students may need additional instruction on this topic.`,
        });
      } else if (avgScore >= 85) {
        insights.push({
          type: "success",
          title: "Strong Performance",
          description: `Average score is ${avgScore.toFixed(1)}. Students are demonstrating good understanding.`,
        });
      }
    }

    return {
      assignment: {
        id: assignment.id,
        title: assignment.title,
        status: assignment.status,
      },
      metrics: {
        totalStudents: statuses.length,
        completed,
        inProgress,
        notStarted,
        overdue,
        completionRate,
        avgProgress,
        avgTimeSpent,
        avgScore: submissions.length > 0 ? avgScore : null,
      },
      insights,
      generatedAt: new Date(),
    };
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate aggregate class metrics
 */
function calculateClassMetrics(
  progressData: any[],
  sessions: any[],
  diagnosticResults: any[]
) {
  const avgListeningProgress =
    progressData.reduce((sum, p) => sum + (p.listeningProgress || 0), 0) /
    (progressData.length || 1);

  const avgSpeakingProgress =
    progressData.reduce((sum, p) => sum + (p.speakingProgress || 0), 0) /
    (progressData.length || 1);

  const avgReadingProgress =
    progressData.reduce((sum, p) => sum + (p.readingProgress || 0), 0) /
    (progressData.length || 1);

  const avgWritingProgress =
    progressData.reduce((sum, p) => sum + (p.writingProgress || 0), 0) /
    (progressData.length || 1);

  const totalQuestions = sessions.reduce((sum, s) => sum + s.questionsAttempted, 0);
  const totalCorrect = sessions.reduce((sum, s) => sum + (s.questionsCorrect || 0), 0);
  const avgAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  const avgStreak =
    progressData.reduce((sum, p) => sum + (p.streak || 0), 0) / (progressData.length || 1);

  return {
    skills: {
      listening: Math.round(avgListeningProgress),
      speaking: Math.round(avgSpeakingProgress),
      reading: Math.round(avgReadingProgress),
      writing: Math.round(avgWritingProgress),
    },
    engagement: {
      totalSessions: sessions.length,
      avgAccuracy: Math.round(avgAccuracy),
      avgStreak: Math.round(avgStreak),
    },
    diagnostics: {
      totalCompleted: diagnosticResults.length,
    },
  };
}

/**
 * Calculate individual student metrics
 */
function calculateStudentMetrics(
  progress: any,
  sessions: any[],
  diagnosticResults: any[],
  assignmentStatuses: any[]
) {
  const totalQuestions = sessions.reduce((sum, s) => sum + s.questionsAttempted, 0);
  const totalCorrect = sessions.reduce((sum, s) => sum + (s.questionsCorrect || 0), 0);
  const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  const completedAssignments = assignmentStatuses.filter(
    (a) => a.status === "completed"
  ).length;
  const avgAssignmentScore =
    assignmentStatuses.reduce((sum, a) => sum + (a.teacherScore || 0), 0) /
    (assignmentStatuses.length || 1);

  return {
    skills: {
      listening: progress?.listeningProgress || 0,
      speaking: progress?.speakingProgress || 0,
      reading: progress?.readingProgress || 0,
      writing: progress?.writingProgress || 0,
    },
    engagement: {
      streak: progress?.streak || 0,
      totalSessions: sessions.length,
      questionsCompleted: progress?.questionsCompleted || 0,
      accuracy: Math.round(accuracy),
    },
    assignments: {
      total: assignmentStatuses.length,
      completed: completedAssignments,
      avgScore: Math.round(avgAssignmentScore),
    },
    diagnostics: {
      totalCompleted: diagnosticResults.length,
    },
  };
}

/**
 * Generate AI analysis using OpenAI
 */
async function generateAIAnalysis(
  classRecord: any,
  metrics: any,
  studentCount: number
) {
  const openai = getOpenAIClient();

  const prompt = `You are an ESOL education expert analyzing class performance data. Generate insights and recommendations for the teacher.

Class: ${classRecord.name}
Students: ${studentCount}

Performance Metrics:
- Average Listening Progress: ${metrics.skills.listening}%
- Average Speaking Progress: ${metrics.skills.speaking}%
- Average Reading Progress: ${metrics.skills.reading}%
- Average Writing Progress: ${metrics.skills.writing}%
- Total Practice Sessions (last 30 days): ${metrics.engagement.totalSessions}
- Average Accuracy: ${metrics.engagement.avgAccuracy}%
- Average Streak: ${metrics.engagement.avgStreak} days

Provide a JSON response with:
1. "summary": A brief 1-2 sentence overview
2. "insights": An array of 3-5 key observations (each with "title" and "description")
3. "recommendations": An array of 3-4 actionable recommendations

Focus on identifying patterns, strengths, areas for improvement, and specific teaching strategies.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating AI insights:", error);
    // Fallback to rule-based insights
    return generateRuleBasedClassInsights(metrics);
  }
}

/**
 * Generate student AI analysis using OpenAI
 */
async function generateStudentAIAnalysis(
  student: any,
  metrics: any,
  sessions: any[],
  diagnosticResults: any[]
) {
  const openai = getOpenAIClient();

  const prompt = `You are an ESOL education expert analyzing individual student performance. Generate personalized insights and recommendations.

Student: ${student.fullName}

Performance Metrics:
- Listening: ${metrics.skills.listening}%
- Speaking: ${metrics.skills.speaking}%
- Reading: ${metrics.skills.reading}%
- Writing: ${metrics.skills.writing}%
- Practice Sessions (last 30 days): ${metrics.engagement.totalSessions}
- Questions Completed: ${metrics.engagement.questionsCompleted}
- Accuracy: ${metrics.engagement.accuracy}%
- Current Streak: ${metrics.engagement.streak} days
- Completed Assignments: ${metrics.assignments.completed}/${metrics.assignments.total}
- Assignment Average Score: ${metrics.assignments.avgScore}

Provide a JSON response with:
1. "summary": A brief 1-2 sentence overview of the student's progress
2. "strengths": An array of 2-3 strengths (each with "title" and "description")
3. "challenges": An array of 2-3 challenges or areas for improvement (each with "title" and "description")
4. "recommendations": An array of 3-5 personalized recommendations for this student

Be specific and constructive. Focus on actionable advice.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating student AI insights:", error);
    // Fallback to rule-based insights
    return generateRuleBasedStudentInsights(metrics);
  }
}

/**
 * Rule-based fallback for class insights
 */
function generateRuleBasedClassInsights(metrics: any) {
  const insights = [];
  const recommendations = [];

  // Analyze skills
  const skills = Object.entries(metrics.skills) as [string, number][];
  const lowestSkill = skills.reduce((min, curr) => (curr[1] < min[1] ? curr : min));
  const highestSkill = skills.reduce((max, curr) => (curr[1] > max[1] ? curr : max));

  insights.push({
    title: "Skill Balance",
    description: `${highestSkill[0]} is the strongest skill (${highestSkill[1]}%), while ${lowestSkill[0]} needs more attention (${lowestSkill[1]}%).`,
  });

  if (lowestSkill[1] < 40) {
    recommendations.push(
      `Focus on ${lowestSkill[0]} practice with targeted exercises and additional support materials.`
    );
  }

  // Engagement analysis
  if (metrics.engagement.avgStreak < 3) {
    insights.push({
      title: "Engagement Level",
      description: "Students are not maintaining consistent study habits.",
    });
    recommendations.push(
      "Encourage daily practice with reminders and set achievable daily goals."
    );
  }

  // Accuracy analysis
  if (metrics.engagement.avgAccuracy < 60) {
    insights.push({
      title: "Performance Concern",
      description: "Average accuracy is below 60%, indicating difficulty with current material.",
    });
    recommendations.push("Consider reviewing foundational concepts before advancing.");
  }

  return {
    summary: `Class showing ${highestSkill[0]} as strongest skill. ${lowestSkill[0]} needs attention.`,
    insights,
    recommendations,
  };
}

/**
 * Rule-based fallback for student insights
 */
function generateRuleBasedStudentInsights(metrics: any) {
  const strengths = [];
  const challenges = [];
  const recommendations = [];

  // Identify strong skills
  const skills = Object.entries(metrics.skills) as [string, number][];
  const strongSkills = skills.filter(([_, value]) => value >= 70);
  const weakSkills = skills.filter(([_, value]) => value < 50);

  if (strongSkills.length > 0) {
    strengths.push({
      title: "Strong Skill Areas",
      description: `Excelling in ${strongSkills.map(([skill]) => skill).join(", ")}`,
    });
  }

  if (weakSkills.length > 0) {
    challenges.push({
      title: "Areas Needing Improvement",
      description: `Struggling with ${weakSkills.map(([skill]) => skill).join(", ")}`,
    });
    recommendations.push(
      `Provide additional practice materials for ${weakSkills.map(([skill]) => skill).join(", ")}`
    );
  }

  // Engagement
  if (metrics.engagement.streak === 0) {
    challenges.push({
      title: "Low Engagement",
      description: "No recent consistent practice activity",
    });
    recommendations.push("Check in with student about any obstacles to regular practice");
  } else if (metrics.engagement.streak >= 7) {
    strengths.push({
      title: "Consistent Learner",
      description: `Maintaining a ${metrics.engagement.streak}-day practice streak`,
    });
  }

  return {
    summary: `Student showing ${strengths.length > 0 ? "progress in key areas" : "need for additional support"}`,
    strengths,
    challenges,
    recommendations,
  };
}

/**
 * Identify students who need attention
 */
function identifyStudentsNeedingAttention(
  studentIds: bigint[],
  progressData: any[],
  recentSessions: any[]
): bigint[] {
  const needsAttention: bigint[] = [];

  for (const studentId of studentIds) {
    const progress = progressData.find((p) => p.userId === studentId);
    const sessions = recentSessions.filter((s) => s.userId === studentId);

    // No recent activity
    if (sessions.length === 0) {
      needsAttention.push(studentId);
      continue;
    }

    // Low progress across all skills
    if (progress) {
      const avgProgress =
        (progress.listeningProgress +
          progress.speakingProgress +
          progress.readingProgress +
          progress.writingProgress) /
        4;
      if (avgProgress < 30) {
        needsAttention.push(studentId);
      }
    }
  }

  return needsAttention;
}

/**
 * Calculate engagement trend
 */
function calculateEngagementTrend(sessions: any[]): "up" | "down" | "stable" {
  if (sessions.length < 2) return "stable";

  // Simple trend: compare first half to second half
  const midpoint = Math.floor(sessions.length / 2);
  const firstHalf = sessions.slice(0, midpoint).length;
  const secondHalf = sessions.slice(midpoint).length;

  if (secondHalf > firstHalf * 1.2) return "up";
  if (secondHalf < firstHalf * 0.8) return "down";
  return "stable";
}

/**
 * Calculate average progress description
 */
function calculateAverageProgress(progressData: any[]): string {
  if (progressData.length === 0) return "No progress data available";

  const avgProgress =
    progressData.reduce((sum, p) => {
      return (
        sum +
        (p.listeningProgress +
          p.speakingProgress +
          p.readingProgress +
          p.writingProgress) /
          4
      );
    }, 0) / progressData.length;

  return `${Math.round(avgProgress)}% average progress across all skills`;
}
