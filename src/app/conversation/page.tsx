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
import { RealtimeConversation } from "@/components/conversation/realtime-conversation";
import type { ConversationScenario } from "@/types";

export default function ConversationPage() {
  const router = useRouter();
  const { currentLevel } = useUserProgress();
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const [isInConversation, setIsInConversation] = useState(false);

  const currentLevelInfo = NZCEL_LEVELS.find((l) => l.id === currentLevel);
  const scenarios = getScenariosByLevel(currentLevel);

  const handleStartConversation = (scenario: ConversationScenario) => {
    setSelectedScenario(scenario);
    setIsInConversation(true);
  };

  const handleEndConversation = () => {
    setIsInConversation(false);
    setSelectedScenario(null);
  };

  if (isInConversation && selectedScenario) {
    return (
      <div className="min-h-screen bg-background">
        <RealtimeConversation
          scenario={selectedScenario}
          onEnd={handleEndConversation}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-primary">
                Real-Time Conversation Practice
              </h1>
              <p className="text-muted-foreground">
                Speak with AI in realistic scenarios •{" "}
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
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              How It Works
            </CardTitle>
            <CardDescription>
              Practice speaking with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">1</Badge>
              <p className="text-sm">
                <strong>Pick a scenario</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">2</Badge>
              <p className="text-sm">
                <strong>Speak naturally</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">3</Badge>
              <p className="text-sm">
                <strong>Get feedback</strong>
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
                  No scenarios for {currentLevel}. Try another level.
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
                <Card key={scenario.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">
                        {scenario.difficulty}
                      </Badge>
                      <Badge variant="outline">{scenario.targetTurns} turns</Badge>
                    </div>
                    <CardTitle className="text-xl">
                      {scenario.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {scenario.context}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Your Role:</strong> {scenario.userRole}
                      </div>
                      <div>
                        <strong>AI Role:</strong> {scenario.aiRole}
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
