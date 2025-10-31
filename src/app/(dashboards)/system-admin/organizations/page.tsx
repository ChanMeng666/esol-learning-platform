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
import { Progress } from "@/components/ui/progress";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Shield,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Organization {
  id: string;
  name: string;
  type: "school" | "institution" | "corporate";
  plan: "free" | "basic" | "premium" | "enterprise";
  status: "active" | "suspended" | "trial" | "inactive";
  userCount: number;
  maxUsers: number;
  storageUsed: number;
  maxStorage: number;
  createdAt: Date;
  expiresAt?: Date;
  owner: string;
  ownerEmail: string;
}

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    id: "type",
    label: "Organization Type",
    type: "multiselect",
    options: [
      { value: "school", label: "School" },
      { value: "institution", label: "Institution" },
      { value: "corporate", label: "Corporate" },
    ],
  },
  {
    id: "plan",
    label: "Plan",
    type: "multiselect",
    options: [
      { value: "free", label: "Free" },
      { value: "basic", label: "Basic" },
      { value: "premium", label: "Premium" },
      { value: "enterprise", label: "Enterprise" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "suspended", label: "Suspended" },
      { value: "trial", label: "Trial" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];

export default function SystemAdminOrganizationsPage() {
  return (
    <ProtectedRoute>
      <OrganizationsPageContent />
    </ProtectedRoute>
  );
}

function OrganizationsPageContent() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        // Mock data - replace with actual API call
        const mockOrgs: Organization[] = [
          {
            id: "1",
            name: "Sunshine Academy",
            type: "school",
            plan: "premium",
            status: "active",
            userCount: 150,
            maxUsers: 500,
            storageUsed: 2.4,
            maxStorage: 10,
            createdAt: new Date(2024, 0, 15),
            owner: "John Smith",
            ownerEmail: "john@sunshineacademy.edu",
          },
          {
            id: "2",
            name: "Riverside School",
            type: "school",
            plan: "basic",
            status: "active",
            userCount: 75,
            maxUsers: 100,
            storageUsed: 1.2,
            maxStorage: 5,
            createdAt: new Date(2024, 1, 1),
            owner: "Jane Doe",
            ownerEmail: "jane@riverside.edu",
          },
          {
            id: "3",
            name: "Tech Training Corp",
            type: "corporate",
            plan: "enterprise",
            status: "active",
            userCount: 320,
            maxUsers: 1000,
            storageUsed: 8.5,
            maxStorage: 50,
            createdAt: new Date(2023, 10, 20),
            owner: "Mike Johnson",
            ownerEmail: "mike@techtraining.com",
          },
          {
            id: "4",
            name: "Demo Organization",
            type: "institution",
            plan: "free",
            status: "trial",
            userCount: 10,
            maxUsers: 20,
            storageUsed: 0.1,
            maxStorage: 1,
            createdAt: new Date(2024, 2, 10),
            expiresAt: new Date(2024, 3, 10),
            owner: "Test User",
            ownerEmail: "test@demo.com",
          },
        ];

        setOrganizations(mockOrgs);
      } catch (error) {
        console.error("Failed to load organizations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  // Table columns
  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: "name",
      header: "Organization",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          <p className="text-sm text-muted-foreground">{row.original.ownerEmail}</p>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("type")}
        </Badge>
      ),
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => {
        const plan = row.getValue("plan") as string;
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          free: "outline",
          basic: "secondary",
          premium: "default",
          enterprise: "default",
        };
        return (
          <Badge variant={variants[plan]} className="capitalize">
            {plan}
          </Badge>
        );
      },
    },
    {
      accessorKey: "userCount",
      header: "Users",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.userCount}/{row.original.maxUsers}</span>
          <Progress
            value={(row.original.userCount / row.original.maxUsers) * 100}
            className="w-16 h-2"
          />
        </div>
      ),
    },
    {
      accessorKey: "storageUsed",
      header: "Storage",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.storageUsed}GB/{row.original.maxStorage}GB</span>
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
          suspended: <AlertCircle className="w-3 h-3 mr-1" />,
          trial: <Calendar className="w-3 h-3 mr-1" />,
          inactive: <AlertCircle className="w-3 h-3 mr-1" />,
        };
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          active: "default",
          suspended: "destructive",
          trial: "secondary",
          inactive: "outline",
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
            onClick={() => setSelectedOrg(row.original)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/system-admin/organizations/${row.original.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Calculate statistics
  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter(org => org.status === "active").length;
  const totalUsers = organizations.reduce((sum, org) => sum + org.userCount, 0);
  const totalStorage = organizations.reduce((sum, org) => sum + org.storageUsed, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage all platform organizations and their settings
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
          <Button onClick={() => router.push("/system-admin/organizations/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
                <p className="text-2xl font-bold">{totalOrgs}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeOrgs}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold">{totalStorage.toFixed(1)}GB</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Organizations</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="trial">Trial</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Management</CardTitle>
              <CardDescription>
                View and manage all organizations on the platform
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
                data={organizations}
                searchKey="name"
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={columns}
                data={organizations.filter(org => org.status === "active")}
                searchKey="name"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trial">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={columns}
                data={organizations.filter(org => org.status === "trial")}
                searchKey="name"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspended">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={columns}
                data={organizations.filter(org => org.status === "suspended")}
                searchKey="name"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Organization Details Modal */}
      {selectedOrg && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedOrg.name} Details</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrg(null)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-medium">{selectedOrg.owner}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedOrg.ownerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <Badge className="mt-1">{selectedOrg.plan}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="mt-1">{selectedOrg.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}