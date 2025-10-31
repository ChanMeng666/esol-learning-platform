"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/shared/empty-state";
import {
  MessageCircle,
  Send,
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Calendar,
  User,
  School,
  ChevronRight,
} from "lucide-react";

interface Message {
  id: string;
  subject: string;
  content: string;
  from: string;
  fromRole: "teacher" | "school" | "admin";
  fromAvatar?: string;
  to: string;
  date: Date;
  read: boolean;
  starred: boolean;
  category: "general" | "academic" | "behavior" | "announcement" | "meeting";
  childName?: string;
  attachments?: string[];
  thread?: Message[];
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  date: Date;
  category: "school" | "class" | "event" | "policy";
  important: boolean;
}

export default function ParentCommunicationPage() {
  return (
    <ProtectedRoute>
      <CommunicationPageContent />
    </ProtectedRoute>
  );
}

function CommunicationPageContent() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState("inbox");
  const [composeMode, setComposeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    to: "",
    subject: "",
    content: "",
    child: "",
  });

  useEffect(() => {
    const loadCommunicationData = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockMessages: Message[] = [
          {
            id: "1",
            subject: "Alice's Progress Update",
            content: "Dear Parent,\n\nI wanted to share some excellent news about Alice's progress in English class. She has shown remarkable improvement in her writing skills and actively participates in class discussions. Her recent essay on environmental conservation was particularly impressive.\n\nKeep encouraging her to read at home - it's clearly making a difference!\n\nBest regards,\nMs. Smith",
            from: "Ms. Smith",
            fromRole: "teacher",
            to: "Parent",
            date: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: false,
            starred: true,
            category: "academic",
            childName: "Alice Johnson",
          },
          {
            id: "2",
            subject: "Parent-Teacher Conference Reminder",
            content: "Dear Parent,\n\nThis is a reminder about the upcoming parent-teacher conference scheduled for next Tuesday, March 28th at 3:30 PM. We'll discuss Bob's progress and areas for improvement.\n\nPlease confirm your attendance.\n\nRegards,\nMr. Brown",
            from: "Mr. Brown",
            fromRole: "teacher",
            to: "Parent",
            date: new Date(Date.now() - 24 * 60 * 60 * 1000),
            read: true,
            starred: false,
            category: "meeting",
            childName: "Bob Johnson",
          },
          {
            id: "3",
            subject: "School Event: Spring Science Fair",
            content: "Dear Parents,\n\nWe're excited to announce our annual Spring Science Fair on April 15th. All students are encouraged to participate. Registration forms are due by March 30th.\n\nFor more information, please visit the school website.\n\nBest,\nPrincipal Anderson",
            from: "Principal Anderson",
            fromRole: "school",
            to: "All Parents",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            read: true,
            starred: false,
            category: "announcement",
          },
        ];

        const mockAnnouncements: Announcement[] = [
          {
            id: "1",
            title: "School Closure - Professional Development Day",
            content: "School will be closed on Friday, March 31st for teacher professional development.",
            author: "School Administration",
            authorRole: "Admin",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            category: "school",
            important: true,
          },
          {
            id: "2",
            title: "New Library Resources Available",
            content: "We've added new digital learning resources to the school library. Students can now access educational games and e-books from home.",
            author: "Library Team",
            authorRole: "Staff",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            category: "event",
            important: false,
          },
        ];

        setMessages(mockMessages);
        setAnnouncements(mockAnnouncements);
      } catch (error) {
        console.error("Failed to load communication data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCommunicationData();
  }, []);

  const handleCompose = () => {
    setComposeMode(true);
    setSelectedMessage(null);
  };

  const handleSendMessage = () => {
    // Handle sending message logic
    console.log("Sending message:", composeForm);
    setComposeMode(false);
    setComposeForm({ to: "", subject: "", content: "", child: "" });
  };

  const handleReply = (message: Message) => {
    setComposeMode(true);
    setComposeForm({
      to: message.from,
      subject: `Re: ${message.subject}`,
      content: `\n\n---\nOn ${message.date.toLocaleDateString()}, ${message.from} wrote:\n${message.content}`,
      child: message.childName || "",
    });
  };

  const unreadCount = messages.filter(m => !m.read).length;
  const starredCount = messages.filter(m => m.starred).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Communication</h1>
          <p className="text-muted-foreground">
            Messages and announcements from teachers and school
          </p>
        </div>
        <Button onClick={handleCompose}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Compose Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <Inbox className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Starred</p>
                <p className="text-2xl font-bold">{starredCount}</p>
              </div>
              <Star className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Announcements</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        {/* Inbox Tab */}
        <TabsContent value="inbox" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id ? "bg-muted" : ""
                      } ${!message.read ? "border-l-4 border-l-primary" : ""}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.fromAvatar} />
                            <AvatarFallback>
                              {message.from.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{message.from}</p>
                            {message.childName && (
                              <p className="text-xs text-muted-foreground">{message.childName}</p>
                            )}
                          </div>
                        </div>
                        {message.starred && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                      </div>
                      <p className={`text-sm ${!message.read ? "font-semibold" : ""}`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {message.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.date.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Detail */}
            <Card className="lg:col-span-2">
              {composeMode ? (
                <>
                  <CardHeader>
                    <CardTitle>Compose Message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="to">To</Label>
                        <Input
                          id="to"
                          value={composeForm.to}
                          onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                          placeholder="Select teacher or staff"
                        />
                      </div>
                      <div>
                        <Label htmlFor="child">Regarding Child</Label>
                        <select
                          id="child"
                          value={composeForm.child}
                          onChange={(e) => setComposeForm({ ...composeForm, child: e.target.value })}
                          className="w-full px-3 py-2 rounded-md border border-border bg-background"
                        >
                          <option value="">Select child</option>
                          <option value="Alice Johnson">Alice Johnson</option>
                          <option value="Bob Johnson">Bob Johnson</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={composeForm.subject}
                        onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                        placeholder="Enter message subject"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Message</Label>
                      <Textarea
                        id="content"
                        value={composeForm.content}
                        onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
                        placeholder="Type your message here..."
                        rows={10}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSendMessage}>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" onClick={() => setComposeMode(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : selectedMessage ? (
                <>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedMessage.subject}</CardTitle>
                        <CardDescription>
                          From: {selectedMessage.from} • {selectedMessage.date.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReply(selectedMessage)}
                        >
                          <Reply className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Forward className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                    </div>
                    {selectedMessage.childName && (
                      <div className="mt-4 p-3 rounded-lg bg-muted">
                        <p className="text-sm">
                          <span className="font-medium">Regarding:</span> {selectedMessage.childName}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </>
              ) : (
                <EmptyState
                  title="No message selected"
                  description="Select a message from the list to view details"
                  icon={<MessageCircle className="w-16 h-16" />}
                />
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4">
          {announcements.map(announcement => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {announcement.title}
                      {announcement.important && (
                        <Badge variant="destructive">Important</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {announcement.author} • {announcement.date.toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{announcement.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}