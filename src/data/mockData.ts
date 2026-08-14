import type { User, Item, Claim } from "../types/index";

export const sampleUser: User = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};

export const sampleItems: Item[] = [
  {
    id: 101,
    title: "Blue Tumbler",
    description: "Hydro Flask 32oz lost in the Computer Lab.",
    location: "Lab 3, 3rd Floor",
    reportedBy: 1,
    status: "lost",
  },
  {
    id: 102,
    title: "Graphing Calculator",
    description: "Casio FX-991EX found near the cafeteria.",
    location: "Student Center",
    reportedBy: 2,
    status: "found",
  },
  {
    id: 103,
    title: "Black Backpack",
    description: "Contains notebooks and a pencil case.",
    location: "Library 2nd Floor",
    reportedBy: 1,
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