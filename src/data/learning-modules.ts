import { LearningModule } from "@/types";

/**
 * Learning Modules Configuration
 * Defines all available learning paths in the ESOL platform
 */

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: "speaking",
    type: "general",
    name: "AI Speaking Coach",
    description: "Real-time voice conversation practice with AI-powered ESOL coach. Improve fluency, pronunciation, and confidence through natural conversations.",
    icon: "Mic",
    route: "/speaking",
    levelSystem: "cefr",
    supportedSkills: ["speaking"],
    isActive: true,
  },
  {
    id: "general-practice",
    type: "general",
    name: "General English Practice",
    description: "CEFR-aligned practice for all four skills. Build your English proficiency from A1 to C2 with adaptive exercises.",
    icon: "BookOpen",
    route: "/practice/general",
    levelSystem: "cefr",
    supportedSkills: ["listening", "speaking", "reading", "writing"],
    isActive: true,
  },
  {
    id: "nzcel-prep",
    type: "nzcel",
    name: "NZCEL Exam Preparation",
    description: "Comprehensive preparation for New Zealand Certificates in English Language. Practice all skills aligned with NZCEL levels and requirements.",
    icon: "GraduationCap",
    route: "/practice/nzcel",
    levelSystem: "nzcel",
    supportedSkills: ["listening", "speaking", "reading", "writing"],
    isActive: true,
  },
  {
    id: "scenario-practice",
    type: "scenario",
    name: "Scenario-Based Learning",
    description: "Practice English in real-world contexts: workplace, travel, academic, and social situations.",
    icon: "Globe",
    route: "/practice/scenarios",
    levelSystem: "cefr",
    supportedSkills: ["listening", "speaking", "reading", "writing"],
    isActive: false, // Coming soon
  },
  {
    id: "ielts-prep",
    type: "ielts",
    name: "IELTS Preparation",
    description: "Targeted practice for the International English Language Testing System exam.",
    icon: "FileText",
    route: "/practice/ielts",
    levelSystem: "custom",
    supportedSkills: ["listening", "speaking", "reading", "writing"],
    isActive: false, // Coming soon
  },
  {
    id: "toefl-prep",
    type: "toefl",
    name: "TOEFL Preparation",
    description: "Comprehensive preparation for the Test of English as a Foreign Language.",
    icon: "FileCheck",
    route: "/practice/toefl",
    levelSystem: "custom",
    supportedSkills: ["listening", "speaking", "reading", "writing"],
    isActive: false, // Coming soon
  },
];

/**
 * Get active learning modules only
 */
export function getActiveModules(): LearningModule[] {
  return LEARNING_MODULES.filter((module) => module.isActive);
}

/**
 * Get module by ID
 */
export function getModuleById(id: string): LearningModule | undefined {
  return LEARNING_MODULES.find((module) => module.id === id);
}

/**
 * Get modules by type
 */
export function getModulesByType(type: string): LearningModule[] {
  return LEARNING_MODULES.filter((module) => module.type === type);
}

/**
 * Get modules that support a specific skill
 */
export function getModulesBySkill(skill: string): LearningModule[] {
  return LEARNING_MODULES.filter((module) =>
    module.supportedSkills.includes(skill as any)
  );
}
