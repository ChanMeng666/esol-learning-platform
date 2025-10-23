"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackgroundCircles } from "@/components/ui/background-circles";
import { WelcomeTour } from "@/components/onboarding/welcome-tour";
import { Timeline } from "@/components/ui/timeline";
import { useUser, useStackApp } from "@stackframe/stack";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const user = useUser();
  const app = useStackApp();

  const timelineData = [
    {
      title: "AI Speaking Coach",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Practice real-time voice conversation with AI coach. Natural dialogue with instant feedback and pronunciation assessment across all CEFR levels.
          </p>
          <div className="mb-8">
            {/* SVG Placeholder: Replace with custom illustration */}
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 h-48 md:h-64 lg:h-80 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] flex items-center justify-center">
              <span className="text-neutral-400 dark:text-neutral-600 text-sm">AI Speaking Coach Illustration</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/speaking")}
              className="flex-1 md:flex-initial"
            >
              Start Practice
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              View Progress
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "NZCEL Exam Prep",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Comprehensive preparation for New Zealand Certificates in English Language. Complete pathway from Foundation to Level 6 covering all skills and university requirements.
          </p>
          <div className="mb-8">
            {/* SVG Placeholder: Replace with custom illustration */}
            <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 h-48 md:h-64 lg:h-80 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] flex items-center justify-center">
              <span className="text-neutral-400 dark:text-neutral-600 text-sm">NZCEL Preparation Illustration</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/practice/nzcel")}
              className="flex-1 md:flex-initial"
            >
              Start Prep
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              View Progress
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "General Practice",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            CEFR-aligned English practice across all proficiency levels. Systematic skill development from Elementary A1 to Proficiency C2 with adaptive difficulty.
          </p>
          <div className="mb-8">
            {/* SVG Placeholder: Replace with custom illustration */}
            <div className="rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 h-48 md:h-64 lg:h-80 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] flex items-center justify-center">
              <span className="text-neutral-400 dark:text-neutral-600 text-sm">General Practice Illustration</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/practice/general")}
              className="flex-1 md:flex-initial"
            >
              Start Practice
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="flex-1 md:flex-initial"
            >
              View Progress
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Scenario Learning",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Context-based English practice for real-world situations. Workplace communication, travel scenarios, academic discussions, and social interactions.
          </p>
          <div className="mb-8">
            {/* SVG Placeholder: Replace with custom illustration */}
            <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 h-48 md:h-64 lg:h-80 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] flex items-center justify-center opacity-60">
              <span className="text-neutral-400 dark:text-neutral-600 text-sm">Scenario Learning Illustration</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              disabled
              className="flex-1 md:flex-initial"
            >
              Coming Soon
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <WelcomeTour />
      {/* Hero Section with Background Circles */}
      <BackgroundCircles variant="octonary">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex flex-col gap-4 items-center justify-center px-4"
        >
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered ESOL Learning Platform
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white text-center">
            Master English with AI
          </h1>

          <p className="text-xl md:text-2xl text-black/70 dark:text-white/70 py-4 text-center max-w-3xl">
            CEFR-aligned practice, NZCEL exam prep, real-time speaking coach, and adaptive learning for ESOL students
          </p>

          {user ? (
            // Logged in user - show Go to Dashboard
            <Button
              onClick={() => router.push("/dashboard")}
              size="lg"
              className="mt-4 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
            >
              Go to Dashboard
            </Button>
          ) : (
            // Guest user - show Get Started (leads to sign-up)
            <Link href={app.urls.signUp}>
              <Button
                size="lg"
                className="mt-4 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
              >
                Get Started Free
              </Button>
            </Link>
          )}
        </motion.div>
      </BackgroundCircles>

      {/* Learning Paths Section - Timeline Design */}
      {user && (
        <Timeline data={timelineData} />
      )}

      {/* Features Section for Guest Users */}
      {!user && (
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional English Learning Platform</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive ESOL preparation powered by AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">AI-Powered Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Personalized feedback and adaptive difficulty based on your performance
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Real-time Speaking Practice</h3>
              <p className="text-muted-foreground leading-relaxed">
                Practice speaking with AI coach and get instant pronunciation feedback
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Exam Preparation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive prep for NZCEL and other English proficiency exams
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
