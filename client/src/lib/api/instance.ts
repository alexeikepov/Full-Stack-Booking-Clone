import axios from "axios";

export const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  console.log(
    "API Request:",
    config.method?.toUpperCase(),
    config.url,
    "Token:",
    token ? "Present" : "Missing"
  );
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.response?.status,
      error.config?.url,
      error.message
    );
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);
