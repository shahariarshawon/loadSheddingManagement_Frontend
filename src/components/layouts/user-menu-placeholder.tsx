"use client";

import { User, LogOut, Settings, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

interface UserMenuPlaceholderProps {
  name?: string;
  email?: string;
  role?: UserRole;
  onLogout?: () => void;
}

export function UserMenuPlaceholder({
  name = "Authorized User",
  email = "user@gridwatch.com",
  role = "CUSTOMER",
  onLogout,
}: UserMenuPlaceholderProps) {
  const initials = name
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 cursor-pointer">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold leading-none">{name}</p>
              <Badge variant="outline" className="text-[10px] uppercase font-mono px-1 py-0 h-4">
                {roleLabel}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground pt-1">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-xs">
          <User className="mr-2 h-4 w-4" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-xs">
          <ShieldCheck className="mr-2 h-4 w-4" />
          <span>Security & Sessions</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-xs">
          <Settings className="mr-2 h-4 w-4" />
          <span>Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-xs text-destructive focus:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
