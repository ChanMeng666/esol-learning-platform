/**
 * Diagnostic Test Sample Data
 * Contains sample diagnostic tests for NZCEL and CEFR systems
 */

export const sampleDiagnosticTests = [
  {
    name: "NZCEL Initial Placement Test",
    description:
      "Comprehensive placement test to determine your starting NZCEL level across all four skills: listening, speaking, reading, and writing.",
    levelSystem: "nzcel",
    testType: "initial_placement",
    targetSkills: ["listening", "speaking", "reading", "writing"],
    estimatedDuration: 60,
    isActive: true,
    isSystemTest: true,
    sections: [
      {
        skillType: "listening",
        sectionName: "Listening Comprehension",
        levelRangeMin: "foundation",
        levelRangeMax: "level-6-advanced",
        totalQuestions: 10,
        passingThreshold: "0.70",
        orderIndex: 1,
        instructions:
          "Listen to the audio clips and answer the questions. You will hear each clip twice.",
        questions: [
          {
            questionType: "multiple_choice",
            questionText: "What is the main topic of the conversation?",
            options: [
              "Planning a vacation",
              "Discussing work schedules",
              "Ordering food at a restaurant",
              "Asking for directions",
            ],
            correctAnswer: "Discussing work schedules",
            difficultyLevel: "foundation",
            points: 1,
            orderIndex: 1,
          },
          {
            questionType: "multiple_choice",
            questionText: "Where does the conversation take place?",
            options: ["At a bank", "At a school", "At an office", "At a hospital"],
            correctAnswer: "At an office",
            difficultyLevel: "level-1",
            points: 1,
            orderIndex: 2,
          },
        ],
      },
      {
        skillType: "reading",
        sectionName: "Reading Comprehension",
        levelRangeMin: "foundation",
        levelRangeMax: "level-6-advanced",
        totalQuestions: 10,
        passingThreshold: "0.70",
        orderIndex: 2,
        instructions:
          "Read the passages carefully and answer the questions based on the information provided.",
        questions: [
          {
            questionType: "multiple_choice",
            questionText:
              "Read the passage: 'The weather forecast shows rain tomorrow.' What does this mean?",
            options: [
              "It rained yesterday",
              "It will rain tomorrow",
              "It is raining now",
              "It might rain next week",
            ],
            correctAnswer: "It will rain tomorrow",
            difficultyLevel: "foundation",
            points: 1,
            orderIndex: 1,
          },
          {
            questionType: "fill_in_blank",
            questionText:
              "Complete the sentence: 'I ____ to the store yesterday.' (go)",
            correctAnswer: "went",
            difficultyLevel: "level-1",
            points: 1,
            orderIndex: 2,
          },
        ],
      },
      {
        skillType: "writing",
        sectionName: "Writing Skills",
        levelRangeMin: "foundation",
        levelRangeMax: "level-6-advanced",
        totalQuestions: 5,
        passingThreshold: "0.70",
        orderIndex: 3,
        instructions:
          "Complete the writing tasks below. Write clearly and check your grammar and spelling.",
        questions: [
          {
            questionType: "essay",
            questionText:
              "Write a short paragraph (50-100 words) describing your typical day.",
            difficultyLevel: "foundation",
            points: 5,
            orderIndex: 1,
            rubric: {
              criteria: [
                "Grammar and sentence structure",
                "Vocabulary usage",
                "Organization and coherence",
                "Task completion",
              ],
            },
          },
          {
            questionType: "essay",
            questionText:
              "Write an email (100-150 words) to a friend inviting them to an event.",
            difficultyLevel: "level-2",
            points: 5,
            orderIndex: 2,
            rubric: {
              criteria: [
                "Appropriate tone and format",
                "Clear communication",
                "Grammar and spelling",
                "Organization",
              ],
            },
          },
        ],
      },
      {
        skillType: "speaking",
        sectionName: "Speaking Assessment",
        levelRangeMin: "foundation",
        levelRangeMax: "level-6-advanced",
        totalQuestions: 5,
        passingThreshold: "0.70",
        orderIndex: 4,
        instructions:
          "Record your responses to the speaking prompts. Speak clearly and naturally.",
        questions: [
          {
            questionType: "speaking_prompt",
            questionText:
              "Introduce yourself. Tell us your name, where you are from, and what you do.",
            difficultyLevel: "foundation",
            points: 3,
            orderIndex: 1,
            rubric: {
              criteria: [
                "Pronunciation and clarity",
                "Fluency",
                "Vocabulary usage",
                "Grammar accuracy",
              ],
            },
          },
          {
            questionType: "speaking_prompt",
            questionText:
              "Describe your favorite place to visit. Why do you like it?",
            difficultyLevel: "level-2",
            points: 3,
            orderIndex: 2,
            rubric: {
              criteria: [
                "Pronunciation",
                "Fluency and coherence",
                "Descriptive language",
                "Grammar and structure",
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: "CEFR Level Assessment",
    description:
      "Determine your CEFR level from A1 (Beginner) to C2 (Proficiency) across listening, speaking, reading, and writing skills.",
    levelSystem: "cefr",
    testType: "initial_placement",
    targetSkills: ["listening", "speaking", "reading", "writing"],
    estimatedDuration: 45,
    isActive: true,
    isSystemTest: true,
    sections: [
      {
        skillType: "listening",
        sectionName: "Listening Test",
        levelRangeMin: "A1",
        levelRangeMax: "C2",
        totalQuestions: 8,
        passingThreshold: "0.70",
        orderIndex: 1,
        instructions:
          "Listen carefully and choose the best answer for each question.",
        questions: [
          {
            questionType: "multiple_choice",
            questionText: "What time does the shop open?",
            options: ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
            correctAnswer: "9:00 AM",
            difficultyLevel: "A1",
            points: 1,
            orderIndex: 1,
          },
          {
            questionType: "multiple_choice",
            questionText: "Why is the speaker calling?",
            options: [
              "To make an appointment",
              "To cancel a meeting",
              "To ask for information",
              "To confirm a reservation",
            ],
            correctAnswer: "To confirm a reservation",
            difficultyLevel: "A2",
            points: 1,
            orderIndex: 2,
          },
        ],
      },
      {
        skillType: "reading",
        sectionName: "Reading Test",
        levelRangeMin: "A1",
        levelRangeMax: "C2",
        totalQuestions: 8,
        passingThreshold: "0.70",
        orderIndex: 2,
        instructions: "Read each text and answer the questions.",
        questions: [
          {
            questionType: "multiple_choice",
            questionText:
              "Read: 'Please call me after 5 PM.' When should you call?",
            options: [
              "Before 5 PM",
              "At 5 PM exactly",
              "After 5 PM",
              "Any time",
            ],
            correctAnswer: "After 5 PM",
            difficultyLevel: "A1",
            points: 1,
            orderIndex: 1,
          },
        ],
      },
      {
        skillType: "writing",
        sectionName: "Writing Test",
        levelRangeMin: "A1",
        levelRangeMax: "C2",
        totalQuestions: 3,
        passingThreshold: "0.70",
        orderIndex: 3,
        instructions: "Complete the writing tasks as instructed.",
        questions: [
          {
            questionType: "essay",
            questionText: "Write a short message (30-50 words) to a colleague.",
            difficultyLevel: "A2",
            points: 5,
            orderIndex: 1,
            rubric: {
              criteria: ["Clarity", "Grammar", "Vocabulary", "Format"],
            },
          },
        ],
      },
      {
        skillType: "speaking",
        sectionName: "Speaking Test",
        levelRangeMin: "A1",
        levelRangeMax: "C2",
        totalQuestions: 3,
        passingThreshold: "0.70",
        orderIndex: 4,
        instructions: "Respond to each prompt by recording your answer.",
        questions: [
          {
            questionType: "speaking_prompt",
            questionText: "Tell us about your family.",
            difficultyLevel: "A1",
            points: 3,
            orderIndex: 1,
            rubric: {
              criteria: ["Pronunciation", "Fluency", "Vocabulary", "Grammar"],
            },
          },
        ],
      },
    ],
  },
];
