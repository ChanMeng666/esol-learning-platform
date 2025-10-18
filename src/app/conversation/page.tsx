"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Play, Home, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserProgress } from "@/lib/store/user-progress";
import { NZCEL_LEVELS } from "@/data/nzcel-levels";
import { getScenariosByLevel } from "@/data/conversation-scenarios";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { RealtimeConversation } from "@/components/conversation/realtime-conversation";
import type { ConversationScenario } from "@/types";

export default function ConversationPage() {
  const router = useRouter();
  const { currentLevel } = useUserProgress();
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const [isInConversation, setIsInConversation] = useState(false);

  const currentLevelInfo = NZCEL_LEVELS.find((l) => l.id === currentLevel);
  const scenarios = getScenariosByLevel(currentLevel);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Conversation Practice" },
  ];

  const handleStartConversation = (scenario: ConversationScenario) => {
    setSelectedScenario(scenario);
    setIsInConversation(true);
  };

  const handleEndConversation = () => {
    setIsInConversation(false);
    setSelectedScenario(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-300";
      case "intermediate":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "intermediate-advanced":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "advanced":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (isInConversation && selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent via-background to-muted/30">
        <RealtimeConversation
          scenario={selectedScenario}
          onEnd={handleEndConversation}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-muted/30 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-destructive">
                Real-Time Conversation Practice
              </h1>
              <p className="text-muted-foreground">
                Practice speaking with AI in realistic scenarios •{" "}
                <Badge variant="secondary" className="ml-2">
                  {currentLevelInfo?.name || currentLevel}
                </Badge>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push("/")}>
                <Home className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-8 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              How It Works
            </CardTitle>
            <CardDescription>
              Have natural, real-time conversations with an AI tutor to improve your speaking skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">1</Badge>
              <p className="text-sm">
                <strong>Choose a scenario</strong> that matches your interests and goals
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">2</Badge>
              <p className="text-sm">
                <strong>Start the conversation</strong> and speak naturally with the AI
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">3</Badge>
              <p className="text-sm">
                <strong>Get instant feedback</strong> and practice multiple times
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scenarios */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Scenarios for {currentLevelInfo?.name}</h2>

          {scenarios.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No scenarios available</h3>
                <p className="text-muted-foreground mb-4">
                  There are no conversation scenarios for {currentLevel} yet.
                  Try changing your level or check back later!
                </p>
                <Button onClick={() => router.push("/practice")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go to Practice
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className="hover:shadow-lg transition-all border-2 hover:border-primary/50 cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getDifficultyColor(scenario.difficulty)}>
                        {scenario.difficulty}
                      </Badge>
                      <Badge variant="outline">{scenario.targetTurns} turns</Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {scenario.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {scenario.context}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className="text-primary">Your Role:</strong> {scenario.userRole}
                      </div>
                      <div>
                        <strong className="text-primary">AI Role:</strong> {scenario.aiRole}
                      </div>
                    </div>

                    <div>
                      <strong className="text-sm">Topics:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {scenario.topics.map((topic, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleStartConversation(scenario)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Conversation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
