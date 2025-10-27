"use server";

import { fetchWithDrizzle } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Get active diagnostic tests available to the user
 * Multi-tenant: Returns tests from user's organization + system-level tests
 */
export async function getActiveDiagnosticTests() {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Get both organization-specific and system-level tests
    const tests = await db.query.diagnosticTests.findMany({
      where: and(
        schema.diagnosticTests.isActive,
        eq(schema.diagnosticTests.organizationId, organizationId)
      ),
      orderBy: [desc(schema.diagnosticTests.createdAt)],
    });

    // Also get system-level tests
    const systemTests = await db.query.diagnosticTests.findMany({
      where: and(
        schema.diagnosticTests.isActive,
        eq(schema.diagnosticTests.isSystemTest, true)
      ),
      orderBy: [desc(schema.diagnosticTests.createdAt)],
    });

    return [...systemTests, ...tests];
  });
}

/**
 * Get detailed diagnostic test by ID including all sections and questions
 * Multi-tenant: Validates access to test
 */
export async function getDiagnosticTestById(testId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Get test details
    const test = await db.query.diagnosticTests.findFirst({
      where: eq(schema.diagnosticTests.id, testId),
    });

    if (!test) {
      throw new Error("Diagnostic test not found");
    }

    // Validate access: must be system test or from user's organization
    if (!test.isSystemTest && test.organizationId !== organizationId) {
      throw new Error("Access denied to this diagnostic test");
    }

    // Get all sections for this test
    const sections = await db.query.diagnosticTestSections.findMany({
      where: eq(schema.diagnosticTestSections.diagnosticTestId, testId),
      orderBy: [schema.diagnosticTestSections.orderIndex],
    });

    // Get questions for each section
    const sectionsWithQuestions = await Promise.all(
      sections.map(async (section) => {
        const questions = await db.query.diagnosticTestQuestions.findMany({
          where: eq(schema.diagnosticTestQuestions.testSectionId, section.id),
          orderBy: [schema.diagnosticTestQuestions.orderIndex],
        });

        return {
          ...section,
          questions,
        };
      })
    );

    return {
      ...test,
      sections: sectionsWithQuestions,
    };
  });
}

/**
 * Start a new diagnostic test attempt for the current user
 * Multi-tenant: Creates attempt within user's organization
 */
export async function startDiagnosticAttempt(testId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate test exists and is accessible
    const test = await db.query.diagnosticTests.findFirst({
      where: eq(schema.diagnosticTests.id, testId),
    });

    if (!test) {
      throw new Error("Diagnostic test not found");
    }

    if (!test.isSystemTest && test.organizationId !== organizationId) {
      throw new Error("Access denied to this diagnostic test");
    }

    // Count existing attempts to set attempt number
    const existingAttempts = await db.query.studentDiagnosticAttempts.findMany({
      where: and(
        eq(schema.studentDiagnosticAttempts.studentId, enhancedUser.id),
        eq(schema.studentDiagnosticAttempts.diagnosticTestId, testId)
      ),
    });

    // Create new attempt
    const [attempt] = await db
      .insert(schema.studentDiagnosticAttempts)
      .values({
        studentId: enhancedUser.id,
        organizationId,
        diagnosticTestId: testId,
        attemptNumber: existingAttempts.length + 1,
        isCompleted: false,
      })
      .returning();

    return attempt;
  });
}

/**
 * Submit an answer for a diagnostic test question
 * Multi-tenant: Validates attempt belongs to user's organization
 */
