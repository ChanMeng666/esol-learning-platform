import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SkillData {
  skill: string;
  level: string;
  score: number; // 0-100
  trend?: "up" | "down" | "stable";
}

interface SkillVisualizationProps {
  skills: SkillData[];
  title?: string;
  description?: string;
  variant?: "default" | "compact";
}

/**
 * Skill Visualization Component
 * Displays skill levels and scores with visual progress bars
 *
 * Usage:
 * <SkillVisualization
 *   skills={[
 *     { skill: "listening", level: "B1", score: 75 },
 *     { skill: "speaking", level: "A2", score: 65 },
 *   ]}
 * />
 */
export function SkillVisualization({
  skills,
  title = "Skill Breakdown",
  description = "Your performance across different skills",
  variant = "default",
}: SkillVisualizationProps) {
  if (variant === "compact") {
    return (
      <div className="space-y-4">
        {skills.map((skillData) => (
          <div key={skillData.skill} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize">{skillData.skill}</span>
              <Badge variant="outline">{skillData.level}</Badge>
            </div>
            <Progress value={skillData.score} className="h-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {skills.map((skillData) => (
          <SkillProgressBar key={skillData.skill} {...skillData} />
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Individual Skill Progress Bar
 */
function SkillProgressBar({ skill, level, score, trend }: SkillData) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-600" />;
    if (trend === "stable") return <Minus className="w-4 h-4 text-gray-600" />;
    return null;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold capitalize">{skill}</h4>
          {trend && getTrendIcon(trend)}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
          <Badge variant="secondary">{level}</Badge>
        </div>
      </div>
      <Progress value={score} className="h-3" />
    </div>
  );
}

/**
 * Skill Comparison Component
 * Compares current skills with target or previous assessment
 */
interface SkillComparisonProps {
  currentSkills: SkillData[];
  previousSkills?: SkillData[];
  targetLevel?: string;
}

export function SkillComparison({
  currentSkills,
  previousSkills,
  targetLevel,
}: SkillComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Tracking</CardTitle>
        <CardDescription>
          {previousSkills
            ? "Compare your current results with previous assessment"
            : "Your current skill levels"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentSkills.map((current) => {
          const previous = previousSkills?.find((p) => p.skill === current.skill);
          const improvement = previous ? current.score - previous.score : 0;

          return (
            <div key={current.skill} className="space-y-2 p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold capitalize">{current.skill}</h4>
                {previous && improvement !== 0 && (
                  <Badge variant={improvement > 0 ? "default" : "secondary"}>
                    {improvement > 0 ? "+" : ""}
                    {improvement}%
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current</p>
                  <div className="flex items-center gap-2">
                    <Progress value={current.score} className="h-2 flex-1" />
                    <span className="text-sm font-semibold">{current.score}%</span>
                  </div>
                </div>
                {previous && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Previous</p>
                    <div className="flex items-center gap-2">
                      <Progress value={previous.score} className="h-2 flex-1" />
                      <span className="text-sm font-semibold text-muted-foreground">
                        {previous.score}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/**
 * Skill Level Badge with description
 */
interface SkillLevelBadgeProps {
  level: string;
  skill: string;
  showDescription?: boolean;
}

export function SkillLevelBadge({
  level,
  skill,
  showDescription = false,
}: SkillLevelBadgeProps) {
  const getLevelDescription = (level: string, skill: string) => {
    // Simplified descriptions - should be expanded based on CEFR/NZCEL framework
    const descriptions: Record<string, string> = {
      A1: "Can understand and use basic expressions",
      A2: "Can communicate in simple routine tasks",
      B1: "Can deal with most situations while traveling",
      B2: "Can interact with native speakers with fluency",
      C1: "Can use language flexibly and effectively",
      C2: "Can understand virtually everything with ease",
    };

    return descriptions[level] || "";
  };

  if (showDescription) {
    return (
      <div className="p-4 border border-border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default" className="text-lg px-3 py-1">
            {level}
          </Badge>
          <span className="font-semibold capitalize">{skill}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {getLevelDescription(level, skill)}
        </p>
      </div>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      <span className="capitalize">{skill}:</span>
      <span className="font-semibold">{level}</span>
    </Badge>
  );
}
