"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// All test routes
const testRoutes = {
  student: [
    { path: "/student/dashboard", expected: "Dashboard" },
    { path: "/student/progress", expected: "My Progress" },
    { path: "/student/analytics", expected: "Analytics" },
    { path: "/student/dashboard/practice/nzcel", expected: "NZCEL Exam Prep" },
    { path: "/practice/nzcel/skills", expected: "NZCEL Exam Prep > Skills Practice" },
    { path: "/practice/nzcel/conversation", expected: "NZCEL Exam Prep > Conversation" },
    { path: "/student/dashboard/practice/general", expected: "General English" },
    { path: "/student/dashboard/speaking", expected: "AI Speaking Coach" },
    { path: "/student/dashboard/diagnostic", expected: "Diagnostic Tests" },
    { path: "/student/assignments", expected: "Assignments" },
    { path: "/student/schedule", expected: "Schedule" },
    { path: "/student/achievements", expected: "Achievements & Badges" },
  ],
  teacher: [
    { path: "/teacher/dashboard", expected: "Dashboard" },
    { path: "/teacher/analytics", expected: "Analytics" },
    { path: "/teacher/insights", expected: "Insights" },
    { path: "/teacher/classes", expected: "My Classes" },
    { path: "/teacher/dashboard/speaking-review", expected: "Speaking Review" },
    { path: "/teacher/gradebook", expected: "Gradebook" },
  ],
  parent: [
    { path: "/parent/dashboard", expected: "Dashboard" },
    { path: "/parent/children", expected: "My Children" },
    { path: "/parent/activity", expected: "Activity & Attendance" },
    { path: "/parent/dashboard/speaking-progress", expected: "Speaking Progress" },
  ],
};

export default function TestSidebarActivationPage() {
  const pathname = usePathname();
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "parent">("student");

  // Function to check if path would be active
  const checkActivation = (testPath: string, configUrl: string): boolean => {
    return testPath === configUrl || testPath.startsWith(configUrl + "/");
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Sidebar Activation Test</CardTitle>
          <p className="text-muted-foreground">
            Current Path: <code className="bg-muted px-2 py-1 rounded">{pathname}</code>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selector */}
          <div className="flex gap-2">
            <Button
              variant={selectedRole === "student" ? "default" : "outline"}
              onClick={() => setSelectedRole("student")}
            >
              Student
            </Button>
            <Button
              variant={selectedRole === "teacher" ? "default" : "outline"}
              onClick={() => setSelectedRole("teacher")}
            >
              Teacher
            </Button>
            <Button
              variant={selectedRole === "parent" ? "default" : "outline"}
              onClick={() => setSelectedRole("parent")}
            >
              Parent
            </Button>
          </div>

          {/* Test Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Test Navigation Links ({selectedRole})</h3>
            <div className="grid gap-2">
              {testRoutes[selectedRole].map((route) => {
                const isCurrentPath = pathname === route.path;
                return (
                  <div
                    key={route.path}
                    className={`flex items-center justify-between p-3 border rounded ${
                      isCurrentPath ? "bg-blue-50 dark:bg-blue-950 border-blue-500" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <Link
                        href={route.path}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {route.path}
                      </Link>
                      <span className="ml-4 text-sm text-muted-foreground">
                        Expected: {route.expected}
                      </span>
                    </div>
                    {isCurrentPath && (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        ✓ Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activation Logic Test */}
          <div className="space-y-4">
            <h3 className="font-semibold">Activation Logic Test</h3>
            <div className="bg-muted p-4 rounded">
              <p className="text-sm mb-2">
                Testing path: <code>{pathname}</code>
              </p>
              <p className="text-sm">
                Would activate:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {[
                  "/student/dashboard",
                  "/student/dashboard/diagnostic",
                  "/student/dashboard/speaking",
                  "/diagnostic",
                  "/speaking",
                  "/practice/nzcel",
                ].map((testUrl) => {
                  const wouldActivate = checkActivation(pathname, testUrl);
                  return (
                    <li key={testUrl} className="text-sm">
                      <code className={wouldActivate ? "text-green-600" : "text-red-600"}>
                        {testUrl}
                      </code>
                      {" - "}
                      {wouldActivate ? "✓ Yes" : "✗ No"}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
              How to Test:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-amber-800 dark:text-amber-200">
              <li>Click on each link above</li>
              <li>Check if the correct sidebar item is highlighted</li>
              <li>The expected active item is shown next to each link</li>
              <li>If the sidebar item doesn't match the expected one, there's an issue</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}