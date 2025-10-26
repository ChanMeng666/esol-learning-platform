"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, Trash2, Database, Info } from "lucide-react";
import { deleteAllUsers, getUserDataCounts, deleteSingleUser } from "@/actions/cleanup-users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CleanupUsersPage() {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [statusResult, setStatusResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    setError(null);
    setStatusResult(null);

    try {
      const response = await getUserDataCounts();
      setStatusResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleDeleteAll = async () => {
    if (confirmText !== "DELETE ALL USERS") {
      setError("Please type 'DELETE ALL USERS' to confirm");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await deleteAllUsers();
      setResult(response);
      setDialogOpen(false);
      setConfirmText("");
      // Refresh status
      await handleCheckStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-red-600">⚠️ Cleanup All Users</h1>
          <p className="text-muted-foreground mt-2">
            Dangerous operation: Delete all users and their data from database and Blob storage
          </p>
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Critical Warning</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>This action is IRREVERSIBLE</li>
                <li>All user data will be permanently deleted from Neon database</li>
                <li>All audio files will be permanently deleted from Vercel Blob</li>
                <li>Organizations will be preserved</li>
                <li>Question audio cache will be preserved</li>
                <li>You must manually delete users from Stack Auth dashboard</li>
                <li>Recommended for development/testing environments only</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        {/* Check Status Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Step 1: Check Current Database Status
            </CardTitle>
            <CardDescription>
              Review what data exists before deletion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCheckStatus}
              disabled={checkingStatus}
              variant="outline"
              className="w-full"
            >
              {checkingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Database className="mr-2 h-4 w-4" />
              Check Database Status
            </Button>

            {statusResult && (
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Database Overview</AlertTitle>
                  <AlertDescription>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(statusResult.counts).map(([key, value]) => (
                        <div key={key} className="bg-muted p-2 rounded">
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-lg font-bold">{value as number}</p>
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>

                {statusResult.users.length > 0 && (
                  <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold mb-3">All Users ({statusResult.totalUsers}):</h3>
                    <div className="space-y-2">
                      {statusResult.users.map((user: any) => (
                        <div
                          key={user.id}
                          className="p-3 border rounded bg-card hover:bg-muted transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{user.fullName}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex gap-3 mt-1">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {user.role || "NO ROLE"}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                  {user.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Created: {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete All Section */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Step 2: Delete All Users (Danger Zone)
            </CardTitle>
            <CardDescription>
              Permanently delete all users and their associated data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full" size="lg">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All Users
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
                  <DialogDescription className="space-y-2">
                    <p className="font-semibold">This will permanently delete from Neon Database:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                      <li>All users ({statusResult?.totalUsers ?? 0} users)</li>
                      <li>All practice sessions and progress</li>
                      <li>All recordings and transcriptions metadata</li>
                      <li>All assignments and submissions</li>
                      <li>All class enrollments</li>
                      <li>All diagnostic test attempts</li>
                    </ul>
                    <p className="font-semibold mt-3">And from Vercel Blob Storage:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                      <li>All user recording audio files</li>
                      <li>All AI response audio files</li>
                      <li>All conversation session audio</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="confirm">
                      Type <span className="font-bold text-red-600">DELETE ALL USERS</span> to confirm
                    </Label>
                    <Input
                      id="confirm"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="DELETE ALL USERS"
                      className="font-mono"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAll}
                    disabled={loading || confirmText !== "DELETE ALL USERS"}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Delete All
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Success</AlertTitle>
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-medium">{result.message}</p>

                    {/* Blob Storage Cleanup Stats */}
                    {result.blobCleanup && (
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                        <p className="font-semibold mb-2 text-blue-900">Blob Storage Cleanup:</p>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Audio files deleted:</span>
                            <span className="font-mono font-bold text-blue-900">
                              {result.blobCleanup.filesDeleted}
                            </span>
                          </div>
                          {result.blobCleanup.errors.length > 0 && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                              <p className="text-xs font-semibold text-red-900 mb-1">
                                Errors ({result.blobCleanup.errors.length}):
                              </p>
                              <div className="max-h-32 overflow-y-auto text-xs text-red-700 space-y-1">
                                {result.blobCleanup.errors.map((error: string, idx: number) => (
                                  <div key={idx}>{error}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Database Cleanup Stats */}
                    <div className="bg-white p-3 rounded border">
                      <p className="font-semibold mb-2">Database Records Deleted:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(result.deletedCounts).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="font-mono font-bold">{value as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Alert variant="destructive" className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Next Steps Required</AlertTitle>
                      <AlertDescription>
                        <div className="space-y-2">
                          {result.warnings && result.warnings.map((warning: string, idx: number) => (
                            <div key={idx}>{warning}</div>
                          ))}
                          <a
                            href="https://app.stack-auth.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-medium mt-2 inline-block"
                          >
                            Go to Stack Auth Dashboard →
                          </a>
                        </div>
                      </AlertDescription>
                    </Alert>
                    {result.deletedUsers && result.deletedUsers.length > 0 && (
                      <div className="bg-white p-3 rounded border">
                        <p className="font-semibold mb-2">Deleted Users ({result.deletedUsers.length}):</p>
                        <div className="space-y-1 text-sm max-h-40 overflow-y-auto">
                          {result.deletedUsers.map((user: any) => (
                            <div key={user.id} className="flex justify-between items-center p-1 hover:bg-muted rounded">
                              <span>{user.email}</span>
                              <span className="text-xs text-muted-foreground">{user.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Post-Cleanup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Delete Stack Auth Users</h4>
              <p className="text-sm text-muted-foreground">
                Visit{" "}
                <a
                  href="https://app.stack-auth.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Stack Auth Dashboard
                </a>{" "}
                and manually delete all users from your project.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. Verify Blob Storage Cleanup</h4>
              <p className="text-sm text-muted-foreground">
                Visit{" "}
                <a
                  href="https://vercel.com/storage/blob"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Vercel Blob Dashboard
                </a>{" "}
                to confirm all user audio files have been deleted.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. Clear Browser Cache</h4>
              <p className="text-sm text-muted-foreground">
                Clear your browser's local storage and cookies to ensure old user sessions are removed.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">4. Test New User Registration</h4>
              <p className="text-sm text-muted-foreground">
                Create new test users to verify the registration and login flow works correctly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
