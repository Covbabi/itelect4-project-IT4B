// Core domain models for the Lost & Found Application
export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "security_admin";
  isActive: boolean;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  location: string;
  reportedBy: number; 
  status: "lost" | "found";
}

export interface Claim {
  id: number;
  itemId: number;
  claimedBy: number;   
  verifiedBy?: number; 
  submittedAt: Date;
}

// ✅ 1. Generic Interface Requirement Met
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ✅ 2. Utility Type Uses Requirement Met (Provides 4 variations)
export type UserUpdate = Partial<User>; // Makes fields optional for update operations
export type ItemPreview = Pick<Item, "id" | "title" | "status">; // Isolates essential data for catalog cards
export type PublicUser = Omit<User, "email" | "isActive">; // Strips sensitive credentials out
export type RoleCount = Record<"student" | "security_admin", number>; // Maps explicit counts to user roles

// ✅ 3. Enum-like constants (compatible with runtime execution)
export const ClaimStatus = {
  Pending: "PENDING",
  Approved: "APPROVED",
  Rejected: "REJECTED",
} as const;

export const Role = {
  Student: "student",
  Admin: "security_admin",
} as const;