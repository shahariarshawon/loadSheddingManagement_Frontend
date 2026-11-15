import type { UserProfile, UserRole } from "@/types";

export type { UserProfile, UserRole };

export interface AuthSessionResponse {
  authenticated: boolean;
  user: UserProfile | null;
}

export interface AuthLoginResponseData {
  user: UserProfile;
  redirectTo: string;
}

export interface AuthActionResponse {
  success: boolean;
  message: string;
  data?: AuthLoginResponseData;
  errors?: { field?: string; message: string }[];
}

export interface DemoLoginPayload {
  role: UserRole;
}
