"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartRevenue } from "@/components/charts/chart-revenue";
import { ChartVisitors } from "@/components/charts/chart-visitors";
import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive";
import {
  Users,
  Building2,
  Server,
  Activity,
  ArrowRight,
  Database,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

// Mock data - replace with actual API calls
interface Organization {
  id: string;
  name: string;
  schools: number;
  totalUsers: number;
  storageUsed: number; // in GB
  status: "active" | "suspended" | "trial";
  plan: "free" | "basic" | "premium" | "enterprise";
}

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  status: "healthy" | "warning" | "critical";
  lastUpdated: string;
}

export default function SystemDashboardPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      const mockOrganizations: Organization[] = [
        {
          id: "1",
          name: "Auckland Language Institute",
          schools: 3,
          totalUsers: 1245,
          storageUsed: 45.2,
          status: "active",
          plan: "enterprise",
        },
        {
          id: "2",
          name: "Wellington ESOL Centre",
          schools: 2,
          totalUsers: 876,
          storageUsed: 32.5,
          status: "active",
          plan: "premium",
        },
        {
          id: "3",
          name: "Christchurch Learning Hub",
          schools: 1,
          totalUsers: 423,
          storageUsed: 18.7,
          status: "trial",
          plan: "basic",
        },
      ];

      const mockMetrics: SystemMetric[] = [
        {
          id: "1",
          name: "Database Performance",
          value: "98.5%",
          status: "healthy",
          lastUpdated: "2 min ago",
        },
        {
          id: "2",
          name: "API Response Time",
          value: "145ms",
          status: "healthy",
          lastUpdated: "1 min ago",
        },
        {
          id: "3",
          name: "Storage Capacity",
          value: "67%",
          status: "warning",
          lastUpdated: "5 min ago",
        },
        {
          id: "4",
          name: "Active Sessions",
          value: "2,847",
          status: "healthy",
          lastUpdated: "30 sec ago",
        },
      ];

      setOrganizations(mockOrganizations);
      setSystemMetrics(mockMetrics);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading system dashboard..." fullScreen />;
  }

  // Calculate statistics
  const totalOrganizations = organizations.length;
  const totalSchools = organizations.reduce((sum, org) => sum + org.schools, 0);
  const totalUsers = organizations.reduce((sum, org) => sum + org.totalUsers, 0);
  const totalStorage = organizations.reduce((sum, org) => sum + org.storageUsed, 0);

  // Mock trends (replace with real data from API)
  const mockTrends = {
    organizations: { value: 15.2, label: "vs last quarter" },
    schools: { value: 8.7, label: "vs last quarter" },
    users: { value: 23.4, label: "vs last month" },
    storage: { value: 12.1, label: "vs last month" },
  };

  // Generate organization comparison data for bar chart
  const organizationData = organizations.map((org) => ({
    label: org.name.split(" ")[0], // First word of org name
    users: org.totalUsers,
    storage: org.storageUsed,
  }));

  const organizationConfig = {
    users: {
      label: "Total Users",
      color: "hsl(var(--chart-1))",
    },
    storage: {
      label: "Storage (GB)",
      color: "hsl(var(--chart-2))",
    },
  };

  // Generate plan distribution data for pie chart
  const planDistribution = organizations.reduce((acc, org) => {
    const planLabels = {
      free: "Free",
      basic: "Basic",
      premium: "Premium",
      enterprise: "Enterprise",
    };
    const existing = acc.find((item) => item.category === planLabels[org.plan]);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        category: planLabels[org.plan],
        value: 1,
        fill: `hsl(var(--chart-${acc.length + 1}))`,
      });
    }
    return acc;
  }, [] as Array<{ category: string; value: number; fill: string }>);

  const planDistributionConfig = {
    Free: {
      label: "Free",
      color: "hsl(var(--chart-1))",
    },
    Basic: {
      label: "Basic",
      color: "hsl(var(--chart-2))",
    },
    Premium: {
      label: "Premium",
      color: "hsl(var(--chart-3))",
    },
    Enterprise: {
      label: "Enterprise",
      color: "hsl(var(--chart-4))",
    },
  };

  // Generate platform growth trend data for area chart
  const growthData = [
    { date: "2023-10-01", users: 2100, organizations: 8 },
    { date: "2023-11-01", users: 2350, organizations: 9 },
    { date: "2023-12-01", users: 2420, organizations: 10 },
    { date: "2024-01-01", users: 2544, organizations: 12 },
  ];

  const growthConfig = {
    users: {
      label: "Total Users",
      color: "hsl(var(--chart-1))",
    },
    organizations: {
      label: "Organizations",
      color: "hsl(var(--chart-2))",
    },
  };

  const getStatusBadgeVariant = (status: Organization["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "trial":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPlanBadgeVariant = (plan: Organization["plan"]) => {
    switch (plan) {
      case "enterprise":
        return "default";
      case "premium":
        return "secondary";
      case "basic":
        return "outline";
      case "free":
        return "outline";
      default:
        return "outline";
    }
  };

  const getMetricIcon = (status: SystemMetric["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getMetricBgColor = (status: SystemMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/10";
      case "warning":
        return "bg-orange-500/10";
      case "critical":
        return "bg-red-500/10";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor platform health, manage organizations, and oversee system-wide operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Organizations"
          value={totalOrganizations}
          description="Active organizations"
          icon={Building2}
          trend={mockTrends.organizations}
          variant="primary"
        />
        <StatCard
          title="Total Schools"
          value={totalSchools}
          description="Across all organizations"
          icon={Server}
          trend={mockTrends.schools}
          variant="success"
        />
        <StatCard
          title="Platform Users"
          value={totalUsers.toLocaleString()}
          description="Total registered users"
          icon={Users}
          trend={mockTrends.users}
          variant="warning"
        />
        <StatCard
          title="Storage Used"
          value={`${totalStorage.toFixed(1)} GB`}
          description="Total storage consumption"
          icon={Database}
          trend={mockTrends.storage}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartAreaInteractive
          title="Platform Growth"
          description="Track users and organizations over time"
          data={growthData}
          config={growthConfig}
          defaultTimeRange="90d"
          timeRanges={[
            { value: "30d", label: "Last 30 days", days: 30 },
            { value: "90d", label: "Last 90 days", days: 90 },
          ]}
        />
        <ChartVisitors
          title="Subscription Plans"
          description="Distribution of organization plans"
          data={planDistribution}
          config={planDistributionConfig}
          showSelector={false}
          centerLabel="Organizations"
        />
      </div>

      {/* Organization Comparison Chart */}
      {organizations.length > 0 && (
        <ChartRevenue
          title="Organization Comparison"
          description="Compare organization sizes and resource usage"
          data={organizationData}
          config={organizationConfig}
          stacked={false}
          footerDescription="Current month statistics"
        />
      )}

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
                onClick={() => router.push("/system/organizations")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {organizations.length === 0 ? (
              <EmptyState
                title="No organizations"
                description="Create your first organization to get started"
                action={{
                  label: "Create Organization",
                  onClick: () => router.push("/system/organizations/new"),
                }}
              />
            ) : (
              <div className="space-y-3">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/system/organizations/${org.id}`)}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold leading-none">{org.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {org.schools} {org.schools === 1 ? "school" : "schools"}, {org.totalUsers.toLocaleString()} users
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getStatusBadgeVariant(org.status)}>
                            {org.status}
                          </Badge>
                          <Badge variant={getPlanBadgeVariant(org.plan)}>
                            {org.plan}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          {org.storageUsed.toFixed(1)} GB storage
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Real-time platform metrics</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/system/monitoring")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemMetrics.length === 0 ? (
                <EmptyState
                  title="No metrics available"
                  description="System metrics will appear here"
                />
              ) : (
                systemMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getMetricBgColor(metric.status)}`}>
                        {getMetricIcon(metric.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{metric.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          {metric.lastUpdated}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{metric.value}</p>
                    </div>
                  </div>
                ))
              )}
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
              onClick={() => router.push("/system/organizations")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Manage Organizations</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Create and configure organizations
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/system/security")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Security Settings</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Configure platform security
                </div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/system/settings")}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-primary/5 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">System Configuration</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Manage system-wide settings
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
