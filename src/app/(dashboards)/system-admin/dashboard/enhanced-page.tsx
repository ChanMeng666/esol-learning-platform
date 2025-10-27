"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/data-table";
import { ProgressLineChart } from "@/components/charts/progress-line-chart";
import { SkillRadarChart } from "@/components/charts/skill-radar-chart";
import { LearningTimeChart } from "@/components/charts/learning-time-chart";
import { AdvancedFilter, type FilterConfig, type FilterValue } from "@/components/filters/advanced-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useContainerQuery } from "@/hooks/use-container-query";
import {
  Users,
  Building2,
  Server,
  Activity,
  TrendingUp,
  AlertTriangle,
  Shield,
  Database,
  Globe,
  Cpu,
  HardDrive,
  Zap,
  Settings,
  FileText,
  Download,
  RefreshCw
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

// Organization data structure
interface Organization {
  id: string;
  name: string;
  type: "school" | "institution" | "corporate";
  plan: "free" | "starter" | "pro" | "enterprise";
  users: number;
  activeUsers: number;
  storage: number; // in GB
  status: "active" | "suspended" | "trial";
  createdAt: Date;
}

// System metrics
interface SystemMetrics {
  cpu: number;
  memory: number;
  storage: number;
  requests: number;
  responseTime: number;
  uptime: number;
  errors: number;
}

// Mock organizations data
const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Auckland Language School",
    type: "school",
    plan: "pro",
    users: 450,
    activeUsers: 387,
    storage: 25.4,
    status: "active",
    createdAt: new Date("2024-01-15")
  },
  {
    id: "2",
    name: "Wellington Institute",
    type: "institution",
    plan: "enterprise",
    users: 1250,
    activeUsers: 1089,
    storage: 85.2,
    status: "active",
    createdAt: new Date("2023-09-20")
  },
  {
    id: "3",
    name: "TechCorp Training",
    type: "corporate",
    plan: "starter",
    users: 75,
    activeUsers: 62,
    storage: 5.8,
    status: "trial",
    createdAt: new Date("2024-10-01")
  }
];

// Organization table columns
const orgColumns: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: "Organization",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue("name")}</p>
        <p className="text-xs text-muted-foreground capitalize">{row.original.type}</p>
      </div>
    )
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      const plan = row.getValue("plan") as string;
      const colors = {
        free: "bg-gray-100 text-gray-800",
        starter: "bg-blue-100 text-blue-800",
        pro: "bg-purple-100 text-purple-800",
        enterprise: "bg-amber-100 text-amber-800"
      };
      return (
        <Badge className={colors[plan as keyof typeof colors] || ""}>
          {plan}
        </Badge>
      );
    }
  },
  {
    accessorKey: "users",
    header: "Users",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.activeUsers}/{row.getValue("users")}</p>
        <Progress
          value={(row.original.activeUsers / (row.getValue("users") as number)) * 100}
          className="h-1 mt-1"
        />
      </div>
    )
  },
  {
    accessorKey: "storage",
    header: "Storage",
    cell: ({ row }) => (
      <div>
        <p className="text-sm">{row.getValue("storage")} GB</p>
      </div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colors = {
        active: "bg-green-100 text-green-800",
        suspended: "bg-red-100 text-red-800",
        trial: "bg-yellow-100 text-yellow-800"
      };
      return (
        <Badge className={colors[status as keyof typeof colors] || ""}>
          {status}
        </Badge>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        Manage
      </Button>
    )
  }
];

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    id: "type",
    label: "Organization Type",
    type: "multiselect",
    options: [
      { value: "school", label: "School" },
      { value: "institution", label: "Institution" },
      { value: "corporate", label: "Corporate" }
    ]
  },
  {
    id: "plan",
    label: "Plan",
    type: "multiselect",
    options: [
      { value: "free", label: "Free" },
      { value: "starter", label: "Starter" },
      { value: "pro", label: "Pro" },
      { value: "enterprise", label: "Enterprise" }
    ]
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "suspended", label: "Suspended" },
      { value: "trial", label: "Trial" }
    ]
  },
  {
    id: "users",
    label: "User Count",
    type: "range",
    min: 0,
    max: 2000,
    step: 50
  }
];

