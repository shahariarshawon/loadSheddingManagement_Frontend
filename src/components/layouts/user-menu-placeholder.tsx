"use client";

import { User, LogOut, ShieldCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { UserRole } from "@/types";

interface UserMenuProps {
  name?: string;
  email?: string;
  role?: UserRole;
  onLogout?: () => void;
}

export function UserMenuPlaceholder({
  name: propName,
  email: propEmail,
  role: propRole,
  onLogout: propLogout,
}: UserMenuProps) {
  const { user, logout, isLoggingOut } = useAuth();

  const name = user?.name || propName || "Authorized User";
  const email = user?.email || propEmail || "user@gridwatch.com";
  const role = user?.role || propRole || "CUSTOMER";

  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "GW";

  const roleLabel =
    role === "ADMIN"
      ? "Administrator"
      : role === "POWER_OPERATOR"
        ? "Power Operator"
        : "Customer";

  const handleLogout = async () => {
    if (propLogout) {
      propLogout();
    } else {
      await logout();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full p-0 cursor-pointer"
          >
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold leading-none truncate max-w-[150px]">
                {name}
              </p>
              <Badge
                variant="outline"
                className="text-xs uppercase font-mono px-2 py-0.5"
              >
                {roleLabel}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground pt-1 truncate">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer text-sm py-2">
            <User className="mr-2 h-4.5 w-4.5" />
            <span>Profile & Area Info</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm py-2">
            <ShieldCheck className="mr-2 h-4.5 w-4.5" />
            <span>Security & Sessions</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-sm py-2 text-destructive focus:text-destructive font-medium"
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4.5 w-4.5" />
          )}
          <span>{isLoggingOut ? "Ending Session..." : "Log Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
