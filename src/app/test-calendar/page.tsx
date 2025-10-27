"use client";

import React from "react";
import { ClassScheduleCalendar } from "@/components/calendar/fullcalendar-schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestCalendarPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>FullCalendar Component Test - React 18</CardTitle>
          <p className="text-sm text-muted-foreground">
            Testing FullCalendar with React {React.version}
          </p>
        </CardHeader>
        <CardContent>
          <ClassScheduleCalendar
            organizationId={BigInt(1)}
            userId="test-user"
            userRole="teacher"
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}