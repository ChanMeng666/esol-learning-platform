import { Question } from "@/types";

/**
 * Level 3 Questions (40 questions across 3 streams)
 * Streams: General (12), Applied (14), Academic (14)
 * Target: Communicate in most familiar situations with increasing independence
 */

// LEVEL 3 GENERAL (12 questions)
export const LEVEL_3_GENERAL_QUESTIONS: Question[] = [
  // Listening
  {
    id: "lv3g-list-001",
    level: "level-3-general",
    skill: "listening",
    type: "audio-comprehension",
    question: "Listen to the radio interview. What is the main topic?",
    audioScript: "Today we're talking to Dr. Sarah Chen about the benefits of learning a second language. Dr. Chen, your research shows that bilingual people have better memory and problem-solving skills. Can you tell us more about this?",
    voiceProfile: "professional",
    options: [
      "Teaching methods",
      "Benefits of bilingualism",
      "Memory problems",
      "Language schools"
    ],
    correctAnswer: "Benefits of bilingualism",
    points: 30,
    allowTranscript: true,
    explanation: "The interviewer introduces the topic as 'benefits of learning a second language' and mentions bilingual advantages.",
  },
  {
    id: "lv3g-list-002",
    level: "level-3-general",
    skill: "listening",
    type: "audio-comprehension",
    question: "Listen to the news report. What caused the traffic delays?",
    audioScript: "Traffic is moving slowly on State Highway 1 this morning after a large truck overturned near the Johnsonville exit around 6am. No one was injured, but the road is expected to remain partially closed until midday while the truck is removed. Motorists are advised to use alternative routes.",
    voiceProfile: "formal",
    options: ["Bad weather", "Truck accident", "Road construction", "Public event"],
    correctAnswer: "Truck accident",
    points: 30,
    allowTranscript: true,
    explanation: "The report states 'a large truck overturned' causing the delays.",
  },
  {
    id: "lv3g-list-003",
    level: "level-3-general",
    skill: "listening",
    type: "audio-comprehension",
    question: "Listen to the conversation. What does the speaker imply about the movie?",
    audioScript: "I saw that new action movie last night. The special effects were amazing and the actors did a great job, but honestly, the story was really predictable. I knew exactly how it would end within the first 20 minutes. Still worth watching for the visuals though.",
    voiceProfile: "casual",
    options: [
      "It was completely boring",
      "It had great effects but a weak plot",
      "It was the best movie ever",
      "It had terrible acting"
    ],
    correctAnswer: "It had great effects but a weak plot",
    points: 30,
    allowTranscript: true,
    explanation: "The speaker praises the effects and acting but criticizes the predictable story.",
  },

  // Speaking
  {
    id: "lv3g-spk-001",
    level: "level-3-general",
    skill: "speaking",
    type: "voice-recording",
    question: "Describe an important decision you made recently. What was the decision? Why was it important? What was the result? Speak for 2 minutes.",
    points: 35,
    expectedDuration: 120,
    explanation: "Practice narrating past events with explanations and outcomes using connected discourse.",
  },
  {
    id: "lv3g-spk-002",
    level: "level-3-general",
    skill: "speaking",
    type: "voice-recording",
    question: "Compare living in a city versus living in a small town. What are the advantages and disadvantages of each? Which do you prefer and why? Speak for 2 minutes.",
    points: 35,
    expectedDuration: 120,
    explanation: "Practice comparing and contrasting with reasoned opinions.",
  },
  {
    id: "lv3g-spk-003",
    level: "level-3-general",
    skill: "speaking",
    type: "voice-recording",
    question: "Describe a problem you had recently (with technology, transport, or a service). How did you try to solve it? What was the outcome? Speak for 2 minutes.",
    points: 35,
    expectedDuration: 120,
    explanation: "Practice problem-solving narratives with clear sequencing.",
  },

  // Reading
  {
    id: "lv3g-read-001",
    level: "level-3-general",
    skill: "reading",
    type: "multiple-choice",
    passage: "The Benefits of Regular Exercise\nRegular physical activity has numerous health benefits. It strengthens the heart and improves circulation, which can reduce the risk of heart disease. Exercise also helps maintain a healthy weight, builds muscle and bone strength, and can improve mental health by reducing stress and anxiety. Health experts recommend at least 30 minutes of moderate exercise five days a week. This can include activities like brisk walking, swimming, or cycling.",
    question: "According to the text, what is NOT mentioned as a benefit of exercise?",
    options: [
      "Reduces heart disease risk",
      "Improves mental health",
      "Increases intelligence",
      "Builds muscle strength"
    ],
    correctAnswer: "Increases intelligence",
    points: 30,
    explanation: "The text mentions heart health, weight, muscles, bones, and mental health, but not intelligence.",
  },
  {
    id: "lv3g-read-002",
    level: "level-3-general",
    skill: "reading",
    type: "multiple-choice",
    passage: "Community Notice: Water Supply Interruption\nPlease be advised that water supply to the following streets will be interrupted on Thursday, March 15, from 9am to 3pm due to essential maintenance work: Oak Street, Pine Avenue, Maple Road, and Cedar Lane. Residents are advised to store water in advance for drinking and cooking. We apologize for any inconvenience this may cause. For emergencies, please contact the council on 0800-WATER-HELP.",
    question: "What should residents do to prepare?",
    options: [
      "Leave their homes",
      "Store water in advance",
      "Call the council immediately",
      "Boil all water"
    ],
    correctAnswer: "Store water in advance",
    points: 30,
    explanation: "The notice states 'Residents are advised to store water in advance'.",
  },
  {
    id: "lv3g-read-003",
    level: "level-3-general",
    skill: "reading",
    type: "multiple-choice",
    passage: "Product Review: SmartHome Security Camera\nI've been using this security camera for three months now, and I'm mostly satisfied. The video quality is excellent, even at night, and the motion detection works well. The mobile app is user-friendly and allows me to check my home from anywhere. However, the initial setup was quite complicated, and the instructions weren't very clear. Also, the monthly subscription fee for cloud storage is higher than I expected. Overall, it's a good product if you're willing to pay for the premium features.",
    question: "What is the reviewer's main criticism?",
    options: [
      "Poor video quality",
      "Difficult setup and high subscription cost",
      "App doesn't work",
      "Motion detection fails"
    ],
    correctAnswer: "Difficult setup and high subscription cost",
    points: 30,
    explanation: "The reviewer mentions complicated setup and unexpected subscription fees as negatives.",
  },

  // Writing
  {
    id: "lv3g-wrt-001",
    level: "level-3-general",
    skill: "writing",
    type: "essay",
    question: "Write about the advantages and disadvantages of social media (120-150 words). Include an introduction, main points, and conclusion.",
    points: 40,
    explanation: "Practice writing balanced arguments with clear organization.",
  },
  {
    id: "lv3g-wrt-002",
    level: "level-3-general",
    skill: "writing",
    type: "essay",
    question: "Write a formal email to your landlord reporting a maintenance problem in your apartment (100-120 words). Describe the problem, explain why it needs to be fixed, and request action.",
    points: 40,
    explanation: "Practice formal written communication with clear problem description and polite requests.",
  },
  {
    id: "lv3g-wrt-003",
    level: "level-3-general",
    skill: "writing",
    type: "essay",
    question: "Write a letter of advice to a friend who is thinking about moving to New Zealand (120-150 words). Include suggestions about finding work, accommodation, and making friends.",
    points: 40,
    explanation: "Practice giving advice in written form with practical suggestions.",
  },
];

