import { z } from "zod";

/**
 * Login Form Validation Schema
 * Mirrors backend auth.validation.ts loginSchema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address format"),
  password: z
    .string()
    .min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Citizen Registration Validation Schema
 * Mirrors backend auth.validation.ts registerSchema
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be under 100 characters"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required")
      .email("Invalid email address format")
      .max(100),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be under 100 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    phone: z
      .string()
      .trim()
      .max(20, "Phone number cannot exceed 20 characters")
      .optional()
      .or(z.literal("")),
    areaId: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
