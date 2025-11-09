"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Users,
  User,
  Shield,
  Building2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getUsersByOrganization, updateUserRole, deactivateUser, reactivateUser } from "@/actions/users";
import { getAllOrganizations } from "@/actions/organizations";
import { type UserRole } from "@/types/navigation";

interface UserWithOrg {
  id: bigint;
  organizationId: bigint;
  stackUserId: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  organizationName?: string;
}

export default function SystemAdminUsersPage() {
  return (
    <ProtectedRoute>
      <UsersPageContent />
    </ProtectedRoute>
  );
}

function UsersPageContent() {
  const [users, setUsers] = useState<UserWithOrg[]>([]);
  const [organizations, setOrganizations] = useState<{ id: bigint; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);

      // Load all organizations
      const orgs = await getAllOrganizations();
      setOrganizations(orgs);

      // Load users from all organizations
      const allUsers: UserWithOrg[] = [];
      for (const org of orgs) {
        try {
          const orgUsers = await getUsersByOrganization(org.id);
          const usersWithOrgName = orgUsers.map((user) => ({
            ...user,
            organizationName: org.name,
          }));
          allUsers.push(...usersWithOrgName);
        } catch (error) {
          console.error(`Failed to load users for org ${org.id}:`, error);
        }
      }

      setUsers(allUsers);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateRole(userId: bigint, newRole: UserRole) {
    try {
      await updateUserRole(userId, newRole);
      toast.success("User role updated successfully");
      loadData();
    } catch (error: any) {
      console.error("Failed to update user role:", error);
      toast.error(error.message || "Failed to update user role");
    }
  }

  async function handleToggleUserStatus(userId: bigint, isActive: boolean) {
    try {
      if (isActive) {
        await deactivateUser(userId);
        toast.success("User deactivated successfully");
      } else {
        await reactivateUser(userId);
        toast.success("User reactivated successfully");
      }
      loadData();
    } catch (error: any) {
      console.error("Failed to toggle user status:", error);
      toast.error(error.message || "Failed to update user status");
    }
  }

  // Filter users
  const filteredUsers = users.filter((user) => {
    if (selectedRole !== "all" && user.role !== selectedRole) return false;
    if (selectedOrg !== "all" && user.organizationId.toString() !== selectedOrg) return false;
    if (selectedStatus !== "all") {
      if (selectedStatus === "active" && !user.isActive) return false;
      if (selectedStatus === "inactive" && user.isActive) return false;
    }
    return true;
  });

  // Table columns
  const columns: ColumnDef<UserWithOrg>[] = [
    {
      accessorKey: "fullName",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {row.original.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.fullName}</p>
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "organizationName",
      header: "Organization",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.organizationName || "Unknown"}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const roleLabels: Record<string, string> = {
          student: "Student",
          teacher: "Teacher",
          parent: "Parent",
          department_head: "Department Head",
          school_admin: "School Admin",
          system_admin: "System Admin",
        };
        const roleIcons: Record<string, any> = {
          system_admin: Shield,
          school_admin: Building2,
          department_head: Users,
          teacher: User,
          student: User,
          parent: User,
        };
        const Icon = roleIcons[role] || User;
        return (
          <Badge variant="outline" className="gap-1">
            <Icon className="h-3 w-3" />
            {roleLabels[role] || role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(date).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Select
            value={row.original.role}
            onValueChange={(value) => handleUpdateRole(row.original.id, value as UserRole)}
          >
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="department_head">Department Head</SelectItem>
              <SelectItem value="school_admin">School Admin</SelectItem>
              <SelectItem value="system_admin">System Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleUserStatus(row.original.id, row.original.isActive)}
          >
            {row.original.isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminUsers = users.filter(
    (u) => u.role === "system_admin" || u.role === "school_admin"
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="inline-block animate-spin h-12 w-12 text-primary" />
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
          <p className="text-muted-foreground">Manage all users across organizations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Administrators</p>
                <p className="text-2xl font-bold">{adminUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="department_head">Department Head</SelectItem>
                  <SelectItem value="school_admin">School Admin</SelectItem>
                  <SelectItem value="system_admin">System Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Organization</Label>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id.toString()} value={org.id.toString()}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>View and manage user roles and status</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredUsers} searchKey="fullName" pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
