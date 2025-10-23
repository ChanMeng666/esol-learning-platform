import type { Question, CEFRLevel, SkillType } from "@/types";

/**
 * CEFR Question Bank
 *
 * Sample questions organized by CEFR level (A1-C2) and skill type
 * This is a starter set - should be expanded with more questions
 */

export const CEFR_QUESTIONS: Question[] = [
  // ============================================================================
  // A1 LEVEL QUESTIONS (Beginner)
  // ============================================================================
  {
    id: "cefr-a1-listening-1",
    level: "foundation", // Maps to A1
    skill: "listening",
    type: "multiple-choice",
    question: "Listen to the sentence: 'Hello, my name is Sarah.' What is the speaker's name?",
    options: ["Sarah", "Mary", "John", "David"],
    correctAnswer: "Sarah",
    points: 10,
    explanation: "The speaker clearly says 'my name is Sarah'.",
    audioScript: "Hello, my name is Sarah.",
  },
  {
    id: "cefr-a1-reading-1",
    level: "foundation",
    skill: "reading",
    type: "multiple-choice",
    question: "Read: 'I have a cat. My cat is white.' What color is the cat?",
    options: ["Black", "White", "Brown", "Gray"],
    correctAnswer: "White",
    points: 10,
    explanation: "The text states 'My cat is white'.",
  },
  {
    id: "cefr-a1-writing-1",
    level: "foundation",
    skill: "writing",
    type: "fill-in-blank",
    question: "Complete the sentence: 'I ___ a student.'",
    options: ["am", "is", "are", "be"],
    correctAnswer: "am",
    points: 10,
    explanation: "Use 'am' with 'I': I am a student.",
  },
  {
    id: "cefr-a1-speaking-1",
    level: "foundation",
    skill: "speaking",
    type: "speaking-prompt",
    question: "Introduce yourself. Say your name and where you are from.",
    points: 15,
    explanation: "A simple self-introduction is a fundamental A1 skill.",
    expectedDuration: 15,
  },

  // ============================================================================
  // A2 LEVEL QUESTIONS (Elementary)
  // ============================================================================
  {
    id: "cefr-a2-listening-1",
    level: "level-1", // Maps to A2
    skill: "listening",
    type: "multiple-choice",
    question: "Listen: 'I usually go to work by bus, but today I'm taking the train.' How does the speaker usually go to work?",
    options: ["By bus", "By train", "By car", "Walking"],
    correctAnswer: "By bus",
    points: 15,
    explanation: "The speaker says 'I usually go to work by bus'.",
    audioScript: "I usually go to work by bus, but today I'm taking the train.",
  },
  {
    id: "cefr-a2-reading-1",
    level: "level-1",
    skill: "reading",
    type: "multiple-choice",
    question: "Read: 'The library is open from 9 AM to 5 PM on weekdays. It is closed on weekends.' When is the library closed?",
    options: ["Weekdays", "Weekends", "Mornings", "Afternoons"],
    correctAnswer: "Weekends",
    points: 15,
    explanation: "The text clearly states 'It is closed on weekends'.",
  },
  {
    id: "cefr-a2-writing-1",
    level: "level-1",
    skill: "writing",
    type: "essay",
    question: "Write a short paragraph (3-4 sentences) about your daily routine.",
    points: 20,
    explanation: "Describing daily routines is a key A2 skill.",
  },

  // ============================================================================
  // B1 LEVEL QUESTIONS (Intermediate)
  // ============================================================================
  {
    id: "cefr-b1-reading-1",
    level: "level-2", // Maps to B1
    skill: "reading",
    type: "multiple-choice",
    question: "Read the passage: 'Climate change is affecting ecosystems worldwide. Scientists warn that immediate action is needed to prevent further damage. Many countries have committed to reducing carbon emissions.' What is the main idea?",
    options: [
      "Climate change is a global concern requiring urgent action",
      "Scientists are studying ecosystems",
      "Countries are competing with each other",
      "Carbon is found in many places",
    ],
    correctAnswer: "Climate change is a global concern requiring urgent action",
    points: 20,
    explanation: "The passage discusses the urgency of addressing climate change globally.",
  },
  {
    id: "cefr-b1-writing-1",
    level: "level-2",
    skill: "writing",
    type: "essay",
    question: "Write an email to a friend describing a recent trip you took. Include details about where you went, what you did, and your overall experience. (100-120 words)",
    points: 25,
    explanation: "Writing informal emails about personal experiences is a B1 skill.",
  },

  // ============================================================================
  // B2 LEVEL QUESTIONS (Upper-Intermediate)
  // ============================================================================
  {
    id: "cefr-b2-reading-1",
    level: "level-4-academic", // Maps to B2
    skill: "reading",
    type: "multiple-choice",
    question: "Read: 'The industrial revolution marked a pivotal transformation in human society. While it brought unprecedented economic growth and technological advancement, it also introduced significant environmental and social challenges that persist today.' What does 'pivotal' most likely mean?",
    options: ["Minor", "Crucial", "Gradual", "Temporary"],
    correctAnswer: "Crucial",
    points: 25,
    explanation: "'Pivotal' means crucial or of great importance, referring to a major turning point.",
  },
  {
    id: "cefr-b2-writing-1",
    level: "level-4-academic",
    skill: "writing",
    type: "essay",
    question: "Write an essay discussing the advantages and disadvantages of social media in modern society. Present balanced arguments and provide examples. (200-250 words)",
    points: 30,
    explanation: "Presenting balanced arguments on complex topics is a B2 skill.",
  },

  // ============================================================================
  // C1 LEVEL QUESTIONS (Advanced)
  // ============================================================================
  {
    id: "cefr-c1-reading-1",
    level: "level-5-academic", // Maps to C1
    skill: "reading",
    type: "multiple-choice",
    question: "Analyze the following: 'The author's nuanced portrayal of the protagonist reveals a sophisticated understanding of human psychology, eschewing simplistic characterizations in favor of a multifaceted representation.' What literary technique is being described?",
    options: [
      "Character development with psychological depth",
      "Simple narrative structure",
      "Chronological storytelling",
      "Plot-driven narrative",
    ],
    correctAnswer: "Character development with psychological depth",
    points: 30,
    explanation: "The passage describes complex character development that avoids simplistic portrayals.",
  },
  {
    id: "cefr-c1-writing-1",
    level: "level-5-academic",
    skill: "writing",
    type: "essay",
    question: "Write a critical analysis of how technology has transformed education in the 21st century. Discuss both pedagogical implications and societal impacts. Support your arguments with relevant examples. (300-350 words)",
    points: 35,
    explanation: "Critical analysis with sophisticated argumentation is a C1 skill.",
  },

  // ============================================================================
  // C2 LEVEL QUESTIONS (Proficiency)
  // ============================================================================
  {
    id: "cefr-c2-reading-1",
    level: "level-6-advanced", // Maps to C2
    skill: "reading",
    type: "multiple-choice",
    question: "Consider this passage: 'The epistemological implications of post-structuralist theory have precipitated a paradigmatic shift in contemporary discourse, challenging the foundational assumptions of knowledge construction and representation.' What is the author's primary focus?",
    options: [
      "The impact of post-structuralist theory on how we understand knowledge",
      "The history of structural theory",
      "Modern communication methods",
      "Educational reform",
    ],
    correctAnswer: "The impact of post-structuralist theory on how we understand knowledge",
    points: 40,
    explanation: "The passage discusses how post-structuralist theory has changed fundamental ideas about knowledge.",
  },
  {
    id: "cefr-c2-writing-1",
    level: "level-6-advanced",
    skill: "writing",
    type: "essay",
    question: "Compose a persuasive academic essay examining the ethical dimensions of artificial intelligence in decision-making processes. Incorporate philosophical frameworks, empirical evidence, and address potential counterarguments with sophistication. (400-450 words)",
    points: 45,
    explanation: "Sophisticated academic writing with philosophical depth is a C2 skill.",
  },
];

