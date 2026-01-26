// API Response Models - přesně podle backend dokumentace

export interface Address {
  Id: number;
  City: string;
  Street: string;
  HouseNumber: string;
  Lat: number | null;
  Lon: number | null;
}

export interface CultureEvent {
  Id: number;
  Name: string;
  Description: string;
  StartDate: string; // ISO DateTime string
  EndDate: string | null; // ISO DateTime string
  CulturePlaceId: number | null;
  Address: Address;
  Organizer: string;
}

// API Response wrapper (pokud backend vrací obalenou odpověď)
export interface ApiResponse<T> {
  Type: string;
  Message: string;
  Data: T;
}

// Auth types
export interface LoginPayload {
  Input: string; // username or email
  Password: string;
}

export interface LoginResponse {
  Data: string; // JWT Token
}

export interface RegisterPayload {
  Name: string;
  Email: string;
  Password: string;
}

// Event Stats
export interface EventStats {
  Events: number;
  Places: number;
  Users: number;
}

// Create/Edit Event payload
export interface CreateEventPayload {
  Name: string;
  Description: string;
  StartDate: string;
  EndDate?: string;
  CulturePlaceId?: number;
  Type: string;
}

export interface EditEventPayload extends CreateEventPayload {
  Id: number;
}
