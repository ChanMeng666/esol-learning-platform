"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { fixLegacyUserRoles, getAllUsersRoleStatus } from "@/actions/fix-user-roles";

export default function FixRolesPage() {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [statusResult, setStatusResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFixRoles = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fixLegacyUserRoles();
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    setError(null);
    setStatusResult(null);

    try {
      const response = await getAllUsersRoleStatus();
      setStatusResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fix User Roles</h1>
          <p className="text-muted-foreground mt-2">
            This tool fixes legacy users who don't have roles in the database. It will set them all to "student" role.
          </p>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Good News!</AlertTitle>
            <AlertDescription>
              The application has been updated to default users without roles to "student" automatically.
              This means your users can already access /dashboard. This tool is optional for cleaning up the database.
            </AlertDescription>
          </Alert>
        </div>

        {/* Check Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Check Current Status</CardTitle>
            <CardDescription>
              First, check how many users need role assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCheckStatus}
              disabled={checkingStatus}
              variant="outline"
            >
              {checkingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Check User Status
            </Button>

            {statusResult && (
              <div className="space-y-3">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Status Report</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-1">
                      <p><strong>Total Users:</strong> {statusResult.totalUsers}</p>
                      <p><strong>Students:</strong> {statusResult.roleDistribution.student}</p>
                      <p><strong>Teachers:</strong> {statusResult.roleDistribution.teacher}</p>
                      <p><strong>School Admins:</strong> {statusResult.roleDistribution.school_admin}</p>
                      <p><strong>System Admins:</strong> {statusResult.roleDistribution.system_admin}</p>
                      <p className="text-red-600 font-bold">
                        <strong>Users Without Roles:</strong> {statusResult.roleDistribution.noRole}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>

                {statusResult.users.length > 0 && (
                  <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold mb-2">All Users:</h3>
                    <div className="space-y-2">
                      {statusResult.users.map((user: any) => (
                        <div
                          key={user.id}
                          className={`p-2 border rounded ${!user.role || user.role === "" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}
                        >
                          <p className="text-sm">
                            <strong>Email:</strong> {user.email}
                          </p>
                          <p className="text-sm">
                            <strong>Name:</strong> {user.fullName}
                          </p>
                          <p className="text-sm">
                            <strong>Role:</strong>{" "}
                            <span className={!user.role || user.role === "" ? "text-red-600 font-bold" : "text-green-600"}>
                              {user.role || "NO ROLE"}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {user.id.toString()} | Stack ID: {user.stackUserId}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fix Roles Section */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Fix Database Roles (Optional)</CardTitle>
            <CardDescription>
              Assign "student" role in database to all users without roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                This updates the database only. Users can already access the application
                because the code now defaults to "student" role for users without roles.
                Running this is optional but recommended for data consistency.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleFixRoles}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fix User Roles
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>
                      <strong>Total users found:</strong> {result.totalFound}
                    </p>
                    <p>
                      <strong>Successfully updated:</strong> {result.summary.successful}
                    </p>
                    <p>
                      <strong>Failed:</strong> {result.summary.failed}
                    </p>

                    {result.results.length > 0 && (
                      <div className="mt-4 border rounded-lg p-4 max-h-64 overflow-y-auto">
                        <h3 className="font-semibold mb-2">Details:</h3>
                        {result.results.map((r: any, idx: number) => (
                          <div
                            key={idx}
                            className={`p-2 mb-2 border rounded ${r.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                          >
                            <p className="text-sm">
                              <strong>Email:</strong> {r.email}
                            </p>
                            <p className="text-sm">
                              <strong>Status:</strong>{" "}
                              <span className={r.success ? "text-green-600" : "text-red-600"}>
                                {r.message}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
