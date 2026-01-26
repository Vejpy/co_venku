import type {
  CultureEvent,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  EventStats,
  CreateEventPayload,
  EditEventPayload,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7247/api";

// Token management
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("auth_token");
  }
  return authToken;
}

// Base fetch wrapper with auth support
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) return {} as T;

  return JSON.parse(text) as T;
}

// ============ EVENT ENDPOINTS ============

/**
 * GET /api/Event/all
 * Vrací seznam všech akcí seřazený podle StartDate
 */
export async function getEvents(): Promise<CultureEvent[]> {
  return fetchApi<CultureEvent[]>("/Event/all");
}

/**
 * GET /api/Event/owner/{ownerId}
 * Vrací akce podle vlastníka
 */
export async function getEventsByOwner(
  ownerId: number,
): Promise<CultureEvent[]> {
  return fetchApi<CultureEvent[]>(`/Event/owner/${ownerId}`);
}

/**
 * GET /api/Event/user/{userId}
 * Vrací akce, kterých se uživatel účastní
 */
export async function getEventsByUser(userId: number): Promise<CultureEvent[]> {
  return fetchApi<CultureEvent[]>(`/Event/user/${userId}`);
}

/**
 * POST /api/Event/Create
 * Vytvoří novou akci (vyžaduje auth)
 */
export async function createEvent(
  payload: CreateEventPayload,
): Promise<CultureEvent> {
  return fetchApi<CultureEvent>("/Event/Create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * PUT /api/Event/{id}
 * Upraví existující akci (vyžaduje auth)
 */
export async function updateEvent(
  id: number,
  payload: EditEventPayload,
): Promise<CultureEvent> {
  return fetchApi<CultureEvent>(`/Event/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * DELETE /api/Event/{id}
 * Smaže akci (vyžaduje auth - admin nebo vlastník)
 */
export async function deleteEvent(id: number): Promise<void> {
  return fetchApi<void>(`/Event/${id}`, {
    method: "DELETE",
  });
}

/**
 * POST /api/Event/EventSign/{eventId}
 * Přihlásí uživatele na akci (vyžaduje auth)
 */
export async function joinEvent(eventId: number): Promise<void> {
  return fetchApi<void>(`/Event/EventSign/${eventId}`, {
    method: "POST",
  });
}

/**
 * GET /api/Event/Stats
 * Vrací statistiky
 */
export async function getEventStats(): Promise<EventStats> {
  return fetchApi<EventStats>("/Event/Stats");
}

// ============ AUTH ENDPOINTS ============

/**
 * POST /api/Auth/login
 */
export async function login(payload: LoginPayload): Promise<string> {
  const response = await fetchApi<LoginResponse>("/Auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const token = response.Data;
  setAuthToken(token);
  return token;
}

/**
 * POST /api/Auth/register
 */
export async function register(payload: RegisterPayload): Promise<void> {
  return fetchApi<void>("/Auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Logout - pouze lokální, smaže token
 */
export function logout(): void {
  setAuthToken(null);
}

// ============ ADDRESS ENDPOINTS ============

/**
 * GET /api/address/search?query=Prague
 */
export async function searchAddress(query: string): Promise<Address[]> {
  return fetchApi<Address[]>(
    `/address/search?query=${encodeURIComponent(query)}`,
  );
}

/**
 * GET /api/address/cities?query=Pra
 */
export async function getCityAutocomplete(query: string): Promise<string[]> {
  return fetchApi<string[]>(
    `/address/cities?query=${encodeURIComponent(query)}`,
  );
}

/**
 * GET /api/address/streets?city=Prague&query=Masa
 */
export async function getStreetAutocomplete(
  city: string,
  query: string,
): Promise<string[]> {
  return fetchApi<string[]>(
    `/address/streets?city=${encodeURIComponent(city)}&query=${encodeURIComponent(query)}`,
  );
}

// Re-export Address type for convenience
import type { Address } from "@/types/api";
export type { Address };
