import { CEFRLevelInfo } from "@/types";

/**
 * CEFR (Common European Framework of Reference for Languages) Level Definitions
 * Based on official CEFR framework and adapted for ESOL learners
 *
 * Reference: https://tracktest.eu/english-levels-cefr/
 * Reference: https://learnenglish.britishcouncil.org/english-levels/understand-your-english-level
 */

export const CEFR_LEVELS: CEFRLevelInfo[] = [
  {
    id: "A1",
    name: "A1 Elementary",
    description: "Beginner level - Can understand and use familiar everyday expressions and very basic phrases",
    canDo: {
      listening: "Understand familiar spoken words and very basic phrases for the most common everyday situations when people speak slowly and clearly",
      speaking: "Introduce themselves and others and can ask and answer questions about personal details such as where they live, people they know and things they have",
      reading: "Understand familiar written words and phrases for the most common everyday situations",
      writing: "Write simple isolated phrases and sentences giving personal information",
    },
    equivalency: {
      nzcel: ["Foundation", "Level 1"],
      ielts: "2.5-3.5",
      toefl: "0-31",
      pte: "10-25",
      duolingo: "10-55",
    },
  },
  {
    id: "A2",
    name: "A2 Pre-intermediate",
    description: "Elementary level - Can communicate in simple and routine tasks requiring direct exchange of information",
    canDo: {
      listening: "Understand sentences and frequently used expressions related to areas of most immediate relevance (e.g. basic personal and family information, shopping, local geography, employment)",
      speaking: "Communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar and routine matters",
      reading: "Understand specific familiar information in simple everyday written texts",
      writing: "Write short simple texts relating to personal and everyday topics",
    },
    equivalency: {
      nzcel: ["Level 1", "Level 2"],
      ielts: "3.5-4.5",
      toefl: "32-42",
      pte: "26-35",
      duolingo: "60-95",
    },
  },
  {
    id: "B1",
    name: "B1 Intermediate",
    description: "Intermediate level - Can deal with most situations whilst travelling in English-speaking areas",
    canDo: {
      listening: "Understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc.",
      speaking: "Deal with most situations likely to arise whilst travelling in an area where English is spoken. Can produce simple connected text on topics which are familiar or of personal interest",
      reading: "Understand the main ideas of complex text on both concrete and abstract topics",
      writing: "Write simple connected texts on topics which are familiar or of personal interest. Can describe experiences and events, dreams, hopes and ambitions",
    },
    equivalency: {
      nzcel: ["Level 2", "Level 3 (General)", "Level 3 (Applied)"],
      ielts: "4.0-5.0",
      toefl: "42-71",
      pte: "36-42",
      duolingo: "95-115",
    },
  },
  {
    id: "B2",
    name: "B2 Upper-intermediate",
    description: "Upper-intermediate level - Can interact with fluency and spontaneity with native speakers",
    canDo: {
      listening: "Understand the main ideas of complex text on both concrete and abstract topics, including technical discussions in their field of specialisation",
      speaking: "Interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party",
      reading: "Understand articles and reports concerned with contemporary problems in which writers adopt particular attitudes or viewpoints",
      writing: "Produce clear, detailed text on a wide range of subjects and explain a viewpoint on a topical issue giving the advantages and disadvantages of various options",
    },
    equivalency: {
      nzcel: ["Level 3 (Academic)", "Level 4 (General)", "Level 4 (Employment)", "Level 4 (Academic)"],
      ielts: "5.5-6.5",
      toefl: "72-94",
      pte: "43-58",
      duolingo: "120-140",
    },
  },
  {
    id: "C1",
    name: "C1 Advanced",
    description: "Advanced level - Can express ideas fluently and spontaneously without much obvious searching for expressions",
    canDo: {
      listening: "Understand extended speech and lectures and follow complex lines of argument provided the topic is reasonably familiar",
      speaking: "Express ideas fluently and spontaneously without much obvious searching for expressions. Use language flexibly and effectively for social, academic and professional purposes",
      reading: "Understand long and complex factual and literary texts, appreciating distinctions of style. Understand specialised articles and longer technical instructions",
      writing: "Produce clear, well-structured, detailed text on complex subjects, showing controlled use of organisational patterns, connectors and cohesive devices",
    },
    equivalency: {
      nzcel: ["Level 5 (General)", "Level 5 (Employment)", "Level 5 (Academic)"],
      ielts: "7.0-8.0",
      toefl: "95-120",
      pte: "59-75",
      duolingo: "145-155",
    },
  },
  {
    id: "C2",
    name: "C2 Proficiency",
    description: "Proficiency level - Can understand with ease virtually everything heard or read",
    canDo: {
      listening: "Understand with ease virtually everything heard, including native speakers speaking rapidly",
      speaking: "Express themselves spontaneously, very fluently and precisely, differentiating finer shades of meaning even in more complex situations",
      reading: "Understand with ease virtually all forms of the written language, including abstract, structurally or linguistically complex texts such as manuals, specialised articles and literary works",
      writing: "Write clear, smoothly flowing text in an appropriate style. Write complex letters, reports or articles which present a case with an effective logical structure",
    },
    equivalency: {
      nzcel: ["Level 5 (Academic)", "Level 6 (Advanced)"],
      ielts: "8.5-9.0",
      toefl: "120",
      pte: "76-90",
      duolingo: "160",
    },
  },
];

/**
 * Get CEFR level information by ID
 */
export function getCEFRLevelById(levelId: string): CEFRLevelInfo | undefined {
  return CEFR_LEVELS.find((level) => level.id === levelId);
}

/**
 * Get CEFR levels in order from beginner to advanced
 */
export function getCEFRLevelsOrdered(): CEFRLevelInfo[] {
  return CEFR_LEVELS;
}

/**
 * Get the next CEFR level for progression
 */
export function getNextCEFRLevel(currentLevel: string): CEFRLevelInfo | null {
  const currentIndex = CEFR_LEVELS.findIndex((level) => level.id === currentLevel);
  if (currentIndex === -1 || currentIndex === CEFR_LEVELS.length - 1) {
    return null;
  }
  return CEFR_LEVELS[currentIndex + 1];
}

/**
 * Get the previous CEFR level
 */
export function getPreviousCEFRLevel(currentLevel: string): CEFRLevelInfo | null {
  const currentIndex = CEFR_LEVELS.findIndex((level) => level.id === currentLevel);
  if (currentIndex <= 0) {
    return null;
  }
  return CEFR_LEVELS[currentIndex - 1];
}

/**
 * Map NZCEL level to approximate CEFR level
 */
export function mapNZCELtoCEFR(nzcelLevel: string): string[] {
  const mappings: Record<string, string[]> = {
    "foundation": ["A1"],
    "level-1": ["A1", "A2"],
    "level-2": ["A2", "B1"],
    "level-3-general": ["B1"],
    "level-3-applied": ["B1"],
    "level-3-academic": ["B1", "B2"],
    "level-4-general": ["B2"],
    "level-4-employment": ["B2"],
    "level-4-academic": ["B2"],
    "level-5-general": ["C1"],
    "level-5-employment": ["C1"],
    "level-5-academic": ["C1"],
    "level-6-advanced": ["C1", "C2"],
  };
  return mappings[nzcelLevel] || ["B1"];
}
