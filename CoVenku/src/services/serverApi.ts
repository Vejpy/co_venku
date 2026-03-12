import { cookies } from "next/headers";
import type {
  DefaultResponse,
  User,
  AppStats,
  AuditLogItem,
  PagedResult,
  CultureEvent,
  Organization,
  EventAnalyticsDto,
} from "@/types/api";

// ---------------------------------------------------------------------------
// Dev TLS: ASP.NET Core uses a self-signed cert on localhost.
// Without this, Node's fetch rejects the certificate and throws "fetch failed".
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// ---------------------------------------------------------------------------
// Base URL — IPv4 (127.0.0.1) to avoid Node 18+ IPv6 resolution of "localhost".
// Must match the API's HTTPS port (default ASP.NET Core: 7246).
// ---------------------------------------------------------------------------
const BASE_URL =
  process.env.SERVER_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://127.0.0.1:7246";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      body || `API ${endpoint} selhalo se statusem ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Auth — current user (for admin guard)
// ---------------------------------------------------------------------------

/**
 * Fetch current user from API.
 * NEVER throws — returns null on any failure (network, auth, API down).
 * Logs errors to server console for debugging.
 */
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const res = await serverFetch<DefaultResponse<User>>("/api/user");
    return res.data ?? null;
  } catch (error) {
    console.error(
      "[serverApi] fetchCurrentUser failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

// ---------------------------------------------------------------------------
// Stats — GET /api/Event/Stats
// ---------------------------------------------------------------------------

export async function fetchAppStats(): Promise<DefaultResponse<AppStats>> {
  return serverFetch<DefaultResponse<AppStats>>("/api/Event/Stats", {
    next: { revalidate: 60 },
  } as RequestInit);
}

// ---------------------------------------------------------------------------
// Audit Logs — GET /api/admin/audit-logs
// ---------------------------------------------------------------------------

export async function fetchAuditLogs(
  page = 1,
  pageSize = 20,
  entityName?: string,
): Promise<DefaultResponse<PagedResult<AuditLogItem>>> {
  const params = new URLSearchParams({
    Page: String(page),
    PageSize: String(pageSize),
  });
  if (entityName) params.set("EntityName", entityName);

  return serverFetch<DefaultResponse<PagedResult<AuditLogItem>>>(
    `/api/admin/audit-logs?${params}`,
  );
}

// ---------------------------------------------------------------------------
// Events — owner / user
// ---------------------------------------------------------------------------

export async function fetchEventsByOwner(
  ownerId: number,
): Promise<DefaultResponse<CultureEvent[]>> {
  return serverFetch<DefaultResponse<CultureEvent[]>>(
    `/api/Event/owner/${ownerId}`,
  );
}

export async function fetchEventsByUser(
  userId: number,
): Promise<DefaultResponse<CultureEvent[]>> {
  return serverFetch<DefaultResponse<CultureEvent[]>>(
    `/api/Event/user/${userId}`,
  );
}

// ---------------------------------------------------------------------------
// Event analytics — GET /api/events/{id}/analytics
// ---------------------------------------------------------------------------

export async function fetchEventAnalytics(
  eventId: number,
): Promise<DefaultResponse<EventAnalyticsDto>> {
  return serverFetch<DefaultResponse<EventAnalyticsDto>>(
    `/api/events/${eventId}/analytics`,
    { next: { revalidate: 120 } } as RequestInit,
  );
}

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

export async function fetchMyOrganizations(): Promise<
  DefaultResponse<Organization[]>
> {
  return serverFetch<DefaultResponse<Organization[]>>("/api/organization/my");
}

// ---------------------------------------------------------------------------
// Events by owner (for SSR user page pre-fetch)
// ---------------------------------------------------------------------------

export async function fetchServerEventsByOwner(
  ownerId: number,
): Promise<CultureEvent[]> {
  try {
    const res = await serverFetch<DefaultResponse<CultureEvent[]>>(
      `/api/Event/owner/${ownerId}`,
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Events by user (participating)
// ---------------------------------------------------------------------------

export async function fetchServerEventsByUser(
  userId: number,
): Promise<CultureEvent[]> {
  try {
    const res = await serverFetch<DefaultResponse<CultureEvent[]>>(
      `/api/Event/user/${userId}`,
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Organizations for user (SSR)
// ---------------------------------------------------------------------------

export async function fetchServerMyOrganizations(): Promise<Organization[]> {
  try {
    const res = await serverFetch<DefaultResponse<Organization[]>>(
      "/api/organization/my",
    );
    return res.data ?? [];
  } catch (error) {
    console.error("Failed to fetch my organizations:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Admin - Pending Organizations for approval
// ---------------------------------------------------------------------------

export async function fetchServerPendingOrganizations(): Promise<Organization[]> {
  try {
    const res = await serverFetch<DefaultResponse<Organization[]>>(
      "/api/admin/organizations/pending",
    );
    return res.data ?? [];
  } catch (error) {
    console.error("Failed to fetch pending organizations:", error);
    return [];
  }
}
