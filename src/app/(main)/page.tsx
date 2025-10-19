"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BackgroundCircles } from "@/components/ui/background-circles";
import { WelcomeTour } from "@/components/onboarding/welcome-tour";
import { useUser, useStackApp } from "@stackframe/stack";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const user = useUser();
  const app = useStackApp();

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
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white text-center">
            Master NZCEL with AI
          </h1>

          <p className="text-xl md:text-2xl text-black/70 dark:text-white/70 py-4 text-center">
            AI-powered NZCEL exam preparation platform
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
                Get Started
              </Button>
            </Link>
          )}
        </motion.div>
      </BackgroundCircles>
    </div>
  );
}
