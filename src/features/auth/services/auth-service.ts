import type { LoginFormData } from "@/features/auth/schemas/login.schema";
import type { RegisterFormData } from "@/features/auth/schemas/register.schema";
import type {
  AuthActionResponse,
  AuthSessionResponse,
  UserRole,
} from "@/features/auth/types/auth.types";

export const authService = {
  /**
   * Log in with email and password via Next.js BFF Route Handler
   */
  async login(credentials: LoginFormData): Promise<AuthActionResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed. Please check your credentials.");
    }
    return data;
  },

  /**
   * One-click demo login via Next.js BFF Route Handler
   */
  async demoLogin(role: UserRole): Promise<AuthActionResponse> {
    const response = await fetch("/api/auth/demo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Demo login failed.");
    }
    return data;
  },

  /**
   * Register a new residential customer account
   */
  async register(formData: RegisterFormData): Promise<AuthActionResponse> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed.");
    }
    return data;
  },

  /**
   * Log out of current session and invalidate cookies
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data;
  },

  /**
   * Retrieve active session user profile from BFF
   */
  async getSession(): Promise<AuthSessionResponse> {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return { authenticated: false, user: null };
    }

    const data = await response.json();
    return {
      authenticated: Boolean(data.authenticated),
      user: data.user || null,
    };
  },
};