export async function submitDiagnosticAnswer({
  attemptId,
  questionId,
  studentAnswer,
  audioRecordingId,
  transcriptionId,
  timeSpent,
}: {
  attemptId: bigint;
  questionId: bigint;
  studentAnswer?: string;
  audioRecordingId?: bigint;
  transcriptionId?: bigint;
  timeSpent?: number;
}) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate attempt belongs to current user and organization
    const attempt = await db.query.studentDiagnosticAttempts.findFirst({
      where: and(
        eq(schema.studentDiagnosticAttempts.id, attemptId),
        eq(schema.studentDiagnosticAttempts.studentId, enhancedUser.id),
        eq(schema.studentDiagnosticAttempts.organizationId, organizationId)
      ),
    });

    if (!attempt) {
      throw new Error("Diagnostic attempt not found or access denied");
    }

    if (attempt.isCompleted) {
      throw new Error("Cannot submit answer to completed test");
    }

    // Get question details to determine if answer is correct
    const question = await db.query.diagnosticTestQuestions.findFirst({
      where: eq(schema.diagnosticTestQuestions.id, questionId),
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Determine if answer is correct (for auto-graded questions)
    let isCorrect = null;
    let pointsEarned = 0;

    if (question.correctAnswer && studentAnswer) {
      isCorrect = studentAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      pointsEarned = isCorrect ? question.points : 0;
    }

    // Check if response already exists (update instead of insert)
    const existingResponse = await db.query.diagnosticQuestionResponses.findFirst({
      where: and(
        eq(schema.diagnosticQuestionResponses.attemptId, attemptId),
        eq(schema.diagnosticQuestionResponses.questionId, questionId)
      ),
    });

    if (existingResponse) {
      // Update existing response
      const [updated] = await db
        .update(schema.diagnosticQuestionResponses)
        .set({
          studentAnswer,
          audioRecordingId,
          transcriptionId,
          isCorrect,
          pointsEarned,
          timeSpent,
        })
        .where(eq(schema.diagnosticQuestionResponses.id, existingResponse.id))
        .returning();

      return updated;
    }

    // Create new response
    const [response] = await db
      .insert(schema.diagnosticQuestionResponses)
      .values({
        attemptId,
        questionId,
        studentAnswer,
        audioRecordingId,
        transcriptionId,
        isCorrect,
        pointsEarned,
        timeSpent,
      })
      .returning();

    return response;
  });
}

/**
 * Complete a diagnostic test attempt and generate results
 * Multi-tenant: Validates attempt and creates results within organization
 */
