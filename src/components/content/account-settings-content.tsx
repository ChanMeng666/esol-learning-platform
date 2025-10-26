"use client";

import { useEffect } from "react";
import { useStackApp } from "@stackframe/stack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Lock, CreditCard, Globe, ExternalLink } from "lucide-react";

/**
 * Account Settings content component for dashboard integration
 * Provides links to Stack Auth settings and local preferences
 */
export function AccountSettingsContent() {
  const app = useStackApp();

  const settingsSections = [
    {
      title: "Profile Settings",
      description: "Manage your personal information and profile picture",
      icon: User,
      action: () => window.open(app.urls.accountSettings, '_blank'),
      external: true,
    },
    {
      title: "Security",
      description: "Password, two-factor authentication, and security preferences",
      icon: Lock,
      action: () => window.open(app.urls.accountSettings, '_blank'),
      external: true,
    },
    {
      title: "Notifications",
      description: "Email and in-app notification preferences",
      icon: Bell,
      action: () => console.log("Notifications settings"),
      external: false,
      disabled: true,
    },
    {
      title: "Language & Region",
      description: "Language preferences and regional settings",
      icon: Globe,
      action: () => console.log("Language settings"),
      external: false,
      disabled: true,
    },
    {
      title: "Billing & Subscription",
      description: "Manage your subscription and payment methods",
      icon: CreditCard,
      action: () => console.log("Billing settings"),
      external: false,
      disabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and personal information
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.title}
              className={`hover:shadow-md transition-shadow ${
                section.disabled ? 'opacity-60' : 'cursor-pointer'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                  {section.external && (
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant={section.disabled ? "outline" : "default"}
                  disabled={section.disabled}
                  onClick={section.action}
                >
                  {section.disabled ? "Coming Soon" : "Manage Settings"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common account management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(app.urls.accountSettings, '_blank')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Open Full Settings
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(app.urls.signOut, '_self')}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">About Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your account is managed by Stack Auth. Some settings will open in a new window
            for security reasons. Changes made to your profile will be reflected across
            the entire platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}