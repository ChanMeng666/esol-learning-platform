"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Building2,
  Users,
  Activity,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileText,
  Server,
  Cpu,
  HardDrive,
  TrendingUp,
  Clock,
  Settings,
  BarChart3,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SystemAdminDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();

  // Real-time system metrics
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 42,
    memory: 68,
    storage: 55,
    uptime: 99.98,
  });

  // Mock data for activity chart
  const [activityData] = useState([
    { hour: "00:00", requests: 1200 },
    { hour: "04:00", requests: 800 },
    { hour: "08:00", requests: 2400 },
    { hour: "12:00", requests: 3200 },
    { hour: "16:00", requests: 2800 },
    { hour: "20:00", requests: 1800 },
    { hour: "24:00", requests: 1500 },
  ]);

  // Real-time metrics update
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.min(100, Math.max(20, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(40, prev.memory + (Math.random() - 0.5) * 5)),
        storage: prev.storage,
        uptime: prev.uptime,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
        <p className="text-muted-foreground">
          Manage all organizations, monitor system health, and oversee platform operations
        </p>
      </div>

      {/* System Status Alert */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>System Status: All Systems Operational</AlertTitle>
        <AlertDescription>
          All services are running normally. Last backup completed 2 hours ago.
        </AlertDescription>
      </Alert>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Organizations</p>
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-green-500 mt-1">+2 this month</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">2,301</p>
                <p className="text-xs text-green-500 mt-1">+156 this month</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Database Size</p>
                <p className="text-2xl font-bold">1.2GB</p>
                <p className="text-xs text-muted-foreground mt-1">60% of limit</p>
              </div>
              <Database className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">99.98%</p>
                <p className="text-xs text-muted-foreground mt-1">30 days</p>
              </div>
              <Activity className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>System Resources</CardTitle>
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3 animate-pulse" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">CPU Usage</span>
                </div>
                <span className="text-sm font-bold">{Math.round(systemMetrics.cpu)}%</span>
              </div>
              <Progress value={systemMetrics.cpu} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Memory</span>
                </div>
                <span className="text-sm font-bold">{Math.round(systemMetrics.memory)}%</span>
              </div>
              <Progress value={systemMetrics.memory} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Storage</span>
                </div>
                <span className="text-sm font-bold">{Math.round(systemMetrics.storage)}%</span>
              </div>
              <Progress value={systemMetrics.storage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Activity (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent System Events</CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.push("/system-admin/audit")}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="default">Success</Badge>
              <span className="text-sm">New organization "Tech Corp" created</span>
              <span className="text-xs text-muted-foreground ml-auto">5 minutes ago</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default">Success</Badge>
              <span className="text-sm">Automated backup completed</span>
              <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Warning</Badge>
              <span className="text-sm">High API usage detected from org "Demo Org"</span>
              <span className="text-xs text-muted-foreground ml-auto">3 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default">Success</Badge>
              <span className="text-sm">System update installed successfully</span>
              <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}