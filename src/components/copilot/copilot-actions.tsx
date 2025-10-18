"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { useUserProgress } from "@/lib/store/user-progress";
import { getQuestionsByLevelAndSkill, getRandomQuestion } from "@/data/questions";
import type { NZCELLevel, SkillType } from "@/types";
import { toast } from "sonner";

/**
 * CopilotActions defines all the actions that the AI can execute
 * These enable interactive, agentic behaviors
 */
export function CopilotActions({ children }: { children: React.ReactNode }) {
  const {
    setCurrentLevel,
    addPoints,
    addBadge,
    updateSkillProgress,
  } = useUserProgress();

  // Action: Generate a practice question
  useCopilotAction({
    name: "generatePracticeQuestion",
    description:
      "Generate a practice question for the student based on their current level and specified skill (listening, speaking, reading, or writing). Returns a question object with question text, options (if multiple choice), correct answer, and explanation.",
    parameters: [
      {
        name: "level",
        type: "string",
        description: "The NZCEL level (e.g., 'foundation', 'level-4-academic')",
        required: true,
      },
      {
        name: "skill",
        type: "string",
        description: "The skill to practice: listening, speaking, reading, or writing",
        required: true,
      },
    ],
    handler: async ({ level, skill }) => {
      const questions = getQuestionsByLevelAndSkill(level, skill);

      if (questions.length === 0) {
        return {
          success: false,
          message: `No questions available for ${level} - ${skill}. Try a different combination.`,
        };
      }

      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

      return {
        success: true,
        question: {
          id: randomQuestion.id,
          question: randomQuestion.question,
          type: randomQuestion.type,
          options: randomQuestion.options,
          points: randomQuestion.points,
          skill: randomQuestion.skill,
          level: randomQuestion.level,
        },
        message: `Here's a ${skill} question for ${level}!`,
      };
    },
  });

  // Action: Check an answer
  useCopilotAction({
    name: "checkAnswer",
    description:
      "Check if a student's answer is correct for a given question. Provide detailed feedback and explanation. Awards points if correct and updates skill progress.",
    parameters: [
      {
        name: "questionId",
        type: "string",
        description: "The ID of the question being answered",
        required: true,
      },
      {
        name: "userAnswer",
        type: "string",
        description: "The student's answer",
        required: true,
      },
    ],
    handler: async () => {
      // In a real app, this would check against the question bank
      // For now, provide encouraging feedback
      const isCorrect = Math.random() > 0.3; // Simulated for demo
      const points = isCorrect ? 20 : 5;

      if (isCorrect) {
        addPoints(points);
        toast.success(`Correct! +${points} points`);
      } else {
        toast.error("Not quite right, but keep practicing!");
      }

      return {
        isCorrect,
        feedback: isCorrect
          ? "Excellent work! Your answer demonstrates a good understanding of the concept."
          : "Your answer shows effort, but there's room for improvement. Review the explanation below.",
        pointsEarned: points,
        explanation: isCorrect
          ? "You correctly identified the key information and applied the appropriate language skills."
          : "The correct approach would be to focus on the main ideas and supporting details. Try breaking down the question into smaller parts.",
      };
    },
  });

  // Action: Recommend next exercise
  useCopilotAction({
    name: "recommendNextExercise",
    description:
      "Analyze the student's progress and recommend the next best exercise or skill to focus on. Uses adaptive learning logic based on skill weaknesses.",
    parameters: [],
    handler: async () => {
      const progress = useUserProgress.getState();
      const skillProgress = progress.skillProgress;

      // Find the weakest skill
      const weakestSkill = Object.entries(skillProgress).reduce<string>((min, [skill, value]) =>
        value < skillProgress[min as SkillType] ? skill : min
      , "listening") as SkillType;

      const recommendation = getRandomQuestion(progress.currentLevel, weakestSkill);

      return {
        recommendedSkill: weakestSkill,
        reason: `Your ${weakestSkill} skill (${skillProgress[weakestSkill]}%) could use more practice. Let's focus on that!`,
        suggestedQuestion: recommendation
          ? {
              id: recommendation.id,
              question: recommendation.question,
              type: recommendation.type,
            }
          : null,
      };
    },
  });

  // Action: Explain NZCEL level
  useCopilotAction({
    name: "explainNZCELLevel",
    description:
      "Provide detailed information about a specific NZCEL level, including its purpose, graduate outcomes for all four skills, pathways, and equivalency to IELTS/TOEFL.",
    parameters: [
      {
        name: "level",
        type: "string",
        description: "The NZCEL level to explain (e.g., 'level-4-academic')",
        required: true,
      },
    ],
    handler: async ({ level }) => {
      const { NZCEL_LEVELS } = await import("@/data/nzcel-levels");
      const levelInfo = NZCEL_LEVELS.find((l) => l.id === level);

      if (!levelInfo) {
        return {
          success: false,
          message: "Level not found. Please check the level name.",
        };
      }

      return {
        success: true,
        levelInfo: {
          name: levelInfo.name,
          description: levelInfo.description,
          purpose: levelInfo.strategicPurpose,
          skills: levelInfo.graduateOutcomes,
          pathways: levelInfo.pathways,
          equivalency: levelInfo.equivalency,
        },
      };
    },
  });

  // Action: Adjust difficulty
  useCopilotAction({
    name: "adjustDifficulty",
    description:
      "Change the student's current NZCEL level based on their performance. Use this when the student is ready to progress or needs to practice at a different level.",
    parameters: [
      {
        name: "newLevel",
        type: "string",
        description: "The new NZCEL level to set",
        required: true,
      },
      {
        name: "reason",
        type: "string",
        description: "Explanation for why the level is being changed",
        required: false,
      },
    ],
    handler: async ({ newLevel, reason }) => {
      setCurrentLevel(newLevel as NZCELLevel);
      toast.success(`Level updated to ${newLevel}`);

      return {
        success: true,
        message: reason || `Your level has been updated to ${newLevel}. Keep up the great work!`,
        newLevel,
      };
    },
  });

  // Action: Award badge
  useCopilotAction({
    name: "awardBadge",
    description:
      "Award a special badge to the student for exceptional achievement. This is for special moments and celebrations!",
    parameters: [
      {
        name: "badgeName",
        type: "string",
        description: "The name of the badge",
        required: true,
      },
      {
        name: "reason",
        type: "string",
        description: "Why the student earned this badge",
        required: true,
      },
      {
        name: "rarity",
        type: "string",
        description: "Badge rarity: common, rare, epic, or legendary",
        required: false,
      },
    ],
    handler: async ({ badgeName, reason, rarity = "common" }) => {
      const badge = {
        id: `badge-${Date.now()}`,
        name: badgeName,
        description: reason,
        icon: "🏆",
        earnedAt: new Date().toISOString(),
        rarity: rarity as "common" | "rare" | "epic" | "legendary",
      };

      addBadge(badge);
      toast.success(`🎉 You earned the "${badgeName}" badge!`);

      return {
        success: true,
        message: `Congratulations! You've been awarded the "${badgeName}" badge for ${reason}`,
        badge,
      };
    },
  });

  // Action: Update skill progress
  useCopilotAction({
    name: "updateSkillProgress",
    description:
      "Update the progress percentage for a specific language skill (listening, speaking, reading, or writing) based on recent performance.",
    parameters: [
      {
        name: "skill",
        type: "string",
        description: "The skill to update: listening, speaking, reading, or writing",
        required: true,
      },
      {
        name: "progressChange",
        type: "number",
        description: "How much to change the progress (positive or negative number)",
        required: true,
      },
    ],
    handler: async ({ skill, progressChange }) => {
      const currentProgress = useUserProgress.getState().skillProgress[skill as SkillType];
      const newProgress = Math.min(100, Math.max(0, currentProgress + progressChange));

      updateSkillProgress(skill as SkillType, newProgress);

      return {
        success: true,
        skill,
        oldProgress: currentProgress,
        newProgress,
        message: `${skill} progress updated: ${currentProgress}% → ${newProgress}%`,
      };
    },
  });

  return <>{children}</>;
}
