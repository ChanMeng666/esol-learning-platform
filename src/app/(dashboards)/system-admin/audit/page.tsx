"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { AdvancedFilter, type FilterConfig, type FilterValue } from "@/components/filters/advanced-filter";
import { type ColumnDef } from "@tanstack/react-table";
import {
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  User,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Clock,
  Server,
  Key,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Plus,
  LogIn,
  LogOut,
  Settings,
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  organizationId: string;
  organizationName: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed" | "warning";
  details?: string;
  changes?: Record<string, any>;
}

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    id: "action",
    label: "Action",
    type: "multiselect",
    options: [
      { value: "user.login", label: "Login" },
      { value: "user.logout", label: "Logout" },
      { value: "user.create", label: "User Created" },
      { value: "user.update", label: "User Updated" },
      { value: "user.delete", label: "User Deleted" },
      { value: "permission.grant", label: "Permission Granted" },
      { value: "permission.revoke", label: "Permission Revoked" },
      { value: "data.export", label: "Data Export" },
      { value: "settings.change", label: "Settings Changed" },
      { value: "api.access", label: "API Access" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "success", label: "Success" },
      { value: "failed", label: "Failed" },
      { value: "warning", label: "Warning" },
    ],
  },
  {
    id: "resource",
    label: "Resource",
    type: "multiselect",
    options: [
      { value: "user", label: "User" },
      { value: "organization", label: "Organization" },
      { value: "permission", label: "Permission" },
      { value: "settings", label: "Settings" },
      { value: "data", label: "Data" },
      { value: "api", label: "API" },
    ],
  },
  {
    id: "dateRange",
    label: "Date Range",
    type: "select",
    options: [
      { value: "today", label: "Today" },
      { value: "yesterday", label: "Yesterday" },
      { value: "last7days", label: "Last 7 Days" },
      { value: "last30days", label: "Last 30 Days" },
      { value: "custom", label: "Custom Range" },
    ],
  },
];

export default function AuditLogsPage() {
  return (
    <ProtectedRoute>
      <AuditLogsContent />
    </ProtectedRoute>
  );
}

