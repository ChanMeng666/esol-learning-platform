"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useGradebookContext } from "../layout";
import { AlertCircle, Save, RotateCcw, Calculator, Settings2, Info } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

export default function GradebookSettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const { selectedClass } = useGradebookContext();

  // Grade weights state
  const [weights, setWeights] = useState({
    assignments: 30,
    quizzes: 20,
    midterm: 20,
    final: 25,
    participation: 5,
  });

  // Grade scale state
  const [gradeScale, setGradeScale] = useState({
    A: 90,
    B: 80,
    C: 70,
    D: 60,
    F: 0,
  });

  // Settings state
  const [settings, setSettings] = useState({
    dropLowestQuiz: false,
    dropLowestAssignment: false,
    roundToNearest: "whole",
    latePolicy: "10",
    allowExtraCredit: true,
    maxExtraCredit: 5,
    autoCalculate: true,
    showRanks: false,
  });

  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0);
  const isValidWeights = totalWeight === 100;

  const handleWeightChange = (category: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [category]: value }));
  };

  const handleSaveSettings = () => {
    if (!isValidWeights) {
      toast.error("Total weights must equal 100%");
      return;
    }
    toast.success("Grade settings saved successfully");
  };

  const handleResetDefaults = () => {
    setWeights({
      assignments: 30,
      quizzes: 20,
      midterm: 20,
      final: 25,
      participation: 5,
    });
    setGradeScale({
      A: 90,
      B: 80,
      C: 70,
      D: 60,
      F: 0,
    });
    toast.success("Settings reset to defaults");
  };

  if (!selectedClass) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>Please select a class to configure grade settings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grade Weights Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Grade Weights
          </CardTitle>
          <CardDescription>
            Configure how different assessment types contribute to the final grade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {Object.entries(weights).map(([category, value]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={category} className="capitalize">
                    {category}
                  </Label>
                  <span className="text-sm font-medium">{value}%</span>
                </div>
                <Slider
                  id={category}
                  value={[value]}
                  onValueChange={([v]) => handleWeightChange(category as keyof typeof weights, v)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className={`p-3 rounded-lg border ${isValidWeights ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"}`}>
            <div className="flex items-center gap-2">
              {isValidWeights ? (
                <>
                  <Info className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Total: 100% ✓</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Total: {totalWeight}% (must equal 100%)</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Scale Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Scale</CardTitle>
          <CardDescription>
            Set the minimum percentage required for each letter grade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(gradeScale).map(([grade, minScore]) => (
              <div key={grade} className="flex items-center gap-3">
                <Label htmlFor={`grade-${grade}`} className="w-8 text-lg font-bold">
                  {grade}
                </Label>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-muted-foreground">≥</span>
                  <Input
                    id={`grade-${grade}`}
                    type="number"
                    value={minScore}
                    onChange={(e) => setGradeScale(prev => ({
                      ...prev,
                      [grade]: parseInt(e.target.value) || 0
                    }))}
                    min={0}
                    max={100}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
          <CardDescription>
            Additional grading policies and options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop Lowest Scores */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="drop-quiz">Drop Lowest Quiz Score</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically exclude the lowest quiz score from calculations
                </p>
              </div>
              <Switch
                id="drop-quiz"
                checked={settings.dropLowestQuiz}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dropLowestQuiz: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="drop-assignment">Drop Lowest Assignment Score</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically exclude the lowest assignment score
                </p>
              </div>
              <Switch
                id="drop-assignment"
                checked={settings.dropLowestAssignment}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dropLowestAssignment: checked }))}
              />
            </div>
          </div>

          {/* Late Policy */}
          <div className="space-y-2">
            <Label htmlFor="late-policy">Late Submission Penalty</Label>
            <Select value={settings.latePolicy} onValueChange={(value) => setSettings(prev => ({ ...prev, latePolicy: value }))}>
              <SelectTrigger id="late-policy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No penalty</SelectItem>
                <SelectItem value="5">5% per day</SelectItem>
                <SelectItem value="10">10% per day</SelectItem>
                <SelectItem value="20">20% per day</SelectItem>
                <SelectItem value="50">50% flat penalty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Extra Credit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="extra-credit">Allow Extra Credit</Label>
                <p className="text-sm text-muted-foreground">
                  Enable extra credit opportunities
                </p>
              </div>
              <Switch
                id="extra-credit"
                checked={settings.allowExtraCredit}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowExtraCredit: checked }))}
              />
            </div>

            {settings.allowExtraCredit && (
              <div className="flex items-center gap-3 pl-4">
                <Label htmlFor="max-extra">Maximum Extra Credit</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="max-extra"
                    type="number"
                    value={settings.maxExtraCredit}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxExtraCredit: parseInt(e.target.value) || 0 }))}
                    min={0}
                    max={20}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            )}
          </div>

          {/* Rounding */}
          <div className="space-y-2">
            <Label htmlFor="rounding">Grade Rounding</Label>
            <Select value={settings.roundToNearest} onValueChange={(value) => setSettings(prev => ({ ...prev, roundToNearest: value }))}>
              <SelectTrigger id="rounding">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whole">Round to whole number</SelectItem>
                <SelectItem value="half">Round to 0.5</SelectItem>
                <SelectItem value="decimal">One decimal place</SelectItem>
                <SelectItem value="none">No rounding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Display Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-calculate">Auto-Calculate Grades</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically recalculate grades when scores change
                </p>
              </div>
              <Switch
                id="auto-calculate"
                checked={settings.autoCalculate}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoCalculate: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-ranks">Show Class Rankings</Label>
                <p className="text-sm text-muted-foreground">
                  Display student rankings in gradebook
                </p>
              </div>
              <Switch
                id="show-ranks"
                checked={settings.showRanks}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showRanks: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleResetDefaults}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings} disabled={!isValidWeights}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}