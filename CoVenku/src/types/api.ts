// ============================================================================
// CoVenku API Types — aligned with OpenAPI v1 spec
// ============================================================================

// ---------------------------------------------------------------------------
// Generic API wrapper (every endpoint uses DefaultResponse<T>)
// ---------------------------------------------------------------------------

export interface DefaultResponse<T> {
  type: string | null;
  message: string | null;
  data: T;
}

// ---------------------------------------------------------------------------
// Address
// ---------------------------------------------------------------------------

export interface Address {
  id: number;
  city: string | null;
  street: string | null;
  houseNumber: string | null;
  zipCode: string | null;
  lat: number | null;
  lon: number | null;
  regionId: number | null;
}

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export interface User {
  id: number;
  name: string | null;
  email: string | null;
  role: string | null;
  addressId: number;
  birth: string;
  male: boolean;
  isBlocked: boolean;
  lastActive: string | null;
}

// ---------------------------------------------------------------------------
// CultureEvent (full — returned by /api/Event/owner/{id}, /api/Event/{id})
// ---------------------------------------------------------------------------

export interface EventTimeSlot {
  start: string;
  end: string | null;
}

export interface CultureEvent {
  id: number;
  name: string | null;
  description: string | null;
  type: string | null;
  ownerId: number;
  validFrom: string;
  validTo: string | null;
  isLongTerm: boolean;
  url: string | null;
  timeSlots: EventTimeSlot[] | null;
  culturePlaceId: number | null;
  organizationId: number | null;
  organizationName: string | null;
  address: Address;
  registrationStatus?: string | null;
}


// ---------------------------------------------------------------------------
// CultureEvent Request / Update
// ---------------------------------------------------------------------------

export interface CultureEventRequest {
  id: number;
  name: string | null;
  description: string | null;
  validFrom: string;
  validTo: string | null;
  isLongTerm: boolean;
  url: string | null;
  timeSlots: EventTimeSlot[] | null;
  culturePlaceId: number | null;
  type: string | null;
  organizationId: number | null;
}

export interface CreateEventRequest {
  name: string;
  description: string;
  validFrom: string;
  validTo: string | null;
  isLongTerm: boolean;
  url: string;
  timeSlots: EventTimeSlot[] | null;
  culturePlaceId: number;
  type: string;
  organizationId: number | null;
}

export interface UpdateEventRequestDto {
  name: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  culturePlaceId: number | null;
  type: string | null;
  organizationId: number | null;
}

// ---------------------------------------------------------------------------
// CulturePlace
// ---------------------------------------------------------------------------

export interface CulturePlace {
  id: number;
  name: string | null;
  description: string | null;
  webUrl: string | null;
  other: string | null;
  type: string | null;
  city: string | null;
  street: string | null;
  houseNumber: string | null;
  zipCode: string | null;
  lat: number;
  lon: number;
  organizationId: number | null;
  address: Address;
}

export interface CulturePlaceRequest {
  name: string;
  description: string;
  webUrl: string;
  type: string;
  other: string;
  addressId: number;
  organizationId: number;
}

export interface AddressRequest {
  city: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  lat: number;
  lon: number;
  regionId: number;
  district?: string;
}

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------

export interface Organization {
  id: number;
  ownerId: number;
  name: string | null;
  ico: string | null;
  website: string | null;
  contactEmail: string | null;
  verificationStatus: string | null;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationRequest {
  name: string;
  ico: string;
  website: string;
  contactEmail: string;
}

export interface VerifyOrganizationRequest {
  method: string; // "dns" | "meta" | "manual"
}

export interface VerificationTokenResponse {
  organizationId: number;
  token: string | null;
  method: string | null;
  instructions: string | null;
  expiresAt: string;
}

// ---------------------------------------------------------------------------
// Admin — Block
// ---------------------------------------------------------------------------

export interface BlockUserRequest {
  userId: number;
  isBlocked: boolean;
  reason: string | null;
}

export interface BlockOrganizationRequest {
  organizationId: number;
  isBlocked: boolean;
  reason: string | null;
}

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------

export interface AuditLogItem {
  id: number;
  userId: number | null;
  userName: string | null;
  action: string | null;
  entityName: string | null;
  entityId: string | null;
  oldValues: string | null;
  newValues: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[] | null;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface TimeSeriesPoint {
  date: string | null;
  count: number;
}

export interface DemographicPoint {
  group: string | null;
  count: number;
}

export interface GenderPoint {
  gender: string | null;
  count: number;
}

export interface EventAnalyticsDto {
  totalAttendees: number;
  salesOverTime: TimeSeriesPoint[] | null;
  ageDemographics: DemographicPoint[] | null;
  genderDemographics: GenderPoint[] | null;
}

/** Public stats — GET /api/Event/Stats */
export interface AppStats {
  events: number;
  places: number;
  users: number;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
  sex: number;
  birthDate: string;
}
