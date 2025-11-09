"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { GradeSpreadsheet } from "@/components/spreadsheet/grade-spreadsheet";
import { useGradebookContext } from "./context";
import { AlertCircle, Info } from "lucide-react";

export default function TeacherGradebookPage() {
  return (
    <ProtectedRoute>
      <SpreadsheetViewContent />
    </ProtectedRoute>
  );
}

function SpreadsheetViewContent() {
  const { selectedClass, classStats } = useGradebookContext();

  if (!selectedClass) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>Please select a class to view the gradebook</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classStats?.average || 0}%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{classStats?.highest || 0}%</div>
            <p className="text-xs text-muted-foreground">Best performer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Lowest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{classStats?.lowest || 0}%</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Median Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classStats?.median || 0}%</div>
            <p className="text-xs text-muted-foreground">Middle value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Passing Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{classStats?.passingRate || 0}%</div>
            <p className="text-xs text-muted-foreground">≥60% grade</p>
          </CardContent>
        </Card>
      </div>

      {/* Spreadsheet */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Entry Spreadsheet</CardTitle>
          <CardDescription>
            Click any cell to edit grades. Use Tab or Enter to navigate between cells.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GradeSpreadsheet
            organizationId={BigInt(1)}
            classId={selectedClass.id}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}