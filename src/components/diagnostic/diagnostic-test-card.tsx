import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, PlayCircle, Users, FileQuestion } from "lucide-react";

interface DiagnosticTestCardProps {
  test: {
    id: bigint;
    name: string;
    description: string;
    levelSystem: string;
    testType: string;
    targetSkills?: string[];
    estimatedDuration?: number;
    isSystemTest: boolean;
  };
  onStartTest: (testId: bigint) => void;
  variant?: "default" | "compact";
}

/**
 * Diagnostic Test Card Component
 * Displays a diagnostic test with its details and start button
 *
 * Usage:
 * <DiagnosticTestCard test={testData} onStartTest={handleStart} />
 */
export function DiagnosticTestCard({
  test,
  onStartTest,
  variant = "default",
}: DiagnosticTestCardProps) {
  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{test.name}</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {test.levelSystem === "nzcel" ? "NZCEL" : "CEFR"}
                </Badge>
                {test.estimatedDuration && (
                  <Badge variant="secondary" className="text-xs">
                    {test.estimatedDuration} min
                  </Badge>
                )}
              </div>
            </div>
            <Button onClick={() => onStartTest(test.id)} size="sm">
              <PlayCircle className="w-3 h-3 mr-1" />
              Start
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{test.name}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {test.levelSystem === "nzcel" ? "NZCEL" : "CEFR"}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {test.testType.replace("_", " ")}
              </Badge>
              {test.isSystemTest && (
                <Badge variant="default">Official</Badge>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {test.description || "Assess your English proficiency level"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        {/* Test Info */}
        <div className="space-y-3">
          {test.estimatedDuration && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Approximately {test.estimatedDuration} minutes</span>
            </div>
          )}

          {test.targetSkills && test.targetSkills.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileQuestion className="w-4 h-4" />
                <span>Skills tested:</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-6">
                {test.targetSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="capitalize text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onStartTest(test.id)}
          className="w-full"
          size="lg"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          Start Test
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Diagnostic Test Result Card
 * Displays completed test results summary
 */
interface DiagnosticResultCardProps {
  result: {
    id: bigint;
    testName: string;
    completedAt: Date;
    overallLevel: string;
    percentageScore: string;
    skillLevels?: Record<string, string>;
  };
  onViewDetails: (resultId: bigint) => void;
}

export function DiagnosticResultCard({
  result,
  onViewDetails,
}: DiagnosticResultCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{result.testName}</CardTitle>
            <CardDescription>
              {new Date(result.completedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </div>
          <Badge variant="default" className="gap-1">
            Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Level</p>
            <p className="text-xl font-bold">{result.overallLevel}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Score</p>
            <p className="text-xl font-bold">
              {parseFloat(result.percentageScore).toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Skill Levels */}
        {result.skillLevels && Object.keys(result.skillLevels).length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(result.skillLevels).map(([skill, level]) => (
              <div key={skill} className="p-2 border border-border rounded text-center">
                <p className="text-xs text-muted-foreground capitalize">{skill}</p>
                <p className="text-sm font-semibold">{level}</p>
              </div>
            ))}
          </div>
        )}

        {/* View Button */}
        <Button
          onClick={() => onViewDetails(result.id)}
          variant="outline"
          className="w-full"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
