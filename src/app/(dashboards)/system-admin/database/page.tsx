"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  HardDrive,
  Activity,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Server,
  FileText,
  Archive,
  Trash2,
  Shield,
  Settings,
  Table as TableIcon,
  BarChart3,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DatabaseTable {
  name: string;
  rows: number;
  size: string;
  lastModified: Date;
  indexes: number;
}

interface BackupInfo {
  id: string;
  timestamp: Date;
  size: string;
  type: "automatic" | "manual";
  status: "completed" | "in_progress" | "failed";
  location: string;
}

export default function DatabasePage() {
  return (
    <ProtectedRoute>
      <DatabaseContent />
    </ProtectedRoute>
  );
}

function DatabaseContent() {
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [storageData, setStorageData] = useState<any[]>([]);
  const [queryMetrics, setQueryMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDatabaseInfo = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockTables: DatabaseTable[] = [
          { name: "users", rows: 2301, size: "4.2 MB", lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000), indexes: 4 },
          { name: "organizations", rows: 15, size: "128 KB", lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000), indexes: 2 },
          { name: "user_progress", rows: 1842, size: "2.1 MB", lastModified: new Date(Date.now() - 30 * 60 * 1000), indexes: 3 },
          { name: "practice_sessions", rows: 8921, size: "12.4 MB", lastModified: new Date(Date.now() - 15 * 60 * 1000), indexes: 3 },
          { name: "audio_files", rows: 3456, size: "892 MB", lastModified: new Date(Date.now() - 45 * 60 * 1000), indexes: 2 },
          { name: "copilot_messages", rows: 15234, size: "24.8 MB", lastModified: new Date(Date.now() - 10 * 60 * 1000), indexes: 2 },
          { name: "assignments", rows: 542, size: "1.8 MB", lastModified: new Date(Date.now() - 3 * 60 * 60 * 1000), indexes: 3 },
          { name: "diagnostic_tests", rows: 89, size: "456 KB", lastModified: new Date(Date.now() - 5 * 60 * 60 * 1000), indexes: 2 },
        ];

        const mockBackups: BackupInfo[] = [
          {
            id: "1",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            size: "1.2 GB",
            type: "automatic",
            status: "completed",
            location: "s3://backups/2024-03-14/",
          },
          {
            id: "2",
            timestamp: new Date(Date.now() - 27 * 60 * 60 * 1000),
            size: "1.2 GB",
            type: "automatic",
            status: "completed",
            location: "s3://backups/2024-03-13/",
          },
          {
            id: "3",
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            size: "1.1 GB",
            type: "manual",
            status: "completed",
            location: "s3://backups/2024-03-09-manual/",
          },
        ];

        // Storage breakdown data
        const storage = [
          { name: "Audio Files", value: 892, color: "#8884d8" },
          { name: "User Data", value: 124, color: "#82ca9d" },
          { name: "Sessions", value: 68, color: "#ffc658" },
          { name: "Messages", value: 45, color: "#ff8042" },
          { name: "Other", value: 31, color: "#00C49F" },
        ];

        // Query metrics over time
        const metrics = Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          queries: Math.floor(1000 + Math.random() * 2000),
          avgTime: Math.floor(10 + Math.random() * 50),
        }));

        setTables(mockTables);
        setBackups(mockBackups);
        setStorageData(storage);
        setQueryMetrics(metrics);
      } catch (error) {
        console.error("Failed to load database info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDatabaseInfo();
  }, []);

  // Calculate statistics
  const totalRows = tables.reduce((sum, table) => sum + table.rows, 0);
  const totalSize = "1.16 GB"; // Mock calculation
  const avgQueryTime = "24ms";
  const cacheHitRate = "94%";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading database information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Database Management</h1>
          <p className="text-muted-foreground">
            Monitor database performance and manage backups
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Optimize Tables
          </Button>
          <Button>
            <Archive className="w-4 h-4 mr-2" />
            Create Backup
          </Button>
        </div>
      </div>

      {/* Database Status Alert */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Database Status: Healthy</AlertTitle>
        <AlertDescription>
          All database services are running normally. Last backup completed 3 hours ago.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{totalSize}</p>
                <Progress value={62} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">62% of 2GB limit</p>
              </div>
              <HardDrive className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{totalRows.toLocaleString()}</p>
                <p className="text-xs text-green-500 mt-1">+12% this month</p>
              </div>
              <TableIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Query Time</p>
                <p className="text-2xl font-bold">{avgQueryTime}</p>
                <p className="text-xs text-muted-foreground mt-1">Within target</p>
              </div>
              <Zap className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cache Hit Rate</p>
                <p className="text-2xl font-bold">{cacheHitRate}</p>
                <p className="text-xs text-green-500 mt-1">Optimal</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tables" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        {/* Tables Tab */}
        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>Overview of all tables in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Indexes</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.map(table => (
                    <TableRow key={table.name}>
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>{table.rows.toLocaleString()}</TableCell>
                      <TableCell>{table.size}</TableCell>
                      <TableCell>{table.indexes}</TableCell>
                      <TableCell>
                        {table.lastModified.toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Query Volume (24h)</CardTitle>
                <CardDescription>Number of queries executed per hour</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={queryMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="queries" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Query Response Time (24h)</CardTitle>
                <CardDescription>Average query response time in milliseconds</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={queryMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgTime" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Slow Queries</CardTitle>
              <CardDescription>Queries taking longer than 100ms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No slow queries detected in the last 24 hours
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Backup History</CardTitle>
                  <CardDescription>Recent database backups and restore points</CardDescription>
                </div>
                <Button size="sm">
                  <Archive className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map(backup => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        {backup.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {backup.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>
                        <Badge variant={backup.status === "completed" ? "default" : "destructive"}>
                          {backup.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {backup.location}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm">
                    Automatic backups are scheduled every 24 hours at 3:00 AM UTC
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Breakdown</CardTitle>
                <CardDescription>Distribution of database storage by table type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={storageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {storageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Details</CardTitle>
                <CardDescription>Detailed breakdown by data type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storageData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.value} MB</p>
                        <p className="text-xs text-muted-foreground">
                          {((item.value / 1160) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Storage Used</span>
                    <span className="font-bold">1.16 GB / 2 GB</span>
                  </div>
                  <Progress value={58} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}