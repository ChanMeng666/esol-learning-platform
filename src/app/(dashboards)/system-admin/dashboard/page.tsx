"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  Building2,
  Users,
  ArrowRight,
  Shield,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { getAllOrganizations } from "@/actions/organizations";
import { getUsersByOrganization } from "@/actions/users";

export default function SystemAdminDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalUsers: 0,
    activeOrganizations: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // Fetch real statistics from database
      const organizations = await getAllOrganizations();
      const activeOrgs = organizations.filter(org => org.isActive);

      // Get total user count across all organizations
      let totalUserCount = 0;
      for (const org of organizations) {
        const users = await getUsersByOrganization(org.id);
        totalUserCount += users.length;
      }

      setStats({
        totalOrganizations: organizations.length,
        totalUsers: totalUserCount,
        activeOrganizations: activeOrgs.length,
      });

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading dashboard..." fullScreen />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
        <p className="text-muted-foreground">
          Manage all organizations and users across the platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Organizations"
          value={stats.totalOrganizations}
          description={`${stats.activeOrganizations} active`}
          icon={Building2}
          variant="info"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Across all organizations"
          icon={Users}
          variant="success"
        />
        <StatCard
          title="Active Organizations"
          value={stats.activeOrganizations}
          description="Currently enabled"
          icon={Building2}
          variant="primary"
        />
      </div>

      {/* Quick Access Cards */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>
            Quick access to core administration features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/system-admin/organizations">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Organizations</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Manage organizations and their settings
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/system-admin/users">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">User Management</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      View and manage all users
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/system-admin/dashboard/invitations">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <KeyRound className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Invitation Codes</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create and manage invitation codes
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/system-admin/permissions">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Permissions</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure roles and permissions
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
