"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { getStudentDiagnosticHistory } from "@/actions/diagnostic-tests";
import { getUserProgress } from "@/actions/user-progress";
import { getCEFRProgress } from "@/actions/cefr-progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  InfoIcon,
  CheckCircle,
  ArrowRight,
  ClipboardCheck,
  BookOpen,
  TrendingUp,
  Target,
} from "lucide-react";
import { toast } from "sonner";

interface StudentOnboardingFlowProps {
  children?: React.ReactNode;
}

export function StudentOnboardingFlow({ children }: StudentOnboardingFlowProps) {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [hasCompletedDiagnostic, setHasCompletedDiagnostic] = useState(false);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [cefrProgress, setCefrProgress] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    if (user) {
      checkUserStatus();
    }
  }, [user]);

  async function checkUserStatus() {
    try {
      setLoading(true);

      // Check diagnostic test history
      const history = await getStudentDiagnosticHistory();
      const hasCompleted = history && history.length > 0 &&
                          history.some((item: any) => item.attempt.isCompleted);

      setHasCompletedDiagnostic(hasCompleted);

      // Get user progress data
      if (hasCompleted) {
        const [nzcelProgress, cefrProgressData] = await Promise.all([
          getUserProgress(),
          getCEFRProgress(),
        ]);
        setUserProgress(nzcelProgress);
        setCefrProgress(cefrProgressData);
      } else {
        // New user - show onboarding flow
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      toast.error("Failed to load user status");
    } finally {
      setLoading(false);
    }
  }

  function handleStartDiagnostic() {
    router.push("/diagnostic");
  }

  function handleSkipDiagnostic() {
    // Allow user to skip but encourage taking the test
    setShowOnboarding(false);
    toast.info("You can take the diagnostic test anytime from your dashboard");
  }

  const onboardingSteps = [
    {
      title: "Welcome to Your ESOL Learning Journey!",
      description: "Let's start by understanding your current English level",
      icon: <BookOpen className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Our comprehensive diagnostic test will help us personalize your learning experience
            by identifying your current proficiency level across all four language skills.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Listening Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Speaking Evaluation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Reading Comprehension</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Writing Skills</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Why Take the Diagnostic Test?",
      description: "Get the most out of your learning experience",
      icon: <Target className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Personalized Learning Path</h4>
                <p className="text-sm text-muted-foreground">
                  Content tailored to your exact proficiency level
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Track Your Progress</h4>
                <p className="text-sm text-muted-foreground">
                  See how far you've come from your starting point
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Adaptive Difficulty</h4>
                <p className="text-sm text-muted-foreground">
                  Exercises that challenge you at the right level
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Teacher Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Your teachers can provide better support
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ready to Begin?",
      description: "The test takes approximately 45-60 minutes",
      icon: <ClipboardCheck className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Before you start</AlertTitle>
            <AlertDescription>
              • Find a quiet place without distractions<br />
              • Make sure you have a stable internet connection<br />
              • Have headphones ready for the listening section<br />
              • Allow 45-60 minutes to complete the test
            </AlertDescription>
          </Alert>
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What happens next?</h4>
            <ol className="text-sm space-y-1 text-muted-foreground">
              <li>1. Complete the diagnostic test</li>
              <li>2. Receive your personalized results</li>
              <li>3. Get a customized learning plan</li>
              <li>4. Start practicing at your level</li>
            </ol>
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Checking your learning profile...</p>
        </div>
      </div>
    );
  }

  // Show onboarding flow for new users
  if (showOnboarding && !hasCompletedDiagnostic) {
    const currentStep = onboardingSteps[onboardingStep];

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {currentStep.icon}
            </div>
            <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
            <CardDescription className="text-base">
              {currentStep.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep.content}

            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {onboardingStep + 1} of {onboardingSteps.length}</span>
                <span>{Math.round(((onboardingStep + 1) / onboardingSteps.length) * 100)}%</span>
              </div>
              <Progress value={((onboardingStep + 1) / onboardingSteps.length) * 100} />
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (onboardingStep > 0) {
                    setOnboardingStep(onboardingStep - 1);
                  } else {
                    handleSkipDiagnostic();
                  }
                }}
              >
                {onboardingStep === 0 ? "Skip for now" : "Back"}
              </Button>

              {onboardingStep < onboardingSteps.length - 1 ? (
                <Button onClick={() => setOnboardingStep(onboardingStep + 1)}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleStartDiagnostic} className="bg-primary">
                  Start Diagnostic Test
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show progress summary for users who completed diagnostic
  if (hasCompletedDiagnostic && userProgress) {
    return (
      <>
        {/* Optional: Show a brief welcome back message */}
        {children}
      </>
    );
  }

  // Default: render children
  return <>{children}</>;
}