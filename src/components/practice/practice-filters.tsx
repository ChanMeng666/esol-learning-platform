"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { SkillType, QuestionType, NZCELLevel } from "@/types";

export interface PracticeFilters {
  skill?: SkillType;
  questionType?: QuestionType;
  level?: NZCELLevel;
}

interface PracticeFiltersProps {
  filters: PracticeFilters;
  onFiltersChange: (filters: PracticeFilters) => void;
  isActive: boolean;
  onToggle: () => void;
}

export function PracticeFilters({
  filters,
  onFiltersChange,
  isActive,
  onToggle,
}: PracticeFiltersProps) {
  const hasActiveFilters = filters.questionType || filters.level;

  const handleClearFilters = () => {
    onFiltersChange({ skill: filters.skill });
  };

  const questionTypeOptions: { value: QuestionType; label: string }[] = [
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "fill-in-blank", label: "Fill in Blank" },
    { value: "audio-comprehension", label: "Audio Comprehension" },
    { value: "listening-comprehension", label: "Listening" },
    { value: "voice-recording", label: "Voice Recording" },
    { value: "speaking-prompt", label: "Speaking" },
    { value: "essay", label: "Essay Writing" },
  ];

  const levelOptions: { value: NZCELLevel; label: string }[] = [
    { value: "foundation", label: "Foundation" },
    { value: "level-1", label: "Level 1" },
    { value: "level-2", label: "Level 2" },
    { value: "level-3-general", label: "Level 3 General" },
    { value: "level-3-applied", label: "Level 3 Applied" },
    { value: "level-3-academic", label: "Level 3 Academic" },
    { value: "level-4-general", label: "Level 4 General" },
    { value: "level-4-employment", label: "Level 4 Employment" },
    { value: "level-4-academic", label: "Level 4 Academic" },
    { value: "level-5-general", label: "Level 5 General" },
    { value: "level-5-employment", label: "Level 5 Employment" },
    { value: "level-5-academic", label: "Level 5 Academic" },
  ];

  if (!isActive) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="relative"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <Badge
            variant="destructive"
            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
          >
            {[filters.questionType, filters.level].filter(Boolean).length}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="mb-6 border-primary/30 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="secondary">
                {[filters.questionType, filters.level].filter(Boolean).length} active
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="question-type" className="text-sm font-medium">
              Question Type
            </Label>
            <Select
              value={filters.questionType || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  questionType: value as QuestionType,
                })
              }
            >
              <SelectTrigger id="question-type">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                {questionTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm font-medium">
              NZCEL Level
            </Label>
            <Select
              value={filters.level || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  level: value as NZCELLevel,
                })
              }
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All levels</SelectItem>
                {levelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.questionType && (
              <Badge variant="secondary" className="gap-1">
                {questionTypeOptions.find((o) => o.value === filters.questionType)?.label}
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, questionType: undefined })
                  }
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.level && (
              <Badge variant="secondary" className="gap-1">
                {levelOptions.find((o) => o.value === filters.level)?.label}
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, level: undefined })
                  }
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
