import { AssessmentRubric, NZCELLevel } from "@/types";

/**
 * NZCEL Writing Assessment Rubrics
 * Based on official NZCEL graduate outcomes and assessment criteria
 */

export const ESSAY_RUBRICS: Record<string, AssessmentRubric> = {
  // Foundation Level
  "foundation-writing": {
    level: "foundation",
    skill: "writing",
    description: "Write simple isolated phrases and sentences giving personal information",
    criteria: [
      {
        id: "content",
        name: "Content & Task Achievement",
        description: "Provides basic personal information as requested",
        weight: 0.3,
        levels: {
          excellent: "All required personal information provided clearly",
          good: "Most required information provided",
          satisfactory: "Some required information provided",
          needsImprovement: "Minimal or unclear information",
        },
      },
      {
        id: "grammar",
        name: "Grammar & Accuracy",
        description: "Uses basic sentence structures correctly",
        weight: 0.3,
        levels: {
          excellent: "Simple sentences mostly error-free",
          good: "Some errors but meaning is clear",
          satisfactory: "Frequent errors affecting clarity",
          needsImprovement: "Many errors impeding understanding",
        },
      },
      {
        id: "vocabulary",
        name: "Vocabulary",
        description: "Uses basic everyday words appropriately",
        weight: 0.2,
        levels: {
          excellent: "Appropriate basic vocabulary used correctly",
          good: "Adequate basic vocabulary with minor errors",
          satisfactory: "Limited vocabulary, some word choice errors",
          needsImprovement: "Very limited vocabulary",
        },
      },
      {
        id: "organization",
        name: "Organization",
        description: "Presents information in simple sequence",
        weight: 0.2,
        levels: {
          excellent: "Clear, simple sequence",
          good: "Generally organized",
          satisfactory: "Some organization visible",
          needsImprovement: "Disorganized or unclear sequence",
        },
      },
    ],
  },

  // Level 4 Academic (Most Critical - Undergraduate Entry)
  "level-4-academic-writing": {
    level: "level-4-academic",
    skill: "writing",
    description: "Write detailed, developed, moderately complex academic texts with clear structure, supporting evidence, and formal style",
    criteria: [
      {
        id: "taskAchievement",
        name: "Task Achievement",
        description: "Addresses all parts of the question with relevant, developed ideas",
        weight: 0.25,
        levels: {
          excellent: "Fully addresses task with well-developed, relevant ideas and clear position",
          good: "Addresses task adequately with relevant ideas, though some aspects may be underdeveloped",
          satisfactory: "Addresses task but response may be incomplete or ideas insufficiently developed",
          needsImprovement: "Does not adequately address task; ideas are unclear or irrelevant",
        },
      },
      {
        id: "coherence",
        name: "Coherence & Cohesion",
        description: "Clear essay structure with logical flow and appropriate linking",
        weight: 0.25,
        levels: {
          excellent: "Clear introduction-body-conclusion structure; ideas flow logically with effective linking words and cohesive devices",
          good: "Generally clear structure; mostly logical progression with appropriate linking",
          satisfactory: "Basic structure present but progression may be unclear; limited range of cohesive devices",
          needsImprovement: "Poor structure; ideas disconnected; lacks cohesion",
        },
      },
      {
        id: "vocabulary",
        name: "Lexical Resource",
        description: "Range and accuracy of vocabulary; appropriateness for academic context",
        weight: 0.2,
        levels: {
          excellent: "Wide range of vocabulary used accurately and appropriately for academic context; demonstrates awareness of collocations",
          good: "Adequate range of vocabulary; generally accurate with occasional errors that don't impede communication",
          satisfactory: "Limited but adequate vocabulary; noticeable errors but meaning is usually clear",
          needsImprovement: "Very limited vocabulary; frequent errors that obscure meaning",
        },
      },
      {
        id: "grammar",
        name: "Grammatical Range & Accuracy",
        description: "Variety and accuracy of grammatical structures",
        weight: 0.2,
        levels: {
          excellent: "Wide range of structures used accurately; rare errors do not affect communication",
          good: "Mix of simple and complex structures; generally accurate with some errors",
          satisfactory: "Predominantly simple structures with attempts at complexity; errors are frequent but don't seriously impede communication",
          needsImprovement: "Very limited range; frequent errors that impede understanding",
        },
      },
      {
        id: "academicStyle",
        name: "Academic Style & Tone",
        description: "Formal academic register; objective tone; appropriate citation indicators",
        weight: 0.1,
        levels: {
          excellent: "Consistently formal and objective; appropriate academic conventions; uses citation indicators effectively",
          good: "Generally formal and objective; mostly follows academic conventions",
          satisfactory: "Attempts academic style but lapses into informal register; limited awareness of conventions",
          needsImprovement: "Inappropriate style; overly informal or conversational",
        },
      },
    ],
  },

  // Level 5 Academic (Postgraduate Entry)
  "level-5-academic-writing": {
    level: "level-5-academic",
    skill: "writing",
    description: "Write well-structured, accurate, evidence-based, extended academic texts on complex and technical topics with sophisticated analysis",
    criteria: [
      {
        id: "criticalThinking",
        name: "Critical Analysis & Argumentation",
        description: "Demonstrates sophisticated critical thinking, analysis, and well-reasoned arguments",
        weight: 0.3,
        levels: {
          excellent: "Demonstrates sophisticated critical analysis; develops nuanced, well-reasoned arguments; effectively evaluates multiple perspectives",
          good: "Shows clear critical thinking and sound argumentation; evaluates different viewpoints",
          satisfactory: "Some evidence of critical thinking but analysis may be superficial; argument development limited",
          needsImprovement: "Lacks critical analysis; predominantly descriptive rather than analytical",
        },
      },
      {
        id: "evidence",
        name: "Use of Evidence & Sources",
        description: "Integrates and evaluates evidence effectively; demonstrates research engagement",
        weight: 0.2,
        levels: {
          excellent: "Skillfully integrates and synthesizes evidence from multiple sources; evaluates source credibility and limitations",
          good: "Uses evidence appropriately to support arguments; acknowledges sources",
          satisfactory: "Some use of evidence but may be superficial or poorly integrated",
          needsImprovement: "Minimal evidence or unsupported claims; poor source integration",
        },
      },
      {
        id: "structure",
        name: "Organization & Structure",
        description: "Sophisticated organization with clear progression of complex ideas",
        weight: 0.2,
        levels: {
          excellent: "Highly effective organization; sophisticated transitions; clear progression of complex ideas; strong thesis development",
          good: "Well-organized with clear structure; effective paragraph development and transitions",
          satisfactory: "Basic organization but may lack sophistication; some unclear transitions",
          needsImprovement: "Poor organization; ideas poorly developed or connected",
        },
      },
      {
        id: "language",
        name: "Language Control & Precision",
        description: "Sophisticated vocabulary and grammatical control; precision in expression",
        weight: 0.2,
        levels: {
          excellent: "Sophisticated vocabulary used with precision; complex grammatical structures handled skillfully; rare errors",
          good: "Good range of vocabulary and grammar; generally accurate with minor errors",
          satisfactory: "Adequate language control but limited sophistication; errors occasionally affect clarity",
          needsImprovement: "Limited language control; frequent errors; imprecise expression",
        },
      },
      {
        id: "conventions",
        name: "Academic Conventions",
        description: "Adherence to academic writing conventions, tone, and citation practices",
        weight: 0.1,
        levels: {
          excellent: "Exemplary adherence to academic conventions; consistent formal register; sophisticated awareness of disciplinary conventions",
          good: "Follows academic conventions appropriately; maintains formal register",
          satisfactory: "Generally follows conventions but with some lapses",
          needsImprovement: "Frequent breaches of academic conventions",
        },
      },
    ],
  },
};

/**
 * Get rubric for a specific level and skill
 */
export function getRubric(level: NZCELLevel, skill: "writing"): AssessmentRubric | undefined {
  const key = `${level}-${skill}`;
  return ESSAY_RUBRICS[key] || ESSAY_RUBRICS["level-4-academic-writing"]; // Default fallback
}

/**
 * Generate rubric description text for inclusion in assessment prompt
 */
export function generateRubricPrompt(rubric: AssessmentRubric): string {
  let prompt = `NZCEL ${rubric.level} Writing Assessment Rubric:\n`;
  prompt += `Graduate Outcome: ${rubric.description}\n\n`;
  prompt += `Assessment Criteria (with weights):\n`;

  rubric.criteria.forEach((criterion) => {
    prompt += `\n${criterion.name} (${Math.round(criterion.weight * 100)}%):\n`;
    prompt += `- ${criterion.description}\n`;
    prompt += `  Excellent (90-100): ${criterion.levels.excellent}\n`;
    prompt += `  Good (70-89): ${criterion.levels.good}\n`;
    prompt += `  Satisfactory (50-69): ${criterion.levels.satisfactory}\n`;
    prompt += `  Needs Improvement (0-49): ${criterion.levels.needsImprovement}\n`;
  });

  return prompt;
}
