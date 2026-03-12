import axios from "axios";
import type {
  DefaultResponse,
  User,
  CultureEvent,
  CulturePlace,
  Organization,
  VerificationTokenResponse,
  BlockUserRequest,
  BlockOrganizationRequest,
} from "@/types/api";

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    return `https://${window.location.hostname}:7246`;
  }
  return "https://localhost:7246";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});

// Attach auth token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function loginUser(payload: {
  username: string;
  password: string;
}): Promise<DefaultResponse<string>> {
  const { data } = await api.post<DefaultResponse<string>>(
    "/api/user/Login",
    payload,
  );
  return data;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  userName: string;
  sex: number;
  birthDate: string;
}): Promise<DefaultResponse<unknown>> {
  const { data } = await api.post<DefaultResponse<unknown>>(
    "/api/user/Register",
    payload,
  );
  return data;
}

// ---------------------------------------------------------------------------
// Current user
// ---------------------------------------------------------------------------

export async function getCurrentUser(): Promise<DefaultResponse<User>> {
  const { data } = await api.get<DefaultResponse<User>>("/api/user");
  return data;
}

// ---------------------------------------------------------------------------
// Culture places
// ---------------------------------------------------------------------------

export async function fetchCulturePlacesRaw() {
  const { data } = await api.get("/api/CulturePlace/All?description=false");
  if (!data || !Array.isArray(data.data)) return { data: [] };
  return data;
}

export async function createCulturePlace(
  payload: import("@/types/api").CulturePlaceRequest,
): Promise<DefaultResponse<CulturePlace>> {
  const { data } = await api.post<DefaultResponse<CulturePlace>>(
    "/api/CulturePlace",
    payload,
  );
  return data;
}

export async function updateCulturePlace(
  id: number,
  payload: import("@/types/api").CulturePlaceRequest,
): Promise<DefaultResponse<CulturePlace>> {
  const { data } = await api.put<DefaultResponse<CulturePlace>>(
    `/api/CulturePlace/${id}`,
    payload,
  );
  return data;
}

export async function deleteCulturePlace(id: number, organizationId: number): Promise<DefaultResponse<boolean>> {
  const { data } = await api.delete<DefaultResponse<boolean>>(
    `/api/CulturePlace/${id}?organizationId=${organizationId}`
  );
  return data;
}

export async function createAddress(
  payload: import("@/types/api").AddressRequest,
): Promise<DefaultResponse<import("@/types/api").Address>> {
  const { data } = await api.post<DefaultResponse<import("@/types/api").Address>>(
    "/api/address",
    payload,
  );
  return data;
}

export async function fetchEventsByPlace(placeId: number): Promise<DefaultResponse<CultureEvent[]>> {
  const { data } = await api.get<DefaultResponse<CultureEvent[]>>(
    `/api/CulturePlace/${placeId}/Events`,
  );
  return data;
}

