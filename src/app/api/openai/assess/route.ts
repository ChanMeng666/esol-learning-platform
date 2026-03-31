import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import type { NZCELLevel, SkillType } from "@/types";

/**
 * Assessment API endpoint
 * Uses GPT-4 to assess speaking or writing responses
 *
 * POST /api/openai/assess
 * Body: {
 *   text: string,
 *   level: NZCELLevel,
 *   skill: 'speaking' | 'writing',
 *   questionText: string,
 *   rubric?: string
 * }
 * Returns: {
 *   score: number,
 *   feedback: string,
 *   criteria: { [key: string]: { score: number, comment: string } }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { text, level, skill, questionText, rubric } = await request.json();

    if (!text || !level || !skill || !questionText) {
      return NextResponse.json(
        { error: "Missing required fields: text, level, skill, questionText" },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();

    // Create assessment prompt based on NZCEL criteria
    const systemPrompt = `You are an expert NZCEL (New Zealand Certificates in English Language) assessor.
Your task is to evaluate ${skill} responses for ${level} level students according to official NZCEL graduate outcomes.

${rubric || getDefaultRubric(level, skill as SkillType)}

Provide detailed, constructive feedback that helps the student improve. Be encouraging but honest.
Format your response as JSON with this structure:
{
  "overallScore": <number 0-100>,
  "overallFeedback": "<string>",
  "criteria": {
    "taskAchievement": { "score": <number 0-100>, "comment": "<string>" },
    "coherence": { "score": <number 0-100>, "comment": "<string>" },
    "vocabulary": { "score": <number 0-100>, "comment": "<string>" },
    "grammar": { "score": <number 0-100>, "comment": "<string>" },
    ${skill === "speaking" ? '"pronunciation": { "score": <number 0-100>, "comment": "<string>" },' : ""}
    ${skill === "speaking" ? '"fluency": { "score": <number 0-100>, "comment": "<string>" }' : '"style": { "score": <number 0-100>, "comment": "<string>" }'}
  },
  "strengths": ["<string>", "<string>"],
  "improvements": ["<string>", "<string>"]
}`;

    const userPrompt = `Question: ${questionText}

Student's ${skill} response:
${text}

Please assess this response according to NZCEL ${level} standards.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const assessment = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Assessment Error:", error);
    return NextResponse.json(
      {
        error: "Failed to assess response",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

function getDefaultRubric(level: NZCELLevel, skill: SkillType): string {
  const rubrics: Record<string, Record<SkillType, string>> = {
    "foundation": {
      listening: "Understand familiar spoken words and very basic phrases",
      speaking: "Participate in simple spoken discourse on familiar topics",
      reading: "Understand familiar written words and phrases",
      writing: "Write simple isolated phrases giving personal information",
    },
    "level-4-academic": {
      listening: "Understand main ideas and supporting details of moderately complex oral academic texts",
      speaking: "Participate effectively in sustained spoken discourse in academic contexts",
      reading: "Understand main ideas and supporting details of moderately complex written academic texts",
      writing: "Write detailed, developed, moderately complex academic texts with clear structure, academic vocabulary, and proper citations",
    },
    "level-5-academic": {
      listening: "Understand extended complex oral academic texts on concrete, abstract and technical topics",
      speaking: "Participate flexibly and effectively in extended spoken discourse on complex academic topics",
      reading: "Understand, analyse, and evaluate complex written academic texts",
      writing: "Write well-structured, accurate, evidence-based, extended academic texts on complex and technical topics",
    },
  };

  return rubrics[level]?.[skill] || rubrics["level-4-academic"][skill];
}
