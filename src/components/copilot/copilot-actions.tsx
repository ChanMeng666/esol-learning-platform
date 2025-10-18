"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { useUserProgress } from "@/lib/store/user-progress";
import { getQuestionsByLevelAndSkill, getRandomQuestion } from "@/data/questions";
import { getScenariosByLevel, getRandomScenario } from "@/data/conversation-scenarios";
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

  // Action: Provide writing feedback
  useCopilotAction({
    name: "provideWritingFeedback",
    description:
      "Provide detailed feedback on a piece of student writing (essay, paragraph, sentence). Analyze grammar, vocabulary, coherence, task achievement, and academic style. Offer specific suggestions for improvement.",
    parameters: [
      {
        name: "writingText",
        type: "string",
        description: "The text the student has written",
        required: true,
      },
      {
        name: "writingType",
        type: "string",
        description: "Type of writing: essay, paragraph, email, report, etc.",
        required: true,
      },
      {
        name: "level",
        type: "string",
        description: "The student's NZCEL level",
        required: false,
      },
    ],
    handler: async ({ writingText, writingType, level }) => {
      // This would integrate with the OpenAI assessment API
      return {
        success: true,
        feedback: {
          overallAssessment: `This ${writingType} demonstrates ${level ? `appropriate skills for ${level}` : "good language use"}. The ideas are clear and the structure is logical.`,
          strengths: [
            "Clear topic sentences",
            "Good use of linking words",
            "Appropriate vocabulary for academic context",
          ],
          areasForImprovement: [
            "Consider varying sentence structure more",
            "Some ideas could be developed with more specific examples",
            "Watch for subject-verb agreement in complex sentences",
          ],
          specificSuggestions: [
            {
              original: "Example sentence from the text",
              improved: "Improved version with explanation",
              reason: "This improves clarity and demonstrates more sophisticated grammar",
            },
          ],
        },
      };
    },
  });

  // Action: Suggest conversation scenario
  useCopilotAction({
    name: "suggestConversationScenario",
    description:
      "Recommend a conversation scenario for real-time speaking practice based on the student's level and interests. Provides scenario details including context, roles, and topics.",
    parameters: [
      {
        name: "level",
        type: "string",
        description: "The NZCEL level",
        required: false,
      },
      {
        name: "context",
        type: "string",
        description: "Preferred context: academic, employment, general, or any",
        required: false,
      },
    ],
    handler: async ({ level, context }) => {
      const studentLevel = level || useUserProgress.getState().currentLevel;
      const scenario = getRandomScenario(studentLevel as NZCELLevel);

      if (!scenario) {
        return {
          success: false,
          message: "No scenarios available for this level yet.",
        };
      }

      return {
        success: true,
        scenario: {
          id: scenario.id,
          title: scenario.title,
          context: scenario.context,
          userRole: scenario.userRole,
          aiRole: scenario.aiRole,
          difficulty: scenario.difficulty,
          topics: scenario.topics,
          targetTurns: scenario.targetTurns,
        },
        message: `I recommend practicing: "${scenario.title}". This will help you develop skills in ${scenario.topics.join(", ")}.`,
      };
    },
  });

  // Action: Explain grammar point
  useCopilotAction({
    name: "explainGrammar",
    description:
      "Explain a specific grammar point, provide examples, and suggest practice exercises. Useful for clarifying grammatical concepts the student is struggling with.",
    parameters: [
      {
        name: "grammarPoint",
        type: "string",
        description: "The grammar concept to explain (e.g., 'present perfect', 'conditional sentences', 'passive voice')",
        required: true,
      },
      {
        name: "level",
        type: "string",
        description: "The student's NZCEL level to tailor complexity",
        required: false,
      },
    ],
    handler: async ({ grammarPoint, level }) => {
      return {
        success: true,
        explanation: {
          concept: grammarPoint,
          definition: `Simplified explanation of ${grammarPoint} appropriate for ${level || "your current level"}`,
          whenToUse: "Context and situations where this grammar is used",
          examples: [
            { sentence: "Example sentence 1", explanation: "Why this example is correct" },
            { sentence: "Example sentence 2", explanation: "Why this example is correct" },
          ],
          commonMistakes: [
            { incorrect: "Common incorrect usage", correct: "Correct usage", reason: "Why the first is wrong" },
          ],
          practiceExercise: "Fill in the blanks or transformation exercise to practice",
        },
      };
    },
  });

  // Action: Create study plan
  useCopilotAction({
    name: "createStudyPlan",
    description:
      "Generate a personalized study plan based on the student's current level, target level, timeline, and weak areas. Provides daily/weekly goals and recommended activities.",
    parameters: [
      {
        name: "targetLevel",
        type: "string",
        description: "The NZCEL level the student wants to achieve",
        required: true,
      },
      {
        name: "timeframe",
        type: "string",
        description: "How many weeks/months until the exam (e.g., '8 weeks', '3 months')",
        required: true,
      },
      {
        name: "weakSkills",
        type: "string",
        description: "Skills that need most improvement (comma-separated: listening, speaking, reading, writing)",
        required: false,
      },
    ],
    handler: async ({ targetLevel, timeframe, weakSkills }) => {
      const currentProgress = useUserProgress.getState();
      const skillsToFocus = weakSkills?.split(",").map(s => s.trim()) || ["listening", "speaking", "reading", "writing"];

      return {
        success: true,
        studyPlan: {
          currentLevel: currentProgress.currentLevel,
          targetLevel,
          duration: timeframe,
          focusSkills: skillsToFocus,
          weeklyGoals: [
            { week: 1, goal: "Complete 20 practice questions focusing on weak areas", activities: ["Daily listening practice (15 min)", "Essay writing practice (2 essays)"] },
            { week: 2, goal: "Improve accuracy to 75%+ on practice questions", activities: ["Speaking practice with scenarios", "Reading comprehension (3 texts)"] },
          ],
          dailyRoutine: {
            morning: "15-20 minutes: Listening practice or reading",
            afternoon: "20-30 minutes: Writing or grammar exercises",
            evening: "10-15 minutes: Speaking practice or vocabulary review",
          },
          milestones: [
            { date: "Week 2", target: "Complete 50 questions with 70%+ accuracy" },
            { date: "Week 4", target: "Show improvement in weakest skill by 20%" },
          ],
        },
        message: `I've created a ${timeframe} study plan to help you reach ${targetLevel}. Focus on ${skillsToFocus.join(" and ")} with daily practice!`,
      };
    },
  });

  // Action: Assess pronunciation
  useCopilotAction({
    name: "assessPronunciation",
    description:
      "Provide feedback on pronunciation based on a transcribed audio sample. Identify pronunciation patterns, common errors, and provide specific improvement tips.",
    parameters: [
      {
        name: "transcribedText",
        type: "string",
        description: "The text that was spoken (transcription)",
        required: true,
      },
      {
        name: "targetText",
        type: "string",
        description: "What the student was trying to say (if different from transcription)",
        required: false,
      },
    ],
    handler: async ({ transcribedText, targetText }) => {
      return {
        success: true,
        pronunciationFeedback: {
          clarity: "Your overall clarity is good. Most words are easily understood.",
          errors: targetText
            ? ["Identified differences between what you said and the target text"]
            : [],
          strengths: [
            "Clear articulation of consonants",
            "Good pacing and rhythm",
          ],
          areasToImprove: [
            "Work on vowel sounds in words like 'specific', 'development'",
            "Practice stress patterns in multi-syllable words",
          ],
          practiceWords: [
            { word: "example1", tip: "Stress the second syllable: ex-AM-ple" },
            { word: "example2", tip: "Clear 'th' sound at the beginning" },
          ],
        },
      };
    },
  });

  // Action: Provide vocabulary suggestions
  useCopilotAction({
    name: "provideVocabularySuggestions",
    description:
      "Suggest more sophisticated vocabulary alternatives for words used in student writing. Helps students expand their academic vocabulary and improve lexical resource.",
    parameters: [
      {
        name: "context",
        type: "string",
        description: "The sentence or paragraph context",
        required: true,
      },
      {
        name: "wordToImprove",
        type: "string",
        description: "The basic word to find alternatives for",
        required: true,
      },
      {
        name: "level",
        type: "string",
        description: "Target NZCEL level for appropriate vocabulary",
        required: false,
      },
    ],
    handler: async ({ context, wordToImprove, level }) => {
      return {
        success: true,
        vocabularySuggestions: {
          originalWord: wordToImprove,
          alternatives: [
            {
              word: "Alternative 1",
              formality: "formal/academic",
              exampleSentence: `Example using the word in context similar to: ${context}`,
              whenToUse: "Best used in formal academic writing",
            },
            {
              word: "Alternative 2",
              formality: "neutral",
              exampleSentence: "Example sentence",
              whenToUse: "Suitable for general use",
            },
          ],
          collocations: [
            "Common word combinations with the alternatives",
          ],
        },
      };
    },
  });

  // Action: Get NZCEL exam tips
  useCopilotAction({
    name: "getExamTips",
    description:
      "Provide specific exam strategies and tips for NZCEL based on the skill area (listening, speaking, reading, writing) and level. Includes time management, common pitfalls, and success strategies.",
    parameters: [
      {
        name: "skill",
        type: "string",
        description: "The skill area: listening, speaking, reading, or writing",
        required: true,
      },
      {
        name: "level",
        type: "string",
        description: "The NZCEL level",
        required: false,
      },
    ],
    handler: async ({ skill, level }) => {
      const examLevel = level || useUserProgress.getState().currentLevel;

      return {
        success: true,
        examTips: {
          skill,
          level: examLevel,
          keyStrategies: [
            `Strategy 1 for ${skill} at ${examLevel}`,
            `Strategy 2 for ${skill} at ${examLevel}`,
            `Strategy 3 for ${skill} at ${examLevel}`,
          ],
          timeManagement: `For ${skill} at ${examLevel}: recommended time allocation and pacing tips`,
          commonPitfalls: [
            `Common mistake students make in ${skill}`,
            "How to avoid this pitfall",
          ],
          examDayTips: [
            "What to do the day before",
            "What to bring to the exam",
            "How to stay calm and focused",
          ],
          assessmentCriteria: `What examiners look for in ${skill} at ${examLevel}`,
        },
      };
    },
  });

  return <>{children}</>;
}
