"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ClassScheduleCalendar } from "@/components/calendar/fullcalendar-schedule";
import { useContainerQuery } from "@/hooks/use-container-query";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Video,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Bell,
  CalendarDays
} from "lucide-react";

// Import Server Actions if needed
// import { getStudentSchedule } from "@/actions/schedule";

interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: "class" | "assignment" | "exam" | "meeting" | "practice";
  location?: string;
  instructor?: string;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
  isOnline?: boolean;
  meetingUrl?: string;
}

export default function StudentSchedulePage() {
  return (
    <ProtectedRoute>
      <SchedulePageContent />
    </ProtectedRoute>
  );
}

function SchedulePageContent() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("week");
  const { ref, isLgUp, isMdUp } = useContainerQuery<HTMLDivElement>();

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        // In production, load from server action
        // const schedule = await getStudentSchedule();

        // Mock data for demonstration
        const mockEvents: ScheduleEvent[] = [
          {
            id: "1",
            title: "NZCEL Level 3 - Speaking Practice",
            description: "Interactive speaking session with AI coach",
            startTime: new Date(2025, 0, 27, 9, 0),
            endTime: new Date(2025, 0, 27, 10, 30),
            type: "class",
            location: "Room 204",
            instructor: "Ms. Sarah Chen",
            status: "upcoming",
            isOnline: false
          },
          {
            id: "2",
            title: "Writing Assignment Due",
            description: "Essay on environmental issues (500 words)",
            startTime: new Date(2025, 0, 27, 23, 59),
            endTime: new Date(2025, 0, 27, 23, 59),
            type: "assignment",
            status: "upcoming"
          },
          {
            id: "3",
            title: "Online Conversation Practice",
            description: "1-on-1 conversation with language partner",
            startTime: new Date(2025, 0, 28, 14, 0),
            endTime: new Date(2025, 0, 28, 14, 45),
            type: "practice",
            status: "upcoming",
            isOnline: true,
            meetingUrl: "https://meet.example.com/abc123"
          },
          {
            id: "4",
            title: "CEFR B2 Assessment",
            description: "Mid-term assessment for all skills",
            startTime: new Date(2025, 0, 29, 10, 0),
            endTime: new Date(2025, 0, 29, 12, 0),
            type: "exam",
            location: "Exam Hall A",
            status: "upcoming"
          },
          {
            id: "5",
            title: "Grammar Workshop",
            description: "Advanced grammar structures",
            startTime: new Date(2025, 0, 29, 13, 0),
            endTime: new Date(2025, 0, 29, 14, 30),
            type: "class",
            location: "Room 301",
            instructor: "Mr. James Wilson",
            status: "upcoming",
            isOnline: false
          }
        ];

        setEvents(mockEvents);
      } catch (error) {
        console.error("Failed to load schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const getEventColor = (type: ScheduleEvent["type"]) => {
    switch (type) {
      case "class": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "assignment": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "exam": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "meeting": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "practice": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getEventIcon = (type: ScheduleEvent["type"]) => {
    switch (type) {
      case "class": return BookOpen;
      case "assignment": return Clock;
      case "exam": return AlertCircle;
      case "meeting": return Users;
      case "practice": return Video;
      default: return Calendar;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    }).format(date);
  };

  // Get today's events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  // Get upcoming events (next 7 days)
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingEvents = events.filter(event => {
    return event.startTime >= tomorrow && event.startTime <= nextWeek;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-muted-foreground">
          View your classes, assignments, and learning activities
        </p>
      </div>

      {/* Quick Stats */}
      <div className={`grid gap-4 ${isLgUp ? "grid-cols-4" : isMdUp ? "grid-cols-2" : "grid-cols-1"}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Events</p>
                <p className="text-2xl font-bold mt-1">{todayEvents.length}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold mt-1">{upcomingEvents.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assignments Due</p>
                <p className="text-2xl font-bold mt-1">
                  {events.filter(e => e.type === "assignment").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Exams</p>
                <p className="text-2xl font-bold mt-1">
                  {events.filter(e => e.type === "exam").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="today">Today's Schedule</TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-6">
          <Card className="p-0">
            <CardContent className="p-0">
              <ClassScheduleCalendar
                organizationId={BigInt(1)}
                userId="student-user"
                userRole="student"
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="mt-6 space-y-6">
          {/* Today's Events */}
          {todayEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Today</h3>
              <div className="space-y-3">
                {todayEvents.map((event) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{event.title}</h4>
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {event.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </div>
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {event.location}
                                  </div>
                                )}
                                {event.instructor && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {event.instructor}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge variant={event.isOnline ? "secondary" : "outline"}>
                              {event.isOnline ? "Online" : "In-Person"}
                            </Badge>
                            {event.isOnline && event.meetingUrl && (
                              <Button size="sm" variant="outline" className="text-xs">
                                Join
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const Icon = getEventIcon(event.type);
                return (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(event.startTime)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Today's Schedule View */}
        <TabsContent value="today" className="mt-6">
          {todayEvents.length > 0 ? (
            <div className="space-y-4">
              {/* Timeline View */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Timeline</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-border"></div>
                    {todayEvents
                      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
                      .map((event, index) => {
                        const Icon = getEventIcon(event.type);
                        return (
                          <div key={event.id} className="relative mb-8 last:mb-0">
                            <div className="absolute -left-2 h-4 w-4 rounded-full bg-primary"></div>
                            <div className="ml-6">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold">
                                  {formatTime(event.startTime)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {event.type}
                                </Badge>
                                {event.isOnline && (
                                  <Badge variant="secondary" className="text-xs">
                                    Online
                                  </Badge>
                                )}
                              </div>
                              <Card className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold">{event.title}</h4>
                                      {event.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {event.description}
                                        </p>
                                      )}
                                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                                        <span>Duration: {
                                          Math.round((event.endTime.getTime() - event.startTime.getTime()) / 60000)
                                        } min</span>
                                        {event.location && (
                                          <span>📍 {event.location}</span>
                                        )}
                                        {event.instructor && (
                                          <span>👤 {event.instructor}</span>
                                        )}
                                      </div>
                                      {event.isOnline && event.meetingUrl && (
                                        <Button size="sm" className="mt-3">
                                          Join Meeting
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No events scheduled for today</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Enjoy your free time or practice on your own!
              </p>
              <Button className="mt-4" onClick={() => window.location.href = "/practice"}>
                Start Practicing
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Notifications Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Schedule Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Writing assignment due tomorrow at 11:59 PM</span>
              </div>
              <Button size="sm" variant="ghost">View</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Speaking practice session in 2 hours</span>
              </div>
              <Button size="sm" variant="ghost">Set Reminder</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}