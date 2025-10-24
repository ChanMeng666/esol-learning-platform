"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BackgroundCircles } from "@/components/ui/background-circles";
import { WelcomeTour } from "@/components/onboarding/welcome-tour";
import { Timeline } from "@/components/ui/timeline";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useUser, useStackApp } from "@stackframe/stack";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const user = useUser();
  const app = useStackApp();

  const testimonials = [
    {
      id: 1,
      name: "Maria Garcia",
      role: "NZCEL Level 4 Student",
      company: "Auckland University",
      content:
        "The AI Speaking Coach helped me improve my pronunciation dramatically. I went from struggling with conversations to confidently presenting in my university classes. The real-time feedback was invaluable!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Chen Wei",
      role: "General English Learner",
      company: "IT Professional",
      content:
        "I've tried many English learning platforms, but this one is different. The CEFR-aligned practice helped me progress from B1 to B2 in just 6 months. The personalized feedback from AI is like having a private tutor!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "NZCEL Level 5 Graduate",
      company: "Healthcare Professional",
      content:
        "The comprehensive NZCEL preparation materials were exactly what I needed. I passed Level 5 on my first attempt and secured my nursing registration. The practice questions matched the actual exam perfectly!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
  ];

  const timelineData = [
    {
      title: "AI Speaking Coach",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base font-normal mb-8 leading-relaxed">
            Practice real-time voice conversation with AI coach. Natural dialogue with instant feedback and pronunciation assessment across all CEFR levels.
          </p>
          <div className="mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/ai-speaking-coach.svg"
                alt="AI Speaking Coach"
                className="w-full h-full object-contain"
              />
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
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/nzcel-exam-prep.svg"
                alt="NZCEL Exam Preparation"
                className="w-full h-full object-contain"
              />
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
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center">
              <img
                src="/general-practice.svg"
                alt="General English Practice"
                className="w-full h-full object-contain"
              />
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
            <div className="h-64 md:h-80 lg:h-96 w-full flex items-center justify-center opacity-60">
              <img
                src="/scenario-learning.svg"
                alt="Scenario-based Learning"
                className="w-full h-full object-contain"
              />
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
        <div className="flex flex-col gap-4 items-center justify-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white text-center">
            Master English with AI
          </h1>

          <p className="text-xl md:text-2xl text-black/70 dark:text-white/70 py-4 text-center max-w-3xl">
            AI-powered practice, exam prep, and speaking coaching for all levels
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
        </div>
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

      {/* Student Success Stories */}
      <AnimatedTestimonials
        title="Student Success Stories"
        subtitle="Join thousands of learners who have achieved their English language goals with our AI-powered platform."
        badgeText="Trusted by students worldwide"
        testimonials={testimonials}
        autoRotateInterval={7000}
        trustedCompanies={[
          { name: "College Board - Advanced Placement", logoPath: "/accreditations-logo/AP.png" },
          { name: "Cambridge International School", logoPath: "/accreditations-logo/Cambridge-International-School.png" },
          { name: "Pearson Edexcel", logoPath: "/accreditations-logo/Pearson-Edexcel.png" },
          { name: "NCEA", logoPath: "/accreditations-logo/NCEA.png" },
          { name: "Western Association of Schools and Colleges", logoPath: "/accreditations-logo/Western-Association-of-Schools-and-Colleges.png" },
          { name: "Council of British International Schools", logoPath: "/accreditations-logo/Council-of-British-International-Schools.png" },
          { name: "NCAA", logoPath: "/accreditations-logo/NCAA.png" },
          { name: "Florida Department of Education", logoPath: "/accreditations-logo/Florida-Department-of-Education.png" },
        ]}
        trustedCompaniesTitle="International and Local Accreditations and Qualifications"
      />
    </div>
  );
}
