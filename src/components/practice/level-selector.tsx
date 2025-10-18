"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NZCEL_LEVELS } from "@/data/nzcel-levels";
import type { NZCELLevel } from "@/types";

interface LevelSelectorProps {
  currentLevel: NZCELLevel;
  onSelectLevel: (level: NZCELLevel) => void;
}

export function LevelSelector({ currentLevel, onSelectLevel }: LevelSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {NZCEL_LEVELS.map((level, index) => {
        const isSelected = currentLevel === level.id;

        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => onSelectLevel(level.id)}
          >
            <Card
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "ring-2 ring-purple-500 shadow-lg bg-purple-50"
                  : "hover:shadow-md hover:border-purple-300"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{level.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {level.description}
                    </CardDescription>
                  </div>
                  {isSelected && (
                    <Badge className="bg-purple-500">
                      <Check className="w-4 h-4" />
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {level.equivalency.ielts && (
                  <p className="text-xs text-gray-600">
                    <strong>IELTS:</strong> {level.equivalency.ielts}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
