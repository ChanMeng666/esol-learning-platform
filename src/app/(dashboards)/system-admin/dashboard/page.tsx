"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "@/components/shared/loading-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  Building2,
  Users,
  Database,
  ArrowRight,
  Info,
  Shield,
  Settings,
  BarChart3,
  FileText,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SystemAdminDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalUsers: 0,
    databaseSize: "0 MB",
    systemHealth: "Healthy",
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // TODO: Implement API calls to fetch real data
      // const data = await getSystemStats();
      // setStats(data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard");
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
          Manage all organizations, monitor system health, and oversee platform operations
        </p>
      </div>

      {/* Development Notice */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          System admin dashboard is displaying basic statistics.
          Use the management pages below to access full system administration features.
        </AlertDescription>
      </Alert>

      {/* Simplified Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Organizations"
          value={stats.totalOrganizations}
          description="Active organizations"
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
          title="Database Size"
          value={stats.databaseSize}
          description="Current usage"
          icon={Database}
          variant="warning"
        />
        <StatCard
          title="System Health"
          value={stats.systemHealth}
          description="Overall status"
          icon={Activity}
          variant="primary"
        />
      </div>

      {/* Quick Access System Management Cards */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>
            Quick access to system administration features
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
                    <h4 className="font-medium text-sm">Organization Management</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create and manage organizations across the platform
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
                      View and manage all users across organizations
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/system-admin/health">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">System Health</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monitor system performance and resource usage
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/system-admin/database">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Database Management</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Database operations, backups, and maintenance
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/system-admin/audit">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Audit Logs</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      View system events and security audit logs
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/system-admin/analytics">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <BarChart3 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Platform Analytics</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Usage statistics and performance metrics
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/system-admin/security">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Security Settings</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure authentication and security policies
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/system-admin/settings">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex items-start justify-between hover:bg-accent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Settings className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">System Settings</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure platform-wide settings and preferences
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
