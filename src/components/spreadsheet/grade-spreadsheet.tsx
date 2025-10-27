"use client";

import { useState, useCallback, useMemo } from "react";
import Spreadsheet from "react-spreadsheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Save, FileSpreadsheet, Undo, Redo, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GradeSpreadsheetProps {
  organizationId: bigint;
  classId?: string;
  className?: string;
}

// Types for spreadsheet data
type CellValue = string | number | boolean | null;
type Cell = {
  value: CellValue;
  readOnly?: boolean;
  className?: string;
};
type Row = Cell[];
type Sheet = Row[];

// Sample student data
const createInitialData = (): Sheet => {
  const headers: Row = [
    { value: "Student ID", readOnly: true, className: "font-bold bg-gray-100" },
    { value: "Name", readOnly: true, className: "font-bold bg-gray-100" },
    { value: "Email", readOnly: true, className: "font-bold bg-gray-100" },
    { value: "Listening", readOnly: true, className: "font-bold bg-gray-100" },
    { value: "Speaking", readOnly: true, className: "font-bold bg-gray-100" },
    { value: "Reading", readOnly: true, className: "font-bold bg-gray-100" },
    { value: "Writing", readOnly: true, className: "font-bold bg-gray-100" },
    { value: "Total", readOnly: true, className: "font-bold bg-gray-100" },
    { value: "Grade", readOnly: true, className: "font-bold bg-gray-100" },
    { value: "Comments", readOnly: true, className: "font-bold bg-gray-100" },
  ];

  const students: Row[] = [
    [
      { value: "S001", readOnly: true },
      { value: "John Smith", readOnly: true },
      { value: "john.smith@example.com", readOnly: true },
      { value: 85 },
      { value: 78 },
      { value: 92 },
      { value: 88 },
      { value: 86, readOnly: true, className: "font-semibold" },
      { value: "B+", readOnly: true, className: "font-semibold" },
      { value: "Good progress in reading" },
    ],
    [
      { value: "S002", readOnly: true },
      { value: "Emma Johnson", readOnly: true },
      { value: "emma.j@example.com", readOnly: true },
      { value: 92 },
      { value: 95 },
      { value: 88 },
      { value: 90 },
      { value: 91, readOnly: true, className: "font-semibold" },
      { value: "A-", readOnly: true, className: "font-semibold" },
      { value: "Excellent speaking skills" },
    ],
    [
      { value: "S003", readOnly: true },
      { value: "Michael Chen", readOnly: true },
      { value: "m.chen@example.com", readOnly: true },
      { value: 75 },
      { value: 72 },
      { value: 80 },
      { value: 78 },
      { value: 76, readOnly: true, className: "font-semibold" },
      { value: "C+", readOnly: true, className: "font-semibold" },
      { value: "Needs improvement in speaking" },
    ],
    [
      { value: "S004", readOnly: true },
      { value: "Sarah Williams", readOnly: true },
      { value: "sarah.w@example.com", readOnly: true },
      { value: 88 },
      { value: 85 },
      { value: 90 },
      { value: 87 },
      { value: 88, readOnly: true, className: "font-semibold" },
      { value: "B+", readOnly: true, className: "font-semibold" },
      { value: "Consistent performance" },
    ],
    [
      { value: "S005", readOnly: true },
      { value: "David Brown", readOnly: true },
      { value: "david.b@example.com", readOnly: true },
      { value: 95 },
      { value: 92 },
      { value: 98 },
      { value: 94 },
      { value: 95, readOnly: true, className: "font-semibold" },
      { value: "A", readOnly: true, className: "font-semibold" },
      { value: "Outstanding work!" },
    ],
  ];

  return [headers, ...students];
};

// Calculate grade based on score
const calculateGrade = (score: number): string => {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 87) return "A-";
  if (score >= 83) return "B+";
  if (score >= 80) return "B";
  if (score >= 77) return "B-";
  if (score >= 73) return "C+";
  if (score >= 70) return "C";
  if (score >= 67) return "C-";
  if (score >= 63) return "D+";
  if (score >= 60) return "D";
  return "F";
};

