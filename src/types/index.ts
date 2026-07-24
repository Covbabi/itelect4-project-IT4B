// Core domain models for the Lost & Found Tracker
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

// Generic response wrapper for API-style functions
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type UserUpdate = Partial<User>;
export type ItemPreview = Pick<Item, "id" | "title" | "status">;
export type PublicUser = Omit<User, "email" | "isActive">;
export type RoleCount = Record<"student" | "security_admin", number>;

export const ClaimStatus = {
  Pending: "PENDING",
  Approved: "APPROVED",
  Rejected: "REJECTED",
} as const;

export const Role = {
  Student: "student",
  Admin: "security_admin",
} as const;

