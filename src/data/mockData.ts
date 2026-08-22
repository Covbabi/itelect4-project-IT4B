import type { User, Item, Claim } from "../types/index";

export const sampleUser: User = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};

export const sampleUsers: User[] = [
  sampleUser,
  {
    id: 2,
    name: "Maria Clara",
    email: "maria@example.com",
    role: "student",
    isActive: true,
  },
];

export const sampleItems: Item[] = [
  {
    id: 101,
    title: "Blue Hydro Flask",
    description: "Found blue insulated bottle",
    location: "Library 2nd Floor",
    reportedBy: 1,
    status: "found",
  },
  {
    id: 102,
    title: "Black Wallet",
    description: "Leather wallet with IDs",
    location: "Gymnasium",
    reportedBy: 2,
    status: "lost",
  },
];

export const sampleClaims: Claim[] = [
  {
    id: 1,
    itemId: 102,
    claimedBy: 1,
    submittedAt: new Date(),
  },
];