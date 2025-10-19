"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HistoryFilters, SkillType, NZCELLevel } from "@/types";

interface HistoryFiltersProps {
  filters: HistoryFilters;
  onFiltersChange: (filters: HistoryFilters) => void;
  showSkillFilter?: boolean;
  showLevelFilter?: boolean;
  showDateRangeFilter?: boolean;
  showRecordingTypeFilter?: boolean;
}

export function HistoryFiltersComponent({
  filters,
  onFiltersChange,
  showSkillFilter = true,
  showLevelFilter = true,
  showDateRangeFilter = true,
  showRecordingTypeFilter = false,
}: HistoryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof HistoryFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setIsExpanded(false);
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof HistoryFilters] !== undefined
  ).length;

  const skills: { value: SkillType; label: string }[] = [
    { value: "listening", label: "Listening" },
    { value: "speaking", label: "Speaking" },
    { value: "reading", label: "Reading" },
    { value: "writing", label: "Writing" },
  ];

  const levels: { value: NZCELLevel; label: string }[] = [
    { value: "foundation", label: "Foundation" },
    { value: "level-1", label: "Level 1" },
    { value: "level-2", label: "Level 2" },
    { value: "level-3-general", label: "Level 3 General" },
    { value: "level-4-general", label: "Level 4 General" },
    { value: "level-5-general", label: "Level 5 General" },
  ];

  const dateRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "all", label: "All time" },
  ];

  const recordingTypes = [
    { value: "practice_answer", label: "Practice Answer" },
    { value: "conversation_turn", label: "Conversation Turn" },
    { value: "pronunciation_test", label: "Pronunciation Test" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant={isExpanded ? "default" : "outline"}
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {isExpanded && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {showSkillFilter && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Skill</label>
                  <Select
                    value={filters.skill || "all"}
                    onValueChange={(value) => updateFilter("skill", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All skills" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All skills</SelectItem>
                      {skills.map((skill) => (
                        <SelectItem key={skill.value} value={skill.value}>
                          {skill.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showLevelFilter && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Level</label>
                  <Select
                    value={filters.level || "all"}
                    onValueChange={(value) => updateFilter("level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showDateRangeFilter && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <Select
                    value={filters.dateRange || "all"}
                    onValueChange={(value) => updateFilter("dateRange", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showRecordingTypeFilter && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Recording Type</label>
                  <Select
                    value={filters.recordingType || "all"}
                    onValueChange={(value) => updateFilter("recordingType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {recordingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
