"use client";

import { AccountSettings } from "@stackframe/stack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, Activity, Settings, Users } from "lucide-react";

/**
 * Integrated Stack Auth Account Settings for dashboard
 * Uses Stack Auth's built-in AccountSettings component without fullPage mode
 */
export function StackAccountSettingsContent() {
  // Custom extra items for the account settings
  const extraItems = [
    {
      id: "learning-preferences",
      title: "Learning Preferences",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Learning Settings</CardTitle>
            <CardDescription>
              Configure your learning experience preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Difficulty Level</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>Auto-adjust based on performance</option>
                <option>Foundation</option>
                <option>Level 1</option>
                <option>Level 2</option>
                <option>Level 3</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Practice Reminders</label>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="daily-reminder" className="mr-2" />
                <label htmlFor="daily-reminder" className="text-sm">
                  Send daily practice reminders
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Voice Speed</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>Normal</option>
                <option>Slow</option>
                <option>Very Slow</option>
                <option>Fast</option>
              </select>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "accessibility",
      title: "Accessibility",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Options</CardTitle>
            <CardDescription>
              Make the platform easier to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Font Size</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>Default</option>
                <option>Large</option>
                <option>Extra Large</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">High Contrast Mode</label>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="high-contrast" className="mr-2" />
                <label htmlFor="high-contrast" className="text-sm">
                  Enable high contrast colors
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Reduce Animations</label>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="reduce-motion" className="mr-2" />
                <label htmlFor="reduce-motion" className="text-sm">
                  Minimize motion and animations
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "privacy",
      title: "Privacy",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>
              Control your data and privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Profile Visibility</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>Visible to classmates</option>
                <option>Visible to teachers only</option>
                <option>Private</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Progress Sharing</label>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="share-progress" className="mr-2" />
                <label htmlFor="share-progress" className="text-sm">
                  Allow teachers to view detailed progress
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Data Collection</label>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="analytics" className="mr-2" defaultChecked />
                <label htmlFor="analytics" className="text-sm">
                  Help improve the platform with anonymous usage data
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Custom Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your profile, security, and platform preferences
        </p>
      </div>

      {/* Stack Auth AccountSettings Component */}
      <div className="rounded-lg border bg-card">
        <AccountSettings
          fullPage={false}
          extraItems={extraItems}
        />
      </div>

      {/* Additional Platform-Specific Settings */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>
              Additional settings specific to the ESOL learning platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="display" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="display">Display</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="export">Data Export</TabsTrigger>
              </TabsList>
              <TabsContent value="display" className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>System default</option>
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Sidebar Position</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>Left</option>
                    <option>Right</option>
                  </select>
                </div>
              </TabsContent>
              <TabsContent value="audio" className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Auto-play Audio</label>
                  <div className="flex items-center mt-2">
                    <input type="checkbox" id="autoplay" className="mr-2" defaultChecked />
                    <label htmlFor="autoplay" className="text-sm">
                      Automatically play audio for questions
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Audio Quality</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>High (recommended)</option>
                    <option>Medium</option>
                    <option>Low (saves data)</option>
                  </select>
                </div>
              </TabsContent>
              <TabsContent value="export" className="space-y-4">
                <div className="space-y-3">
                  <button className="w-full p-3 text-left border rounded-md hover:bg-muted/50">
                    <div className="font-medium">Export Learning Progress</div>
                    <div className="text-sm text-muted-foreground">
                      Download your progress data as CSV
                    </div>
                  </button>
                  <button className="w-full p-3 text-left border rounded-md hover:bg-muted/50">
                    <div className="font-medium">Export Practice History</div>
                    <div className="text-sm text-muted-foreground">
                      Download all your practice sessions
                    </div>
                  </button>
                  <button className="w-full p-3 text-left border rounded-md hover:bg-muted/50">
                    <div className="font-medium">Request Full Data Export</div>
                    <div className="text-sm text-muted-foreground">
                      Get all your data in a downloadable archive
                    </div>
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}