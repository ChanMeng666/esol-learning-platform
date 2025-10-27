"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartRevenue } from "@/components/charts/chart-revenue";
import { ChartVisitors } from "@/components/charts/chart-visitors";
import { DataTable } from "@/components/data-table/data-table";
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
  UserCog,
  Trash2,
  Send,
  BarChart3,
  FlaskConical,
  Bug,
  Terminal,
  Code2,
  TestTube,
  Gauge,
  Wrench,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

// Define columns for organizations table
const organizationColumns = [
  {
    accessorKey: "name",
    header: "Organization",
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "userCount",
    header: "Users",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export default function SystemAdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with real API calls
  const [organizations] = useState<any[]>([
    {
      id: "1",
      name: "Sunshine Academy",
      plan: "Premium",
      userCount: 150,
      createdAt: "2024-01-15",
      status: "active"
    },
    {
      id: "2",
      name: "Riverside School",
      plan: "Basic",
      userCount: 75,
      createdAt: "2024-02-01",
      status: "active"
    },
    {
      id: "3",
      name: "Demo Organization",
      plan: "Trial",
      userCount: 10,
      createdAt: "2024-03-10",
      status: "trial"
    }
  ]);

  const [systemHealth] = useState({
    status: "healthy",
    uptime: "99.9%",
    lastBackup: "2 hours ago",
  });

  // Calculate statistics
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

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-3xl grid-cols-6 lg:grid-cols-6">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="organizations" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Organizations</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="developer" className="gap-2">
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">Developer</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Organizations"
              value={totalOrganizations}
              description="Total organizations"
              icon={Building2}
              trend={mockTrends.organizations}
              variant="info"
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
              title="Active Orgs"
              value={activeOrganizations}
              description="Currently active"
              icon={Activity}
              trend={mockTrends.active}
              variant="warning"
            />
            <StatCard
              title="Database"
              value={databaseSize}
              description="Total storage used"
              icon={Database}
              trend={mockTrends.storage}
              variant="primary"
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
                    <CardTitle>Recent Organizations</CardTitle>
                    <CardDescription>Latest registered organizations</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("organizations")}
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {organizations.slice(0, 3).map((org) => (
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
        </TabsContent>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Organization Management</CardTitle>
                  <CardDescription>Manage all platform organizations</CardDescription>
                </div>
                <Button onClick={() => router.push("/system-admin/organizations/new")}>
                  Create Organization
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filter placeholder - can be implemented later */}
                <div className="text-sm text-muted-foreground">
                  Filter functionality coming soon
                </div>
                <DataTable
                  columns={organizationColumns}
                  data={organizations}
                  searchKey="name"
                  pageSize={10}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all platform users across organizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">User Operations</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => router.push("/system-admin/users")}>
                    View All Users
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/system-admin/dashboard/fix-roles")}>
                    Fix User Roles
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">User Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-muted-foreground">Total Users</dt>
                        <dd className="text-sm font-medium">{totalUsers}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-muted-foreground">Active Today</dt>
                        <dd className="text-sm font-medium">142</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-muted-foreground">New This Week</dt>
                        <dd className="text-sm font-medium">23</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Role Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-muted-foreground">Students</dt>
                        <dd className="text-sm font-medium">165</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-muted-foreground">Teachers</dt>
                        <dd className="text-sm font-medium">42</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-muted-foreground">Admins</dt>
                        <dd className="text-sm font-medium">18</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage system settings and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => router.push("/system-admin/settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">System Settings</div>
                    <div className="text-sm text-muted-foreground">Configure platform settings</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => router.push("/system-admin/backup")}
                >
                  <Database className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Database Backup</div>
                    <div className="text-sm text-muted-foreground">Manual backup and restore</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => router.push("/system-admin/monitoring")}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">System Monitoring</div>
                    <div className="text-sm text-muted-foreground">Performance metrics</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => router.push("/system-admin/dashboard/invitations")}
                >
                  <Send className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Invitation Codes</div>
                    <div className="text-sm text-muted-foreground">Manage invitations</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Access Control</CardTitle>
              <CardDescription>Manage permissions and audit system access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => router.push("/system-admin/permissions")}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Permissions</div>
                    <div className="text-sm text-muted-foreground">Configure access control</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => router.push("/system-admin/audit")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Audit Logs</div>
                    <div className="text-sm text-muted-foreground">Review system activity</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => router.push("/system-admin/dashboard/fix-roles")}
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Fix User Roles</div>
                    <div className="text-sm text-muted-foreground">Repair role assignments</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => router.push("/system-admin/dashboard/cleanup-users")}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Cleanup Users</div>
                    <div className="text-sm text-muted-foreground">Delete test data</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Developer Tab - MOST IMPORTANT FOR TESTING */}
        <TabsContent value="developer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Developer Tools & Testing</CardTitle>
              <CardDescription>Access all enhanced features and testing pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enhanced Dashboard Pages */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Enhanced Dashboard Pages</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-emerald-500/5 hover:border-emerald-500/50"
                    onClick={() => router.push("/student/dashboard/enhanced-page")}
                  >
                    <FlaskConical className="w-4 h-4 mr-2 text-emerald-500" />
                    <div className="text-left">
                      <div className="font-medium">Student Enhanced</div>
                      <div className="text-xs text-muted-foreground">Test student features</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-emerald-500/5 hover:border-emerald-500/50"
                    onClick={() => router.push("/teacher/dashboard/enhanced-page")}
                  >
                    <FlaskConical className="w-4 h-4 mr-2 text-emerald-500" />
                    <div className="text-left">
                      <div className="font-medium">Teacher Enhanced</div>
                      <div className="text-xs text-muted-foreground">Test teacher features</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-emerald-500/5 hover:border-emerald-500/50"
                    onClick={() => router.push("/parent/dashboard/enhanced-page")}
                  >
                    <FlaskConical className="w-4 h-4 mr-2 text-emerald-500" />
                    <div className="text-left">
                      <div className="font-medium">Parent Enhanced</div>
                      <div className="text-xs text-muted-foreground">Test parent features</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-emerald-500/5 hover:border-emerald-500/50"
                    onClick={() => router.push("/school-admin/dashboard/enhanced-page")}
                  >
                    <FlaskConical className="w-4 h-4 mr-2 text-emerald-500" />
                    <div className="text-left">
                      <div className="font-medium">School Admin Enhanced</div>
                      <div className="text-xs text-muted-foreground">Test school admin features</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-emerald-500/5 hover:border-emerald-500/50"
                    onClick={() => router.push("/department/dashboard/enhanced-page")}
                  >
                    <FlaskConical className="w-4 h-4 mr-2 text-emerald-500" />
                    <div className="text-left">
                      <div className="font-medium">Department Enhanced</div>
                      <div className="text-xs text-muted-foreground">Test department features</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-emerald-500/5 hover:border-emerald-500/50"
                    onClick={() => router.push("/system-admin/dashboard/enhanced-page")}
                  >
                    <FlaskConical className="w-4 h-4 mr-2 text-emerald-500" />
                    <div className="text-left">
                      <div className="font-medium">System Admin Enhanced</div>
                      <div className="text-xs text-muted-foreground">Test system admin features</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Component Testing Pages */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Component Testing</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-blue-500/5 hover:border-blue-500/50"
                    onClick={() => router.push("/test-realtime")}
                  >
                    <TestTube className="w-4 h-4 mr-2 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Realtime API Test</div>
                      <div className="text-xs text-muted-foreground">OpenAI Realtime debug</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-blue-500/5 hover:border-blue-500/50"
                    onClick={() => router.push("/diagnostic")}
                  >
                    <Gauge className="w-4 h-4 mr-2 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Diagnostic Tests</div>
                      <div className="text-xs text-muted-foreground">Test diagnostic flow</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-blue-500/5 hover:border-blue-500/50"
                    onClick={() => {
                      toast.info("Opening Calendar Test Page");
                      router.push("/test/calendar");
                    }}
                  >
                    <TestTube className="w-4 h-4 mr-2 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Calendar Component</div>
                      <div className="text-xs text-muted-foreground">TOAST UI Calendar test</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-blue-500/5 hover:border-blue-500/50"
                    onClick={() => {
                      toast.info("Opening Spreadsheet Test Page");
                      router.push("/test/spreadsheet");
                    }}
                  >
                    <TestTube className="w-4 h-4 mr-2 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Spreadsheet Component</div>
                      <div className="text-xs text-muted-foreground">Grade spreadsheet test</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-blue-500/5 hover:border-blue-500/50"
                    onClick={() => {
                      toast.info("Opening Data Table Test Page");
                      router.push("/test/data-table");
                    }}
                  >
                    <TestTube className="w-4 h-4 mr-2 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Data Table</div>
                      <div className="text-xs text-muted-foreground">TanStack Table test</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-blue-500/5 hover:border-blue-500/50"
                    onClick={() => {
                      toast.info("Opening Charts Test Page");
                      router.push("/test/charts");
                    }}
                  >
                    <TestTube className="w-4 h-4 mr-2 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Charts</div>
                      <div className="text-xs text-muted-foreground">Recharts components test</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Development Tools */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Development Tools</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-orange-500/5 hover:border-orange-500/50"
                    onClick={() => {
                      toast.info("Opening Database Schema Viewer");
                      router.push("/system-admin/dev/schema");
                    }}
                  >
                    <Database className="w-4 h-4 mr-2 text-orange-500" />
                    <div className="text-left">
                      <div className="font-medium">Database Schema</div>
                      <div className="text-xs text-muted-foreground">View all 44 tables</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-orange-500/5 hover:border-orange-500/50"
                    onClick={() => {
                      toast.info("Opening API Documentation");
                      router.push("/system-admin/dev/api");
                    }}
                  >
                    <Code2 className="w-4 h-4 mr-2 text-orange-500" />
                    <div className="text-left">
                      <div className="font-medium">API Documentation</div>
                      <div className="text-xs text-muted-foreground">Server Actions catalog</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-orange-500/5 hover:border-orange-500/50"
                    onClick={() => {
                      toast.info("Opening Performance Monitor");
                      router.push("/system-admin/dev/performance");
                    }}
                  >
                    <Gauge className="w-4 h-4 mr-2 text-orange-500" />
                    <div className="text-left">
                      <div className="font-medium">Performance Monitor</div>
                      <div className="text-xs text-muted-foreground">Virtual scrolling demo</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-orange-500/5 hover:border-orange-500/50"
                    onClick={() => {
                      toast.info("Opening Console Terminal");
                      // In a real app, this would open an embedded terminal
                      window.open("/api/console", "_blank");
                    }}
                  >
                    <Terminal className="w-4 h-4 mr-2 text-orange-500" />
                    <div className="text-left">
                      <div className="font-medium">Console Terminal</div>
                      <div className="text-xs text-muted-foreground">Debug console</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-orange-500/5 hover:border-orange-500/50"
                    onClick={() => {
                      toast.info("Opening Error Logs");
                      router.push("/system-admin/dev/errors");
                    }}
                  >
                    <Bug className="w-4 h-4 mr-2 text-orange-500" />
                    <div className="text-left">
                      <div className="font-medium">Error Logs</div>
                      <div className="text-xs text-muted-foreground">View system errors</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-orange-500/5 hover:border-orange-500/50"
                    onClick={() => {
                      toast.success("Cache cleared successfully!");
                    }}
                  >
                    <Wrench className="w-4 h-4 mr-2 text-orange-500" />
                    <div className="text-left">
                      <div className="font-medium">Clear Cache</div>
                      <div className="text-xs text-muted-foreground">Reset all caches</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Quick Test Actions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Test Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.success("Test notification triggered!");
                    }}
                  >
                    Test Toast
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.error("Error notification example");
                    }}
                  >
                    Test Error
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.loading("Loading notification example");
                    }}
                  >
                    Test Loading
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Reload Page
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      localStorage.clear();
                      toast.success("LocalStorage cleared!");
                    }}
                  >
                    Clear Storage
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      document.documentElement.classList.toggle("dark");
                      toast.success("Theme toggled!");
                    }}
                  >
                    Toggle Theme
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common system administration tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
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
                  Manage all users
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
                  Configure access
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
                  Review activity
                </div>
              </div>
            </Button>

            <Button
              onClick={() => setActiveTab("developer")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Code2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Developer Tools</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Testing & debug
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}