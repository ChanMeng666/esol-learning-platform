"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  Shield,
  Users,
  User,
  Building2,
  GraduationCap,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define standard role permissions based on the application's RBAC model
interface RoleDefinition {
  role: string;
  name: string;
  description: string;
  icon: any;
  permissions: string[];
}

const roleDefinitions: RoleDefinition[] = [
  {
    role: "system_admin",
    name: "System Administrator",
    description: "Full platform access across all organizations",
    icon: Shield,
    permissions: [
      "Manage all organizations",
      "Manage all users",
      "Configure platform settings",
      "View system health and logs",
      "Manage permissions",
      "Create invitation codes",
    ],
  },
  {
    role: "school_admin",
    name: "School Administrator",
    description: "Full access within assigned organization",
    icon: Building2,
    permissions: [
      "Manage organization settings",
      "Manage organization users",
      "Create departments",
      "Create classes",
      "View organization analytics",
      "Manage assignments",
    ],
  },
  {
    role: "department_head",
    name: "Department Head",
    description: "Manage department-level operations",
    icon: Users,
    permissions: [
      "Manage department classes",
      "View department teachers",
      "View department students",
      "Access department analytics",
    ],
  },
  {
    role: "teacher",
    name: "Teacher",
    description: "Manage classes and student progress",
    icon: GraduationCap,
    permissions: [
      "Manage assigned classes",
      "Create assignments",
      "Grade student work",
      "View student progress",
      "Review speaking assessments",
      "Access class analytics",
    ],
  },
  {
    role: "student",
    name: "Student",
    description: "Access learning materials and track progress",
    icon: User,
    permissions: [
      "Access practice modules",
      "Submit assignments",
      "View own progress",
      "Use AI speaking coach",
      "Take diagnostic tests",
      "View achievements",
    ],
  },
  {
    role: "parent",
    name: "Parent",
    description: "Monitor children's learning progress",
    icon: UserCheck,
    permissions: [
      "View children's progress",
      "View children's assignments",
      "View speaking progress",
      "Access progress reports",
      "View activity and attendance",
      "Send messages to teachers",
    ],
  },
];

export default function PermissionsPage() {
  return (
    <ProtectedRoute>
      <PermissionsContent />
    </ProtectedRoute>
  );
}

function PermissionsContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground">
          View role definitions and their associated permissions
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Role-Based Access Control (RBAC)</AlertTitle>
        <AlertDescription>
          The platform uses a role-based permission system. User roles are managed through the User
          Management page. Permissions are automatically assigned based on user roles.
        </AlertDescription>
      </Alert>

      {/* Roles Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {roleDefinitions.map((roleDef) => {
          const Icon = roleDef.icon;
          return (
            <Card key={roleDef.role}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{roleDef.name}</CardTitle>
                    <CardDescription>{roleDef.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{roleDef.role}</Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Permissions:</h4>
                    <ul className="space-y-1">
                      {roleDef.permissions.map((permission, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions Matrix</CardTitle>
          <CardDescription>Quick reference for role capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Capability</TableHead>
                  <TableHead className="text-center">System Admin</TableHead>
                  <TableHead className="text-center">School Admin</TableHead>
                  <TableHead className="text-center">Department Head</TableHead>
                  <TableHead className="text-center">Teacher</TableHead>
                  <TableHead className="text-center">Student</TableHead>
                  <TableHead className="text-center">Parent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Manage Organizations</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Manage Users</TableCell>
                  <TableCell className="text-center">✓ All</TableCell>
                  <TableCell className="text-center">✓ Org</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Manage Classes</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">✓ Dept</TableCell>
                  <TableCell className="text-center">✓ Own</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Create Assignments</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Grade Assignments</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Access Practice Modules</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">✓</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">View Student Progress</TableCell>
                  <TableCell className="text-center">✓ All</TableCell>
                  <TableCell className="text-center">✓ Org</TableCell>
                  <TableCell className="text-center">✓ Dept</TableCell>
                  <TableCell className="text-center">✓ Class</TableCell>
                  <TableCell className="text-center">✓ Own</TableCell>
                  <TableCell className="text-center">✓ Child</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">View Analytics</TableCell>
                  <TableCell className="text-center">✓ All</TableCell>
                  <TableCell className="text-center">✓ Org</TableCell>
                  <TableCell className="text-center">✓ Dept</TableCell>
                  <TableCell className="text-center">✓ Class</TableCell>
                  <TableCell className="text-center">✓ Own</TableCell>
                  <TableCell className="text-center">✓ Child</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium mb-1">Legend:</p>
            <ul className="space-y-1 ml-4">
              <li>✓ - Full access</li>
              <li>✓ All - Access across all organizations</li>
              <li>✓ Org - Access within own organization</li>
              <li>✓ Dept - Access within own department</li>
              <li>✓ Class - Access to own classes</li>
              <li>✓ Own - Access to own data only</li>
              <li>✓ Child - Access to children's data</li>
              <li>- - No access</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
