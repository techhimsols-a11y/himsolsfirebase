import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8888";

// Create axios instance with credentials
const adminApi = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Add request interceptor to include auth token
adminApi.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const userData = JSON.parse(user);
    // You can add token here if needed
  }
  return config;
});

// Add response interceptor for error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export interface Tree {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  scientificName: string;
  growthTime: string;
  height: string;
  benefits: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalServiceRequests: number; // Remove totalOrders
    totalTrees: number;
  };
  recentServiceRequests: any[]; // Remove recentOrders
  monthlyStats: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Dashboard API
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await adminApi.get("/api/admin/dashboard");
  return response.data.data;
};

// Trees API
export const getTrees = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<PaginatedResponse<Tree>> => {
  const response = await adminApi.get("/api/admin/trees", { params });
  // The admin endpoint returns { data: { trees: [...], pagination: {...} } }
  return {
    data: response.data.data.trees,
    pagination: response.data.data.pagination,
  };
};

export const createTree = async (
  treeData: Omit<Tree, "id" | "createdAt" | "updatedAt">
): Promise<Tree> => {
  const response = await adminApi.post("/api/admin/trees", treeData);
  return response.data.data;
};

export const updateTree = async (
  id: string,
  treeData: Partial<Tree>
): Promise<Tree> => {
  const response = await adminApi.put(`/api/admin/trees/${id}`, treeData);
  return response.data.data;
};

export const deleteTree = async (id: string): Promise<void> => {
  await adminApi.delete(`/api/trees/${id}`);
};

// Users API
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<PaginatedResponse<any>> => {
  const response = await adminApi.get("/api/admin/users", { params });
  return response.data.data;
};

export const updateUserRole = async (
  userId: string,
  role: "USER" | "ADMIN"
): Promise<any> => {
  const response = await adminApi.patch(`/api/admin/users/${userId}/role`, {
    role,
  });
  return response.data.data;
};

// Remove Orders API and use Service Requests instead
export const getServiceRequests = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<{ serviceRequests: any[]; pagination: any }> => {
  const response = await adminApi.get("/api/admin/service-requests", {
    params,
  });
  return {
    serviceRequests: response.data.data.serviceRequests,
    pagination: response.data.data.pagination,
  };
};

// New function to get all service requests for CSV export
export const getAllServiceRequestsForCSV = async (params?: {
  status?: string;
  search?: string;
  type?: string;
}): Promise<{ serviceRequests: any[]; pagination: any }> => {
  const response = await adminApi.get("/api/admin/service-requests", {
    params: {
      ...params,
      limit: 1000, // Request a large number to get all records
      page: 1
    },
  });
  return {
    serviceRequests: response.data.data.serviceRequests,
    pagination: response.data.data.pagination,
  };
};

export const updateServiceRequestStatus = async (
  requestId: string,
  status: string
): Promise<any> => {
  const response = await adminApi.patch(
    `/api/admin/service-requests/${requestId}/status`,
    {
      status,
    }
  );
  return response.data.data;
};

export default adminApi;
