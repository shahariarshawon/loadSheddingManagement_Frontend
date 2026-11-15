"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { APP_CONFIG, ROUTES } from "@/lib/constants";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface MobileSidebarProps {
  items: NavItem[];
  roleTitle?: string;
  roleBadge?: string;
}

export function MobileSidebar({ items, roleTitle = "Dashboard", roleBadge }: MobileSidebarProps) {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useUiStore();

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="w-[280px] p-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <SheetHeader className="p-4 border-b border-border/80 text-left">
            <Link
              href={ROUTES.HOME}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Zap className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <SheetTitle className="text-sm font-bold tracking-tight text-foreground">
                  {APP_CONFIG.name}
                </SheetTitle>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider -mt-0.5">
                  {roleTitle}
                </span>
              </div>
            </Link>
          </SheetHeader>

          {/* Role Badge */}
          {roleBadge && (
            <div className="px-4 py-2 border-b border-border/40 bg-muted/40 flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Portal View:</span>
              <Badge variant="secondary" className="text-[10px] font-mono uppercase px-1.5 py-0">
                {roleBadge}
              </Badge>
            </div>
          )}

          {/* Navigation Items */}
          <div className="py-3 px-2 space-y-1">
            {items.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <span>{item.title}</span>
                  </div>
                  {item.badge !== undefined && (
                    <Badge
                      variant={isActive ? "secondary" : "outline"}
                      className="text-[10px] px-1.5 py-0 h-4 font-mono ml-2"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-border/80 text-[11px] text-muted-foreground text-center">
          {APP_CONFIG.name} v{APP_CONFIG.version}
        </div>
      </SheetContent>
    </Sheet>
  );
}
