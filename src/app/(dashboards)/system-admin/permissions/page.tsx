"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  Users,
  Key,
  Lock,
  Unlock,
  Settings,
  Edit,
  Plus,
  Save,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  FileKey,
  Copy,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Role {
  id: string;
  name: string;
  description: string;
  type: "system" | "organization" | "custom";
  userCount: number;
  permissions: string[];
  createdAt: Date;
  modifiedAt: Date;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
  risk: "low" | "medium" | "high";
}

export default function PermissionsPage() {
  return (
    <ProtectedRoute>
      <PermissionsContent />
    </ProtectedRoute>
  );
}

function PermissionsContent() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loadPermissionData = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockRoles: Role[] = [
          {
            id: "1",
            name: "System Administrator",
            description: "Full system access with all permissions",
            type: "system",
            userCount: 2,
            permissions: ["*"],
            createdAt: new Date(2023, 0, 1),
            modifiedAt: new Date(2024, 2, 1),
          },
          {
            id: "2",
            name: "School Administrator",
            description: "Manage school-level operations and users",
            type: "organization",
            userCount: 15,
            permissions: [
              "users.create", "users.read", "users.update",
              "classes.manage", "reports.view", "settings.school"
            ],
            createdAt: new Date(2023, 0, 1),
            modifiedAt: new Date(2024, 1, 15),
          },
          {
            id: "3",
            name: "Teacher",
            description: "Manage classes and student progress",
            type: "organization",
            userCount: 142,
            permissions: [
              "classes.view", "students.view", "assignments.manage",
              "grades.manage", "reports.class"
            ],
            createdAt: new Date(2023, 0, 1),
            modifiedAt: new Date(2024, 0, 20),
          },
          {
            id: "4",
            name: "Student",
            description: "Access learning materials and view progress",
            type: "organization",
            userCount: 1250,
            permissions: [
              "practice.access", "progress.view.own", "assignments.submit"
            ],
            createdAt: new Date(2023, 0, 1),
            modifiedAt: new Date(2023, 11, 10),
          },
          {
            id: "5",
            name: "Parent",
            description: "View child's progress and communicate with teachers",
            type: "organization",
            userCount: 892,
            permissions: [
              "children.view", "progress.view.children", "messages.send"
            ],
            createdAt: new Date(2023, 0, 1),
            modifiedAt: new Date(2023, 10, 5),
          },
          {
            id: "6",
            name: "Content Manager",
            description: "Manage learning content and questions",
            type: "custom",
            userCount: 5,
            permissions: [
              "content.create", "content.edit", "content.delete",
              "questions.manage", "curriculum.edit"
            ],
            createdAt: new Date(2023, 6, 15),
            modifiedAt: new Date(2024, 2, 10),
          },
        ];

        const mockPermissions: Permission[] = [
          // User Management
          { id: "1", name: "users.create", category: "User Management", description: "Create new users", risk: "medium" },
          { id: "2", name: "users.read", category: "User Management", description: "View user information", risk: "low" },
          { id: "3", name: "users.update", category: "User Management", description: "Update user details", risk: "medium" },
          { id: "4", name: "users.delete", category: "User Management", description: "Delete users", risk: "high" },
          { id: "5", name: "users.suspend", category: "User Management", description: "Suspend user accounts", risk: "high" },

          // Class Management
          { id: "6", name: "classes.manage", category: "Class Management", description: "Full class management", risk: "medium" },
          { id: "7", name: "classes.view", category: "Class Management", description: "View class information", risk: "low" },
          { id: "8", name: "students.view", category: "Class Management", description: "View student information", risk: "low" },

          // Content Management
          { id: "9", name: "content.create", category: "Content", description: "Create learning content", risk: "medium" },
          { id: "10", name: "content.edit", category: "Content", description: "Edit learning content", risk: "medium" },
          { id: "11", name: "content.delete", category: "Content", description: "Delete learning content", risk: "high" },
          { id: "12", name: "questions.manage", category: "Content", description: "Manage question banks", risk: "medium" },

          // System Administration
          { id: "13", name: "system.config", category: "System", description: "System configuration", risk: "high" },
          { id: "14", name: "audit.view", category: "System", description: "View audit logs", risk: "low" },
          { id: "15", name: "database.access", category: "System", description: "Direct database access", risk: "high" },
          { id: "16", name: "api.manage", category: "System", description: "API key management", risk: "high" },

          // Reports & Analytics
          { id: "17", name: "reports.view", category: "Reports", description: "View reports", risk: "low" },
          { id: "18", name: "reports.export", category: "Reports", description: "Export reports", risk: "low" },
          { id: "19", name: "analytics.full", category: "Reports", description: "Full analytics access", risk: "medium" },
        ];

        setRoles(mockRoles);
        setPermissions(mockPermissions);
        setSelectedRole(mockRoles[0]);
      } catch (error) {
        console.error("Failed to load permission data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissionData();
  }, []);

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: "default",
      medium: "secondary",
      high: "destructive",
    };
    return <Badge variant={colors[risk as keyof typeof colors] as any}>{risk}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "system":
        return <ShieldAlert className="w-4 h-4" />;
      case "organization":
        return <ShieldCheck className="w-4 h-4" />;
      case "custom":
        return <Shield className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Permissions & Roles</h1>
          <p className="text-muted-foreground">
            Manage system roles and access permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Clone Role
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Roles</p>
                <p className="text-2xl font-bold">{roles.filter(r => r.type === "system").length}</p>
              </div>
              <ShieldAlert className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Custom Roles</p>
                <p className="text-2xl font-bold">{roles.filter(r => r.type === "custom").length}</p>
              </div>
              <Settings className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Permissions</p>
                <p className="text-2xl font-bold">{permissions.length}</p>
              </div>
              <Key className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Select a role to view and edit permissions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {roles.map(role => (
                <div
                  key={role.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    selectedRole?.id === role.id ? "bg-muted" : ""
                  }`}
                  onClick={() => {
                    setSelectedRole(role);
                    setEditMode(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(role.type)}
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-sm text-muted-foreground">{role.userCount} users</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {role.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Details & Permissions */}
        <Card className="lg:col-span-2">
          {selectedRole ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getTypeIcon(selectedRole.type)}
                      {selectedRole.name}
                    </CardTitle>
                    <CardDescription>{selectedRole.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {editMode ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                        <Button size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setEditMode(true)}
                        disabled={selectedRole.type === "system"}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Permissions
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="permissions" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                  </TabsList>

                  <TabsContent value="permissions" className="space-y-4">
                    {selectedRole.permissions[0] === "*" ? (
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-500" />
                          This role has full system permissions
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Array.from(new Set(permissions.map(p => p.category))).map(category => (
                          <div key={category}>
                            <h4 className="font-medium mb-3">{category}</h4>
                            <div className="space-y-2">
                              {permissions
                                .filter(p => p.category === category)
                                .map(permission => (
                                  <div
                                    key={permission.id}
                                    className="flex items-center justify-between p-3 rounded-lg border"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Checkbox
                                        checked={selectedRole.permissions.includes(permission.name)}
                                        disabled={!editMode || selectedRole.type === "system"}
                                      />
                                      <div>
                                        <p className="text-sm font-medium">{permission.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {permission.description}
                                        </p>
                                      </div>
                                    </div>
                                    {getRiskBadge(permission.risk)}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Role Type</Label>
                        <p className="font-medium capitalize">{selectedRole.type}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">User Count</Label>
                        <p className="font-medium">{selectedRole.userCount} users</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Created</Label>
                        <p className="font-medium">{selectedRole.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Last Modified</Label>
                        <p className="font-medium">{selectedRole.modifiedAt.toLocaleDateString()}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Permission Count</Label>
                        <p className="font-medium">
                          {selectedRole.permissions[0] === "*"
                            ? "All permissions"
                            : `${selectedRole.permissions.length} permissions`}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="users">
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3" />
                      <p>User list for this role</p>
                      <p className="text-sm">Feature coming soon</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Select a role to view details</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}