"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { completeRegistration } from "@/actions/registration";
import { getDefaultDashboardRoute } from "@/lib/dashboard-configs";
import type { UserRole } from "@/types/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processRegistration = async () => {
      try {
        // Get pending invitation from sessionStorage
        const pendingInvitationStr = sessionStorage.getItem("pending_invitation");

        if (!pendingInvitationStr) {
          // No pending invitation - might be OAuth user or existing user login
          // Check if user needs invitation code verification
          const { checkUserRegistrationStatus } = await import("@/actions/registration");
          const status = await checkUserRegistrationStatus();

          if (status.needsInvitationCode) {
            // OAuth user without enhanced user record
            router.push("/auth/verify-invitation");
            return;
          }

          // Existing user, redirect to appropriate dashboard
          const dashboardPath = getDefaultDashboardRoute(status.role as UserRole);
          router.push(dashboardPath);
          return;
        }

        const pendingInvitation = JSON.parse(pendingInvitationStr);

        // Complete registration with invitation code
        const result = await completeRegistration({
          invitationCodeId: pendingInvitation.id,
          invitationCode: pendingInvitation.code,
          organizationId: pendingInvitation.organizationId,
          role: pendingInvitation.role,
        });

        if (result.success) {
          // Clear pending invitation
          sessionStorage.removeItem("pending_invitation");

          setStatus("success");

          // Redirect to dashboard after a brief delay
          const dashboardPath = getDefaultDashboardRoute(pendingInvitation.role as UserRole);

          setTimeout(() => {
            router.push(dashboardPath);
          }, 1500);
        } else {
          throw new Error("Registration completion failed");
        }
      } catch (err) {
        console.error("Registration callback error:", err);
        setStatus("error");
        setError(
          err instanceof Error ? err.message : "Failed to complete registration"
        );
      }
    };

    processRegistration();
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {status === "processing" && "Setting up your account..."}
            {status === "success" && "Welcome aboard!"}
            {status === "error" && "Registration Error"}
          </CardTitle>
          <CardDescription>
            {status === "processing" && "Please wait while we set up your account"}
            {status === "success" && "Your account has been created successfully"}
            {status === "error" && "There was a problem completing your registration"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "processing" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">
                Creating your account and setting up your learning profile...
              </p>
            </div>
          )}

          {status === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your account has been created! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "An unexpected error occurred"}
                <br />
                <a href="/register" className="underline">
                  Try again
                </a>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
