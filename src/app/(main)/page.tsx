"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackgroundCircles } from "@/components/ui/background-circles";
import { WelcomeTour } from "@/components/onboarding/welcome-tour";
import { useUser, useStackApp } from "@stackframe/stack";
import { Mic, GraduationCap, BookOpen, Sparkles, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const user = useUser();
  const app = useStackApp();

  const learningPaths = [
    {
      icon: Mic,
      title: "AI Speaking Coach",
      description: "Real-time voice conversation with AI ESOL coach. Practice speaking naturally and get instant feedback.",
      route: "/speaking",
      featured: true,
      badges: ["Real-time", "AI-Powered", "CEFR A1-C2"],
      gradient: "from-blue-500/10 to-purple-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: GraduationCap,
      title: "NZCEL Exam Prep",
      description: "Comprehensive preparation for New Zealand Certificates in English Language across all 13 levels.",
      route: "/practice/nzcel",
      featured: false,
      badges: ["13 Levels", "All Skills", "University Pathway"],
      gradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
    },
    {
      icon: BookOpen,
      title: "General Practice",
      description: "CEFR-aligned practice for all four skills. Build your English proficiency from A1 to C2.",
      route: "/practice/general",
      featured: false,
      badges: ["CEFR Aligned", "A1-C2", "All Skills"],
      gradient: "from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-500/20",
      disabled: false,
    },
    {
      icon: Globe,
      title: "Scenario Learning",
      description: "Practice English in real-world contexts: workplace, travel, academic, and social situations.",
      route: "/practice/scenarios",
      featured: false,
      badges: ["Real-world", "Contextual", "Coming Soon"],
      gradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      disabled: true,
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

      {/* Learning Paths Section */}
      {user && (
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Learning Path</h2>
            <p className="text-muted-foreground text-lg">
              Multiple ways to improve your English, all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.route}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`h-full transition-all duration-300 ${
                    path.disabled
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:shadow-xl hover:scale-[1.02]"
                  } ${path.featured ? "border-2 border-primary" : `border-2 ${path.borderColor}`} bg-gradient-to-br ${path.gradient}`}
                  onClick={() => !path.disabled && router.push(path.route)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-lg ${path.featured ? "bg-primary/20" : "bg-primary/10"}`}>
                        <path.icon className={`h-8 w-8 ${path.featured ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      {path.featured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{path.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {path.badges.map((badge) => (
                        <Badge key={badge} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      variant={path.featured ? "default" : "outline"}
                      disabled={path.disabled}
                    >
                      {path.disabled ? "Coming Soon" : "Start Learning"}
                      {!path.disabled && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Features Section for Guest Users */}
      {!user && (
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-muted-foreground text-lg">
              The most comprehensive ESOL learning platform powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
              <p className="text-muted-foreground">
                Personalized feedback and adaptive difficulty based on your performance
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Speaking Practice</h3>
              <p className="text-muted-foreground">
                Practice speaking with AI coach and get instant pronunciation feedback
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exam Preparation</h3>
              <p className="text-muted-foreground">
                Comprehensive prep for NZCEL and other English proficiency exams
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
