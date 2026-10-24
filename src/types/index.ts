// Core domain models for the Lost & Found Tracker
export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "security_admin";
  isActive: boolean;
}

export interface Item {
  id: number; // Changed back to number to match app data
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
  status?: "pending" | "verified";
  itemTitle?: string;
}

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

// --- SESSION 7 ADDITIONS ---
// Handles over-the-wire JSON format (ISO strings for Date)
export type ApiClaim = Omit<Claim, "id" | "submittedAt"> & {
  id: string;
  submittedAt: string;
};

// Represents payload required to send when creating a new claim
export type NewClaim = Omit<ApiClaim, "id">;

// ===== SESSION 11: what POST /api/ai sends back =======================
// The fourth time a shape is copied across the two repos, and the
// same rule as the first three: itelect4-backend's Review type is
// derived from a Zod schema in src/schemas/review.ts, and this has
// to say the same thing. Nothing checks that they agree -- you do.
export interface AiReview {
  summary:      string;
  strengths:    string[];
  improvements: string[];
  readiness:    "ready" | "almost" | "not-yet";
}