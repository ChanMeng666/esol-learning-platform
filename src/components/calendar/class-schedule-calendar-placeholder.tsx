"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, MapPin } from "lucide-react";

interface ClassScheduleCalendarProps {
  editable?: boolean;
  onEventClick?: (event: any) => void;
  onEventCreate?: (event: any) => void;
}

export function ClassScheduleCalendar({
  editable = false,
  onEventClick,
  onEventCreate,
}: ClassScheduleCalendarProps) {
  // Sample events for display
  const sampleEvents = [
    {
      id: "1",
      title: "English Class - Level 3",
      time: "09:00 AM - 10:30 AM",
      location: "Room 201",
      students: 25,
    },
    {
      id: "2",
      title: "Speaking Practice - Advanced",
      time: "11:00 AM - 12:00 PM",
      location: "Language Lab",
      students: 15,
    },
    {
      id: "3",
      title: "Grammar Workshop",
      time: "02:00 PM - 03:30 PM",
      location: "Room 105",
      students: 20,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Today's Schedule</h3>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-3">
        {sampleEvents.map((event) => (
          <Card
            key={event.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onEventClick?.(event)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-semibold">{event.title}</h4>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {event.students} students
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editable && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Full calendar functionality with drag-and-drop scheduling coming soon
          </p>
        </div>
      )}
    </div>
  );
}