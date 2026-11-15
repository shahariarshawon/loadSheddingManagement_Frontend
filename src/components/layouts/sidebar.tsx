"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { APP_CONFIG, ROUTES } from "@/lib/constants";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface SidebarProps {
  items: NavItem[];
  roleTitle?: string;
  roleBadge?: string;
}

export function Sidebar({ items, roleTitle = "Dashboard", roleBadge }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out relative z-30",
        sidebarOpen ? "w-64" : "w-18"
      )}
    >
      {/* Sidebar Header / Brand */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/80">
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Zap className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="text-sm font-bold tracking-tight text-foreground truncate">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider -mt-0.5 truncate">
                {roleTitle}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Role Pill Banner when open */}
      {sidebarOpen && roleBadge && (
        <div className="px-4 py-2 border-b border-border/40 bg-muted/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">Portal View:</span>
            <Badge variant="secondary" className="text-[10px] font-mono uppercase px-1.5 py-0">
              {roleBadge}
            </Badge>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {items.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          if (!sidebarOpen) {
            // Collapsed Mode with Tooltips
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-10 w-10 mx-auto items-center justify-center rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  }
                />
                <TooltipContent side="right" className="font-medium text-xs">
                  {item.title}
                  {item.badge !== undefined && (
                    <span className="ml-1.5 text-[10px] text-muted-foreground">
                      ({item.badge})
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          }

          // Expanded Mode
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                {Icon && (
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                )}
                <span className="truncate">{item.title}</span>
              </div>
              {item.badge !== undefined && (
                <Badge
                  variant={isActive ? "secondary" : "outline"}
                  className="text-[10px] px-1.5 py-0 h-4 font-mono ml-2 shrink-0"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse / Expand Toggle Button */}
      <div className="p-3 border-t border-border/80 flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full h-8 text-xs text-muted-foreground hover:text-foreground justify-center gap-1.5"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </aside>
  );
}
