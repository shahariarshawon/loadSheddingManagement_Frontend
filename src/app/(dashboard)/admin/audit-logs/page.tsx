"use client";

import { Suspense, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Search,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Globe,
  Code,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import type { AuditLog, ApiResponse } from "@/types";

function AuditLogsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 15;
  const search = searchParams.get("search") || "";
  const entity = searchParams.get("entity") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

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
    updateFilters({ search: searchInput.trim(), page: 1 });
  };

  const handleReset = () => {
    setSearchInput("");
    router.push(pathname);
  };

  const { data, isLoading, isError, error, refetch } = useQuery<ApiResponse<AuditLog[]>>({
    queryKey: ["audit-logs", { page, search, entity }],
    queryFn: () => {
      const q: Record<string, string | number> = {
        page,
        limit,
      };
      if (search) q.search = search;
      if (entity) q.entity = entity;
      return apiClient.get<AuditLog[]>("/api/v1/admin/audit-logs", q);
    },
  });

  const auditLogs = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || (meta?.total ? Math.ceil(meta.total / limit) : 1);

  const getActionColor = (action: string) => {
    if (action.includes("CREATE") || action.includes("RESTORE")) return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    if (action.includes("DELETE") || action.includes("CANCEL") || action.includes("REJECT") || action.includes("SUSPEND"))
      return "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    if (action.includes("UPDATE") || action.includes("ASSIGN") || action.includes("STATUS"))
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    return "border-primary/30 bg-primary/10 text-primary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">System Audit Logs</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Immutable forensic log of administrative interventions, outage updates, role changes, and grid adjustments.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by action, actor name, email, or entity..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={entity}
              onChange={(e) => updateFilters({ entity: e.target.value, page: 1 })}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All Entities</option>
              <option value="User">User</option>
              <option value="Outage">Outage</option>
              <option value="OutageReport">Outage Report</option>
              <option value="Technician">Technician</option>
              <option value="Zone">Zone</option>
              <option value="Substation">Substation</option>
              <option value="Area">Area</option>
            </select>

            <Button type="submit" size="sm">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              Filter
            </Button>

            {(search || entity) && (
              <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Table Content */}
      <Card className="shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-destructive space-y-2">
            <AlertCircle className="mx-auto h-8 w-8" />
            <p className="font-semibold">Failed to query audit trail</p>
            <p className="text-sm text-muted-foreground">{error?.message || "Internal server error"}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Shield className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No audit events found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {search || entity
                ? "No audit records matched your filter criteria."
                : "No system modification records have been logged yet."}
            </p>
            {(search || entity) && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target Entity</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Origin IP</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    {/* Timestamp */}
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-foreground/60" />
                        <span>
                          {new Date(log.createdAt).toLocaleString("en-US", {
                            dateStyle: "short",
                            timeStyle: "medium",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`font-mono text-[11px] ${getActionColor(log.action)}`}>
                        {log.action}
                      </Badge>
                    </td>

                    {/* Entity */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{log.entity}</div>
                      {log.entityId && (
                        <div className="font-mono text-[11px] text-muted-foreground truncate max-w-[140px]">
                          {log.entityId}
                        </div>
                      )}
                    </td>

                    {/* Actor */}
                    <td className="px-4 py-3">
                      {log.user ? (
                        <div>
                          <p className="font-medium text-foreground text-xs">{log.user.name}</p>
                          <p className="text-[11px] text-muted-foreground">{log.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">System Automated</span>
                      )}
                    </td>

                    {/* Origin IP */}
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-foreground/50" />
                        <span>{log.ipAddress || "::1"}</span>
                      </div>
                    </td>

                    {/* Details Action */}
                    <td className="px-4 py-3 text-right">
                      {log.details ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          className="h-7 text-xs px-2"
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          Inspect
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Page <span className="font-medium text-foreground">{page}</span> of{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
              {meta?.total ? ` (${meta.total} audit records)` : ""}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateFilters({ page: page - 1 })}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateFilters({ page: page + 1 })}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* JSON Inspector Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Code className="h-4 w-4 text-primary" />
              Audit Event Payload: {selectedLog?.action}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Entity: {selectedLog?.entity} ({selectedLog?.entityId}) | Actor:{" "}
              {selectedLog?.user?.name || "System"}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/70 rounded-md p-3 max-h-[300px] overflow-auto">
            <pre className="font-mono text-xs text-foreground whitespace-pre-wrap">
              {JSON.stringify(selectedLog?.details, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminAuditLogsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-10 w-64 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      }
    >
      <AuditLogsContent />
    </Suspense>
  );
}
