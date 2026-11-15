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
      <SheetContent side="left" className="w-[300px] p-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <SheetHeader className="p-4 border-b border-border/80 text-left">
            <Link
              href={ROUTES.HOME}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Zap className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <SheetTitle className="text-base font-bold tracking-tight text-foreground">
                  {APP_CONFIG.name}
                </SheetTitle>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {roleTitle}
                </span>
              </div>
            </Link>
          </SheetHeader>

          {/* Role Badge */}
          {roleBadge && (
            <div className="px-4 py-2.5 border-b border-border/40 bg-muted/40 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Portal View:</span>
              <Badge variant="secondary" className="text-xs font-mono uppercase px-2 py-0.5">
                {roleBadge}
              </Badge>
            </div>
          )}

          {/* Navigation Items */}
          <div className="py-3 px-3 space-y-1.5">
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
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="h-4.5 w-4.5 shrink-0" />}
                    <span>{item.title}</span>
                  </div>
                  {item.badge !== undefined && (
                    <Badge
                      variant={isActive ? "secondary" : "outline"}
                      className="text-xs px-2 py-0.5 font-mono ml-2"
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
        <div className="p-4 border-t border-border/80 text-xs text-muted-foreground text-center">
          {APP_CONFIG.name} v{APP_CONFIG.version}
        </div>
      </SheetContent>
    </Sheet>
  );
}
