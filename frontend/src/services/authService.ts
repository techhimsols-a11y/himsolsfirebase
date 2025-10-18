import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8888";

// Create axios instance with credentials for auth
const authApi = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Add response interceptor for error handling
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Auth API Error:", error);
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  mobile?: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
}

// Admin Login
export const adminLogin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await authApi.post("/api/auth/admin/login", {
    email,
    password,
  });
  return response.data;
};

// Regular User Login
export const userLogin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await authApi.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

// User Registration
export const userRegister = async (userData: {
  name: string;
  email: string;
  password: string;
  mobile?: string;
}): Promise<LoginResponse> => {
  const response = await authApi.post("/api/auth/register", userData);
  return response.data;
};

// Logout
export const logout = async (): Promise<void> => {
  await authApi.post("/api/auth/logout");
};

// Get Profile
export const getProfile = async (): Promise<User> => {
  const response = await authApi.get("/api/auth/profile");
  return response.data.data.user;
};

// Refresh Token
export const refreshToken = async (): Promise<LoginResponse> => {
  const response = await authApi.post("/api/auth/refresh");
  return response.data;
};
