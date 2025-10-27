"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Save, Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface GradeSpreadsheetProps {
  className?: string;
  editable?: boolean;
  onSave?: (data: any) => void;
}

export function GradeSpreadsheet({
  className,
  editable = false,
  onSave,
}: GradeSpreadsheetProps) {
  const [grades, setGrades] = useState([
    { id: "1", name: "John Doe", assignment1: 85, assignment2: 90, assignment3: 78, midterm: 88, final: 92, average: 86.6 },
    { id: "2", name: "Jane Smith", assignment1: 92, assignment2: 88, assignment3: 95, midterm: 90, final: 94, average: 91.8 },
    { id: "3", name: "Bob Johnson", assignment1: 78, assignment2: 82, assignment3: 75, midterm: 80, final: 85, average: 80.0 },
    { id: "4", name: "Alice Brown", assignment1: 95, assignment2: 93, assignment3: 90, midterm: 92, final: 96, average: 93.2 },
    { id: "5", name: "Charlie Wilson", assignment1: 70, assignment2: 75, assignment3: 72, midterm: 78, final: 80, average: 75.0 },
  ]);

  const handleCellChange = (studentId: string, field: string, value: string) => {
    if (!editable) return;

    const numValue = parseFloat(value) || 0;
    setGrades(prev => prev.map(student => {
      if (student.id === studentId) {
        const updated = { ...student, [field]: numValue };
        // Recalculate average
        const gradeFields = ['assignment1', 'assignment2', 'assignment3', 'midterm', 'final'];
        const sum = gradeFields.reduce((acc, f) => acc + (updated[f as keyof typeof updated] as number || 0), 0);
        updated.average = Math.round(sum / gradeFields.length * 10) / 10;
        return updated;
      }
      return student;
    }));
  };

  const handleSave = () => {
    onSave?.(grades);
    toast.success("Grades saved successfully");
  };

  const handleExport = () => {
    const csv = [
      ['Student Name', 'Assignment 1', 'Assignment 2', 'Assignment 3', 'Midterm', 'Final', 'Average'],
      ...grades.map(g => [g.name, g.assignment1, g.assignment2, g.assignment3, g.midterm, g.final, g.average])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grades.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Grades exported to CSV");
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className={className}>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Class Grades</h3>
        <div className="flex gap-2">
          {editable && (
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background">Student Name</TableHead>
              <TableHead className="text-center">Assignment 1</TableHead>
              <TableHead className="text-center">Assignment 2</TableHead>
              <TableHead className="text-center">Assignment 3</TableHead>
              <TableHead className="text-center">Midterm</TableHead>
              <TableHead className="text-center">Final</TableHead>
              <TableHead className="text-center font-semibold">Average</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="sticky left-0 bg-background font-medium">
                  {student.name}
                </TableCell>
                <TableCell className="text-center">
                  {editable ? (
                    <Input
                      type="number"
                      value={student.assignment1}
                      onChange={(e) => handleCellChange(student.id, 'assignment1', e.target.value)}
                      className="w-20 mx-auto text-center"
                      min="0"
                      max="100"
                    />
                  ) : (
                    <span className={getGradeColor(student.assignment1)}>{student.assignment1}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {editable ? (
                    <Input
                      type="number"
                      value={student.assignment2}
                      onChange={(e) => handleCellChange(student.id, 'assignment2', e.target.value)}
                      className="w-20 mx-auto text-center"
                      min="0"
                      max="100"
                    />
                  ) : (
                    <span className={getGradeColor(student.assignment2)}>{student.assignment2}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {editable ? (
                    <Input
                      type="number"
                      value={student.assignment3}
                      onChange={(e) => handleCellChange(student.id, 'assignment3', e.target.value)}
                      className="w-20 mx-auto text-center"
                      min="0"
                      max="100"
                    />
                  ) : (
                    <span className={getGradeColor(student.assignment3)}>{student.assignment3}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {editable ? (
                    <Input
                      type="number"
                      value={student.midterm}
                      onChange={(e) => handleCellChange(student.id, 'midterm', e.target.value)}
                      className="w-20 mx-auto text-center"
                      min="0"
                      max="100"
                    />
                  ) : (
                    <span className={getGradeColor(student.midterm)}>{student.midterm}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {editable ? (
                    <Input
                      type="number"
                      value={student.final}
                      onChange={(e) => handleCellChange(student.id, 'final', e.target.value)}
                      className="w-20 mx-auto text-center"
                      min="0"
                      max="100"
                    />
                  ) : (
                    <span className={getGradeColor(student.final)}>{student.final}</span>
                  )}
                </TableCell>
                <TableCell className="text-center font-semibold">
                  <span className={getGradeColor(student.average)}>{student.average}%</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        {editable ? (
          <p>Click on any grade cell to edit. Changes are automatically calculated.</p>
        ) : (
          <p>Grade editing is currently disabled.</p>
        )}
      </div>
    </div>
  );
}