"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Brain, Trophy, Sparkles, ArrowRight, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserProgress } from "@/lib/store/user-progress";
import { WelcomeTour } from "@/components/onboarding/welcome-tour";

export default function HomePage() {
  const router = useRouter();
  const { totalPoints, streak } = useUserProgress();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get personalized guidance from your AI study companion",
      color: "text-primary",
    },
    {
      icon: Target,
      title: "Adaptive Practice",
      description: "Questions that adjust to your skill level automatically",
      color: "text-secondary",
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Earn points, badges, and maintain your study streak",
      color: "text-destructive",
    },
    {
      icon: Sparkles,
      title: "Clean Interface",
      description: "Simple, elegant design focused on learning",
      color: "text-accent-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-muted/30">
      <WelcomeTour />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 text-sm px-4 py-2" variant="secondary">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            NZCEL Exam Preparation Platform
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-destructive to-secondary mb-6">
            Master NZCEL with AI
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Interactive, fun, and intelligent exam preparation for the{" "}
            <span className="font-semibold text-gray-800">
              New Zealand Certificates in English Language
            </span>
          </p>

          {/* Stats Bar */}
          {totalPoints > 0 && (
            <div className="flex justify-center gap-6 mb-8">
              <Card className="bg-card/80 backdrop-blur border-primary/20 transition-colors">
                <CardContent className="p-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="text-lg font-bold text-foreground">{totalPoints}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur border-destructive/20 transition-colors">
                <CardContent className="p-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-lg font-bold text-foreground">{streak} days</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => router.push("/practice")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Practice
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 hover:bg-primary/5 transition-colors"
              onClick={() => router.push("/dashboard")}
            >
              View Dashboard
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => (
            <Card key={index} className="h-full bg-card/80 backdrop-blur border-2 hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader>
                <feature.icon className={`w-12 h-12 mb-2 ${feature.color}`} />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* NZCEL Information Section */}
        <div className="mt-20">
          <Card className="bg-gradient-to-br from-accent to-muted/50 border-2 border-primary/30 shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">What is NZCEL?</CardTitle>
              <CardDescription className="text-base max-w-3xl mx-auto">
                The New Zealand Certificates in English Language (NZCEL) are nationally recognized
                qualifications that provide a clear pathway to tertiary education and employment in
                New Zealand.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 border-2 border-primary/30">
                    <span className="text-2xl font-bold text-primary">13</span>
                  </div>
                  <p className="font-semibold">NZCEL Levels</p>
                  <p className="text-sm text-muted-foreground">Foundation to Advanced</p>
                </div>
                <div className="text-center">
                  <div className="bg-secondary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 border-2 border-secondary/40">
                    <span className="text-2xl font-bold text-secondary-foreground">4</span>
                  </div>
                  <p className="font-semibold">Core Skills</p>
                  <p className="text-sm text-muted-foreground">Listening, Speaking, Reading, Writing</p>
                </div>
                <div className="text-center">
                  <div className="bg-destructive/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 border-2 border-destructive/30">
                    <span className="text-2xl font-bold text-destructive">✓</span>
                  </div>
                  <p className="font-semibold">Direct Pathway</p>
                  <p className="text-sm text-muted-foreground">To NZ Universities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Start practicing today and unlock your full potential!
          </p>
          <Button
            size="lg"
            className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => router.push("/practice")}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Begin Practice Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
