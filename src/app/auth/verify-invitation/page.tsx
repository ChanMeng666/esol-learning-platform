"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { validateInvitationCode } from "@/actions/invitations";
import { completeRegistration } from "@/actions/registration";

/**
 * Invitation Code Verification for OAuth Users
 *
 * This page is shown to users who signed up via OAuth (Google/GitHub)
 * but haven't completed their registration by providing an invitation code.
 */
export default function VerifyInvitationPage() {
  const router = useRouter();
  const user = useUser();
  const [invitationCode, setInvitationCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validatedInvitation, setValidatedInvitation] = useState<any>(null);

  useEffect(() => {
    // If user is not authenticated, redirect to sign in
    if (!user) {
      router.push("/handler/sign-in");
    }
  }, [user, router]);

  const handleValidateCode = async () => {
    if (!invitationCode.trim()) {
      setValidationError("Please enter an invitation code");
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const invitation = await validateInvitationCode(invitationCode.trim());
      setValidatedInvitation(invitation);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : "Invalid invitation code"
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!validatedInvitation) return;

    setIsCompleting(true);

    try {
      const result = await completeRegistration({
        invitationCodeId: validatedInvitation.id.toString(),
        invitationCode: validatedInvitation.code,
        organizationId: validatedInvitation.organizationId.toString(),
        role: validatedInvitation.role,
      });

      if (result.success) {
        // Update Stack Auth user metadata
        if (user) {
          await user.update({
            clientMetadata: {
              role: validatedInvitation.role,
              organizationId: validatedInvitation.organizationId.toString(),
            },
          });
        }

        // Redirect to appropriate dashboard
        const dashboardPath = validatedInvitation.role === "teacher"
          ? "/teacher/dashboard"
          : "/dashboard";
        router.push(dashboardPath);
      }
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : "Failed to complete registration"
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !validatedInvitation) {
      handleValidateCode();
    } else if (e.key === "Enter" && validatedInvitation) {
      handleCompleteRegistration();
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Registration</CardTitle>
          <CardDescription>
            {user.displayName ? `Welcome, ${user.displayName}!` : "Welcome!"}
            <br />
            Please enter your invitation code to complete registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              You signed in successfully, but we need an invitation code to assign you to an organization and set your role.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="invitation-code">Invitation Code</Label>
            <Input
              id="invitation-code"
              type="text"
              placeholder="SCHOOL-ABC123-X7"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={isValidating || isCompleting || !!validatedInvitation}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Don't have an invitation code? Contact your school administrator.
            </p>
          </div>

          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {validatedInvitation && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Valid invitation code for <strong>{validatedInvitation.organizationName}</strong>
                <br />
                Role: <strong className="capitalize">{validatedInvitation.role}</strong>
              </AlertDescription>
            </Alert>
          )}

          {!validatedInvitation ? (
            <Button
              className="w-full"
              onClick={handleValidateCode}
              disabled={isValidating || !invitationCode.trim()}
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                "Validate Code"
              )}
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={handleCompleteRegistration}
              disabled={isCompleting}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Registration...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Need help?{" "}
            <a href="mailto:support@example.com" className="text-primary hover:underline">
              Contact Support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
