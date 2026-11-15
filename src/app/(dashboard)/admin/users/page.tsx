"use client";

import { Suspense, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Users,
  Search,
  Filter,
  RotateCcw,
  Shield,
  ShieldAlert,
  Radio,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import type { UserProfile, UserRole, ApiResponse } from "@/types";

function UsersManagementContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 8;
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const isActive = searchParams.get("isActive") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  // Dialog state for Role Update
  const [roleModalUser, setRoleModalUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");

  // Dialog state for Status Suspension
  const [statusModalUser, setStatusModalUser] = useState<UserProfile | null>(null);

  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const updateFilters = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(newParams)) {
      if (value === null || value === "" || value === "ALL") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }
    if (!newParams.page) {
      params.delete("page");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() });
  };

  const handleReset = () => {
    setSearchInput("");
    router.push(pathname);
  };

  // Fetch paginated users via BFF
  const {
    data: usersResponse,
    isLoading,
    isFetching,
    isError,
  } = useQuery<ApiResponse<UserProfile[]>>({
    queryKey: ["admin", "users", page, limit, search, role, isActive],
    queryFn: () =>
      apiClient.get<UserProfile[]>("/admin/users", {
        page,
        limit,
        search,
        role: role || undefined,
        isActive: isActive !== "" ? isActive === "true" : undefined,
      }),
  });

  // Role Update Mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: UserRole }) =>
      apiClient.patch(`/admin/users/${userId}/role`, { role: newRole }),
    onSuccess: () => {
      toast.success("User Role Updated", {
        description: `Successfully modified role to ${selectedRole}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      setRoleModalUser(null);
    },
    onError: (err: Error) => {
      toast.error("Role Update Failed", { description: err.message });
    },
  });

  // Account Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, targetStatus }: { userId: string; targetStatus: boolean }) =>
      apiClient.patch(`/admin/users/${userId}/status`, { isActive: targetStatus }),
    onSuccess: (_, vars) => {
      toast.success(
        vars.targetStatus ? "Account Activated" : "Account Suspended",
        {
          description: `User account status has been updated.`,
        }
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      setStatusModalUser(null);
    },
    onError: (err: Error) => {
      toast.error("Status Update Failed", { description: err.message });
    },
  });

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta;
  const totalPages = meta?.totalPages || 1;
  const hasActiveFilters = Boolean(search || role || isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>User & Access Governance</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit registered platform accounts, modify RBAC roles, and manage account suspensions.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-mono w-fit">
          {meta?.total || 0} Total Records
        </Badge>
      </div>

      {/* Search & Filters */}
      <Card className="border-border bg-card/60 backdrop-blur-sm p-4">
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by user name, email, or phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
            <Button type="submit" size="sm" className="font-medium text-xs h-9 cursor-pointer gap-1">
              <Search className="h-3 w-3" />
              <span>Search</span>
            </Button>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs h-9 cursor-pointer gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Filter className="h-3 w-3" /> Role Filter
              </label>
              <select
                value={role}
                onChange={(e) => updateFilters({ role: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs"
              >
                <option value="">All Roles</option>
                <option value="CUSTOMER">CUSTOMER (Consumer)</option>
                <option value="POWER_OPERATOR">POWER_OPERATOR (Provider)</option>
                <option value="ADMIN">ADMIN (System Administrator)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" /> Account Status
              </label>
              <select
                value={isActive}
                onChange={(e) => updateFilters({ isActive: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs"
              >
                <option value="">All Statuses</option>
                <option value="true">Active Only</option>
                <option value="false">Suspended Only</option>
              </select>
            </div>
          </div>
        </form>
      </Card>

      {/* Users Table */}
      <Card className="border-border bg-card overflow-hidden">
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-8 text-center space-y-2">
            <AlertCircle className="h-6 w-6 text-destructive mx-auto" />
            <p className="text-xs font-semibold text-destructive">Failed to fetch users from backend.</p>
          </div>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No users match the search criteria.
          </div>
        )}

        {!isLoading && !isError && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border/80 text-muted-foreground uppercase text-[10px] font-mono">
                <tr>
                  <th className="px-4 py-3">User Details</th>
                  <th className="px-4 py-3">Role Tier</th>
                  <th className="px-4 py-3">Sector</th>
                  <th className="px-4 py-3">Account Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => {
                  const roleBadgeClass =
                    u.role === "ADMIN"
                      ? "border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10"
                      : u.role === "POWER_OPERATOR"
                      ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                      : "border-border text-muted-foreground";

                  return (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono truncate max-w-[180px]">
                          {u.email}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-[10px] font-mono uppercase ${roleBadgeClass}`}>
                          {u.role}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground text-[11px]">
                        {u.area?.name || "Unassigned"}
                      </td>

                      <td className="px-4 py-3">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 text-[11px]">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-medium text-destructive text-[11px]">
                            <UserX className="h-3 w-3" />
                            Suspended
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="text-xs w-44">
                            <DropdownMenuLabel>Manage Access</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setRoleModalUser(u);
                                setSelectedRole(u.role);
                              }}
                            >
                              <Shield className="h-3.5 w-3.5 mr-2 text-primary" />
                              <span>Change Role</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-destructive focus:text-destructive"
                              onClick={() => setStatusModalUser(u)}
                            >
                              {u.isActive ? (
                                <>
                                  <UserX className="h-3.5 w-3.5 mr-2" />
                                  <span>Suspend Account</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-3.5 w-3.5 mr-2" />
                                  <span>Reactivate Account</span>
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border p-3 text-xs">
            <span className="text-muted-foreground">
              Page <strong className="text-foreground">{page}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isFetching}
                onClick={() => updateFilters({ page: page - 1 })}
                className="h-7 text-xs cursor-pointer gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                <span>Prev</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isFetching}
                onClick={() => updateFilters({ page: page + 1 })}
                className="h-7 text-xs cursor-pointer gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Change Role Dialog */}
      <Dialog open={Boolean(roleModalUser)} onOpenChange={(open) => !open && setRoleModalUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Modify User Role</DialogTitle>
            <DialogDescription className="text-xs">
              Change the RBAC authorization privilege tier for <strong>{roleModalUser?.email}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Select New Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full rounded-md border border-input bg-background p-2 text-xs"
              >
                <option value="CUSTOMER">CUSTOMER — Residential consumer services</option>
                <option value="POWER_OPERATOR">POWER_OPERATOR — Outage dispatch & technician triage</option>
                <option value="ADMIN">ADMIN — Full system-wide governance</option>
              </select>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Note: The backend enforces safety guards preventing the demotion of the last active Administrator.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setRoleModalUser(null)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={updateRoleMutation.isPending}
              onClick={() => {
                if (roleModalUser) {
                  updateRoleMutation.mutate({
                    userId: roleModalUser.id,
                    newRole: selectedRole,
                  });
                }
              }}
              className="text-xs font-semibold"
            >
              {updateRoleMutation.isPending ? "Updating Role..." : "Confirm Role Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Status Dialog */}
      <Dialog open={Boolean(statusModalUser)} onOpenChange={(open) => !open && setStatusModalUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              {statusModalUser?.isActive ? "Suspend User Account" : "Activate User Account"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to {statusModalUser?.isActive ? "suspend" : "reactivate"}{" "}
              <strong>{statusModalUser?.email}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 text-xs text-muted-foreground">
            {statusModalUser?.isActive
              ? "Suspended users will be denied access to all authenticated portals immediately."
              : "Reactivated users will regain standard access to their assigned role portal."}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setStatusModalUser(null)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              variant={statusModalUser?.isActive ? "destructive" : "default"}
              disabled={updateStatusMutation.isPending}
              onClick={() => {
                if (statusModalUser) {
                  updateStatusMutation.mutate({
                    userId: statusModalUser.id,
                    targetStatus: !statusModalUser.isActive,
                  });
                }
              }}
              className="text-xs font-semibold"
            >
              {updateStatusMutation.isPending
                ? "Processing..."
                : statusModalUser?.isActive
                ? "Yes, Suspend Account"
                : "Yes, Activate Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <UsersManagementContent />
    </Suspense>
  );
}
