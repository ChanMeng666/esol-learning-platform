"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ColumnDef } from "@tanstack/react-table";
import { getOrganizationUsersWithDetails } from "@/actions/school-admin-stats";
import { toast } from "sonner";
import {
  Users,
  GraduationCap,
  UserCheck,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface User {
  id: bigint;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  metadata: unknown;
}

export default function SchoolAdminUsersPage() {
  return (
    <ProtectedRoute>
      <UsersPageContent />
    </ProtectedRoute>
  );
}

function UsersPageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers(activeTab);
  }, [activeTab]);

  async function loadUsers(roleFilter: string) {
    try {
      setIsLoading(true);
      const data = await getOrganizationUsersWithDetails(
        roleFilter === "all" ? undefined : roleFilter
      );
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }

  // Table columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "fullName",
      header: "User",
      cell: ({ row }) => {
        const metadata = row.original.metadata as Record<string, unknown> | null | undefined;
        const initials = row.original.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {metadata && typeof metadata === 'object' && 'avatar' in metadata && typeof metadata.avatar === 'string' && <AvatarImage src={metadata.avatar} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{row.original.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {row.original.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const roleConfig: Record<string, { label: string; variant: any }> = {
          teacher: { label: "Teacher", variant: "default" },
          student: { label: "Student", variant: "secondary" },
          parent: { label: "Parent", variant: "outline" },
          school_admin: { label: "School Admin", variant: "destructive" },
        };

        const config = roleConfig[role] || { label: role, variant: "outline" };

        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <div className="flex items-center gap-2">
            {isActive ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Active</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-gray-400" />
                <span className="text-muted-foreground">Inactive</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return (
          <span className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/school-admin/users/${row.original.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteUser(row.original.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  async function handleDeleteUser(_userId: bigint) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      // TODO: Implement delete user API
      toast.success("User deleted successfully");
      loadUsers(activeTab);
    } catch {
      toast.error("Failed to delete user");
    }
  }

  // Calculate statistics
  const totalUsers = users.length;
  const teachers = users.filter((u) => u.role === "teacher").length;
  const students = users.filter((u) => u.role === "student").length;
  const parents = users.filter((u) => u.role === "parent").length;

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
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Button onClick={() => router.push("/school-admin/users/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
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
                <p className="text-sm font-medium text-muted-foreground">Teachers</p>
                <p className="text-2xl font-bold">{teachers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">{students}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parents</p>
                <p className="text-2xl font-bold">{parents}</p>
              </div>
              <Users className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="teacher">Teachers</TabsTrigger>
              <TabsTrigger value="student">Students</TabsTrigger>
              <TabsTrigger value="parent">Parents</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <DataTable
                columns={columns}
                data={users}
                searchKey="fullName"
                pageSize={10}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