export async function completeDiagnosticAttempt(attemptId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    if (!enhancedUser) {
      throw new Error("User context required");
    }

    // Validate attempt
    const attempt = await db.query.studentDiagnosticAttempts.findFirst({
      where: and(
        eq(schema.studentDiagnosticAttempts.id, attemptId),
        eq(schema.studentDiagnosticAttempts.studentId, enhancedUser.id),
        eq(schema.studentDiagnosticAttempts.organizationId, organizationId)
      ),
    });

    if (!attempt) {
      throw new Error("Diagnostic attempt not found or access denied");
    }

    if (attempt.isCompleted) {
      throw new Error("Test already completed");
    }

    // Get test details
    const test = await db.query.diagnosticTests.findFirst({
      where: eq(schema.diagnosticTests.id, attempt.diagnosticTestId),
    });

    if (!test) {
      throw new Error("Diagnostic test not found");
    }

    // Get all responses for this attempt
    const responses = await db.query.diagnosticQuestionResponses.findMany({
      where: eq(schema.diagnosticQuestionResponses.attemptId, attemptId),
    });

    // Get all questions to calculate scores by skill
    const questionIds = responses.map((r) => r.questionId);
    const questions = await db.query.diagnosticTestQuestions.findMany({
      where: eq(schema.diagnosticTestQuestions.id, questionIds[0]), // This is a limitation, will need better query
    });

    // Calculate scores by skill
    const skillScores: Record<string, { earned: number; total: number }> = {};
    const skillLevels: Record<string, string> = {};

    // Get sections to determine skills
    const sections = await db.query.diagnosticTestSections.findMany({
      where: eq(schema.diagnosticTestSections.diagnosticTestId, attempt.diagnosticTestId),
    });

    for (const section of sections) {
      const sectionQuestions = await db.query.diagnosticTestQuestions.findMany({
        where: eq(schema.diagnosticTestQuestions.testSectionId, section.id),
      });

      const sectionResponses = responses.filter((r) =>
        sectionQuestions.some((q) => q.id === r.questionId)
      );

      const totalPoints = sectionQuestions.reduce((sum, q) => sum + q.points, 0);
      const earnedPoints = sectionResponses.reduce((sum, r) => sum + r.pointsEarned, 0);

      const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

      skillScores[section.skillType] = {
        earned: earnedPoints,
        total: totalPoints,
      };

      // Determine skill level based on percentage
      // This is a simplified algorithm - should be more sophisticated in production
      let level = section.levelRangeMin;
      if (percentage >= 90) level = section.levelRangeMax;
      else if (percentage >= 75) level = section.levelRangeMax; // Adjust this logic
      else if (percentage >= 50) level = section.levelRangeMin;

      skillLevels[section.skillType] = level;
    }

    // Calculate overall level (most common skill level)
    const levelCounts: Record<string, number> = {};
    Object.values(skillLevels).forEach((level) => {
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });

    const overallLevel = Object.keys(levelCounts).reduce((a, b) =>
      levelCounts[a] > levelCounts[b] ? a : b
    );

    // Calculate total score
    const totalScore = responses.reduce((sum, r) => sum + r.pointsEarned, 0);
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
    const percentageScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    // Generate recommendations (placeholder - should use AI)
    const strengths: string[] = [];
    const areasForImprovement: string[] = [];
    const recommendedNextSteps: string[] = [];

    Object.entries(skillScores).forEach(([skill, score]) => {
      const percentage = (score.earned / score.total) * 100;
      if (percentage >= 75) {
        strengths.push(skill);
      } else if (percentage < 50) {
        areasForImprovement.push(skill);
        recommendedNextSteps.push(`Focus on ${skill} practice`);
      }
    });

    // Mark attempt as completed
    const completedAt = new Date();
    const totalDuration = Math.floor((completedAt.getTime() - attempt.startedAt.getTime()) / 1000);

    await db
      .update(schema.studentDiagnosticAttempts)
      .set({
        isCompleted: true,
        completedAt,
        totalDuration,
      })
      .where(eq(schema.studentDiagnosticAttempts.id, attemptId));

    // Create results record
    const [results] = await db
      .insert(schema.studentDiagnosticResults)
      .values({
        studentId: enhancedUser.id,
        organizationId,
        attemptId,
        diagnosticTestId: attempt.diagnosticTestId,
        levelSystem: test.levelSystem,
        overallLevel,
        skillLevels,
        skillScores,
        strengths,
        areasForImprovement,
        recommendedNextSteps,
        totalScore,
        percentageScore: percentageScore.toString(),
        completedAt,
      })
      .returning();

    // Update user's NZCEL or CEFR level based on diagnostic results
    if (test.levelSystem === "nzcel") {
      // Check if user has existing NZCEL progress
      const existingProgress = await db.query.userProgress.findFirst({
        where: and(
          eq(schema.userProgress.userId, userId),
          eq(schema.userProgress.organizationId, organizationId)
        ),
      });

      if (existingProgress) {
        // Update existing progress with new level
        await db
          .update(schema.userProgress)
          .set({
            currentLevel: overallLevel,
            // Update skill progress based on scores
            listeningProgress: skillLevels.listening ?
              Math.round((skillScores.listening?.earned / skillScores.listening?.total) * 100) :
              existingProgress.listeningProgress,
            speakingProgress: skillLevels.speaking ?
              Math.round((skillScores.speaking?.earned / skillScores.speaking?.total) * 100) :
              existingProgress.speakingProgress,
            readingProgress: skillLevels.reading ?
              Math.round((skillScores.reading?.earned / skillScores.reading?.total) * 100) :
              existingProgress.readingProgress,
            writingProgress: skillLevels.writing ?
              Math.round((skillScores.writing?.earned / skillScores.writing?.total) * 100) :
              existingProgress.writingProgress,
          })
          .where(eq(schema.userProgress.id, existingProgress.id));
      } else {
        // Create new progress record
        await db.insert(schema.userProgress).values({
          userId,
          organizationId,
          currentLevel: overallLevel,
          targetLevel: overallLevel, // Set same as current initially
          listeningProgress: skillLevels.listening ?
            Math.round((skillScores.listening?.earned / skillScores.listening?.total) * 100) : 0,
          speakingProgress: skillLevels.speaking ?
            Math.round((skillScores.speaking?.earned / skillScores.speaking?.total) * 100) : 0,
          readingProgress: skillLevels.reading ?
            Math.round((skillScores.reading?.earned / skillScores.reading?.total) * 100) : 0,
          writingProgress: skillLevels.writing ?
            Math.round((skillScores.writing?.earned / skillScores.writing?.total) * 100) : 0,
          totalPoints: totalScore,
          questionsCompleted: responses.length,
          streakDays: 0,
          lastActivityDate: new Date(),
        });
      }
    } else if (test.levelSystem === "cefr") {
      // Update CEFR progress
      const existingCEFR = await db.query.cefrProgress.findFirst({
        where: and(
          eq(schema.cefrProgress.userId, userId),
          eq(schema.cefrProgress.organizationId, organizationId)
        ),
      });

      if (existingCEFR) {
        // Update existing CEFR progress
        await db
          .update(schema.cefrProgress)
          .set({
            currentLevel: overallLevel,
            listeningProgress: skillLevels.listening ?
              Math.round((skillScores.listening?.earned / skillScores.listening?.total) * 100) :
              existingCEFR.listeningProgress,
            speakingProgress: skillLevels.speaking ?
              Math.round((skillScores.speaking?.earned / skillScores.speaking?.total) * 100) :
              existingCEFR.speakingProgress,
            readingProgress: skillLevels.reading ?
              Math.round((skillScores.reading?.earned / skillScores.reading?.total) * 100) :
              existingCEFR.readingProgress,
            writingProgress: skillLevels.writing ?
              Math.round((skillScores.writing?.earned / skillScores.writing?.total) * 100) :
              existingCEFR.writingProgress,
          })
          .where(eq(schema.cefrProgress.id, existingCEFR.id));
      } else {
        // Create new CEFR progress record
        await db.insert(schema.cefrProgress).values({
          userId,
          organizationId,
          currentLevel: overallLevel,
          targetLevel: overallLevel, // Set same as current initially
          listeningProgress: skillLevels.listening ?
            Math.round((skillScores.listening?.earned / skillScores.listening?.total) * 100) : 0,
          speakingProgress: skillLevels.speaking ?
            Math.round((skillScores.speaking?.earned / skillScores.speaking?.total) * 100) : 0,
          readingProgress: skillLevels.reading ?
            Math.round((skillScores.reading?.earned / skillScores.reading?.total) * 100) : 0,
          writingProgress: skillLevels.writing ?
            Math.round((skillScores.writing?.earned / skillScores.writing?.total) * 100) : 0,
          totalPoints: totalScore,
          questionsCompleted: responses.length,
        });
      }
    }

    return results;
  });
}

