import type { Item, ApiClaim, NewClaim } from "../types/index";

export const API_URL = "http://localhost:3001";

// GET /items
export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_URL}/items`);
  if (!res.ok) {
    throw new Error("Could not load reported items");
  }
  return res.json();
}

// GET /items?id=...
export async function fetchItemById(id: string): Promise<Item> {
  const res = await fetch(`${API_URL}/items?id=${id}`);
  if (!res.ok) {
    throw new Error("Could not load that item");
  }
  const matches: Item[] = await res.json();
  if (matches.length === 0) {
    throw new Error(`No item found with ID "${id}".`);
  }
  return matches[0];
}

// GET /claims
export async function fetchClaims(): Promise<ApiClaim[]> {
  const res = await fetch(`${API_URL}/claims`);
  if (!res.ok) {
    throw new Error("Could not load claims");
  }
  return res.json();
}

// POST /claims
export async function createClaim(newClaim: NewClaim): Promise<ApiClaim> {
  const res = await fetch(`${API_URL}/claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newClaim),
  });
  if (!res.ok) {
    throw new Error("Could not save the claim");
  }
  return res.json();
}