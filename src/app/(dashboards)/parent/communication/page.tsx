"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageCircle, Inbox } from "lucide-react";

export default function ParentCommunicationPage() {
  return (
    <ProtectedRoute>
      <CommunicationPageContent />
    </ProtectedRoute>
  );
}

function CommunicationPageContent() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Communication</h1>
      </div>

      {/* Stats - Simplified to 1 card */}
      <div className="grid gap-6 md:grid-cols-1 max-w-md">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unread Messages
            </CardTitle>
            <Inbox className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              From teachers and school
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No Messages Yet"
            description="Communication features are currently being developed. You'll be able to message teachers and view school announcements soon."
            icon={<MessageCircle className="w-16 h-16" />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
