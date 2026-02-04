import axios, {
  AxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: "https://api-venku.bezvod.cz/api",
  timeout: 10000,
});

export async function get(
  endpoint: string,
  options: AxiosRequestConfig = {},
) {
  const response = await api.get(endpoint, options);

  if (response.status !== 200) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.data;
}

export async function post<T>(endpoint: string, data: T, options = {}) {
  const response = await api.post(endpoint, data, options);

  if (response.status !== 201) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.data;
}

export async function fetchCulturePlacesRaw() {
  const data = await get("/CulturePlace/All?description=false");

  if (!data || !Array.isArray(data.data)) {
    return { data: [] };
  }

  return data;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  userName: string;
  sex: number;
  birthDate: string;
}) {
  const response = await api.post("/user/Register", payload);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Registration failed with status ${response.status}`);
  }
  return response.data;
}

export async function loginUser(payload: {
  username: string;
  password: string;
}) {
  const response = await api.post("/user/Login", payload);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Login failed with status ${response.status}`);
  }
  return response.data;
}

// Get current user info
export async function getCurrentUser() {
  const response = await api.get("/user");
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to get user with status ${response.status}`);
  }
  return response.data;
}

// Event APIs
export async function fetchAllEvents() {
  const response = await api.get("/CulturePlace/All?description=false");
  return response.data;
}

export async function fetchUserEvents(ownerId: number) {
  const response = await api.get(`/Event/owner/${ownerId}`);
  return response.data;
}

export async function createEvent(payload: {
  name: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string | null;
  culturePlaceId: number | null;
}) {
  const response = await api.post("/Event/Create", payload);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to create event with status ${response.status}`);
  }
  return response.data;
}

export async function updateEvent(
  id: number,
  payload: {
    name: string;
    description: string;
    type: string;
    startDate: string;
    endDate: string | null;
    culturePlaceId: number | null;
  },
) {
  const response = await api.put(`/Event/${id}`, payload);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to update event with status ${response.status}`);
  }
  return response.data;
}

export async function deleteEvent(id: number) {
  const response = await api.delete(`/Event/${id}`);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to delete event with status ${response.status}`);
  }
  return response.data;
}

export async function signUpForEvent(eventId: number) {
  const response = await api.post(`/Event/EventSign/${eventId}`);
  return response.data;
}

export default api;
