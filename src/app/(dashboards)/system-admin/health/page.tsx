"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Activity,
  Server,
  Database,
  Cloud,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Zap,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Gauge,
  RefreshCw,
  Download,
  Bell,
  AlertTriangle,
  WifiOff,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface HealthMetric {
  service: string;
  status: "healthy" | "degraded" | "down";
  uptime: number;
  responseTime: number;
  cpu?: number;
  memory?: number;
  lastCheck: Date;
}

interface SystemAlert {
  id: string;
  severity: "info" | "warning" | "error" | "critical";
  message: string;
  timestamp: Date;
  service: string;
}

export default function SystemHealthPage() {
  return (
    <ProtectedRoute>
      <SystemHealthContent />
    </ProtectedRoute>
  );
}

function SystemHealthContent() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockMetrics: HealthMetric[] = [
          {
            service: "Web Application",
            status: "healthy",
            uptime: 99.98,
            responseTime: 124,
            cpu: 35,
            memory: 62,
            lastCheck: new Date(),
          },
          {
            service: "Database (Neon)",
            status: "healthy",
            uptime: 99.99,
            responseTime: 18,
            cpu: 22,
            memory: 45,
            lastCheck: new Date(),
          },
          {
            service: "Authentication (Stack)",
            status: "healthy",
            uptime: 100,
            responseTime: 89,
            lastCheck: new Date(),
          },
          {
            service: "Storage (Vercel Blob)",
            status: "healthy",
            uptime: 99.95,
            responseTime: 156,
            lastCheck: new Date(),
          },
          {
            service: "OpenAI API",
            status: "degraded",
            uptime: 98.5,
            responseTime: 892,
            lastCheck: new Date(),
          },
          {
            service: "CDN",
            status: "healthy",
            uptime: 100,
            responseTime: 45,
            lastCheck: new Date(),
          },
        ];

        const mockAlerts: SystemAlert[] = [
          {
            id: "1",
            severity: "warning",
            message: "OpenAI API response time above threshold (>500ms)",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            service: "OpenAI API",
          },
          {
            id: "2",
            severity: "info",
            message: "Scheduled maintenance window: March 15, 2AM-4AM UTC",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            service: "System",
          },
        ];

        // Generate mock performance data for the last 24 hours
        const perfData = Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          cpu: Math.floor(20 + Math.random() * 40),
          memory: Math.floor(40 + Math.random() * 30),
          requests: Math.floor(1000 + Math.random() * 500),
          responseTime: Math.floor(80 + Math.random() * 100),
        }));

        setMetrics(mockMetrics);
        setAlerts(mockAlerts);
        setPerformanceData(perfData);
      } catch (error) {
        console.error("Failed to load health data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHealthData();
    // Refresh every 30 seconds
    const interval = setInterval(loadHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setLastRefresh(new Date());
    // Trigger data reload
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Calculate overall system health
  const overallHealth = metrics.reduce((acc, metric) => {
    if (metric.status === "healthy") return acc;
    if (metric.status === "degraded") return acc - 10;
    if (metric.status === "down") return acc - 25;
    return acc;
  }, 100);

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-500";
    if (health >= 70) return "text-amber-500";
    return "text-red-500";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "degraded":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "down":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-4 h-4" />;
      case "error":
        return <AlertTriangle className="w-4 h-4" />;
      case "warning":
        return <AlertCircle className="w-4 h-4" />;
      case "info":
        return <Bell className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      case "info":
        return "outline";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading system health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">
            Monitor platform services and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Health Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Overall System Health</h3>
              <div className="flex items-center gap-4 mt-2">
                <span className={`text-4xl font-bold ${getHealthColor(overallHealth)}`}>
                  {overallHealth}%
                </span>
                <div className="flex-1 max-w-md">
                  <Progress value={overallHealth} className="h-3" />
                </div>
              </div>
            </div>
            <Activity className="h-12 w-12 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Alerts</h2>
          {alerts.map(alert => (
            <Alert key={alert.id}>
              <div className="flex items-start gap-2">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <AlertTitle>
                    <Badge variant={getSeverityColor(alert.severity) as any} className="mr-2">
                      {alert.severity}
                    </Badge>
                    {alert.service}
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    <p>{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(metric => (
          <Card key={metric.service}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{metric.service}</CardTitle>
                {getStatusIcon(metric.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium">{metric.uptime}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Response Time</span>
                <span className="font-medium">{metric.responseTime}ms</span>
              </div>
              {metric.cpu !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">CPU</span>
                    <span className="font-medium">{metric.cpu}%</span>
                  </div>
                  <Progress value={metric.cpu} className="h-2" />
                </div>
              )}
              {metric.memory !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Memory</span>
                    <span className="font-medium">{metric.memory}%</span>
                  </div>
                  <Progress value={metric.memory} className="h-2" />
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Last check: {metric.lastCheck.toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage (24h)</CardTitle>
            <CardDescription>CPU and Memory utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="CPU %"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Memory %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Metrics (24h)</CardTitle>
            <CardDescription>Requests and response times</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="requests"
                  stroke="#8884d8"
                  name="Requests"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#82ca9d"
                  name="Response Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">2.4M</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from yesterday
                </p>
              </div>
              <Network className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">124ms</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -8ms from yesterday
                </p>
              </div>
              <Gauge className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold">0.02%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Within normal range
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">1,842</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently online
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}