import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .trim()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username: alphanumeric characters only"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const sendMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required and cannot be empty.")
    .max(500, "Message cannot exceed 500 characters."),
});

export const profileUpdateSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const verifyEmailSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
});

export const resendVerificationSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message || "Invalid request";
}
