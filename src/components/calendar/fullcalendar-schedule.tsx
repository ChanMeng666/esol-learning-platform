"use client";

import { useState, useRef, useCallback } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface ClassScheduleCalendarProps {
  organizationId?: bigint;
  userId?: string;
  userRole?: string;
  className?: string;
}

interface EventFormData {
  title: string;
  eventType: string;
  location: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
}

// Event colors based on type
const eventTypeColors: { [key: string]: string } = {
  speaking: '#10b981',
  listening: '#f97316',
  reading: '#3b82f6',
  writing: '#a855f7',
  diagnostic: '#ef4444',
  special: '#6366f1',
};

export function ClassScheduleCalendar({
  organizationId,
  userId,
  userRole = "student",
  className,
}: ClassScheduleCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: "",
    eventType: "speaking",
    location: "",
    description: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endDate: format(new Date(), "yyyy-MM-dd"),
    endTime: "10:00",
    allDay: false,
  });

  // Sample initial events
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Speaking Practice - Conversation',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(),
      backgroundColor: eventTypeColors.speaking,
      borderColor: eventTypeColors.speaking,
      extendedProps: {
        location: 'Room 301',
        eventType: 'speaking',
        description: 'Practice conversation skills with Level 3 students'
      }
    },
    {
      id: '2',
      title: 'Reading Comprehension',
      start: new Date(Date.now() + 7200000).toISOString(),
      end: new Date(Date.now() + 10800000).toISOString(),
      backgroundColor: eventTypeColors.reading,
      borderColor: eventTypeColors.reading,
      extendedProps: {
        location: 'Room 202',
        eventType: 'reading',
        description: 'Reading practice for Level 2 students'
      }
    },
    {
      id: '3',
      title: 'NZCEL Diagnostic Test',
      start: format(new Date(), 'yyyy-MM-dd'),
      allDay: true,
      backgroundColor: eventTypeColors.diagnostic,
      borderColor: eventTypeColors.diagnostic,
      extendedProps: {
        location: 'Computer Lab',
        eventType: 'diagnostic',
        description: 'Diagnostic test for new students'
      }
    },
  ]);

  // Handle event click
  const handleEventClick = useCallback((clickInfo: any) => {
    const event = clickInfo.event;

    if (userRole === "student") {
      // Students can only view
      toast.info(
        <div className="space-y-2">
          <p className="font-semibold">{event.title}</p>
          {event.extendedProps.location && (
            <p className="text-sm">Location: {event.extendedProps.location}</p>
          )}
          <p className="text-sm">
            Time: {event.allDay ? 'All Day' : format(event.start, 'h:mm a')} - {!event.allDay && format(event.end || event.start, 'h:mm a')}
          </p>
        </div>
      );
    } else {
      // Teachers and admins can edit
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        eventType: event.extendedProps.eventType || 'speaking',
        location: event.extendedProps.location || '',
        description: event.extendedProps.description || '',
        startDate: format(event.start, 'yyyy-MM-dd'),
        startTime: event.allDay ? '09:00' : format(event.start, 'HH:mm'),
        endDate: format(event.end || event.start, 'yyyy-MM-dd'),
        endTime: event.allDay ? '10:00' : format(event.end || event.start, 'HH:mm'),
        allDay: event.allDay,
      });
      setIsEventDialogOpen(true);
    }
  }, [userRole]);

  // Handle date selection (for creating new events)
  const handleDateSelect = useCallback((selectInfo: any) => {
    if (userRole === "student") return;

    const start = selectInfo.start;
    const end = selectInfo.end;
    const allDay = selectInfo.allDay;

    setEditingEvent(null);
    setEventForm({
      title: "",
      eventType: "speaking",
      location: "",
      description: "",
      startDate: format(start, 'yyyy-MM-dd'),
      startTime: allDay ? '09:00' : format(start, 'HH:mm'),
      endDate: format(end, 'yyyy-MM-dd'),
      endTime: allDay ? '10:00' : format(end, 'HH:mm'),
      allDay: allDay,
    });
    setIsEventDialogOpen(true);

    // Clear the selection
    selectInfo.view.calendar.unselect();
  }, [userRole]);

  // Save event
  const handleSaveEvent = () => {
    if (!eventForm.title) {
      toast.error("Please enter an event title");
      return;
    }

    const eventData = {
      title: eventForm.title,
      start: eventForm.allDay
        ? eventForm.startDate
        : `${eventForm.startDate}T${eventForm.startTime}`,
      end: eventForm.allDay
        ? eventForm.endDate
        : `${eventForm.endDate}T${eventForm.endTime}`,
      allDay: eventForm.allDay,
      backgroundColor: eventTypeColors[eventForm.eventType],
      borderColor: eventTypeColors[eventForm.eventType],
      extendedProps: {
        location: eventForm.location,
        eventType: eventForm.eventType,
        description: eventForm.description,
      }
    };

    if (editingEvent) {
      // Update existing event
      editingEvent.setProp('title', eventForm.title);
      editingEvent.setStart(eventData.start);
      editingEvent.setEnd(eventData.end);
      editingEvent.setAllDay(eventData.allDay);
      editingEvent.setProp('backgroundColor', eventData.backgroundColor);
      editingEvent.setProp('borderColor', eventData.borderColor);
      editingEvent.setExtendedProp('location', eventForm.location);
      editingEvent.setExtendedProp('eventType', eventForm.eventType);
      editingEvent.setExtendedProp('description', eventForm.description);

      toast.success("Event updated successfully");
    } else {
      // Create new event
      const newEvent = {
        ...eventData,
        id: Date.now().toString(),
      };
      setEvents([...events, newEvent]);
      toast.success("Event created successfully");
    }

    setIsEventDialogOpen(false);
    resetForm();
  };

  // Delete event
  const handleDeleteEvent = () => {
    if (!editingEvent) return;

    editingEvent.remove();
    toast.success("Event deleted successfully");

    setIsEventDialogOpen(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      eventType: "speaking",
      location: "",
      description: "",
      startDate: format(new Date(), 'yyyy-MM-dd'),
      startTime: "09:00",
      endDate: format(new Date(), 'yyyy-MM-dd'),
      endTime: "10:00",
      allDay: false,
    });
  };

  const canEdit = userRole === "teacher" || userRole === "school-admin" || userRole === "system-admin";

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Class Schedule</CardTitle>
        <CardDescription>
          {canEdit
            ? "Manage your class schedules and events"
            : "View your upcoming classes and events"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: '600px' }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            events={events}
            eventClick={handleEventClick}
            select={handleDateSelect}
            selectable={canEdit}
            editable={canEdit}
            dayMaxEvents={true}
            weekends={true}
            eventDisplay="block"
            height="100%"
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
            eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>

        {/* Event Type Legend */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(eventTypeColors).map(([type, color]) => (
            <Badge
              key={type}
              style={{ backgroundColor: color, color: 'white' }}
              className="capitalize"
            >
              {type}
            </Badge>
          ))}
        </div>

        {/* Event Dialog */}
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Create New Event"}
              </DialogTitle>
              <DialogDescription>
                {editingEvent
                  ? "Update the event details below"
                  : "Fill in the details for the new event"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g., Speaking Practice - Conversation"
                />
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select
                  value={eventForm.eventType}
                  onValueChange={(value) => setEventForm({ ...eventForm, eventType: value })}
                >
                  <SelectTrigger id="eventType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventTypeColors).map(([type, color]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="capitalize">{type}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* All Day Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allday"
                  checked={eventForm.allDay}
                  onChange={(e) => setEventForm({ ...eventForm, allDay: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="allday">All day event</Label>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={eventForm.startDate}
                    onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                  />
                </div>
                {!eventForm.allDay && (
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={eventForm.startTime}
                      onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={eventForm.endDate}
                    onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                  />
                </div>
                {!eventForm.allDay && (
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={eventForm.endTime}
                      onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="e.g., Room 301, Computer Lab"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Add any additional details..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-between">
              {editingEvent && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteEvent}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEvent}>
                  {editingEvent ? "Update" : "Create"} Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}