function AuditLogsContent() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuditLogs = async () => {
      try {
        // Mock data - replace with actual API call
        const mockLogs: AuditLog[] = [
          {
            id: "1",
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            userId: "user1",
            userName: "John Smith",
            userRole: "school_admin",
            organizationId: "org1",
            organizationName: "Sunshine Academy",
            action: "user.login",
            resource: "authentication",
            ipAddress: "192.168.1.100",
            userAgent: "Chrome/120.0.0.0",
            status: "success",
            details: "Successful login with 2FA",
          },
          {
            id: "2",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            userId: "user2",
            userName: "Admin User",
            userRole: "system_admin",
            organizationId: "system",
            organizationName: "System",
            action: "user.update",
            resource: "user",
            resourceId: "user123",
            ipAddress: "10.0.0.1",
            userAgent: "Firefox/121.0",
            status: "success",
            details: "Updated user role from teacher to school_admin",
            changes: {
              role: { old: "teacher", new: "school_admin" },
            },
          },
          {
            id: "3",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            userId: "user3",
            userName: "Jane Doe",
            userRole: "teacher",
            organizationId: "org2",
            organizationName: "Riverside School",
            action: "data.export",
            resource: "data",
            ipAddress: "192.168.1.50",
            userAgent: "Safari/17.0",
            status: "success",
            details: "Exported student progress report (25 records)",
          },
          {
            id: "4",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            userId: "user4",
            userName: "Test User",
            userRole: "student",
            organizationId: "org1",
            organizationName: "Sunshine Academy",
            action: "user.login",
            resource: "authentication",
            ipAddress: "192.168.1.200",
            userAgent: "Chrome/119.0.0.0",
            status: "failed",
            details: "Invalid password attempt",
          },
          {
            id: "5",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            userId: "user2",
            userName: "Admin User",
            userRole: "system_admin",
            organizationId: "system",
            organizationName: "System",
            action: "permission.grant",
            resource: "permission",
            resourceId: "role456",
            ipAddress: "10.0.0.1",
            userAgent: "Chrome/120.0.0.0",
            status: "success",
            details: "Granted content.manage permission to Content Manager role",
          },
          {
            id: "6",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            userId: "user1",
            userName: "John Smith",
            userRole: "school_admin",
            organizationId: "org1",
            organizationName: "Sunshine Academy",
            action: "settings.change",
            resource: "settings",
            ipAddress: "192.168.1.100",
            userAgent: "Chrome/120.0.0.0",
            status: "success",
            details: "Updated organization settings: enabled 2FA requirement",
            changes: {
              twoFactorRequired: { old: false, new: true },
            },
          },
          {
            id: "7",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            userId: "system",
            userName: "System",
            userRole: "system",
            organizationId: "system",
            organizationName: "System",
            action: "api.access",
            resource: "api",
            ipAddress: "api.external.com",
            userAgent: "API Client/1.0",
            status: "warning",
            details: "Rate limit exceeded for API key: sk-...abc123",
          },
        ];

        setLogs(mockLogs);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuditLogs();
  }, []);

  // Table columns
  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => {
        const date = row.getValue("timestamp") as Date;
        return (
          <div className="text-sm">
            <p>{date.toLocaleDateString()}</p>
            <p className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "userName",
      header: "User",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("userName")}</p>
          <p className="text-xs text-muted-foreground">{row.original.userRole}</p>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.getValue("action") as string;
        const getActionIcon = () => {
          if (action.includes("login")) return <LogIn className="w-3 h-3" />;
          if (action.includes("logout")) return <LogOut className="w-3 h-3" />;
          if (action.includes("create")) return <Plus className="w-3 h-3" />;
          if (action.includes("update")) return <Edit className="w-3 h-3" />;
          if (action.includes("delete")) return <Trash2 className="w-3 h-3" />;
          if (action.includes("permission")) return <Shield className="w-3 h-3" />;
          if (action.includes("export")) return <Download className="w-3 h-3" />;
          if (action.includes("settings")) return <Settings className="w-3 h-3" />;
          return <Activity className="w-3 h-3" />;
        };
        return (
          <div className="flex items-center gap-2">
            {getActionIcon()}
            <span className="text-sm">{action}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "resource",
      header: "Resource",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("resource")}
        </Badge>
      ),
    },
    {
      accessorKey: "organizationName",
      header: "Organization",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("organizationName")}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const icons = {
          success: <CheckCircle2 className="w-3 h-3" />,
          failed: <XCircle className="w-3 h-3" />,
          warning: <AlertTriangle className="w-3 h-3" />,
        };
        const variants: Record<string, "default" | "destructive" | "secondary"> = {
          success: "default",
          failed: "destructive",
          warning: "secondary",
        };
        return (
          <Badge variant={variants[status]}>
            {icons[status]}
            <span className="ml-1">{status}</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
      cell: ({ row }) => (
        <span className="text-xs font-mono">{row.getValue("ipAddress")}</span>
      ),
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => {
        const details = row.getValue("details") as string;
        const changes = row.original.changes;
        return (
          <div className="max-w-xs">
            <p className="text-sm truncate">{details}</p>
            {changes && (
              <div className="mt-1">
                {Object.entries(changes).map(([key, value]) => (
                  <p key={key} className="text-xs text-muted-foreground">
                    {key}: {value.old} → {value.new}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Calculate statistics
  const totalLogs = logs.length;
  const successLogs = logs.filter(l => l.status === "success").length;
  const failedLogs = logs.filter(l => l.status === "failed").length;
  const warningLogs = logs.filter(l => l.status === "warning").length;

  // Group logs by action type
  const actionCounts = logs.reduce((acc, log) => {
    const actionType = log.action.split('.')[0];
    acc[actionType] = (acc[actionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track and review all system activities and changes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Search
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{totalLogs}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold">{successLogs}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((successLogs / totalLogs) * 100).toFixed(1)}% success rate
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{failedLogs}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires attention
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold">{warningLogs}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitor closely
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>Actions performed in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(actionCounts).map(([action, count]) => (
              <div key={action} className="text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{action} actions</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            All system activities and user actions
          </CardDescription>
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
            columns={columns}
            data={logs}
            searchKey="userName"
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}