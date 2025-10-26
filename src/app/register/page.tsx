"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { validateInvitationCode } from "@/actions/invitations";

export default function RegisterPage() {
  const router = useRouter();
  const [invitationCode, setInvitationCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validatedInvitation, setValidatedInvitation] = useState<any>(null);

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

      // Store invitation code in session storage for registration callback
      sessionStorage.setItem("pending_invitation", JSON.stringify({
        code: invitation.code,
        id: invitation.id.toString(),
        role: invitation.role,
        organizationId: invitation.organizationId.toString(),
        organizationName: invitation.organizationName,
      }));

      // Redirect to Stack Auth signup with organization context
      router.push("/handler/sign-up");
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : "Invalid invitation code"
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleValidateCode();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to ESOL Platform</CardTitle>
          <CardDescription>
            New user? Enter your invitation code to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invitation-code">Invitation Code</Label>
            <Input
              id="invitation-code"
              type="text"
              placeholder="SCHOOL-ABC123-X7"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={isValidating}
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
              "Continue to Registration"
            )}
          </Button>

          <div className="space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/handler/sign-in" className="text-primary hover:underline">
                Sign in
              </a>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Note: OAuth users (Google/GitHub) will be asked for invitation code after first sign-in
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