// LEVEL 3 APPLIED (14 questions)
export const LEVEL_3_APPLIED_QUESTIONS: Question[] = [
  // Listening
  {
    id: "lv3a-list-001",
    level: "level-3-applied",
    skill: "listening",
    type: "audio-comprehension",
    question: "Listen to the workplace safety briefing. What is the main safety concern?",
    audioScript: "Before we start work today, I need to remind everyone about the importance of wearing your safety equipment at all times. Last week, we had an incident where someone nearly got injured because they weren't wearing their hard hat in the construction zone. This is a strict requirement - no exceptions. If you don't have proper equipment, see me before starting work.",
    voiceProfile: "professional",
    options: [
      "Fire hazards",
      "Not wearing safety equipment",
      "Poor lighting",
      "Slippery floors"
    ],
    correctAnswer: "Not wearing safety equipment",
    points: 35,
    allowTranscript: true,
    explanation: "The briefing emphasizes the importance of wearing safety equipment, specifically hard hats.",
  },
  {
    id: "lv3a-list-002",
    level: "level-3-applied",
    skill: "listening",
    type: "audio-comprehension",
    question: "Listen to the community health message. What action is recommended?",
    audioScript: "With flu season approaching, the community health center is offering free flu vaccinations for all residents over 65 and those with chronic health conditions. Appointments are available Monday to Friday from 9am to 4pm. You can book online or call our helpline. Getting vaccinated not only protects you but also helps protect vulnerable members of our community.",
    voiceProfile: "professional",
    options: [
      "Stay home if sick",
      "Get flu vaccination",
      "Wash hands more",
      "Avoid crowded places"
    ],
    correctAnswer: "Get flu vaccination",
    points: 35,
    allowTranscript: true,
    explanation: "The message promotes free flu vaccinations and encourages people to get vaccinated.",
  },
  {
    id: "lv3a-list-003",
    level: "level-3-applied",
    skill: "listening",
    type: "audio-comprehension",
    question: "Listen to the job interview question. What quality is the interviewer looking for?",
    audioScript: "Can you tell me about a time when you had to deal with a difficult customer? I'm interested in hearing how you handled the situation, what steps you took to resolve the problem, and what the outcome was. This will help me understand your problem-solving approach and customer service skills.",
    voiceProfile: "professional",
    options: [
      "Sales ability",
      "Technical knowledge",
      "Problem-solving and customer service skills",
      "Leadership experience"
    ],
    correctAnswer: "Problem-solving and customer service skills",
    points: 35,
    allowTranscript: true,
    explanation: "The interviewer explicitly mentions wanting to understand 'problem-solving approach and customer service skills'.",
  },

  // Speaking
  {
    id: "lv3a-spk-001",
    level: "level-3-applied",
    skill: "speaking",
    type: "voice-recording",
    question: "You need to call in sick to work. Explain your illness, say when you think you'll be back, and mention any urgent tasks that need to be handled. Speak for 1-2 minutes.",
    points: 40,
    expectedDuration: 90,
    explanation: "Practice workplace communication with appropriate tone and relevant details.",
  },
  {
    id: "lv3a-spk-002",
    level: "level-3-applied",
    skill: "speaking",
    type: "voice-recording",
    question: "Explain to a new colleague how to use the office photocopier. Include step-by-step instructions and troubleshooting tips. Speak for 2 minutes.",
    points: 40,
    expectedDuration: 120,
    explanation: "Practice giving clear instructions in a workplace context.",
  },
  {
    id: "lv3a-spk-003",
    level: "level-3-applied",
    skill: "speaking",
    type: "voice-recording",
    question: "You witnessed a minor accident in your workplace. Describe what happened to your supervisor. Include when, where, who was involved, and what you saw. Speak for 2 minutes.",
    points: 40,
    expectedDuration: 120,
    explanation: "Practice reporting incidents clearly and factually in an employment context.",
  },
  {
    id: "lv3a-spk-004",
    level: "level-3-applied",
    skill: "speaking",
    type: "voice-recording",
    question: "Describe the public transport system in your city to someone who has just arrived. Include information about buses, trains, tickets, and payment. Speak for 2 minutes.",
    points: 40,
    expectedDuration: 120,
    explanation: "Practice explaining community services with practical information.",
  },

  // Reading
  {
    id: "lv3a-read-001",
    level: "level-3-applied",
    skill: "reading",
    type: "multiple-choice",
    passage: "Employee Leave Policy\nAll permanent employees are entitled to four weeks of annual leave per year. Leave must be requested at least two weeks in advance using the online portal. During busy periods (November-January), only limited leave can be approved. Unused leave can be carried over to the following year, up to a maximum of two weeks. Sick leave is separate and requires a medical certificate for absences longer than three consecutive days.",
    question: "What is required for sick leave longer than 3 days?",
    options: [
      "Manager approval",
      "Two weeks notice",
      "Medical certificate",
      "HR interview"
    ],
    correctAnswer: "Medical certificate",
    points: 35,
    explanation: "The policy states sick leave 'requires a medical certificate for absences longer than three consecutive days'.",
  },
  {
    id: "lv3a-read-002",
    level: "level-3-applied",
    skill: "reading",
    type: "multiple-choice",
    passage: "Workplace Health and Safety Notice\nAll contractors working on site must:\n• Sign in at reception and collect a visitor badge\n• Attend a 30-minute safety induction before starting work\n• Wear high-visibility clothing and safety boots at all times\n• Report any hazards or accidents immediately to the site supervisor\n• Follow all safety signage and barriers\nFailure to comply may result in removal from site. These rules are for your protection and the safety of all workers.",
    question: "What must contractors do before starting work?",
    options: [
      "Buy safety equipment",
      "Attend safety induction",
      "Complete online training",
      "Get insurance"
    ],
    correctAnswer: "Attend safety induction",
    points: 35,
    explanation: "The notice requires contractors to 'Attend a 30-minute safety induction before starting work'.",
  },
  {
    id: "lv3a-read-003",
    level: "level-3-applied",
    skill: "reading",
    type: "multiple-choice",
    passage: "Community Garden Volunteer Guidelines\nWelcome to Sunnyvale Community Garden! To ensure everyone has a positive experience:\n• Volunteer sessions run every Saturday 9am-12pm\n• Please bring your own gloves and water bottle\n• Tools are provided and must be returned to the shed after use\n• Children under 12 must be supervised by an adult\n• Produce grown in the garden is shared among all active volunteers\n• We practice organic gardening - no chemical pesticides or fertilizers",
    question: "What gardening method does the garden use?",
    options: [
      "Hydroponic",
      "Organic",
      "Indoor",
      "Intensive farming"
    ],
    correctAnswer: "Organic",
    points: 35,
    explanation: "The guidelines state 'We practice organic gardening - no chemical pesticides or fertilizers'.",
  },

  // Writing
  {
    id: "lv3a-wrt-001",
    level: "level-3-applied",
    skill: "writing",
    type: "essay",
    question: "Write a formal email to your manager requesting two days of annual leave (100-120 words). State the dates, provide a reason, and mention how your work will be covered.",
    points: 45,
    explanation: "Practice formal workplace writing with clear requests and professional tone.",
  },
  {
    id: "lv3a-wrt-002",
    level: "level-3-applied",
    skill: "writing",
    type: "essay",
    question: "Write a short report for your supervisor about a problem in your workplace (120-150 words). Describe the problem, explain its impact, and suggest a solution.",
    points: 45,
    explanation: "Practice problem-reporting in workplace contexts with professional structure.",
  },
  {
    id: "lv3a-wrt-003",
    level: "level-3-applied",
    skill: "writing",
    type: "essay",
    question: "Write instructions for a new employee on how to open and close the shop (100-120 words). Include security procedures and important tasks.",
    points: 45,
    explanation: "Practice writing clear procedural instructions for workplace tasks.",
  },
];

