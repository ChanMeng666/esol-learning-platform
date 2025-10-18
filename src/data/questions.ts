/**
 * DEPRECATED: This file is kept for backward compatibility.
 * Use the new comprehensive question bank from ./questions/index.ts instead.
 *
 * New structure provides 200+ questions organized by level and stream.
 */
export { ALL_QUESTIONS as SAMPLE_QUESTIONS } from "./questions/index";
export * from "./questions/index";

// Legacy exports below (commented out, kept for reference)
/*
import { Question } from "@/types";

export const SAMPLE_QUESTIONS_OLD: Question[] = [
  // Foundation Level Questions
  {
    id: "found-list-001",
    level: "foundation",
    skill: "listening",
    type: "multiple-choice",
    question: "Listen: 'Hello, my name is Sarah.' What is the speaker's name?",
    options: ["Mary", "Sarah", "Emma", "Lisa"],
    correctAnswer: "Sarah",
    points: 10,
    explanation: "The speaker clearly states 'my name is Sarah'.",
  },
  {
    id: "found-read-001",
    level: "foundation",
    skill: "reading",
    type: "multiple-choice",
    question: "Read: 'The cat is on the mat.' Where is the cat?",
    options: ["Under the mat", "On the mat", "Behind the mat", "Near the mat"],
    correctAnswer: "On the mat",
    points: 10,
    explanation: "The sentence states the cat is 'on' the mat.",
  },

  // Level 1 Questions
  {
    id: "lv1-list-001",
    level: "level-1",
    skill: "listening",
    type: "multiple-choice",
    question: "Listen: 'I go to school every Monday and Wednesday.' How often does the speaker go to school?",
    options: ["Every day", "Two days a week", "Three days a week", "On weekends"],
    correctAnswer: "Two days a week",
    points: 15,
    explanation: "Monday and Wednesday are two days per week.",
  },
  {
    id: "lv1-write-001",
    level: "level-1",
    skill: "writing",
    type: "fill-in-blank",
    question: "Complete the sentence: I ___ to the supermarket yesterday.",
    correctAnswer: ["went", "walked", "drove"],
    points: 15,
    explanation: "Past tense verbs like 'went', 'walked', or 'drove' are appropriate here.",
  },

  // Level 2 Questions
  {
    id: "lv2-read-001",
    level: "level-2",
    skill: "reading",
    type: "multiple-choice",
    question: "Read this notice: 'Library hours: Monday-Friday 9am-5pm. Saturday 10am-2pm. Closed Sundays.' When is the library open the longest?",
    options: ["Monday", "Saturday", "Sunday", "Weekdays"],
    correctAnswer: "Weekdays",
    points: 20,
    explanation: "Weekdays (Monday-Friday) are open 8 hours (9am-5pm), while Saturday is only 4 hours.",
  },
  {
    id: "lv2-speak-001",
    level: "level-2",
    skill: "speaking",
    type: "speaking-prompt",
    question: "Describe your daily routine. Talk about what you do in the morning, afternoon, and evening. (Speak for 1-2 minutes)",
    points: 25,
    explanation: "Practice describing familiar, everyday activities using simple connected sentences.",
  },

  // Level 3 Academic Questions
  {
    id: "lv3a-read-001",
    level: "level-3-academic",
    skill: "reading",
    type: "multiple-choice",
    question: "Read: 'The study examined the correlation between sleep patterns and academic performance among university students. Results indicated a positive relationship between adequate sleep and higher grades.' What was the main finding?",
    options: [
      "Students don't sleep enough",
      "Better sleep is linked to better grades",
      "University is stressful",
      "Grades don't matter",
    ],
    correctAnswer: "Better sleep is linked to better grades",
    points: 30,
    explanation: "The text states a 'positive relationship between adequate sleep and higher grades'.",
  },
  {
    id: "lv3a-write-001",
    level: "level-3-academic",
    skill: "writing",
    type: "essay",
    question: "Write a paragraph (100-150 words) discussing the advantages and disadvantages of online learning.",
    points: 40,
    explanation: "Should include clear topic sentence, supporting points for both advantages and disadvantages, and a conclusion.",
  },

  // Level 4 Academic Questions
  {
    id: "lv4a-list-001",
    level: "level-4-academic",
    skill: "listening",
    type: "multiple-choice",
    question: "Listen to this lecture excerpt: 'Climate change presents numerous challenges for coastal communities, including rising sea levels, increased storm intensity, and ecosystem disruption. These factors necessitate comprehensive adaptation strategies.' What is the main topic?",
    options: [
      "Ocean pollution",
      "Weather forecasting",
      "Climate change impacts on coastal areas",
      "Marine biology",
    ],
    correctAnswer: "Climate change impacts on coastal areas",
    points: 40,
    explanation: "The excerpt focuses on how climate change affects coastal communities.",
  },
  {
    id: "lv4a-write-001",
    level: "level-4-academic",
    skill: "writing",
    type: "essay",
    question: "Write an essay (250-300 words) analyzing the role of technology in modern education. Include an introduction, body paragraphs with supporting evidence, and a conclusion.",
    points: 50,
    explanation: "Should demonstrate clear structure, academic vocabulary, and ability to develop arguments with supporting details.",
  },
  {
    id: "lv4a-read-001",
    level: "level-4-academic",
    skill: "reading",
    type: "multiple-choice",
    question: "Read: 'The implementation of renewable energy sources requires substantial initial investment, yet the long-term economic and environmental benefits outweigh these costs. Studies demonstrate that solar and wind power become cost-effective within 5-10 years.' What is the author's perspective?",
    options: [
      "Renewable energy is too expensive",
      "Initial costs are justified by long-term benefits",
      "Fossil fuels are better",
      "Energy costs are unpredictable",
    ],
    correctAnswer: "Initial costs are justified by long-term benefits",
    points: 40,
    explanation: "The author argues that 'long-term benefits outweigh these costs'.",
  },

  // Level 4 Employment Questions
  {
    id: "lv4e-speak-001",
    level: "level-4-employment",
    skill: "speaking",
    type: "speaking-prompt",
    question: "You're in a job interview. Describe your previous work experience and explain why you're a good fit for a customer service role. (Speak for 2-3 minutes)",
    points: 45,
    explanation: "Practice professional communication, using appropriate vocabulary and structure for workplace contexts.",
  },
  {
    id: "lv4e-write-001",
    level: "level-4-employment",
    skill: "writing",
    type: "essay",
    question: "Write a professional email (150-200 words) to your manager requesting time off for a family emergency. Include appropriate greeting, explanation, and closing.",
    points: 45,
    explanation: "Should demonstrate formal email structure, polite language, and clear communication of the request.",
  },

  // Level 5 Academic Questions
  {
    id: "lv5a-read-001",
    level: "level-5-academic",
    skill: "reading",
    type: "multiple-choice",
    question: "Read this abstract: 'This meta-analysis synthesizes findings from 50 empirical studies examining the efficacy of cognitive-behavioral therapy (CBT) for anxiety disorders. The aggregate data reveals significant effect sizes (d=0.85, p<0.001), suggesting CBT is a robust intervention.' What type of research is this?",
    options: [
      "A case study",
      "An experiment",
      "A meta-analysis of multiple studies",
      "A survey",
    ],
    correctAnswer: "A meta-analysis of multiple studies",
    points: 50,
    explanation: "The text explicitly states it is a 'meta-analysis' that 'synthesizes findings from 50 empirical studies'.",
  },
  {
    id: "lv5a-write-001",
    level: "level-5-academic",
    skill: "writing",
    type: "essay",
    question: "Write a critical analysis (400-500 words) evaluating the statement: 'Social media has had a predominantly negative impact on democratic discourse.' Support your argument with evidence and consider counterarguments.",
    points: 60,
    explanation: "Should demonstrate advanced academic writing, critical thinking, balanced argumentation, and sophisticated vocabulary.",
  },
  {
    id: "lv5a-speak-001",
    level: "level-5-academic",
    skill: "speaking",
    type: "speaking-prompt",
    question: "Present a 5-minute seminar on a current global issue of your choice. Analyze the issue from multiple perspectives and propose potential solutions.",
    points: 60,
    explanation: "Practice delivering formal academic presentations with complex analysis and sophisticated language.",
  },
];
*/
