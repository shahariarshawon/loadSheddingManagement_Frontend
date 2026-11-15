"use client";

import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export function LogoutButton({
  variant = "ghost",
  size = "sm",
  className,
  showIcon = true,
  label = "Log Out",
}: LogoutButtonProps) {
  const { logout, isLoggingOut } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoggingOut}
      onClick={() => logout()}
      className={className}
    >
      {isLoggingOut ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        showIcon && <LogOut className="h-4 w-4 mr-2" />
      )}
      <span>{label}</span>
    </Button>
  );
}