/**
 * Get questions by CEFR level and skill
 * Note: Since we're using NZCEL levels in the data, we need to map CEFR to NZCEL
 */
export function getCEFRQuestionsByLevelAndSkill(
  cefrLevel: CEFRLevel,
  skill: SkillType
): Question[] {
  // Map CEFR to NZCEL levels (approximate)
  const levelMapping: Record<CEFRLevel, string[]> = {
    A1: ["foundation"],
    A2: ["level-1"],
    B1: ["level-2"],
    B2: ["level-3-academic", "level-4-academic"],
    C1: ["level-5-academic"],
    C2: ["level-6-advanced"],
  };

  const nzcelLevels = levelMapping[cefrLevel] || [];

  return CEFR_QUESTIONS.filter(
    (q) => nzcelLevels.includes(q.level) && q.skill === skill
  );
}

/**
 * Get a random question for a specific CEFR level and skill
 */
export function getRandomCEFRQuestion(
  cefrLevel: CEFRLevel,
  skill: SkillType
): Question | null {
  const questions = getCEFRQuestionsByLevelAndSkill(cefrLevel, skill);
  if (questions.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

/**
 * Get all questions for a specific skill across all CEFR levels
 */
export function getCEFRQuestionsBySkill(skill: SkillType): Question[] {
  return CEFR_QUESTIONS.filter((q) => q.skill === skill);
}

/**
 * Get question count by CEFR level
 */
export function getCEFRQuestionCount(cefrLevel: CEFRLevel): number {
  const levelMapping: Record<CEFRLevel, string[]> = {
    A1: ["foundation"],
    A2: ["level-1"],
    B1: ["level-2"],
    B2: ["level-3-academic", "level-4-academic"],
    C1: ["level-5-academic"],
    C2: ["level-6-advanced"],
  };

  const nzcelLevels = levelMapping[cefrLevel] || [];
  return CEFR_QUESTIONS.filter((q) => nzcelLevels.includes(q.level)).length;
}
