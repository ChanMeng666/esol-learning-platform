"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartRevenue } from "@/components/charts/chart-revenue";
import { ChartVisitors } from "@/components/charts/chart-visitors";
import {
  Building2,
  Users,
  Activity,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Settings,
  Shield,
  FileText,
} from "lucide-react";

export default function SystemAdminDashboardPage() {
  const router = useRouter();

  // Mock data - replace with real API calls
  const [organizations] = useState<any[]>([]);
  const [systemHealth] = useState({
    status: "healthy",
    uptime: "99.9%",
    lastBackup: "2 hours ago",
  });

  // Mock statistics
  const totalOrganizations = organizations.length;
  const totalUsers = organizations.reduce((sum, org) => sum + (org.userCount || 0), 0);
  const activeOrganizations = organizations.filter((org) => org.status === "active").length;
  const databaseSize = "2.4 GB";

  const mockTrends = {
    organizations: { value: 8.3, label: "vs last month" },
    users: { value: 15.7, label: "vs last month" },
    active: { value: 2.1, label: "vs last month" },
    storage: { value: 12.4, label: "vs last week" },
  };

  // Organization distribution data
  const organizationData = [
    {
      category: "Active",
      value: activeOrganizations,
      fill: "hsl(var(--chart-1))",
    },
    {
      category: "Trial",
      value: organizations.filter((org) => org.status === "trial").length,
      fill: "hsl(var(--chart-2))",
    },
    {
      category: "Suspended",
      value: organizations.filter((org) => org.status === "suspended").length,
      fill: "hsl(var(--chart-3))",
    },
  ];

  const organizationConfig = {
    Active: {
      label: "Active",
      color: "hsl(var(--chart-1))",
    },
    Trial: {
      label: "Trial",
      color: "hsl(var(--chart-2))",
    },
    Suspended: {
      label: "Suspended",
      color: "hsl(var(--chart-3))",
    },
  };

  // System metrics over time
  const metricsData = [
    { label: "Mon", users: 1200, organizations: 45 },
    { label: "Tue", users: 1280, organizations: 46 },
    { label: "Wed", users: 1350, organizations: 47 },
    { label: "Thu", users: 1420, organizations: 48 },
    { label: "Fri", users: 1500, organizations: 50 },
    { label: "Sat", users: 1450, organizations: 50 },
    { label: "Sun", users: 1480, organizations: 51 },
  ];

  const metricsConfig = {
    users: {
      label: "Total Users",
      color: "hsl(var(--chart-1))",
    },
    organizations: {
      label: "Organizations",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
        <p className="text-muted-foreground">
          Manage all organizations, monitor system health, and oversee platform operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Organizations"
          value={totalOrganizations}
          description="Total organizations"
          icon={Building2}
          trend={mockTrends.organizations}
          variant="primary"
        />
        <StatCard
          title="Total Users"
          value={totalUsers}
          description="Across all organizations"
          icon={Users}
          trend={mockTrends.users}
          variant="success"
        />
        <StatCard
          title="Active Organizations"
          value={activeOrganizations}
          description="Currently active"
          icon={Activity}
          trend={mockTrends.active}
          variant="warning"
        />
        <StatCard
          title="Database Size"
          value={databaseSize}
          description="Total storage used"
          icon={Database}
          trend={mockTrends.storage}
          variant="default"
        />
      </div>

      {/* System Health Card */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Current system status and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">System Status</p>
                <p className="text-2xl font-bold capitalize">{systemHealth.status}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-2xl font-bold">{systemHealth.uptime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Database className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-2xl font-bold">{systemHealth.lastBackup}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartRevenue
          title="System Metrics"
          description="Users and organizations over time"
          data={metricsData}
          config={metricsConfig}
          stacked={false}
          footerDescription="Last 7 days"
        />
        <ChartVisitors
          title="Organization Status"
          description="Distribution by status"
          data={organizationData}
          config={organizationConfig}
          showSelector={false}
          centerLabel="Total"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Organizations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Organizations</CardTitle>
                <CardDescription>Manage all platform organizations</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/system-admin/organizations")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {organizations.length === 0 ? (
              <EmptyState
                title="No organizations yet"
                description="Create your first organization to get started"
                action={{
                  label: "Create Organization",
                  onClick: () => router.push("/system-admin/organizations/new"),
                }}
              />
            ) : (
              <div className="space-y-3">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/system-admin/organizations/${org.id}`)}
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold leading-none">{org.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {org.userCount} users • {org.plan}
                      </p>
                    </div>
                    <Badge
                      variant={
                        org.status === "active"
                          ? "default"
                          : org.status === "trial"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {org.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Important notifications</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/system-admin/audit")}
              >
                View Logs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">System Backup Completed</p>
                  <p className="text-xs text-muted-foreground">
                    Automated backup completed successfully
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Database Optimization</p>
                  <p className="text-xs text-muted-foreground">
                    Scheduled maintenance completed
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common system administration tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={() => router.push("/system-admin/users")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">User Management</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Manage all platform users
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/system-admin/permissions")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Permissions</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Configure access control
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/system-admin/audit")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Audit Logs</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Review system activity
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
