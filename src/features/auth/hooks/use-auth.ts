"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/features/auth/services/auth-service";
import { ROUTES } from "@/lib/constants";
import type { LoginFormData } from "@/features/auth/schemas/login.schema";
import type { RegisterFormData } from "@/features/auth/schemas/register.schema";
import type { UserRole, UserProfile } from "@/types";

export const AUTH_QUERY_KEY = ["auth", "session"] as const;

export function useAuth() {
  const queryClient = useQueryClient();

  // Active Session Query
  const {
    data: sessionData,
    isLoading,
    isFetching,
    refetch: refreshSession,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.getSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const user: UserProfile | null = sessionData?.user || null;
  const isAuthenticated = Boolean(sessionData?.authenticated && user);
  const role: UserRole | null = user?.role || null;

  // Standard Login Mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormData) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, {
        authenticated: true,
        user: data.data?.user || null,
      });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("Login successful!", {
        description: `Welcome back, ${data.data?.user.name}!`,
      });
      if (data.data?.redirectTo) {
        window.location.href = data.data.redirectTo;
      }
    },
    onError: (error: Error) => {
      toast.error("Authentication failed", {
        description: error.message || "Invalid email or password.",
      });
    },
  });

  // One-Click Demo Login Mutation
  const demoLoginMutation = useMutation({
    mutationFn: (demoRole: UserRole) => authService.demoLogin(demoRole),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, {
        authenticated: true,
        user: data.data?.user || null,
      });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("Demo Login Verified!", {
        description: data.message || `Signed in as ${data.data?.user.role}.`,
      });
      if (data.data?.redirectTo) {
        window.location.href = data.data.redirectTo;
      }
    },
    onError: (error: Error) => {
      toast.error("Demo authentication failed", {
        description: error.message || "Could not authenticate demo user.",
      });
    },
  });

  // Customer Registration Mutation
  const registerMutation = useMutation({
    mutationFn: (formData: RegisterFormData) => authService.register(formData),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, {
        authenticated: true,
        user: data.data?.user || null,
      });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("Account created successfully!", {
        description: "Welcome to GridWatch.",
      });
      if (data.data?.redirectTo) {
        window.location.href = data.data.redirectTo;
      } else {
        window.location.href = ROUTES.DASHBOARD;
      }
    },
    onError: (error: Error) => {
      toast.error("Registration failed", {
        description: error.message || "Could not complete registration.",
      });
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, {
        authenticated: false,
        user: null,
      });
      queryClient.clear();
      toast.success("Logged out successfully", {
        description: "Your session has ended securely.",
      });
      window.location.href = ROUTES.LOGIN;
    },
    onError: () => {
      // Still reset client state on failure
      queryClient.setQueryData(AUTH_QUERY_KEY, {
        authenticated: false,
        user: null,
      });
      queryClient.clear();
      window.location.href = ROUTES.LOGIN;
    },
  });

  return {
    user,
    isAuthenticated,
    role,
    isLoading: isLoading || isFetching,
    isLoggingIn: loginMutation.isPending,
    isDemoLoggingIn: demoLoginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    login: loginMutation.mutateAsync,
    demoLogin: demoLoginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refreshSession,
  };
}
