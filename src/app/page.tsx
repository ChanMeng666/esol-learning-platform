"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Brain, Trophy, Sparkles, ArrowRight, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserProgress } from "@/lib/store/user-progress";

export default function HomePage() {
  const router = useRouter();
  const { totalPoints, streak } = useUserProgress();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get personalized guidance from your AI study companion",
      color: "text-blue-500",
    },
    {
      icon: Target,
      title: "Adaptive Practice",
      description: "Questions that adjust to your skill level automatically",
      color: "text-green-500",
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Earn points, badges, and maintain your study streak",
      color: "text-yellow-500",
    },
    {
      icon: Sparkles,
      title: "Interactive UI",
      description: "Engaging animations and dynamic feedback",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className="mb-4 text-sm px-4 py-2" variant="secondary">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            NZCEL Exam Preparation Platform
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6">
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center gap-6 mb-8"
            >
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">Points</p>
                    <p className="text-lg font-bold">{totalPoints}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Streak</p>
                    <p className="text-lg font-bold">{streak} days</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => router.push("/practice")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Practice
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => router.push("/dashboard")}
            >
              View Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
            >
              <Card className="h-full bg-white/80 backdrop-blur border-2 hover:border-purple-300 transition-all">
                <CardHeader>
                  <feature.icon
                    className={`w-12 h-12 mb-2 ${feature.color} transition-transform ${
                      hoveredFeature === index ? "scale-110" : ""
                    }`}
                  />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* NZCEL Information Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
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
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">13</span>
                  </div>
                  <p className="font-semibold">NZCEL Levels</p>
                  <p className="text-sm text-gray-600">Foundation to Advanced</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-purple-600">4</span>
                  </div>
                  <p className="font-semibold">Core Skills</p>
                  <p className="text-sm text-gray-600">Listening, Speaking, Reading, Writing</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">✓</span>
                  </div>
                  <p className="font-semibold">Direct Pathway</p>
                  <p className="text-sm text-gray-600">To NZ Universities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Start practicing today and unlock your full potential!
          </p>
          <Button
            size="lg"
            className="text-lg px-10 py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            onClick={() => router.push("/practice")}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Begin Practice Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
