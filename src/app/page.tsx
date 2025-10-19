"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundCircles } from "@/components/ui/background-circles";
import { WelcomeTour } from "@/components/onboarding/welcome-tour";

export default function HomePage() {
  const router = useRouter();

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

          <Button
            onClick={() => router.push("/practice")}
            size="lg"
            className="mt-4 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Start Practice
          </Button>
        </motion.div>
      </BackgroundCircles>
    </div>
  );
}
