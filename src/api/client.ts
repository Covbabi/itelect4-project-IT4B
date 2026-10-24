import type { Item, ApiClaim, NewClaim } from "../types/index";

export const API_URL = "http://localhost:4000/api";

function getAuthHeaders(): HeadersInit {
  const raw = localStorage.getItem("lost-found-auth");

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as { state?: { token?: string } };
    const token = parsed.state?.token;

    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

// GET /api/items
export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_URL}/items`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Could not load reported items");
  }

  return res.json();
}

// GET /api/items/:id
export async function fetchItemById(id: string): Promise<Item> {
  const res = await fetch(`${API_URL}/items/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Could not load that item");
  }

  return res.json();
}

// GET /api/claims
export async function fetchClaims(): Promise<ApiClaim[]> {
  const res = await fetch(`${API_URL}/claims`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Could not load claims");
  }

  return res.json();
}

// POST /api/claims
export async function createClaim(newClaim: NewClaim): Promise<ApiClaim> {
  const res = await fetch(`${API_URL}/claims`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(newClaim),
  });

  if (!res.ok) {
    throw new Error("Could not save the claim");
  }

  return res.json();
}