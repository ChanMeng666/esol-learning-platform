"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldOff, Lock, AlertTriangle } from "lucide-react";

// Define user roles
export type UserRole =
  | "student"
  | "teacher"
  | "parent"
  | "school-admin"
  | "department-head"
  | "system-admin";

// Define permissions for features
export interface Permission {
  view?: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  export?: boolean;
  manage?: boolean;
}

// Define feature permissions map
export const FEATURE_PERMISSIONS: Record<string, Record<UserRole, Permission>> = {
  // Calendar permissions
  calendar: {
    student: { view: true },
    teacher: { view: true, create: true, edit: true, delete: true },
    parent: { view: true },
    "school-admin": { view: true, create: true, edit: true, delete: true, manage: true },
    "department-head": { view: true, create: true, edit: true, delete: true },
    "system-admin": { view: true, manage: true }
  },

  // Spreadsheet/Grades permissions
  grades: {
    student: { view: true },
    teacher: { view: true, create: true, edit: true, export: true },
    parent: { view: true },
    "school-admin": { view: true, export: true, manage: true },
    "department-head": { view: true, export: true },
    "system-admin": { view: true, manage: true }
  },

  // Data table permissions
  studentData: {
    student: { view: false },
    teacher: { view: true, export: true },
    parent: { view: false },
    "school-admin": { view: true, create: true, edit: true, delete: true, export: true },
    "department-head": { view: true, export: true },
    "system-admin": { view: true, manage: true }
  },

  // Analytics permissions
  analytics: {
    student: { view: true }, // Limited to own data
    teacher: { view: true, export: true },
    parent: { view: true }, // Limited to children's data
    "school-admin": { view: true, export: true, manage: true },
    "department-head": { view: true, export: true },
    "system-admin": { view: true, export: true, manage: true }
  },

  // CopilotKit AI features
  aiFeatures: {
    student: { view: true, create: true }, // Can use AI for learning
    teacher: { view: true, create: true, manage: true }, // Can configure AI for class
    parent: { view: true }, // Can view AI interactions
    "school-admin": { view: true, manage: true },
    "department-head": { view: true, manage: true },
    "system-admin": { view: true, manage: true }
  },

  // System administration
  systemAdmin: {
    student: { view: false },
    teacher: { view: false },
    parent: { view: false },
    "school-admin": { view: true },
    "department-head": { view: true },
    "system-admin": { view: true, create: true, edit: true, delete: true, manage: true }
  }
};

// Role hierarchy for permission inheritance
const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  "system-admin": ["school-admin", "department-head", "teacher", "parent", "student"],
  "school-admin": ["department-head", "teacher"],
  "department-head": ["teacher"],
  teacher: [],
  parent: [],
  student: []
};

interface RoleBasedWrapperProps {
  children: ReactNode;
  feature: keyof typeof FEATURE_PERMISSIONS;
  permission?: keyof Permission;
  userRole?: UserRole;
  fallback?: ReactNode;
  showError?: boolean;
  customMessage?: string;
}

/**
 * RoleBasedWrapper component for controlling access to features based on user role
 */
