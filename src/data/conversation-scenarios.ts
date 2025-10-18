import type { ConversationScenario, NZCELLevel } from "@/types";

/**
 * Conversation scenarios for real-time speaking practice
 * Organized by NZCEL level and context
 */

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  // Foundation Level Scenarios
  {
    id: "found-intro-001",
    level: "foundation",
    title: "Introducing Yourself",
    context: "You are meeting someone for the first time at a community center.",
    userRole: "A new community member",
    aiRole: "A friendly community member",
    initialPrompt: "Hello! I don't think we've met before. I'm Alex. What's your name?",
    targetTurns: 6,
    difficulty: "beginner",
    topics: ["personal information", "basic greetings", "daily activities"],
  },
  {
    id: "found-shop-001",
    level: "foundation",
    title: "Shopping for Groceries",
    context: "You are at a local grocery store asking about products.",
    userRole: "A customer",
    aiRole: "A helpful shop assistant",
    initialPrompt: "Good morning! Welcome to the shop. How can I help you today?",
    targetTurns: 8,
    difficulty: "beginner",
    topics: ["shopping", "numbers", "food items", "prices"],
  },

  // Level 4 Academic - Most Critical
  {
    id: "lv4ac-sem-001",
    level: "level-4-academic",
    title: "Discussing a Research Topic",
    context: "You are meeting with a classmate to discuss your group research project on climate change.",
    userRole: "An undergraduate student",
    aiRole: "Your classmate and research partner",
    initialPrompt: "Hi! Thanks for meeting up. I've been reading some articles about climate change impacts on coastal regions. What aspect of the topic have you been focusing on?",
    targetTurns: 12,
    difficulty: "intermediate",
    topics: ["academic discussion", "research", "critical thinking", "evidence"],
  },
  {
    id: "lv4ac-tut-001",
    level: "level-4-academic",
    title: "Tutorial Discussion",
    context: "You are in an academic tutorial discussing an essay you submitted. The tutor wants to discuss your argument development.",
    userRole: "An undergraduate student",
    aiRole: "Your academic tutor",
    initialPrompt: "I've read your essay on sustainable development. Your thesis is clear, but I'd like to discuss how you could strengthen your argument in the second paragraph. Can you walk me through your main point there?",
    targetTurns: 10,
    difficulty: "intermediate",
    topics: ["academic writing", "argumentation", "critical analysis", "feedback"],
  },
  {
    id: "lv4ac-pres-001",
    level: "level-4-academic",
    title: "Presenting Research Findings",
    context: "You are presenting your research findings to your class and taking questions.",
    userRole: "A student presenter",
    aiRole: "An interested classmate asking questions",
    initialPrompt: "Thanks for that presentation! Your findings on student engagement were really interesting. Could you explain more about the methodology you used to collect your data?",
    targetTurns: 10,
    difficulty: "intermediate-advanced",
    topics: ["research presentation", "methodology", "data analysis", "academic discussion"],
  },

  // Level 5 Academic - Postgraduate
  {
    id: "lv5ac-conf-001",
    level: "level-5-academic",
    title: "Academic Conference Q&A",
    context: "You have just presented your research at an academic conference. A fellow researcher is asking critical questions about your methodology.",
    userRole: "A postgraduate researcher",
    aiRole: "An experienced academic researcher",
    initialPrompt: "Thank you for that compelling presentation. I'm intrigued by your analytical framework. However, I wonder if you've considered potential limitations in your sampling methodology, particularly regarding representativeness across demographic categories?",
    targetTurns: 14,
    difficulty: "advanced",
    topics: ["research methodology", "critical evaluation", "academic debate", "theoretical frameworks"],
  },
  {
    id: "lv5ac-super-001",
    level: "level-5-academic",
    title: "Supervision Meeting",
    context: "You are meeting with your thesis supervisor to discuss progress on your research and address challenges you're facing.",
    userRole: "A postgraduate student",
    aiRole: "Your thesis supervisor",
    initialPrompt: "Good to see you. I've reviewed the chapter you sent last week on your literature review. The theoretical framework is developing well, but I think we need to discuss how you're positioning your work within the existing scholarly discourse. How do you see your contribution?",
    targetTurns: 12,
    difficulty: "advanced",
    topics: ["thesis development", "scholarly discourse", "research contribution", "academic writing"],
  },
  {
    id: "lv5ac-debate-001",
    level: "level-5-academic",
    title: "Theoretical Debate",
    context: "You are in a postgraduate seminar debating different theoretical approaches to your field of study.",
    userRole: "A postgraduate student",
    aiRole: "Another postgraduate student with a different perspective",
    initialPrompt: "I appreciate your constructivist approach, but I would argue that you're overlooking some fundamental materialist concerns. How do you account for structural economic factors in your analysis?",
    targetTurns: 16,
    difficulty: "advanced",
    topics: ["theoretical frameworks", "academic debate", "critical analysis", "scholarly argumentation"],
  },

  // Level 4 Employment
  {
    id: "lv4emp-meet-001",
    level: "level-4-employment",
    title: "Team Meeting Discussion",
    context: "You are in a team meeting discussing project priorities and timelines.",
    userRole: "A team member",
    aiRole: "Your team leader",
    initialPrompt: "Thanks everyone for joining. We need to discuss the upcoming product launch. I'd like to hear your thoughts on whether we should prioritize marketing or final product testing this week. What's your view?",
    targetTurns: 10,
    difficulty: "intermediate",
    topics: ["workplace discussion", "decision making", "priorities", "professional communication"],
  },
  {
    id: "lv4emp-client-001",
    level: "level-4-employment",
    title: "Client Consultation",
    context: "You are meeting with a client to understand their needs and propose solutions.",
    userRole: "A service provider/consultant",
    aiRole: "A potential client",
    initialPrompt: "Thank you for taking the time to meet with me. Our company is looking to improve our customer service processes. We've been receiving feedback that response times are too slow. What solutions can you offer?",
    targetTurns: 12,
    difficulty: "intermediate-advanced",
    topics: ["client relations", "problem-solving", "professional proposals", "negotiation"],
  },

  // Level 5 Employment
  {
    id: "lv5emp-negot-001",
    level: "level-5-employment",
    title: "Contract Negotiation",
    context: "You are negotiating contract terms with a potential business partner.",
    userRole: "A business representative",
    aiRole: "A potential business partner",
    initialPrompt: "I've reviewed your proposal, and while we're interested in the partnership, there are some concerns about the timeline and deliverables outlined in section 3. Specifically, the 8-week turnaround seems ambitious given the scope. Can we discuss this?",
    targetTurns: 14,
    difficulty: "advanced",
    topics: ["negotiation", "business strategy", "problem-solving", "professional diplomacy"],
  },
  {
    id: "lv5emp-crisis-001",
    level: "level-5-employment",
    title: "Crisis Management Discussion",
    context: "You are leading a crisis management meeting to address a significant service disruption.",
    userRole: "A senior manager",
    aiRole: "A board member seeking explanations",
    initialPrompt: "We need to discuss yesterday's system outage that affected our clients. This is the third incident this quarter. What's your assessment of the root cause, and what immediate steps are you taking to prevent recurrence?",
    targetTurns: 12,
    difficulty: "advanced",
    topics: ["crisis management", "leadership", "strategic communication", "accountability"],
  },
];

/**
 * Get scenarios filtered by level
 */
export function getScenariosByLevel(level: NZCELLevel): ConversationScenario[] {
  return CONVERSATION_SCENARIOS.filter((s) => s.level === level);
}

/**
 * Get scenario by ID
 */
export function getScenarioById(id: string): ConversationScenario | undefined {
  return CONVERSATION_SCENARIOS.find((s) => s.id === id);
}

/**
 * Get random scenario for a level
 */
export function getRandomScenario(level: NZCELLevel): ConversationScenario | undefined {
  const scenarios = getScenariosByLevel(level);
  if (scenarios.length === 0) return undefined;
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}
