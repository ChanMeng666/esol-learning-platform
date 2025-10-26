"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Copy,
  Eye,
  Ban,
  CheckCircle,
  Trash2,
  Users,
  Calendar,
  Hash,
} from "lucide-react";
import {
  createInvitationCode,
  getOrganizationInvitationCodes,
  getInvitationCodeStats,
  deactivateInvitationCode,
  reactivateInvitationCode,
  deleteInvitationCode,
} from "@/actions/invitations";
import type { UserRole } from "@/lib/auth/permissions";
import type { InvitationCodeType } from "@/lib/invitations/code-generator";
import { useToast } from "@/hooks/use-toast";

export default function InvitationsPage() {
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  // Create invitation dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("student");
  const [type, setType] = useState<InvitationCodeType>("organization_general");
  const [maxUses, setMaxUses] = useState<string>("");
  const [expiresIn, setExpiresIn] = useState<string>("");
  const [customPrefix, setCustomPrefix] = useState("");

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const data = await getOrganizationInvitationCodes();
      setInvitations(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load invitations",
        variant: "destructive",
      });
    }
  };

  const handleCreateInvitation = async () => {
    setLoading(true);

    try {
      let expiresAt: Date | null = null;
      if (expiresIn) {
        const days = parseInt(expiresIn);
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
      }

      await createInvitationCode({
        role,
        type,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt,
        customPrefix: customPrefix || undefined,
      });

      toast({
        title: "Success",
        description: "Invitation code created successfully",
      });

      setCreateDialogOpen(false);
      resetForm();
      loadInvitations();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRole("student");
    setType("organization_general");
    setMaxUses("");
    setExpiresIn("");
    setCustomPrefix("");
  };

  const handleViewStats = async (invitationId: bigint) => {
    try {
      const data = await getInvitationCodeStats(invitationId);
      setStats(data);
      setStatsDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load stats",
        variant: "destructive",
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Invitation code copied to clipboard",
    });
  };

  const handleDeactivate = async (invitationId: bigint) => {
    try {
      await deactivateInvitationCode(invitationId);
      toast({
        title: "Success",
        description: "Invitation code deactivated",
      });
      loadInvitations();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to deactivate",
        variant: "destructive",
      });
    }
  };

  const handleReactivate = async (invitationId: bigint) => {
    try {
      await reactivateInvitationCode(invitationId);
      toast({
        title: "Success",
        description: "Invitation code reactivated",
      });
      loadInvitations();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reactivate",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (invitationId: bigint) => {
    if (!confirm("Are you sure you want to delete this invitation code? This cannot be undone.")) {
      return;
    }

    try {
      await deleteInvitationCode(invitationId);
      toast({
        title: "Success",
        description: "Invitation code deleted",
      });
      loadInvitations();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-700";
      case "teacher":
        return "bg-purple-100 text-purple-700";
      case "parent":
        return "bg-green-100 text-green-700";
      case "school_admin":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (invitation: any) => {
    const isExpired = invitation.expiresAt && new Date(invitation.expiresAt) < new Date();
    const isUsedUp =
      invitation.maxUses !== null && invitation.usedCount >= invitation.maxUses;

    if (!invitation.isActive) {
      return <Badge variant="secondary">Deactivated</Badge>;
    }

    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    if (isUsedUp) {
      return <Badge variant="outline">Used Up</Badge>;
    }

    return <Badge className="bg-green-100 text-green-700">Active</Badge>;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Invitation Codes</h1>
            <p className="text-muted-foreground mt-2">
              Manage invitation codes for user registration
            </p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Invitation Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Invitation Code</DialogTitle>
                <DialogDescription>
                  Generate a new invitation code for user registration
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="school_admin">School Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={type}
                    onValueChange={(value) => setType(value as InvitationCodeType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organization_general">
                        Organization General (Reusable)
                      </SelectItem>
                      <SelectItem value="teacher_specific">Teacher Specific (Limited)</SelectItem>
                      <SelectItem value="parent_specific">Parent Specific (One-time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxUses">Max Uses (optional)</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    placeholder="Leave empty for unlimited"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresIn">Expires In (days, optional)</Label>
                  <Input
                    id="expiresIn"
                    type="number"
                    placeholder="Leave empty for no expiration"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customPrefix">Custom Prefix (optional)</Label>
                  <Input
                    id="customPrefix"
                    placeholder="e.g., SPRING2024"
                    value={customPrefix}
                    onChange={(e) => setCustomPrefix(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateInvitation} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Code
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Invitations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Invitation Codes</CardTitle>
            <CardDescription>
              View and manage invitation codes for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No invitation codes yet</p>
                <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Invitation Code
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id.toString()}>
                      <TableCell className="font-mono font-semibold">
                        {invitation.code}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-6 w-6 p-0"
                          onClick={() => handleCopyCode(invitation.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(invitation.role)}>
                          {invitation.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {invitation.type.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {invitation.usedCount}
                            {invitation.maxUses !== null ? ` / ${invitation.maxUses}` : ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {invitation.expiresAt
                          ? new Date(invitation.expiresAt).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>{getStatusBadge(invitation)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewStats(invitation.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invitation.isActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeactivate(invitation.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReactivate(invitation.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {invitation.usedCount === 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(invitation.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Stats Dialog */}
        <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Invitation Code Statistics</DialogTitle>
              <DialogDescription>Usage details and history</DialogDescription>
            </DialogHeader>

            {stats && (
              <div className="space-y-4">
                {/* Code Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Code: {stats.invitation.code}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <Badge className={getRoleBadgeColor(stats.invitation.role)}>
                          {stats.invitation.role}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">
                          {stats.invitation.type.replace(/_/g, " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Uses</p>
                        <p className="font-medium">{stats.stats.totalUses}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Remaining Uses</p>
                        <p className="font-medium">
                          {stats.stats.remainingUses ?? "Unlimited"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage History */}
                {stats.usages.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Usage History</h3>
                    <div className="border rounded-lg max-h-64 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Used At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats.usages.map((usage: any) => (
                            <TableRow key={usage.id.toString()}>
                              <TableCell>{usage.user?.fullName || "Unknown"}</TableCell>
                              <TableCell>{usage.user?.email || "N/A"}</TableCell>
                              <TableCell className="text-sm">
                                {new Date(usage.usedAt).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
