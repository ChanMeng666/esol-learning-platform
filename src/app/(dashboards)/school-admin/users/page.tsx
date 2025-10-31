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
  GraduationCap,
  UserCheck,
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "student" | "parent";
  department?: string;
  status: "active" | "inactive" | "pending";
  joinedDate: Date;
  lastActive?: Date;
  avatar?: string;
  phone?: string;
}

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    id: "department",
    label: "Department",
    type: "multiselect",
    options: [
      { value: "english", label: "English Language" },
      { value: "esol", label: "ESOL Foundation" },
      { value: "advanced", label: "Advanced Studies" },
      { value: "business", label: "Business English" },
    ],
  },
];

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
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Mock data - replace with actual API call
        const mockUsers: User[] = [
          // Teachers
          {
            id: "t1",
            name: "Dr. Michael Anderson",
            email: "m.anderson@school.edu",
            role: "teacher",
            department: "english",
            status: "active",
            joinedDate: new Date(2023, 0, 15),
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
            phone: "(555) 123-4567",
          },
          {
            id: "t2",
            name: "Ms. Jennifer Lee",
            email: "j.lee@school.edu",
            role: "teacher",
            department: "esol",
            status: "active",
            joinedDate: new Date(2023, 2, 10),
            lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
            phone: "(555) 234-5678",
          },
          // Students
          {
            id: "s1",
            name: "Alice Johnson",
            email: "alice.j@student.edu",
            role: "student",
            department: "english",
            status: "active",
            joinedDate: new Date(2024, 1, 1),
            lastActive: new Date(Date.now() - 30 * 60 * 1000),
          },
          {
            id: "s2",
            name: "Bob Smith",
            email: "bob.s@student.edu",
            role: "student",
            department: "esol",
            status: "active",
            joinedDate: new Date(2024, 1, 15),
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          // Parents
          {
            id: "p1",
            name: "Mary Johnson",
            email: "mary.j@parent.com",
            role: "parent",
            status: "active",
            joinedDate: new Date(2024, 1, 1),
            lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
            phone: "(555) 345-6789",
          },
        ];

        setUsers(mockUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Get users by role
  const teachers = users.filter(u => u.role === "teacher");
  const students = users.filter(u => u.role === "student");
  const parents = users.filter(u => u.role === "parent");

  // Table columns
  const columns: ColumnDef<User>[] = [
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
        return (
          <Badge variant="outline" className="capitalize">
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.department && (
            <>
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="capitalize">{row.original.department}</span>
            </>
          )}
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
          inactive: <XCircle className="w-3 h-3 mr-1" />,
          pending: <Clock className="w-3 h-3 mr-1" />,
        };
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
          active: "default",
          inactive: "secondary",
          pending: "secondary",
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
      accessorKey: "joinedDate",
      header: "Joined",
      cell: ({ row }) => {
        const date = row.getValue("joinedDate") as Date;
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => {
        const lastActive = row.getValue("lastActive") as Date | undefined;
        if (!lastActive) return <span className="text-muted-foreground">Never</span>;

        const hoursAgo = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60));
        if (hoursAgo < 1) return "Just now";
        if (hoursAgo < 24) return `${hoursAgo}h ago`;
        const daysAgo = Math.floor(hoursAgo / 24);
        return `${daysAgo}d ago`;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/school-admin/users/${row.original.id}`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("Send email:", row.original.id)}
          >
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const pendingUsers = users.filter(u => u.status === "pending").length;

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
            Manage all school users including teachers, students, and parents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push("/school-admin/users/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                <p className="text-2xl font-bold">{teachers.length}</p>
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
                <p className="text-2xl font-bold">{students.length}</p>
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
                <p className="text-2xl font-bold">{parents.length}</p>
              </div>
              <Users className="h-8 w-8 text-amber-500" />
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
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="parents">Parents</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage all school users</CardDescription>
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
        </TabsContent>

        <TabsContent value="teachers">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={columns}
                data={teachers}
                searchKey="name"
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={columns}
                data={students}
                searchKey="name"
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parents">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={columns}
                data={parents}
                searchKey="name"
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}