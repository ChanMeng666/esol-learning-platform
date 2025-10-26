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
                src="/images/illustrations/ai-speaking-coach.svg"
                alt="AI Speaking Coach"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => user ? router.push("/speaking") : router.push("/register")}
              className="flex-1 md:flex-initial"
            >
              Start Practice
            </Button>
            <Button
              onClick={() => user ? router.push("/dashboard") : router.push("/register")}
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
                src="/images/illustrations/nzcel-exam-prep.svg"
                alt="NZCEL Exam Preparation"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => user ? router.push("/practice/nzcel") : router.push("/register")}
              className="flex-1 md:flex-initial"
            >
              Start Prep
            </Button>
            <Button
              onClick={() => user ? router.push("/dashboard") : router.push("/register")}
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
                src="/images/illustrations/general-practice.svg"
                alt="General English Practice"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => user ? router.push("/practice/general") : router.push("/register")}
              className="flex-1 md:flex-initial"
            >
              Start Practice
            </Button>
            <Button
              onClick={() => user ? router.push("/dashboard") : router.push("/register")}
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
                src="/images/illustrations/scenario-learning.svg"
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
            // Logged in user - show Go to Dashboard (role-based redirect)
            <Button
              onClick={() => {
                const userRole = (user.clientMetadata?.role as string) || "student";
                const dashboardPath = userRole === "teacher" ? "/teacher/dashboard" : "/dashboard";
                router.push(dashboardPath);
              }}
              size="lg"
              className="mt-4 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
            >
              Go to Dashboard
            </Button>
          ) : (
            // Guest user - show Get Started (leads to registration with invitation code)
            <Link href="/register">
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
      <Timeline data={timelineData} />

      {/* Student Success Stories */}
      <AnimatedTestimonials
        title="Student Success Stories"
        subtitle="Join thousands of learners who have achieved their English language goals with our AI-powered platform."
        badgeText="Trusted by students worldwide"
        testimonials={testimonials}
        autoRotateInterval={7000}
        trustedCompanies={[
          {
            name: "College Board - Advanced Placement",
            logoPath: "/images/accreditations/AP.svg",
            description: "Accredited by the College Board to offer Advanced Placement (AP) curriculum."
          },
          {
            name: "Cambridge International School",
            logoPath: "/images/accreditations/Cambridge-International-School.svg",
            description: "Registered Cambridge International School."
          },
          {
            name: "Pearson Edexcel",
            logoPath: "/images/accreditations/Pearson-Edexcel.svg",
            description: "Accredited by Pearson Edexcel to offer International GCSEs and A Levels."
          },
          {
            name: "NCEA",
            logoPath: "/images/accreditations/NCEA.svg",
            description: "Offering NCEA Levels 1-3 in flexible online and in-person settings."
          },
          {
            name: "Western Association of Schools and Colleges",
            logoPath: "/images/accreditations/Western-Association-of-Schools-and-Colleges.svg",
            description: "Accredited by WASC, the largest global accrediting schooling body."
          },
          {
            name: "Council of British International Schools",
            logoPath: "/images/accreditations/Council-of-British-International-Schools.svg",
            description: "COBIS accredited member, a benchmark for top international schools."
          },
          {
            name: "NCAA",
            logoPath: "/images/accreditations/NCAA.svg",
            description: "Offering accredited NCAA courses to support student athletes."
          },
          {
            name: "Florida Department of Education",
            logoPath: "/images/accreditations/Florida-Department-of-Education.svg",
            description: "Registered in Florida as a private school with the Department of Education."
          },
        ]}
        trustedCompaniesTitle="International and Local Accreditations and Qualifications"
      />
    </div>
  );
}
