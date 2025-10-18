# 🎓 NZCEL Exam Prep - AI-Powered Interactive Learning Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![CopilotKit](https://img.shields.io/badge/CopilotKit-1.10-purple)](https://copilotkit.ai/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An innovative, gamified web application that revolutionizes NZCEL exam preparation through AI-powered adaptive learning, real-time feedback, and engaging interactive experiences.

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [CopilotKit Integration](#-copilotkit-integration)
- [NZCEL Framework](#-nzcel-framework)
- [User Flow](#-user-flow)
- [Data Models](#-data-models)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **NZCEL Exam Prep Platform** is a comprehensive learning solution designed to help students master the New Zealand Certificates in English Language (NZCEL) examinations. By combining artificial intelligence, gamification, and modern web technologies, we provide an engaging and effective study experience.

### Key Highlights

- 🤖 **AI-Powered Study Companion** - Intelligent tutoring with CopilotKit
- 🎯 **Adaptive Learning** - Personalized difficulty adjustment
- 🏆 **Gamification** - Points, badges, streaks, and achievements
- 📊 **Progress Tracking** - Real-time skill monitoring
- ✨ **Modern UI/UX** - Beautiful animations and responsive design
- 🌐 **Client-Side First** - No backend required, data persists locally

---

## ✨ Features

### 🤖 AI-Powered Learning

```mermaid
graph LR
    A[Student] -->|Interacts| B[CopilotKit AI]
    B -->|Provides| C[Context-Aware Help]
    B -->|Generates| D[Practice Questions]
    B -->|Validates| E[Answers]
    B -->|Recommends| F[Next Steps]

    style B fill:#a855f7,stroke:#7c3aed,color:#fff
    style C fill:#60a5fa,stroke:#3b82f6,color:#fff
    style D fill:#60a5fa,stroke:#3b82f6,color:#fff
    style E fill:#60a5fa,stroke:#3b82f6,color:#fff
    style F fill:#60a5fa,stroke:#3b82f6,color:#fff
```

**AI Capabilities:**
- Generate contextual practice questions based on student level
- Provide instant answer validation with detailed explanations
- Recommend personalized learning paths based on performance
- Explain NZCEL framework concepts and requirements
- Award achievements and badges for milestones
- Track and update skill progress dynamically

### 🎯 Adaptive Practice System

- **13 NZCEL Levels**: Foundation → Level 1 → Level 2 → Level 3 (General/Applied/Academic) → Level 4 (General/Employment/Academic) → Level 5 (General/Employment/Academic) → Level 6 (Advanced)
- **4 Core Skills**: Listening 🎧, Speaking 🗣️, Reading 📖, Writing ✍️
- **Multiple Question Types**: Multiple Choice, Fill-in-Blank, Essays, Speaking Prompts
- **Smart Difficulty Adjustment**: AI-driven level recommendations

### 🏆 Gamification System

```mermaid
graph TD
    A[Student Activity] --> B{Complete Question}
    B -->|Correct| C[+Points]
    B -->|Any Answer| D[Update Streak]
    C --> E{Milestone Reached?}
    E -->|Yes| F[Unlock Achievement]
    E -->|No| G[Continue Learning]
    F --> H[Award Badge]
    F --> I[Confetti Celebration]
    H --> G
    I --> G
    D --> G

    style C fill:#fbbf24,stroke:#f59e0b,color:#000
    style F fill:#10b981,stroke:#059669,color:#fff
    style H fill:#a855f7,stroke:#7c3aed,color:#fff
    style I fill:#ec4899,stroke:#db2777,color:#fff
```

**Gamification Elements:**
- ⭐ **Points System**: Earn points for every correct answer
- 🔥 **Study Streaks**: Maintain daily practice momentum
- 🏅 **Achievements**: 6 progressive milestones to unlock
- 🎖️ **Badges**: Collectible rewards with rarity tiers
- 🎉 **Celebrations**: Confetti animations for major wins

### 📊 Progress Dashboard

- Real-time skill progress visualization
- Comprehensive statistics (points, streak, questions completed)
- Achievement tracking (in-progress vs. completed)
- Badge showcase and collection
- Study calendar with streak history

---

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App Router]
        B[React Components]
        C[Framer Motion]
        D[shadcn/ui]
    end

    subgraph "State Management"
        E[Zustand Store]
        F[LocalStorage]
    end

    subgraph "AI Layer"
        G[CopilotKit Provider]
        H[Copilot Cloud API]
        I[Context Providers]
        J[Action Handlers]
    end

    subgraph "Data Layer"
        K[NZCEL Levels Data]
        L[Question Bank]
        M[User Progress]
    end

    A --> B
    B --> C
    B --> D
    B --> E
    E --> F
    A --> G
    G --> H
    G --> I
    G --> J
    I --> M
    J --> K
    J --> L
    E --> M

    style G fill:#a855f7,stroke:#7c3aed,color:#fff
    style H fill:#6366f1,stroke:#4f46e5,color:#fff
    style E fill:#10b981,stroke:#059669,color:#fff
    style A fill:#000,stroke:#333,color:#fff
```

### Component Architecture

```mermaid
graph TD
    A[App Layout] --> B[CopilotKit Provider]
    B --> C[CopilotContext]
    B --> D[CopilotActions]
    C --> E[CopilotSidebar]
    D --> E
    E --> F[Page Content]

    F --> G[Landing Page]
    F --> H[Practice Page]
    F --> I[Dashboard Page]

    H --> J[QuestionCard]
    H --> K[LevelSelector]
    H --> L[SkillProgress]

    I --> M[StatsCards]
    I --> N[SkillCharts]
    I --> O[Achievements]
    I --> P[BadgeGallery]

    style B fill:#a855f7,stroke:#7c3aed,color:#fff
    style C fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style D fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style E fill:#6366f1,stroke:#4f46e5,color:#fff
```

### Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI Component
    participant Z as Zustand Store
    participant LS as LocalStorage
    participant CK as CopilotKit
    participant AI as Copilot Cloud

    U->>UI: Select Skill
    UI->>Z: Get Current Level
    Z->>LS: Load State
    LS-->>Z: Return State
    Z-->>UI: Current Level Data

    U->>UI: Request Question
    UI->>CK: Trigger generateQuestion
    CK->>AI: Send Request + Context
    AI-->>CK: Return Question
    CK-->>UI: Display Question

    U->>UI: Submit Answer
    UI->>CK: Trigger checkAnswer
    CK->>AI: Validate Answer
    AI-->>CK: Return Feedback
    CK-->>UI: Show Feedback

    UI->>Z: Update Progress
    Z->>LS: Persist State
    Z-->>UI: Confirm Update
    UI-->>U: Show Confetti 🎉
```

---

## 🛠️ Tech Stack

### Core Technologies

```mermaid
mindmap
  root((NZCEL Platform))
    Frontend
      Next.js 15
      React 19
      TypeScript 5
      TailwindCSS 4
    UI/UX
      shadcn/ui
      Framer Motion
      Lucide Icons
      react-confetti
    AI/ML
      CopilotKit
      Copilot Cloud
      useCopilotAction
      useCopilotReadable
    State
      Zustand
      LocalStorage
      Persistence
    Tools
      ESLint
      Prettier
      Git
```

### Technology Details

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 15 | App Router, RSC, TypeScript support |
| **UI Library** | React 19 | Component-based architecture |
| **Styling** | TailwindCSS 4 | Utility-first CSS framework |
| **Components** | shadcn/ui | Beautiful, accessible components |
| **AI Platform** | CopilotKit | AI integration framework |
| **AI Backend** | Copilot Cloud | Managed AI service |
| **State Mgmt** | Zustand | Lightweight state management |
| **Persistence** | LocalStorage | Client-side data storage |
| **Animations** | Framer Motion | Smooth, declarative animations |
| **Icons** | Lucide React | Modern icon system |
| **Language** | TypeScript | Type safety and developer experience |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher (or yarn/pnpm)
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nzcel-prep

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: http://your-ip:3000

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

---

## 📁 Project Structure

```
nzcel-prep/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── page.tsx                 # Landing page
│   │   ├── practice/                # Practice interface
│   │   │   └── page.tsx
│   │   └── dashboard/               # Progress dashboard
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ... (14 components)
│   │   │
│   │   ├── copilot/                 # CopilotKit integration
│   │   │   ├── copilot-context.tsx  # useCopilotReadable
│   │   │   └── copilot-actions.tsx  # useCopilotAction
│   │   │
│   │   ├── practice/                # Practice components
│   │   │   ├── question-card.tsx
│   │   │   └── level-selector.tsx
│   │   │
│   │   └── providers.tsx            # App providers wrapper
│   │
│   ├── data/
│   │   ├── nzcel-levels.ts          # 13 NZCEL level definitions
│   │   └── questions.ts             # Question bank & helpers
│   │
│   ├── lib/
│   │   ├── store/
│   │   │   └── user-progress.ts     # Zustand store
│   │   └── utils.ts                 # Utility functions
│   │
│   ├── types/
│   │   └── index.ts                 # TypeScript definitions
│   │
│   └── hooks/
│       └── use-window-size.ts       # Custom React hooks
│
├── public/                          # Static assets
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts              # Tailwind config
├── next.config.ts                  # Next.js config
└── README.md                        # This file
```

---

## 🤖 CopilotKit Integration

### Architecture Overview

```mermaid
graph TB
    subgraph "CopilotKit Layer"
        A[CopilotKit Provider]
        B[CopilotSidebar]
        C[CopilotContext]
        D[CopilotActions]
    end

    subgraph "Context Data useCopilotReadable"
        E[Student Level & Target]
        F[Skill Progress]
        G[Gamification Stats]
        H[Achievements & Badges]
        I[NZCEL Framework]
    end

    subgraph "AI Actions useCopilotAction"
        J[generatePracticeQuestion]
        K[checkAnswer]
        L[recommendNextExercise]
        M[explainNZCELLevel]
        N[adjustDifficulty]
        O[awardBadge]
        P[updateSkillProgress]
    end

    A --> B
    A --> C
    A --> D
    C --> E
    C --> F
    C --> G
    C --> H
    C --> I
    D --> J
    D --> K
    D --> L
    D --> M
    D --> N
    D --> O
    D --> P

    style A fill:#a855f7,stroke:#7c3aed,color:#fff
    style B fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style C fill:#6366f1,stroke:#4f46e5,color:#fff
    style D fill:#6366f1,stroke:#4f46e5,color:#fff
```

### Context Providers (useCopilotReadable)

The AI has access to comprehensive student context:

```typescript
// Current level and goals
{
  currentLevel: "level-4-academic",
  targetLevel: "level-5-academic"
}

// Skill progress (0-100%)
{
  listening: 75,
  speaking: 60,
  reading: 85,
  writing: 70
}

// Gamification metrics
{
  totalPoints: 1250,
  streak: 7,
  completedQuestionsCount: 45,
  lastStudyDate: "2025-10-18"
}

// Achievements & Badges
{
  achievements: [...],
  badges: [...]
}

// Complete NZCEL Framework
{
  levels: [13 levels with full details]
}
```

### AI Actions (useCopilotAction)

| Action | Purpose | Parameters | Returns |
|--------|---------|------------|---------|
| `generatePracticeQuestion` | Create contextual practice questions | level, skill | Question object |
| `checkAnswer` | Validate student answers | questionId, userAnswer | Feedback, points |
| `recommendNextExercise` | Suggest adaptive learning path | - | Recommended skill, question |
| `explainNZCELLevel` | Provide level details | level | Level information |
| `adjustDifficulty` | Change student level | newLevel, reason | Confirmation |
| `awardBadge` | Grant achievement badges | badgeName, reason, rarity | Badge object |
| `updateSkillProgress` | Track skill improvement | skill, progressChange | New progress |

### Example AI Interactions

**Student**: "Can you generate a reading question for Level 4 Academic?"

**AI**: *Executes `generatePracticeQuestion` action*
```json
{
  "success": true,
  "question": {
    "type": "multiple-choice",
    "question": "Read: 'Climate change presents...' What is the main topic?",
    "options": [...],
    "points": 40
  }
}
```

**Student**: "What's the difference between Level 3 and Level 4?"

**AI**: *Executes `explainNZCELLevel` action twice and compares*

---

## 📚 NZCEL Framework

### Level Progression

```mermaid
graph TD
    A[Foundation] --> B[Level 1]
    B --> C[Level 2]
    C --> D[Level 3 General]
    D --> E[Level 3 Applied]
    D --> F[Level 3 Academic]
    E --> G[Level 4 General]
    E --> H[Level 4 Employment]
    F --> I[Level 4 Academic]
    G --> J[Level 5 General]
    H --> K[Level 5 Employment]
    I --> L[Level 5 Academic]
    J --> M[Level 6 Advanced]
    K --> M
    L --> M

    I -.->|Entry to| N[Bachelor's Degree]
    L -.->|Entry to| O[Master's/PhD]

    style I fill:#10b981,stroke:#059669,color:#fff
    style L fill:#6366f1,stroke:#4f46e5,color:#fff
    style N fill:#fbbf24,stroke:#f59e0b,color:#000
    style O fill:#ec4899,stroke:#db2777,color:#fff
```

### IELTS Equivalency

| NZCEL Level | IELTS Score | TOEFL iBT | PTE Academic | CEFR | Pathway |
|-------------|-------------|-----------|--------------|------|---------|
| Level 3 (Applied/Academic) | 5.5 (no band < 5.0) | 46 | 42 | - | Certificate Level 4 |
| Level 4 (General/Employment) | 5.5 (no band < 5.0) | 46 | 42 | - | Diploma Level 5 |
| **Level 4 (Academic)** | **6.0 (no band < 5.5)** | **60** | **50** | **B2** | **Bachelor's Degree** |
| **Level 5 (Academic)** | **6.5 (no band < 6.0)** | **79** | **58** | **C1** | **Master's/PhD** |
| Level 6 (Advanced) | - | - | - | C2 | Advanced proficiency |

### Four Core Skills

Each NZCEL level defines graduate outcomes for:

1. **🎧 Listening**: Understanding spoken English in various contexts
2. **🗣️ Speaking**: Participating in conversations and presentations
3. **📖 Reading**: Comprehending written texts and materials
4. **✍️ Writing**: Producing clear, structured written communication

---

## 👥 User Flow

### Student Journey

```mermaid
journey
    title Student Learning Journey
    section Onboarding
      Visit Landing Page: 5: Student
      Learn About Features: 4: Student
      Click Start Practice: 5: Student
    section Practice
      Select Skill (e.g., Reading): 5: Student
      Receive AI-Generated Question: 5: AI, Student
      Submit Answer: 4: Student
      Get Instant Feedback: 5: AI, Student
      Earn Points & Update Streak: 5: System
    section Achievements
      Complete 10 Questions: 4: Student
      Unlock Achievement: 5: System, Student
      Receive Badge: 5: System, Student
      See Confetti Celebration: 5: Student
    section Progress Review
      Visit Dashboard: 5: Student
      Check Skill Progress: 4: Student
      View Achievements: 4: Student
      Review Badges: 5: Student
    section AI Assistance
      Open AI Sidebar: 5: Student
      Ask for Help: 4: Student, AI
      Get Personalized Guidance: 5: AI, Student
      Request Next Question: 5: Student, AI
```

### Practice Flow

```mermaid
stateDiagram-v2
    [*] --> LandingPage
    LandingPage --> PracticePage: Click Start Practice
    PracticePage --> SelectSkill
    SelectSkill --> LoadQuestion
    LoadQuestion --> AnswerQuestion
    AnswerQuestion --> SubmitAnswer
    SubmitAnswer --> CheckAnswer
    CheckAnswer --> ShowFeedback
    ShowFeedback --> UpdateProgress
    UpdateProgress --> CheckAchievement
    CheckAchievement --> ShowConfetti: Achievement Unlocked
    CheckAchievement --> LoadQuestion: Continue Practice
    ShowConfetti --> LoadQuestion
    LoadQuestion --> Dashboard: View Progress
    Dashboard --> PracticePage: Continue Practice
    Dashboard --> [*]: Exit
```

---

## 🗄️ Data Models

### TypeScript Type Definitions

```mermaid
classDiagram
    class NZCELLevel {
        +string id
        +string name
        +string description
        +string strategicPurpose
        +GraduateOutcomes graduateOutcomes
        +string[] pathways
        +Equivalency equivalency
    }

    class Question {
        +string id
        +NZCELLevel level
        +SkillType skill
        +QuestionType type
        +string question
        +string[] options
        +string correctAnswer
        +number points
        +string explanation
    }

    class UserProgress {
        +NZCELLevel currentLevel
        +NZCELLevel targetLevel
        +SkillProgress skillProgress
        +string[] completedQuestions
        +number totalPoints
        +number streak
        +string lastStudyDate
        +Badge[] badges
        +Achievement[] achievements
    }

    class Achievement {
        +string id
        +string title
        +string description
        +number progress
        +number target
        +boolean completed
        +number reward
    }

    class Badge {
        +string id
        +string name
        +string description
        +string icon
        +string earnedAt
        +Rarity rarity
    }

    UserProgress --> Badge
    UserProgress --> Achievement
    UserProgress --> NZCELLevel
    Question --> NZCELLevel
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style

- Follow TypeScript best practices
- Use ESLint configuration provided
- Write meaningful commit messages
- Add comments for complex logic
- Ensure responsive design

### Adding Questions

To expand the question bank:

1. Edit `src/data/questions.ts`
2. Follow the `Question` interface structure
3. Include explanation for correct answers
4. Test questions in practice mode

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NZQA** - For the comprehensive NZCEL framework
- **CopilotKit** - For enabling seamless AI integration
- **shadcn/ui** - For beautiful, accessible components
- **Vercel** - For the Next.js framework and hosting platform
- **NZCEL Students** - For inspiring this educational tool

---

## 📞 Support

For questions, issues, or suggestions:

- 📧 Email: support@nzcel-prep.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/nzcel-prep/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/nzcel-prep/discussions)

---

<div align="center">

**Built with ❤️ for NZCEL students worldwide**

[![Next.js](https://img.shields.io/badge/Powered%20by-Next.js-black?logo=next.js)](https://nextjs.org/)
[![CopilotKit](https://img.shields.io/badge/AI%20by-CopilotKit-purple)](https://copilotkit.ai/)

</div>
