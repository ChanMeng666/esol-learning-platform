import { Question } from "@/types";
import { FOUNDATION_QUESTIONS } from "./foundation";
import { LEVEL_1_QUESTIONS } from "./level-1";
import { LEVEL_2_QUESTIONS } from "./level-2";
import { LEVEL_3_QUESTIONS } from "./level-3";
import { LEVEL_4_QUESTIONS } from "./level-4";
import { LEVEL_5_QUESTIONS } from "./level-5";

/**
 * Comprehensive NZCEL Question Bank
 * Total: 200 questions across all levels (Foundation to Level 5)
 * Organized by NZCEL level and stream (General, Applied/Employment, Academic)
 *
 * Question Distribution:
 * - Foundation: 20 questions (5 per skill)
 * - Level 1: 20 questions (5 per skill)
 * - Level 2: 25 questions (6-7 per skill)
 * - Level 3: 40 questions across 3 streams
 *   - General: 12 questions
 *   - Applied: 14 questions
 *   - Academic: 14 questions
 * - Level 4: 50 questions across 3 streams ⭐ (Most critical for undergraduate entry)
 *   - General: 15 questions
 *   - Employment: 15 questions
 *   - Academic: 20 questions
 * - Level 5: 45 questions across 3 streams ⭐⭐ (Postgraduate entry)
 *   - General: 12 questions
 *   - Employment: 13 questions
 *   - Academic: 20 questions
 *
 * Question Types:
 * - audio-comprehension: Listening with TTS-generated or pre-recorded audio
 * - voice-recording: Speaking with recording and AI assessment
 * - realtime-conversation: Interactive speaking practice with Realtime API
 * - multiple-choice: Reading comprehension and listening
 * - fill-in-blank: Grammar and vocabulary
 * - essay: Writing with AI grading
 */

export const ALL_QUESTIONS: Question[] = [
  ...FOUNDATION_QUESTIONS,
  ...LEVEL_1_QUESTIONS,
  ...LEVEL_2_QUESTIONS,
  ...LEVEL_3_QUESTIONS,
  ...LEVEL_4_QUESTIONS,
  ...LEVEL_5_QUESTIONS,
];

// Helper function to get questions by level
export function getQuestionsByLevel(level: string): Question[] {
  return ALL_QUESTIONS.filter((q) => q.level === level);
}

// Helper function to get questions by skill
export function getQuestionsBySkill(skill: string): Question[] {
  return ALL_QUESTIONS.filter((q) => q.skill === skill);
}

// Helper function to get questions by level and skill
export function getQuestionsByLevelAndSkill(level: string, skill: string): Question[] {
  return ALL_QUESTIONS.filter((q) => q.level === level && q.skill === skill);
}

// Helper function to get questions by type
export function getQuestionsByType(type: string): Question[] {
  return ALL_QUESTIONS.filter((q) => q.type === type);
}

// Get a random question with optional filters
export function getRandomQuestion(
  level?: string,
  skill?: string,
  type?: string
): Question | undefined {
  let questions = [...ALL_QUESTIONS];

  if (level) {
    questions = questions.filter((q) => q.level === level);
  }
  if (skill) {
    questions = questions.filter((q) => q.skill === skill);
  }
  if (type) {
    questions = questions.filter((q) => q.type === type);
  }

  if (questions.length === 0) return undefined;

  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

// Get statistics about the question bank
export function getQuestionBankStats() {
  const stats = {
    total: ALL_QUESTIONS.length,
    byLevel: {} as Record<string, number>,
    bySkill: {} as Record<string, number>,
    byType: {} as Record<string, number>,
  };

  ALL_QUESTIONS.forEach((q) => {
    // Count by level
    stats.byLevel[q.level] = (stats.byLevel[q.level] || 0) + 1;

    // Count by skill
    stats.bySkill[q.skill] = (stats.bySkill[q.skill] || 0) + 1;

    // Count by type
    stats.byType[q.type] = (stats.byType[q.type] || 0) + 1;
  });

  return stats;
}

// Export for backward compatibility with existing code
export { ALL_QUESTIONS as SAMPLE_QUESTIONS };