export default function EnhancedSystemAdminDashboard() {
  const [organizations, setOrganizations] = useState(mockOrganizations);
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 42,
    memory: 68,
    storage: 55,
    requests: 12450,
    responseTime: 145,
    uptime: 99.98,
    errors: 3
  });
  const { ref, isLgUp, isMdUp } = useContainerQuery<HTMLDivElement>();

  // Platform growth data
  const growthData = [
    { date: "Jan", users: 2500, organizations: 15, revenue: 25000 },
    { date: "Feb", users: 3200, organizations: 18, revenue: 32000 },
    { date: "Mar", users: 3800, organizations: 22, revenue: 38000 },
    { date: "Apr", users: 4500, organizations: 26, revenue: 45000 },
    { date: "May", users: 5200, organizations: 30, revenue: 52000 },
    { date: "Jun", users: 6100, organizations: 35, revenue: 61000 },
    { date: "Jul", users: 7200, organizations: 41, revenue: 72000 }
  ];

  // Usage distribution
  const usageDistribution = [
    { skill: "Schools", current: 45, target: 50 },
    { skill: "Institutions", current: 30, target: 35 },
    { skill: "Corporate", current: 15, target: 20 },
    { skill: "Individual", current: 10, target: 15 }
  ];

  // Server load data
  const serverLoad = [
    { day: "Mon", time: 75, sessions: 1250 },
    { day: "Tue", time: 82, sessions: 1380 },
    { day: "Wed", time: 78, sessions: 1290 },
    { day: "Thu", time: 85, sessions: 1420 },
    { day: "Fri", time: 72, sessions: 1180 },
    { day: "Sat", time: 45, sessions: 680 },
    { day: "Sun", time: 38, sessions: 520 }
  ];

  // Simulate real-time metrics update
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.min(100, Math.max(20, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(40, prev.memory + (Math.random() - 0.5) * 5)),
        storage: prev.storage,
        requests: prev.requests + Math.floor(Math.random() * 50),
        responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 20),
        uptime: prev.uptime,
        errors: prev.errors + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate totals
  const totalUsers = organizations.reduce((sum, org) => sum + org.users, 0);
  const totalActiveUsers = organizations.reduce((sum, org) => sum + org.activeUsers, 0);
  const totalStorage = organizations.reduce((sum, org) => sum + org.storage, 0);

  return (
    <div ref={ref} className="space-y-8 p-8 container-responsive">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground">
            Platform monitoring, management, and analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {systemMetrics.errors > 5 && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            System experiencing elevated error rates. {systemMetrics.errors} errors in the last hour.
          </AlertDescription>
        </Alert>
      )}

      {/* Platform Overview Stats */}
      <div className={`grid gap-4 ${isLgUp ? "grid-cols-4" : isMdUp ? "grid-cols-2" : "grid-cols-1"}`}>
        <StatCard
          title="Total Organizations"
          value={organizations.length.toString()}
          description="Active accounts"
          icon={<Building2 className="h-4 w-4" />}
          trend={{
            value: 15,
            isPositive: true
          }}
          gradient="blue"
        />

        <StatCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          description={`${totalActiveUsers.toLocaleString()} active`}
          icon={<Users className="h-4 w-4" />}
          trend={{
            value: 12,
            isPositive: true
          }}
          gradient="emerald"
          footer={
            <Progress value={(totalActiveUsers / totalUsers) * 100} className="h-1.5" />
          }
        />

        <StatCard
          title="Storage Used"
          value={`${totalStorage.toFixed(1)} GB`}
          description="Across all organizations"
          icon={<HardDrive className="h-4 w-4" />}
          gradient="purple"
          footer={
            <span className="text-xs text-muted-foreground">
              {(totalStorage / 1000 * 100).toFixed(1)}% of 1TB
            </span>
          }
        />

        <StatCard
          title="System Uptime"
          value={`${systemMetrics.uptime}%`}
          description="Last 30 days"
          icon={<Activity className="h-4 w-4" />}
          gradient="amber"
          footer={
            <Badge variant="secondary" className="text-xs">
              SLA: 99.9%
            </Badge>
          }
        />
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.cpu.toFixed(1)}%</div>
            <Progress value={systemMetrics.cpu} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.memory.toFixed(1)}%</div>
            <Progress value={systemMetrics.memory} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.storage}%</div>
            <Progress value={systemMetrics.storage} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Requests/min
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(systemMetrics.requests / 60)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total: {systemMetrics.requests}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.responseTime}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Avg latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.errors}</div>
            <p className="text-xs text-muted-foreground mt-1">Last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="organizations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdvancedFilter
                filters={filterConfig}
                values={filterValues}
                onChange={setFilterValues}
                onApply={(values) => console.log("Filters applied:", values)}
                onReset={() => setFilterValues({})}
              />
              <DataTable
                columns={orgColumns}
                data={organizations}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className={`grid gap-4 ${isLgUp ? "grid-cols-2" : "grid-cols-1"}`}>
            <Card>
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressLineChart
                  data={growthData}
                  title=""
                  description=""
                  showLegend={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <SkillRadarChart
                  data={usageDistribution}
                  title=""
                  description=""
                  showTarget={false}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Server Load Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <LearningTimeChart
                data={serverLoad}
                title=""
                description=""
                goalMinutes={80}
                showGoalLine={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">SSL Certificate</span>
                  <Badge variant="outline" className="bg-green-50">Valid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">2FA Enabled</span>
                  <span className="text-sm font-medium">78% of users</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Security Audit</span>
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Failed Login Attempts</span>
                  <span className="text-sm font-medium">12 today</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5" />
                    <div>
                      <p className="font-medium">Suspicious login detected</p>
                      <p className="text-xs text-muted-foreground">IP: 192.168.1.1 - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                    <div>
                      <p className="font-medium">Security patch applied</p>
                      <p className="text-xs text-muted-foreground">Version 2.4.1 - 5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                    <div>
                      <p className="font-medium">Backup completed</p>
                      <p className="text-xs text-muted-foreground">Full backup - 12 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Infrastructure Tab */}
        <TabsContent value="infrastructure" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Clusters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Primary (US-West)</span>
                    <Badge variant="outline" className="bg-green-50">Healthy</Badge>
                  </div>
                  <Progress value={62} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Replica (EU-Central)</span>
                    <Badge variant="outline" className="bg-green-50">Synced</Badge>
                  </div>
                  <Progress value={58} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Replica (AP-South)</span>
                    <Badge variant="outline" className="bg-yellow-50">Syncing</Badge>
                  </div>
                  <Progress value={71} className="h-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CDN Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cache Hit Rate</span>
                  <span className="text-sm font-medium">94.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bandwidth Used</span>
                  <span className="text-sm font-medium">2.4 TB / 10 TB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Edge Locations</span>
                  <span className="text-sm font-medium">28 active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Response Time</span>
                  <span className="text-sm font-medium">42ms</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Gateway</span>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Authentication Service</span>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">File Storage</span>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Service</span>
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analytics Pipeline</span>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-900">
                  <span className="text-gray-500">[2024-10-27 14:23:45]</span>
                  <span className="text-blue-600 ml-2">INFO</span>
                  <span className="ml-2">Organization 'Auckland Language School' upgraded to Pro plan</span>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-900">
                  <span className="text-gray-500">[2024-10-27 14:20:12]</span>
                  <span className="text-yellow-600 ml-2">WARN</span>
                  <span className="ml-2">High memory usage detected on server node-3</span>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-900">
                  <span className="text-gray-500">[2024-10-27 14:18:30]</span>
                  <span className="text-green-600 ml-2">SUCCESS</span>
                  <span className="ml-2">Database backup completed successfully</span>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-900">
                  <span className="text-gray-500">[2024-10-27 14:15:22]</span>
                  <span className="text-blue-600 ml-2">INFO</span>
                  <span className="ml-2">New user registration: 42 users in the last hour</span>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-900">
                  <span className="text-gray-500">[2024-10-27 14:10:08]</span>
                  <span className="text-red-600 ml-2">ERROR</span>
                  <span className="ml-2">Failed to send email notification - retrying...</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Logs
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}