export function RoleBasedWrapper({
  children,
  feature,
  permission = "view",
  userRole = "student", // In production, get from auth context
  fallback,
  showError = true,
  customMessage
}: RoleBasedWrapperProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check permission
    const checkPermission = () => {
      const featurePermissions = FEATURE_PERMISSIONS[feature];
      if (!featurePermissions) {
        console.warn(`Feature "${feature}" not found in permissions`);
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      const rolePermissions = featurePermissions[userRole];
      const hasDirectPermission = rolePermissions?.[permission] === true;

      // Check inherited permissions from higher roles
      let hasInheritedPermission = false;
      if (!hasDirectPermission) {
        const inheritedRoles = ROLE_HIERARCHY[userRole] || [];
        hasInheritedPermission = inheritedRoles.some(role => {
          const inheritedPerms = featurePermissions[role];
          return inheritedPerms?.[permission] === true;
        });
      }

      setHasPermission(hasDirectPermission || hasInheritedPermission);
      setIsLoading(false);
    };

    checkPermission();
  }, [feature, permission, userRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showError) {
      return null;
    }

    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
            <div className="p-4 rounded-full bg-destructive/10">
              <ShieldOff className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Access Restricted</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {customMessage || `You don't have permission to ${permission} this ${feature}. Please contact your administrator if you believe this is an error.`}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

/**
 * Hook to check permissions programmatically
 */
export function usePermission(
  feature: keyof typeof FEATURE_PERMISSIONS,
  permission: keyof Permission = "view",
  userRole: UserRole = "student"
): boolean {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const featurePermissions = FEATURE_PERMISSIONS[feature];
    if (!featurePermissions) {
      setHasPermission(false);
      return;
    }

    const rolePermissions = featurePermissions[userRole];
    setHasPermission(rolePermissions?.[permission] === true);
  }, [feature, permission, userRole]);

  return hasPermission;
}

/**
 * Component to conditionally render based on role
 */
interface ConditionalRenderProps {
  children: ReactNode;
  roles: UserRole[];
  userRole?: UserRole;
  fallback?: ReactNode;
}

export function ConditionalRender({
  children,
  roles,
  userRole = "student",
  fallback = null
}: ConditionalRenderProps) {
  if (roles.includes(userRole)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}

/**
 * HOC for protecting components with role-based access
 */
export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  feature: keyof typeof FEATURE_PERMISSIONS,
  requiredPermission: keyof Permission = "view"
) {
  return function ProtectedComponent(props: P & { userRole?: UserRole }) {
    return (
      <RoleBasedWrapper
        feature={feature}
        permission={requiredPermission}
        userRole={props.userRole}
      >
        <Component {...props} />
      </RoleBasedWrapper>
    );
  };
}

/**
 * Utility to get available features for a role
 */
export function getAvailableFeatures(userRole: UserRole): string[] {
  const availableFeatures: string[] = [];

  Object.entries(FEATURE_PERMISSIONS).forEach(([feature, permissions]) => {
    const rolePermissions = permissions[userRole];
    if (rolePermissions && Object.values(rolePermissions).some(p => p === true)) {
      availableFeatures.push(feature);
    }
  });

  return availableFeatures;
}

/**
 * Utility to check if user can perform action
 */
export function canPerformAction(
  userRole: UserRole,
  feature: keyof typeof FEATURE_PERMISSIONS,
  action: keyof Permission
): boolean {
  const featurePermissions = FEATURE_PERMISSIONS[feature];
  if (!featurePermissions) return false;

  const rolePermissions = featurePermissions[userRole];
  return rolePermissions?.[action] === true;
}

/**
 * Permission Badge component
 */
interface PermissionBadgeProps {
  userRole: UserRole;
  feature: keyof typeof FEATURE_PERMISSIONS;
}

export function PermissionBadge({ userRole, feature }: PermissionBadgeProps) {
  const permissions = FEATURE_PERMISSIONS[feature]?.[userRole];
  if (!permissions) return null;

  const permissionList = Object.entries(permissions)
    .filter(([_, allowed]) => allowed)
    .map(([perm]) => perm);

  if (permissionList.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      <Lock className="h-3 w-3 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">
        {permissionList.join(", ")}
      </span>
    </div>
  );
}

/**
 * Feature Access Alert component
 */
interface FeatureAccessAlertProps {
  feature: keyof typeof FEATURE_PERMISSIONS;
  userRole: UserRole;
}

export function FeatureAccessAlert({ feature, userRole }: FeatureAccessAlertProps) {
  const permissions = FEATURE_PERMISSIONS[feature]?.[userRole];

  if (!permissions || Object.values(permissions).every(p => !p)) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription>
          You have limited access to this feature. Some functionality may be restricted.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}