export function GradeSpreadsheet({
  organizationId,
  classId,
  className,
}: GradeSpreadsheetProps) {
  const [data, setData] = useState<Sheet>(createInitialData);
  const [selectedAssignment, setSelectedAssignment] = useState("midterm");
  const [history, setHistory] = useState<Sheet[]>([createInitialData()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    if (data.length <= 1) return null;

    const scores = {
      listening: [] as number[],
      speaking: [] as number[],
      reading: [] as number[],
      writing: [] as number[],
      total: [] as number[],
    };

    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const listening = row[3]?.value;
      const speaking = row[4]?.value;
      const reading = row[5]?.value;
      const writing = row[6]?.value;
      const total = row[7]?.value;

      if (typeof listening === "number") scores.listening.push(listening);
      if (typeof speaking === "number") scores.speaking.push(speaking);
      if (typeof reading === "number") scores.reading.push(reading);
      if (typeof writing === "number") scores.writing.push(writing);
      if (typeof total === "number") scores.total.push(total);
    }

    const calculateStats = (arr: number[]) => {
      if (arr.length === 0) return { avg: 0, min: 0, max: 0 };
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      return { avg: Math.round(avg * 10) / 10, min, max };
    };

    return {
      listening: calculateStats(scores.listening),
      speaking: calculateStats(scores.speaking),
      reading: calculateStats(scores.reading),
      writing: calculateStats(scores.writing),
      total: calculateStats(scores.total),
    };
  }, [data]);

  // Handle cell changes
  const handleChange = useCallback((newData: Sheet) => {
    // Recalculate totals and grades
    const updatedData = newData.map((row, rowIndex) => {
      if (rowIndex === 0) return row; // Skip header

      const newRow = [...row];
      const listening = typeof row[3]?.value === "number" ? row[3].value : 0;
      const speaking = typeof row[4]?.value === "number" ? row[4].value : 0;
      const reading = typeof row[5]?.value === "number" ? row[5].value : 0;
      const writing = typeof row[6]?.value === "number" ? row[6].value : 0;

      const total = Math.round((listening + speaking + reading + writing) / 4);
      const grade = calculateGrade(total);

      // Update total and grade cells
      newRow[7] = { value: total, readOnly: true, className: "font-semibold" };
      newRow[8] = { value: grade, readOnly: true, className: "font-semibold" };

      return newRow;
    });

    setData(updatedData);
    setHasUnsavedChanges(true);

    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Save grades
  const handleSave = useCallback(() => {
    // In a real app, this would save to the database
    toast.success("Grades saved successfully");
    setHasUnsavedChanges(false);
  }, []);

  // Export to CSV
  const handleExport = useCallback(() => {
    const csv = data.map(row =>
      row.map(cell => {
        const value = cell.value;
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`;
        }
        return value?.toString() || "";
      }).join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grades_${selectedAssignment}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Grades exported to CSV");
  }, [data, selectedAssignment]);

  // Import CSV
  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split("\n").map(row => {
        const values = row.split(",").map(val => {
          // Remove quotes if present
          const cleaned = val.trim().replace(/^"(.*)"$/, "$1");
          // Try to parse as number
          const num = Number(cleaned);
          return isNaN(num) ? cleaned : num;
        });

        return values.map((value, colIndex) => {
          const isHeader = rows.indexOf(row) === 0;
          const isReadOnly = isHeader || colIndex < 3 || colIndex === 7 || colIndex === 8;
          return {
            value,
            readOnly: isReadOnly,
            className: isHeader ? "font-bold bg-gray-100" : isReadOnly ? "font-semibold" : "",
          };
        });
      });

      handleChange(rows);
      toast.success("Grades imported successfully");
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset input
  }, [handleChange]);

  // Calculate class statistics
  const handleCalculateStats = useCallback(() => {
    toast.info(
      <div className="space-y-2">
        <p className="font-semibold">Class Statistics</p>
        {stats && (
          <div className="text-sm space-y-1">
            <p>Overall Average: {stats.total.avg}</p>
            <p>Listening: {stats.listening.avg} (Min: {stats.listening.min}, Max: {stats.listening.max})</p>
            <p>Speaking: {stats.speaking.avg} (Min: {stats.speaking.min}, Max: {stats.speaking.max})</p>
            <p>Reading: {stats.reading.avg} (Min: {stats.reading.min}, Max: {stats.reading.max})</p>
            <p>Writing: {stats.writing.avg} (Min: {stats.writing.min}, Max: {stats.writing.max})</p>
          </div>
        )}
      </div>,
      { duration: 5000 }
    );
  }, [stats]);

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Grade Management</CardTitle>
            <CardDescription>
              Manage and track student grades for {classId || "all classes"}
            </CardDescription>
          </div>

          {/* Status Badge */}
          <Badge variant={hasUnsavedChanges ? "destructive" : "default"}>
            {hasUnsavedChanges ? "Unsaved Changes" : "All Changes Saved"}
          </Badge>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-4">
          {/* Assignment Selector */}
          <div className="flex items-center gap-2">
            <Label htmlFor="assignment">Assignment:</Label>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger id="assignment" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="midterm">Midterm Exam</SelectItem>
                <SelectItem value="final">Final Exam</SelectItem>
                <SelectItem value="quiz1">Quiz 1</SelectItem>
                <SelectItem value="quiz2">Quiz 2</SelectItem>
                <SelectItem value="project">Final Project</SelectItem>
                <SelectItem value="participation">Participation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <div className="flex rounded-md shadow-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="rounded-r-none"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                className="rounded-l-none border-l-0"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* Calculate Stats */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCalculateStats}
            >
              <Calculator className="h-4 w-4 mr-1" />
              Stats
            </Button>

            {/* Import */}
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
            </div>

            {/* Export */}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>

            {/* Save */}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Spreadsheet */}
        <div className="border rounded-lg overflow-auto">
          <Spreadsheet
            data={data}
            onChange={handleChange}
            columnLabels={["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]}
            rowLabels={Array.from({ length: data.length }, (_, i) => (i + 1).toString())}
          />
        </div>

        {/* Statistics Summary */}
        {stats && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Quick Statistics</h4>
            <div className="grid grid-cols-5 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Overall Avg</p>
                <p className="font-semibold text-lg">{stats.total.avg}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Listening</p>
                <p className="font-semibold text-lg">{stats.listening.avg}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Speaking</p>
                <p className="font-semibold text-lg">{stats.speaking.avg}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reading</p>
                <p className="font-semibold text-lg">{stats.reading.avg}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Writing</p>
                <p className="font-semibold text-lg">{stats.writing.avg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Tips:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Click on any grade cell to edit</li>
            <li>Total and Grade columns are automatically calculated</li>
            <li>Use Import/Export for bulk operations</li>
            <li>Press Ctrl+Z/Ctrl+Y for undo/redo</li>
            <li>Changes are saved locally until you click Save</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}