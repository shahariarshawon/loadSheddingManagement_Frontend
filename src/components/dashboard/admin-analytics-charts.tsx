"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart as PieIcon } from "lucide-react";
import type { AdminStats } from "@/types";

interface AdminAnalyticsChartsProps {
  stats: AdminStats;
}

const PIE_COLORS = ["#10b981", "#f59e0b", "#8b5cf6"];

export function AdminAnalyticsCharts({ stats }: AdminAnalyticsChartsProps) {
  const outageData = [
    { name: "Planned", count: stats.outages.planned, fill: "#3b82f6" },
    { name: "Unexpected", count: stats.outages.unexpected, fill: "#ef4444" },
    { name: "Active", count: stats.outages.active, fill: "#f59e0b" },
    { name: "Restored", count: stats.outages.restored, fill: "#10b981" },
  ];

  const userRoleData = [
    { name: "Customers", value: stats.users.customers },
    { name: "Operators", value: stats.users.operators },
    { name: "Admins", value: stats.users.admins },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Chart 1: Outage Status & Classification Bar Chart */}
      <Card className="border-border bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4.5 w-4.5 text-primary" />
              <CardTitle className="text-sm font-semibold">
                Outage Operations Breakdown
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              Total: {stats.outages.total}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Distribution of planned load shedding vs unexpected emergency blackouts
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: User Role Distribution Pie Chart */}
      <Card className="border-border bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-sm font-semibold">
                Platform User Roles Composition
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              Total: {stats.users.total}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Verified accounts categorized across the three role tiers
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name || ""} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {userRoleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