export async function fetchAIRecommendations(): Promise<DefaultResponse<CultureEvent[]>> {
  const { data } = await api.get<DefaultResponse<CultureEvent[]>>("/api/Recommendations/FromAI");
  return data;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function fetchAllEvents(): Promise<DefaultResponse<CultureEvent[]>> {
  const { data } = await api.get<DefaultResponse<CultureEvent[]>>("/api/Event/all");
  return data;
}

export async function fetchUserEvents(
  ownerId: number,
): Promise<DefaultResponse<CultureEvent[]>> {
  const { data } = await api.get<DefaultResponse<CultureEvent[]>>(
    `/api/Event/owner/${ownerId}`,
  );
  return data;
}

export async function fetchParticipatingEvents(
  userId: number,
): Promise<DefaultResponse<CultureEvent[]>> {
  const { data } = await api.get<DefaultResponse<CultureEvent[]>>(
    `/api/Event/user/${userId}`,
  );
  return data;
}

export async function createEvent(
  payload: import("@/types/api").CreateEventRequest,
): Promise<DefaultResponse<CultureEvent>> {
  const { data } = await api.post<DefaultResponse<CultureEvent>>(
    "/api/Event/Create",
    payload,
  );
  return data;
}

export async function updateEvent(
  id: number,
  payload: Record<string, unknown>,
): Promise<DefaultResponse<CultureEvent>> {
  const { data } = await api.put<DefaultResponse<CultureEvent>>(
    `/api/Event/${id}`,
    payload,
  );
  return data;
}

export async function deleteEvent(id: number) {
  const { data } = await api.delete(`/api/Event/${id}`);
  return data;
}

export async function signUpForEvent(eventId: number) {
  const { data } = await api.post(`/api/Event/EventSign/${eventId}`);
  return data;
}

export async function leaveEvent(eventId: number) {
  const { data } = await api.delete(`/api/Event/EventSign/${eventId}`);
  return data;
}

export async function fetchEventDemographics(eventId: number): Promise<DefaultResponse<{
  ageDistribution: { ageGroup: string; count: number }[];
  genderDistribution: { gender: string; count: number }[];
}>> {
  const { data } = await api.get(`/api/Analytics/Event/${eventId}/Demographics`);
  return data;
}

export async function fetchEventAnalytics(eventId: number): Promise<DefaultResponse<{
  totalAttendees: number;
  views: number;
  conversionRate: number;
  salesOverTime: { date: string; count: number }[];
  ageDemographics: { group: string; count: number }[];
  genderDemographics: { gender: string; count: number }[];
}>> {
  const { data } = await api.get(`/api/events/${eventId}/analytics`);
  return data;
}

// ---------------------------------------------------------------------------
// Admin — user and organization lists
// ---------------------------------------------------------------------------

export async function fetchAdminUsers(
  page = 1,
  pageSize = 50,
): Promise<DefaultResponse<import("@/types/api").PagedResult<User>>> {
  const params = new URLSearchParams({ Page: String(page), PageSize: String(pageSize) });
  const { data } = await api.get(`/api/admin/users?${params}`);
  return data;
}

export async function fetchAdminOrganizations(
  page = 1,
  pageSize = 50,
): Promise<DefaultResponse<import("@/types/api").PagedResult<Organization>>> {
  const params = new URLSearchParams({ Page: String(page), PageSize: String(pageSize) });
  const { data } = await api.get(`/api/admin/organizations?${params}`);
  return data;
}

export async function updateAdminUser(
  userId: number,
  payload: { name?: string; role?: string },
): Promise<DefaultResponse<unknown>> {
  const { data } = await api.put(`/api/admin/users/${userId}`, payload);
  return data;
}


// ---------------------------------------------------------------------------
// Organizations (client-side actions)
// ---------------------------------------------------------------------------

export async function createOrganization(payload: {
  name: string;
  ico: string;
  website: string;
  contactEmail: string;
}): Promise<DefaultResponse<Organization>> {
  const { data } = await api.post<DefaultResponse<Organization>>(
    "/api/organization",
    payload,
  );
  return data;
}

export async function deleteOrganization(orgId: number): Promise<DefaultResponse<boolean>> {
  const { data } = await api.delete<DefaultResponse<boolean>>(`/api/Organization/${orgId}`);
  return data;
}

export async function fetchMyOrganizationsClient(): Promise<
  DefaultResponse<Organization[]>
> {
  const { data } = await api.get<DefaultResponse<Organization[]>>(
    "/api/organization/my",
  );
  return data;
}

export async function fetchAllOrganizations(): Promise<
  DefaultResponse<Organization[]>
> {
  const { data } = await api.get<DefaultResponse<Organization[]>>("/api/Organization/all");
  return data;
}

export async function fetchAresData(ico: string): Promise<
  DefaultResponse<{ ico: string; companyName: string }>
> {
  const { data } = await api.get<DefaultResponse<{ ico: string; companyName: string }>>(
    `/api/ares/${ico}`,
  );
  return data;
}

export async function verifyOrganization(
  orgId: number,
  method: string,
  note?: string,
): Promise<DefaultResponse<VerificationTokenResponse>> {
  const { data } = await api.post<DefaultResponse<VerificationTokenResponse>>(
    `/api/organization/${orgId}/verify`,
    { method, note },
  );
  return data;
}

export async function checkOrganizationVerification(
  orgId: number,
): Promise<DefaultResponse<boolean>> {
  const { data } = await api.post<DefaultResponse<boolean>>(
    `/api/organization/${orgId}/verify/check`
  );
  return data;
}

// ---------------------------------------------------------------------------
// Admin actions (client-side)
// ---------------------------------------------------------------------------

export async function fetchAuditLogsClient(
  page = 1,
  pageSize = 20,
  entityName?: string,
) {
  const params = new URLSearchParams({
    Page: String(page),
    PageSize: String(pageSize),
  });
  if (entityName) params.set("EntityName", entityName);

  const { data } = await api.get<
    DefaultResponse<
      import("@/types/api").PagedResult<import("@/types/api").AuditLogItem>
    >
  >(`/api/admin/audit-logs?${params}`);
  return data;
}

export async function blockUserAction(
  userId: number,
  payload: Omit<BlockUserRequest, "userId">,
): Promise<DefaultResponse<unknown>> {
  const { data } = await api.post<DefaultResponse<unknown>>(
    `/api/admin/users/${userId}/block`,
    { userId, ...payload },
  );
  return data;
}

export async function blockOrganizationAction(
  orgId: number,
  payload: Omit<BlockOrganizationRequest, "organizationId">,
): Promise<DefaultResponse<unknown>> {
  const { data } = await api.post<DefaultResponse<unknown>>(
    `/api/admin/organizations/${orgId}/block`,
    { organizationId: orgId, ...payload },
  );
  return data;
}

export async function approveOrganizationAction(
  orgId: number,
  status: "verified" | "rejected"
): Promise<DefaultResponse<unknown>> {
  const { data } = await api.put<DefaultResponse<unknown>>(
    `/api/admin/organizations/${orgId}/verify`,
    { verificationStatus: status }
  );
  return data;
}

export default api;
