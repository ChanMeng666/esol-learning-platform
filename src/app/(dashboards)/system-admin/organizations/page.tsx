"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DataTable } from "@/components/data-table/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "@/actions/organizations";
import { getUsersByOrganization } from "@/actions/users";

interface OrganizationWithStats {
  id: bigint;
  name: string;
  slug: string;
  subscriptionTier: string;
  maxStudents: number | null;
  isActive: boolean;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  userCount?: number;
}

export default function SystemAdminOrganizationsPage() {
  return (
    <ProtectedRoute>
      <OrganizationsPageContent />
    </ProtectedRoute>
  );
}

function OrganizationsPageContent() {
  const [organizations, setOrganizations] = useState<OrganizationWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationWithStats | null>(null);

  useEffect(() => {
    loadOrganizations();
  }, []);

  async function loadOrganizations() {
    try {
      setIsLoading(true);
      const orgs = await getAllOrganizations();

      // Fetch user counts for each organization
      const orgsWithStats = await Promise.all(
        orgs.map(async (org) => {
          try {
            const users = await getUsersByOrganization(org.id);
            return { ...org, userCount: users.length };
          } catch (error) {
            console.error(`Failed to get users for org ${org.id}:`, error);
            return { ...org, userCount: 0 };
          }
        })
      );

      setOrganizations(orgsWithStats);
    } catch (error) {
      console.error("Failed to load organizations:", error);
      toast.error("Failed to load organizations");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateOrganization(data: {
    name: string;
    slug: string;
    subscriptionTier: string;
    maxStudents: string;
    contactEmail: string;
  }) {
    try {
      await createOrganization({
        name: data.name,
        slug: data.slug,
        subscriptionTier: data.subscriptionTier as "basic" | "pro" | "enterprise",
        maxStudents: data.maxStudents ? parseInt(data.maxStudents) : undefined,
        contactEmail: data.contactEmail || undefined,
      });
      toast.success("Organization created successfully");
      setIsCreateDialogOpen(false);
      loadOrganizations();
    } catch (error: any) {
      console.error("Failed to create organization:", error);
      toast.error(error.message || "Failed to create organization");
    }
  }

  async function handleUpdateOrganization(
    orgId: bigint,
    data: Partial<{
      name: string;
      isActive: boolean;
      subscriptionTier: "basic" | "pro" | "enterprise";
      maxStudents: number;
    }>
  ) {
    try {
      await updateOrganization(orgId, data);
      toast.success("Organization updated successfully");
      setEditingOrg(null);
      loadOrganizations();
    } catch (error: any) {
      console.error("Failed to update organization:", error);
      toast.error(error.message || "Failed to update organization");
    }
  }

  async function handleDeleteOrganization(orgId: bigint, orgName: string) {
    if (!confirm(`Are you sure you want to delete "${orgName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteOrganization(orgId);
      toast.success("Organization deleted successfully");
      loadOrganizations();
    } catch (error: any) {
      console.error("Failed to delete organization:", error);
      toast.error(error.message || "Failed to delete organization");
    }
  }

  async function toggleOrganizationStatus(orgId: bigint, currentStatus: boolean) {
    try {
      await updateOrganization(orgId, { isActive: !currentStatus });
      toast.success(`Organization ${currentStatus ? "deactivated" : "activated"} successfully`);
      loadOrganizations();
    } catch (error: any) {
      console.error("Failed to toggle organization status:", error);
      toast.error(error.message || "Failed to update organization status");
    }
  }

  // Table columns
  const columns: ColumnDef<OrganizationWithStats>[] = [
    {
      accessorKey: "name",
      header: "Organization",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          <p className="text-sm text-muted-foreground">{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: "subscriptionTier",
      header: "Subscription",
      cell: ({ row }) => {
        const tier = row.getValue("subscriptionTier") as string;
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          basic: "outline",
          pro: "secondary",
          enterprise: "default",
        };
        return (
          <Badge variant={variants[tier] || "outline"} className="capitalize">
            {tier}
          </Badge>
        );
      },
    },
    {
      accessorKey: "userCount",
      header: "Users",
      cell: ({ row }) => {
        const userCount = row.original.userCount || 0;
        const maxStudents = row.original.maxStudents;
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {userCount}
              {maxStudents && ` / ${maxStudents}`}
            </span>
          </div>
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
                <AlertCircle className="w-3 h-3 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: "contactEmail",
      header: "Contact",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.contactEmail || (
            <span className="text-muted-foreground">No contact</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingOrg(row.original)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              toggleOrganizationStatus(row.original.id, row.original.isActive)
            }
          >
            {row.original.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteOrganization(row.original.id, row.original.name)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  // Calculate statistics
  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter((org) => org.isActive).length;
  const totalUsers = organizations.reduce((sum, org) => sum + (org.userCount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="inline-block animate-spin h-12 w-12 text-primary" />
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
          <p className="text-muted-foreground">Manage platform organizations</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Organization
            </Button>
          </DialogTrigger>
          <CreateOrganizationDialog onSubmit={handleCreateOrganization} />
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
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
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
          <CardDescription>View and manage all organizations on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={organizations} searchKey="name" pageSize={10} />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingOrg && (
        <EditOrganizationDialog
          organization={editingOrg}
          onClose={() => setEditingOrg(null)}
          onSubmit={(data) => handleUpdateOrganization(editingOrg.id, data)}
        />
      )}
    </div>
  );
}

function CreateOrganizationDialog({
  onSubmit,
}: {
  onSubmit: (data: {
    name: string;
    slug: string;
    subscriptionTier: string;
    maxStudents: string;
    contactEmail: string;
  }) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    subscriptionTier: "basic",
    maxStudents: "",
    contactEmail: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }
    onSubmit(formData);
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Organization</DialogTitle>
        <DialogDescription>Add a new organization to the platform</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  name,
                  slug: formData.slug || generateSlug(name),
                });
              }}
              placeholder="Acme School"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="acme-school"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tier">Subscription Tier</Label>
            <Select
              value={formData.subscriptionTier}
              onValueChange={(value) => setFormData({ ...formData, subscriptionTier: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="maxStudents">Max Students</Label>
            <Input
              id="maxStudents"
              type="number"
              value={formData.maxStudents}
              onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
              placeholder="100"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="admin@acme-school.edu"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Organization</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function EditOrganizationDialog({
  organization,
  onClose,
  onSubmit,
}: {
  organization: OrganizationWithStats;
  onClose: () => void;
  onSubmit: (data: Partial<{
    name: string;
    isActive: boolean;
    subscriptionTier: "basic" | "pro" | "enterprise";
    maxStudents: number;
  }>) => void;
}) {
  const [formData, setFormData] = useState<{
    name: string;
    subscriptionTier: "basic" | "pro" | "enterprise";
    maxStudents: string;
    isActive: boolean;
  }>({
    name: organization.name,
    subscriptionTier: organization.subscriptionTier as "basic" | "pro" | "enterprise",
    maxStudents: organization.maxStudents?.toString() || "",
    isActive: organization.isActive,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      subscriptionTier: formData.subscriptionTier,
      maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
      isActive: formData.isActive,
    });
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>Update organization details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Organization Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tier">Subscription Tier</Label>
              <Select
                value={formData.subscriptionTier}
                onValueChange={(value) => setFormData({ ...formData, subscriptionTier: value as "basic" | "pro" | "enterprise" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-maxStudents">Max Students</Label>
              <Input
                id="edit-maxStudents"
                type="number"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