// LEVEL 3 ACADEMIC (14 questions)
export const LEVEL_3_ACADEMIC_QUESTIONS: Question[] = [
  // Listening
  {
    id: "lv3ac-list-001",
    level: "level-3-academic",
    skill: "listening",
    type: "audio-comprehension",
    question: "Listen to the lecture introduction. What is the main topic?",
    audioScript: "Good morning, everyone. Today we're going to examine the effects of climate change on New Zealand's biodiversity. We'll look at how rising temperatures and changing rainfall patterns are affecting native species, particularly birds and plants. We'll also discuss some conservation efforts currently underway.",
    voiceProfile: "academic",
    options: [
      "Weather forecasting",
      "Climate change effects on NZ biodiversity",
      "International conservation",
      "Bird migration patterns"
    ],
    correctAnswer: "Climate change effects on NZ biodiversity",
    points: 35,
    allowTranscript: true,
    explanation: "The lecturer introduces the topic as 'effects of climate change on New Zealand's biodiversity'.",
  },
  {
    id: "lv3ac-list-002",
    level: "level-3-academic",
    skill: "listening",
    type: "audio-comprehension",
    question: "Listen to the study group discussion. What is the group's main concern?",
    audioScript: "I'm worried about the assignment due next week. We have so much reading to do and I haven't even started the research yet. Should we divide the work somehow? Maybe each person could focus on different sources and then we can share our findings?",
    voiceProfile: "casual",
    options: [
      "Exam preparation",
      "Assignment deadline and workload",
      "Library access",
      "Group conflict"
    ],
    correctAnswer: "Assignment deadline and workload",
    points: 35,
    allowTranscript: true,
    explanation: "The speaker expresses worry about the upcoming assignment and the amount of work required.",
  },
  {
    id: "lv3ac-list-003",
    level: "level-3-academic",
    skill: "listening",
    type: "audio-comprehension",
    question: "Listen to the instructor's feedback. What does the instructor suggest improving?",
    audioScript: "Your essay shows good understanding of the main concepts, and your examples are relevant. However, you need to work on your paragraph structure. Each paragraph should have a clear topic sentence followed by supporting evidence. Also, remember to cite your sources properly using APA format.",
    voiceProfile: "professional",
    options: [
      "Understanding of concepts",
      "Choice of examples",
      "Paragraph structure and citations",
      "Essay length"
    ],
    correctAnswer: "Paragraph structure and citations",
    points: 35,
    allowTranscript: true,
    explanation: "The instructor identifies paragraph structure and citation format as areas needing improvement.",
  },

  // Speaking
  {
    id: "lv3ac-spk-001",
    level: "level-3-academic",
    skill: "speaking",
    type: "voice-recording",
    question: "Give a short presentation summarizing a book or article you've read recently for your studies (2-3 minutes). Include the main idea, key points, and your opinion of it.",
    points: 40,
    expectedDuration: 150,
    explanation: "Practice academic presentation skills with summary and critical thinking.",
  },
  {
    id: "lv3ac-spk-002",
    level: "level-3-academic",
    skill: "speaking",
    type: "voice-recording",
    question: "Explain to a classmate how to use the library's online database to find academic articles (2 minutes). Include step-by-step instructions.",
    points: 40,
    expectedDuration: 120,
    explanation: "Practice explaining academic procedures clearly and sequentially.",
  },
  {
    id: "lv3ac-spk-003",
    level: "level-3-academic",
    skill: "speaking",
    type: "voice-recording",
    question: "Describe the education system in your home country and compare it to New Zealand (2-3 minutes). What are the main similarities and differences?",
    points: 40,
    expectedDuration: 150,
    explanation: "Practice comparative analysis in spoken form with clear structure.",
  },
  {
    id: "lv3ac-spk-004",
    level: "level-3-academic",
    skill: "speaking",
    type: "voice-recording",
    question: "You need to request an extension for an assignment from your tutor. Explain your situation, give reasons, and propose a new deadline (1-2 minutes).",
    points: 40,
    expectedDuration: 90,
    explanation: "Practice making formal academic requests with appropriate justification.",
  },

  // Reading
  {
    id: "lv3ac-read-001",
    level: "level-3-academic",
    skill: "reading",
    type: "multiple-choice",
    passage: "The Impact of Sleep on Academic Performance\nRecent research has demonstrated a strong correlation between sleep patterns and academic achievement among university students. A study conducted at three New Zealand universities followed 500 students over one academic year. Results indicated that students who maintained regular sleep schedules of 7-9 hours per night achieved significantly higher grades than those with irregular or insufficient sleep. The researchers suggest that adequate sleep enhances memory consolidation and cognitive function, both essential for learning.",
    question: "According to the study, what contributes to better academic performance?",
    options: [
      "Studying late at night",
      "Regular sleep of 7-9 hours",
      "Sleeping more than 10 hours",
      "Irregular sleep patterns"
    ],
    correctAnswer: "Regular sleep of 7-9 hours",
    points: 35,
    explanation: "The study found that students with 'regular sleep schedules of 7-9 hours per night achieved significantly higher grades'.",
  },
  {
    id: "lv3ac-read-002",
    level: "level-3-academic",
    skill: "reading",
    type: "multiple-choice",
    passage: "Academic Integrity Policy\nAll students must maintain academic honesty in their work. Plagiarism, defined as using another person's ideas or words without proper attribution, is strictly prohibited. This includes copying from websites, books, or other students' work. When using sources, you must:\n1. Put quotations in quotation marks\n2. Paraphrase properly using your own words\n3. Provide full citations for all sources\nViolations may result in failing the assessment or, in serious cases, suspension from the program.",
    question: "What must students do when using ideas from sources?",
    options: [
      "Copy them exactly",
      "Only use their own ideas",
      "Provide citations and proper attribution",
      "Get permission from the author"
    ],
    correctAnswer: "Provide citations and proper attribution",
    points: 35,
    explanation: "The policy requires students to 'provide full citations for all sources' and properly attribute ideas.",
  },
  {
    id: "lv3ac-read-003",
    level: "level-3-academic",
    skill: "reading",
    type: "multiple-choice",
    passage: "Sustainable Agriculture in New Zealand\nNew Zealand's agricultural sector is increasingly adopting sustainable practices to address environmental concerns. These include reducing chemical fertilizer use, improving water management, and implementing regenerative farming techniques. While conventional farming focuses on maximizing short-term productivity, sustainable approaches aim to maintain soil health and ecosystem balance for long-term viability. However, the transition requires significant investment and farmer education, which presents challenges for widespread adoption.",
    question: "What is a challenge for sustainable farming?",
    options: [
      "Lack of government support",
      "Poor soil quality",
      "High investment and need for education",
      "Consumer resistance"
    ],
    correctAnswer: "High investment and need for education",
    points: 35,
    explanation: "The passage states that 'the transition requires significant investment and farmer education, which presents challenges'.",
  },

  // Writing
  {
    id: "lv3ac-wrt-001",
    level: "level-3-academic",
    skill: "writing",
    type: "essay",
    question: "Write a paragraph (150-200 words) discussing the advantages and disadvantages of online learning compared to traditional classroom learning. Include a topic sentence, supporting points, and a conclusion.",
    points: 45,
    explanation: "Practice academic paragraph writing with balanced analysis and clear structure.",
  },
  {
    id: "lv3ac-wrt-002",
    level: "level-3-academic",
    skill: "writing",
    type: "essay",
    question: "Write a summary of the following statement (100-120 words): 'Technology has transformed how students learn, providing access to information and enabling new forms of collaboration, but it also presents challenges such as distraction and reduced face-to-face interaction.'",
    points: 45,
    explanation: "Practice summarizing academic ideas concisely while maintaining key points.",
  },
  {
    id: "lv3ac-wrt-003",
    level: "level-3-academic",
    skill: "writing",
    type: "essay",
    question: "Write an email to your course coordinator (120-150 words) asking for clarification about the assignment requirements. Be specific about what you don't understand and maintain a formal, polite tone.",
    points: 45,
    explanation: "Practice formal academic communication with clear questions and appropriate register.",
  },
];

export const LEVEL_3_QUESTIONS = [
  ...LEVEL_3_GENERAL_QUESTIONS,
  ...LEVEL_3_APPLIED_QUESTIONS,
  ...LEVEL_3_ACADEMIC_QUESTIONS,
];
