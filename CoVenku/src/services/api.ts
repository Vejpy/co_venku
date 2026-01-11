import axios from "axios";

const api = axios.create({
  baseURL: "https://api-venku.bezvod.cz/api",
  timeout: 10000,
});


export async function get(endpoint: string, options = {}) { 
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
  return await get("/CulturePlace/All");
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

export default api;
