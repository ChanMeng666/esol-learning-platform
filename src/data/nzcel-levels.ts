import { NZCELLevelInfo } from "@/types";

export const NZCEL_LEVELS: NZCELLevelInfo[] = [
  {
    id: "foundation",
    name: "Foundation Level",
    description: "For learners with no or very minimal English",
    strategicPurpose:
      "Equips learners with basic language skills to communicate with support in highly familiar, everyday situations.",
    graduateOutcomes: {
      listening: "Understand familiar spoken words and very basic phrases for the most common everyday situations.",
      speaking: "Participate in simple spoken discourse with familiar people on familiar and personal topics in areas of most immediate need.",
      reading: "Understand familiar written words and phrases for the most common everyday situations.",
      writing: "Write simple isolated phrases and sentences giving personal information.",
    },
    pathways: ["Leads to NZCEL Level 1"],
    equivalency: {},
  },
  {
    id: "level-1",
    name: "Level 1",
    description: "Minimal command of English for basic everyday situations",
    strategicPurpose:
      "Graduates possess language skills to communicate, with support, in basic and familiar everyday situations.",
    graduateOutcomes: {
      listening: "Understand frequently used spoken expressions and simple spoken discourse on areas of immediate personal relevance in familiar everyday situations.",
      speaking: "Participate in short spoken discourse of immediate personal relevance for social and transactional purposes in familiar everyday situations.",
      reading: "Understand specific familiar information in simple everyday written texts.",
      writing: "Write short simple texts relating to personal and everyday topics.",
    },
    pathways: ["Builds on Foundation", "Leads to NZCEL Level 2"],
    equivalency: {},
  },
  {
    id: "level-2",
    name: "Level 2",
    description: "Communicate with some independence in familiar situations",
    strategicPurpose:
      "Graduates have language skills to communicate with some independence in a range of familiar, everyday situations.",
    graduateOutcomes: {
      listening: "Understand the gist and key points in straightforward spoken discourse, oral texts, and exchanges on familiar everyday topics.",
      speaking: "Participate in a straightforward spoken discourse on familiar everyday topics.",
      reading: "Understand the gist and key points in straightforward written texts on familiar and routine topics.",
      writing: "Write simple, connected texts on familiar topics.",
    },
    pathways: ["Builds on Level 1", "Leads to NZCEL Level 3 streams"],
    equivalency: {},
  },
  {
    id: "level-3-general",
    name: "Level 3 (General)",
    description: "Communicate in most familiar situations with increasing independence",
    strategicPurpose:
      "Develops ability to communicate in most familiar situations with increasing independence and fluency.",
    graduateOutcomes: {
      listening: "Understand main ideas and some specific details of oral texts on reasonably familiar topics.",
      speaking: "Participate with reasonable fluency in spoken discourse on most familiar topics.",
      reading: "Understand main ideas and some specific details of written texts on reasonably familiar topics.",
      writing: "Write connected texts on reasonably familiar topics.",
    },
    pathways: ["Builds on Level 2", "Leads to Level 3 (Applied)"],
    equivalency: {},
  },
  {
    id: "level-3-applied",
    name: "Level 3 (Applied)",
    description: "Apply English to community and employment contexts",
    strategicPurpose:
      "Apply developing English proficiency to specific community and/or employment contexts with increasing independence.",
    graduateOutcomes: {
      listening: "Understand main ideas and some specific details of moderately complex oral texts on reasonably familiar topics relevant to the applied context.",
      speaking: "Participate with increasing independence and fluency in sustained spoken discourse on reasonably familiar topics relevant to the applied context.",
      reading: "Understand main ideas and some specific details of moderately complex written texts on reasonably familiar topics relevant to the applied context.",
      writing: "Write clear connected texts on reasonably familiar topics relevant to the applied context.",
    },
    pathways: ["Builds on Level 3 (General)", "Leads to Level 4 streams"],
    equivalency: {
      ielts: "5.5 (no band < 5.0)",
      toefl: "46 (writing 14)",
      pte: "42 (no band < 36)",
    },
  },
  {
    id: "level-3-academic",
    name: "Level 3 (Academic)",
    description: "Participate in academic settings with growing independence",
    strategicPurpose:
      "Equips graduates with language skills to participate with growing independence and fluency in academic settings.",
    graduateOutcomes: {
      listening: "Understand main ideas and some specific details of moderately complex oral texts on reasonably familiar topics relevant to the academic context.",
      speaking: "Participate with increasing independence and fluency in sustained spoken discourse on reasonably familiar topics relevant to the academic context.",
      reading: "Understand main ideas and some specific details of moderately complex written texts on reasonably familiar topics relevant to the academic context.",
      writing: "Write clear connected texts on reasonably familiar topics relevant to the academic context.",
    },
    pathways: ["Academic-focused route from Level 3", "Leads to Level 4 streams"],
    equivalency: {
      ielts: "5.5 (no band < 5.0)",
      toefl: "46 (writing 14)",
      pte: "42 (no band < 36)",
    },
  },
  {
    id: "level-4-general",
    name: "Level 4 (General)",
    description: "Communicate independently for social and transactional purposes",
    strategicPurpose:
      "Communicate independently and effectively for social and transactional purposes in the wider New Zealand community.",
    graduateOutcomes: {
      listening: "Understand main ideas and supporting details of moderately complex oral texts for social and transactional purposes.",
      speaking: "Participate effectively in sustained spoken discourse for social and transactional purposes.",
      reading: "Understand main ideas and supporting details of moderately complex written texts for social and transactional purposes.",
      writing: "Write detailed, developed, moderately complex texts for social and transactional purposes.",
    },
    pathways: ["Entry to NZQF Level 5 programmes", "Leads to NZCEL Level 5"],
    equivalency: {
      ielts: "5.5 (no band < 5.0)",
      toefl: "46 (writing 14)",
      pte: "42 (no band < 36)",
    },
  },
  {
    id: "level-4-employment",
    name: "Level 4 (Employment)",
    description: "Communicate effectively in NZ employment contexts",
    strategicPurpose:
      "Communicate independently and effectively in New Zealand employment contexts.",
    graduateOutcomes: {
      listening: "Understand main ideas and supporting details of complex oral texts in employment contexts.",
      speaking: "Participate effectively in sustained spoken discourse in employment contexts.",
      reading: "Understand main ideas and supporting details of complex written texts in employment contexts.",
      writing: "Write detailed, developed, complex texts in employment contexts.",
    },
    pathways: ["Employment-focused pathway", "Entry to vocational Level 5 programmes"],
    equivalency: {
      ielts: "5.5 (no band < 5.0)",
      toefl: "46 (writing 14)",
      pte: "42 (no band < 36)",
    },
  },
  {
    id: "level-4-academic",
    name: "Level 4 (Academic)",
    description: "Undergraduate degree entry qualification",
    strategicPurpose:
      "Key qualification for undergraduate pathway. Communicate independently and effectively in academic contexts.",
    graduateOutcomes: {
      listening: "Understand main ideas and supporting details of moderately complex oral academic texts.",
      speaking: "Participate effectively in sustained spoken discourse in academic contexts.",
      reading: "Understand main ideas and supporting details of moderately complex written academic texts.",
      writing: "Write detailed, developed, moderately complex academic texts.",
    },
    pathways: ["Standard entry for bachelor's degrees", "Leads to NZCEL Level 5 (Academic)"],
    equivalency: {
      ielts: "6.0 (no band < 5.5)",
      toefl: "60 (writing 18)",
      pte: "50 (no band < 42)",
      cefr: "B2",
    },
  },
  {
    id: "level-5-general",
    name: "Level 5 (General)",
    description: "Flexible and effective communication on wide range of topics",
    strategicPurpose:
      "Develops flexible and effective communication on a wide range of topics in general contexts.",
    graduateOutcomes: {
      listening: "Understand extended complex oral texts on a range of concrete and abstract topics.",
      speaking: "Participate flexibly and effectively in extended spoken discourse on a wide range of topics.",
      reading: "Understand and analyze complex written texts on a range of topics.",
      writing: "Write well-structured, accurate, extended texts on complex topics.",
    },
    pathways: ["Advanced general communication pathway"],
    equivalency: {},
  },
  {
    id: "level-5-employment",
    name: "Level 5 (Employment)",
    description: "Professional communication in NZ employment",
    strategicPurpose:
      "Develops flexible and effective communication for professional purposes in New Zealand employment contexts.",
    graduateOutcomes: {
      listening: "Understand extended complex oral texts in professional employment contexts.",
      speaking: "Participate flexibly and effectively in extended spoken discourse for professional purposes.",
      reading: "Understand and analyze complex written texts in employment contexts.",
      writing: "Write well-structured, accurate, extended texts for professional purposes.",
    },
    pathways: ["Advanced employment-focused pathway"],
    equivalency: {},
  },
  {
    id: "level-5-academic",
    name: "Level 5 (Academic)",
    description: "Postgraduate degree entry qualification",
    strategicPurpose:
      "Preparation for postgraduate study. Communicate independently, effectively, fluently, and flexibly in a wide range of academic situations.",
    graduateOutcomes: {
      listening: "Understand extended complex oral academic texts on a range of concrete, abstract and technical topics.",
      speaking: "Participate flexibly and effectively in extended spoken discourse on complex academic topics.",
      reading: "Understand, analyze, and evaluate complex written academic texts on a range of topics.",
      writing: "Write well-structured, accurate, evidence-based, extended academic texts on complex and technical topics.",
    },
    pathways: ["Entry for postgraduate programmes (Masters, PhD)"],
    equivalency: {
      ielts: "6.5 (no band < 6.0)",
      toefl: "79 (writing 21)",
      pte: "58 (no band < 50)",
      cefr: "C1",
    },
  },
  {
    id: "level-6-advanced",
    name: "Level 6 (Advanced)",
    description: "Fluent, spontaneous, and effective communication",
    strategicPurpose:
      "Develops fluent, spontaneous, and effective communication on a range of complex topics.",
    graduateOutcomes: {
      listening: "Understand extended complex oral texts with ease on a wide range of topics.",
      speaking: "Participate fluently, spontaneously, and effectively in extended discourse on complex topics.",
      reading: "Understand and critically analyze highly complex written texts on diverse topics.",
      writing: "Write sophisticated, well-structured, accurate texts on highly complex topics.",
    },
    pathways: ["Highest level of NZCEL framework"],
    equivalency: {
      cefr: "C2",
    },
  },
];
