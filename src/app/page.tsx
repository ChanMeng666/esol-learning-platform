"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Brain, Trophy, Sparkles, ArrowRight, Target, Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserProgress } from "@/lib/store/user-progress";
import { WelcomeTour } from "@/components/onboarding/welcome-tour";

export default function HomePage() {
  const router = useRouter();
  const { totalPoints, streak } = useUserProgress();


  return (
    <div className="min-h-screen bg-background">
      <WelcomeTour />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 text-sm px-4 py-2" variant="secondary">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            NZCEL Exam Preparation Platform
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
            Master NZCEL with AI
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            AI-powered NZCEL exam preparation
          </p>

          {/* Stats Bar */}
          {totalPoints > 0 && (
            <div className="flex justify-center gap-6 mb-8">
              <Card>
                <CardContent className="p-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="text-lg font-bold">{totalPoints}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-lg font-bold">{streak} days</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button onClick={() => router.push("/practice")}>
              <BookOpen className="mr-2 h-5 w-5" />
              Start Practice
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              View Dashboard
            </Button>
          </div>
        </div>

        {/* Feature Image Placeholder */}
        <div className="mt-16">
          <div className="bg-muted rounded-lg flex items-center justify-center" style={{ height: '400px' }}>
            <p className="text-muted-foreground">Feature Image Placeholder</p>
          </div>
        </div>

        {/* NZCEL Information Section */}
        <div className="mt-20">
          <Card>
            <CardHeader>
              <CardTitle>What is NZCEL?</CardTitle>
              <CardDescription>
                Nationally recognized qualifications for tertiary education and employment in NZ.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Master all 4 skills with AI guidance
          </p>
          <Button onClick={() => router.push("/practice")}>
            <Sparkles className="mr-2 h-5 w-5" />
            Begin Practice Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