/**
 * Get diagnostic test results by attempt ID
 * Multi-tenant: Validates access to results
 */
export async function getDiagnosticResults(attemptId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const results = await db.query.studentDiagnosticResults.findFirst({
      where: and(
        eq(schema.studentDiagnosticResults.attemptId, attemptId),
        eq(schema.studentDiagnosticResults.organizationId, organizationId)
      ),
    });

    if (!results) {
      throw new Error("Results not found");
    }

    // Validate access: must be the student or a teacher in the organization
    if (results.studentId !== enhancedUser.id && enhancedUser.role !== "teacher") {
      throw new Error("Access denied to these results");
    }

    // Get the test details
    const test = await db.query.diagnosticTests.findFirst({
      where: eq(schema.diagnosticTests.id, results.diagnosticTestId),
    });

    return {
      ...results,
      test,
    };
  });
}

/**
 * Get student's diagnostic test history
 * Multi-tenant: Returns history from user's organization
 */
export async function getStudentDiagnosticHistory(studentId?: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId, enhancedUser }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    // Determine which student's history to retrieve
    const targetStudentId = studentId || enhancedUser.id;

    // Validate access
    if (targetStudentId !== enhancedUser.id && enhancedUser.role !== "teacher") {
      throw new Error("Access denied to student history");
    }

    // Get all completed attempts
    const attempts = await db.query.studentDiagnosticAttempts.findMany({
      where: and(
        eq(schema.studentDiagnosticAttempts.studentId, targetStudentId),
        eq(schema.studentDiagnosticAttempts.organizationId, organizationId),
        eq(schema.studentDiagnosticAttempts.isCompleted, true)
      ),
      orderBy: [desc(schema.studentDiagnosticAttempts.completedAt)],
    });

    // Get results for each attempt
    const history = await Promise.all(
      attempts.map(async (attempt) => {
        const results = await db.query.studentDiagnosticResults.findFirst({
          where: eq(schema.studentDiagnosticResults.attemptId, attempt.id),
        });

        const test = await db.query.diagnosticTests.findFirst({
          where: eq(schema.diagnosticTests.id, attempt.diagnosticTestId),
        });

        return {
          attempt,
          results,
          test,
        };
      })
    );

    return history;
  });
}

/**
 * Generate AI-powered recommendations based on diagnostic results
 * This is a placeholder - should integrate with OpenAI for better recommendations
 */
export async function generateDiagnosticRecommendations(resultsId: bigint) {
  return fetchWithDrizzle(async (db, { userId, organizationId }) => {
    if (!organizationId) {
      throw new Error("Organization context required");
    }

    const results = await db.query.studentDiagnosticResults.findFirst({
      where: and(
        eq(schema.studentDiagnosticResults.id, resultsId),
        eq(schema.studentDiagnosticResults.organizationId, organizationId)
      ),
    });

    if (!results) {
      throw new Error("Results not found");
    }

    // Placeholder recommendations
    // TODO: Integrate with OpenAI API for personalized recommendations
    const recommendations = {
      dailyPracticeMinutes: 30,
      focusSkills: results.areasForImprovement,
      suggestedLearningPath: results.overallLevel,
      estimatedTimeToNextLevel: "3-6 months",
    };

    return recommendations;
  });
}
