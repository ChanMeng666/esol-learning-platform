"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ClassScheduleCalendar } from "@/components/calendar/fullcalendar-schedule";
import { useClassContext } from "../layout";
import { Calendar, Clock, Plus, Edit, Trash2 } from "lucide-react";

export default function ClassSchedulePage() {
  return (
    <ProtectedRoute>
      <ScheduleContent />
    </ProtectedRoute>
  );
}

function ScheduleContent() {
  const { classData } = useClassContext();

  // Mock schedule data
  const upcomingClasses = [
    {
      id: "1",
      date: "Monday, Dec 11",
      time: "9:00 AM - 10:00 AM",
      topic: "Grammar: Present Perfect Tense",
      room: "Room 204",
      type: "lecture",
    },
    {
      id: "2",
      date: "Wednesday, Dec 13",
      time: "9:00 AM - 10:00 AM",
      topic: "Vocabulary: Business English",
      room: "Room 204",
      type: "workshop",
    },
    {
      id: "3",
      date: "Friday, Dec 15",
      time: "9:00 AM - 10:00 AM",
      topic: "Speaking Practice: Job Interviews",
      room: "Room 204",
      type: "practice",
    },
    {
      id: "4",
      date: "Monday, Dec 18",
      time: "9:00 AM - 10:00 AM",
      topic: "Mid-term Review",
      room: "Room 204",
      type: "review",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "default";
      case "workshop":
        return "secondary";
      case "practice":
        return "success";
      case "review":
        return "warning";
      case "exam":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Regular Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{classData.schedule || "MWF 9:00-10:00 AM"}</p>
            <p className="text-xs text-muted-foreground mt-1">{classData.room || "Room 204"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Next Class</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">Monday, Dec 11</p>
            <p className="text-xs text-muted-foreground mt-1">Grammar: Present Perfect</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Classes This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground mt-1">Mon, Wed, Fri</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Class Calendar</CardTitle>
              <CardDescription>
                Schedule and manage class sessions for {classData.name}
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ClassScheduleCalendar />
        </CardContent>
      </Card>

      {/* Upcoming Classes List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
          <CardDescription>Next scheduled sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingClasses.map((session) => (
              <div
                key={session.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.topic}</p>
                      <Badge variant={getTypeColor(session.type) as any} className="text-xs">
                        {session.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.time}
                      </span>
                      <span>{session.room}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Auto-remind students</p>
                <p className="text-xs text-muted-foreground">Send reminders 24 hours before class</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Holiday schedule</p>
                <p className="text-xs text-muted-foreground">Manage holiday and break periods</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Recurring classes</p>
                <p className="text-xs text-muted-foreground">Set up weekly recurring sessions</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}