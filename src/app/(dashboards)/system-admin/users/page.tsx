"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { AdvancedFilter, type FilterConfig, type FilterValue } from "@/components/filters/advanced-filter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Users,
  User,
  Shield,
  Building2,
  Calendar,
  Activity,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  MoreVertical,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Key,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "parent" | "department_head" | "school_admin" | "system_admin";
  organizationId: string;
  organizationName: string;
  status: "active" | "inactive" | "suspended" | "pending";
  createdAt: Date;
  lastLogin?: Date;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  avatar?: string;
}

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    id: "role",
    label: "User Role",
    type: "multiselect",
    options: [
      { value: "student", label: "Student" },
      { value: "teacher", label: "Teacher" },
      { value: "parent", label: "Parent" },
      { value: "department_head", label: "Department Head" },
      { value: "school_admin", label: "School Admin" },
      { value: "system_admin", label: "System Admin" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "suspended", label: "Suspended" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    id: "organization",
    label: "Organization",
    type: "multiselect",
    options: [], // Will be populated from data
  },
  {
    id: "emailVerified",
    label: "Email Verified",
    type: "select",
    options: [
      { value: "true", label: "Verified" },
      { value: "false", label: "Not Verified" },
    ],
  },
];

export default function SystemAdminUsersPage() {
  return (
    <ProtectedRoute>
      <UsersPageContent />
    </ProtectedRoute>
  );
}

function UsersPageContent() {
  const router = useRouter();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Mock data - replace with actual API call
        const mockUsers: SystemUser[] = [
          {
            id: "1",
            name: "John Smith",
            email: "john@sunshineacademy.edu",
            role: "school_admin",
            organizationId: "org1",
            organizationName: "Sunshine Academy",
            status: "active",
            createdAt: new Date(2024, 0, 15),
            lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
            emailVerified: true,
            twoFactorEnabled: true,
          },
          {
            id: "2",
            name: "Alice Johnson",
            email: "alice@student.edu",
            role: "student",
            organizationId: "org1",
            organizationName: "Sunshine Academy",
            status: "active",
            createdAt: new Date(2024, 1, 20),
            lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
            emailVerified: true,
            twoFactorEnabled: false,
          },
          {
            id: "3",
            name: "Ms. Smith",
            email: "smith@sunshineacademy.edu",
            role: "teacher",
            organizationId: "org1",
            organizationName: "Sunshine Academy",
            status: "active",
            createdAt: new Date(2023, 10, 10),
            lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000),
            emailVerified: true,
            twoFactorEnabled: false,
          },
          {
            id: "4",
            name: "Admin User",
            email: "admin@system.com",
            role: "system_admin",
            organizationId: "system",
            organizationName: "System",
            status: "active",
            createdAt: new Date(2023, 0, 1),
            lastLogin: new Date(),
            emailVerified: true,
            twoFactorEnabled: true,
          },
          {
            id: "5",
            name: "Pending User",
            email: "pending@demo.com",
            role: "student",
            organizationId: "org2",
            organizationName: "Demo Organization",
            status: "pending",
            createdAt: new Date(2024, 2, 10),
            emailVerified: false,
            twoFactorEnabled: false,
          },
        ];

        setUsers(mockUsers);

        // Update filter options with unique organizations
        const uniqueOrgs = Array.from(new Set(mockUsers.map(u => u.organizationName)));
        filterConfig[2].options = uniqueOrgs.map(org => ({
          value: org,
          label: org,
        }));
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Table columns
  const columns: ColumnDef<SystemUser>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback>
              {row.original.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.getValue("name")}</p>
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const roleColors: Record<string, string> = {
          system_admin: "destructive",
          school_admin: "default",
          department_head: "secondary",
          teacher: "outline",
          parent: "outline",
          student: "outline",
        };
        return (
          <Badge variant={roleColors[role] as any} className="capitalize">
            {role.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: "organizationName",
      header: "Organization",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          {row.getValue("organizationName")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const icons = {
          active: <CheckCircle2 className="w-3 h-3 mr-1" />,
          inactive: <UserX className="w-3 h-3 mr-1" />,
          suspended: <Lock className="w-3 h-3 mr-1" />,
          pending: <AlertCircle className="w-3 h-3 mr-1" />,
        };
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          active: "default",
          inactive: "secondary",
          suspended: "destructive",
          pending: "outline",
        };
        return (
          <Badge variant={variants[status]}>
            {icons[status]}
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "emailVerified",
      header: "Verification",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.emailVerified && (
            <Badge variant="outline" className="text-xs">
              <UserCheck className="w-3 h-3 mr-1" />
              Email
            </Badge>
          )}
          {row.original.twoFactorEnabled && (
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              2FA
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => {
        const lastLogin = row.getValue("lastLogin") as Date | undefined;
        if (!lastLogin) return <span className="text-muted-foreground">Never</span>;

        const hoursAgo = Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60));
        if (hoursAgo < 24) {
          return `${hoursAgo}h ago`;
        }
        return lastLogin.toLocaleDateString();
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/system-admin/users/${row.original.id}`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("Reset password:", row.original.id)}
          >
            <Key className="w-4 h-4" />
          </Button>
          {row.original.status === "active" ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Suspend:", row.original.id)}
            >
              <Lock className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("Activate:", row.original.id)}
            >
              <Unlock className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const verifiedUsers = users.filter(u => u.emailVerified).length;
  const twoFactorUsers = users.filter(u => u.twoFactorEnabled).length;

  // Group users by role for stats
  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all platform users across organizations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Users
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push("/system-admin/users/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeUsers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{verifiedUsers}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">2FA Enabled</p>
                <p className="text-2xl font-bold">{twoFactorUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users by Role */}
      <Card>
        <CardHeader>
          <CardTitle>Users by Role</CardTitle>
          <CardDescription>Distribution of users across different roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Object.entries(usersByRole).map(([role, count]) => (
              <div key={role} className="text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{role.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage all users in the system
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
            data={users}
            searchKey="name"
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}