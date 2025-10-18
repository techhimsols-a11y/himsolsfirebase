import { api } from '@/lib/axios';

export type ServiceRequestType = 'TREE_PLANTATION' | 'WASTE_MANAGEMENT' | 'ENVIRONMENTAL_CONSULTING' | 'ECO_TOURISM' | 'OTHER';
export type ServiceRequestStatus = 'PENDING' | 'IN_PROCESS' | 'VERIFICATION' | 'FULFILLED' | 'CANCELLED';

export interface ServiceRequestItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ServiceRequest {
  requestId: string;
  type: ServiceRequestType;
  status: ServiceRequestStatus;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  customerAddress: string;
  customerPincode: string;
  customerNotes?: string;
  items: ServiceRequestItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequestPayload {
  type: ServiceRequestType;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  customerAddress: string;
  customerPincode: string;
  customerNotes?: string;
  items: ServiceRequestItem[];
  total: number;
}

export const serviceRequestService = {
  async createServiceRequest(payload: CreateServiceRequestPayload): Promise<ServiceRequest> {
    const response = await api.post<{ success: boolean; data: ServiceRequest }>('/api/requests', payload);
    return response.data.data;
  },

  async getServiceRequest(requestId: string): Promise<ServiceRequest> {
    const response = await api.get<{ success: boolean; data: ServiceRequest }>(`/api/requests/${requestId}`);
    return response.data.data;
  },

  async listServiceRequests(params?: { 
    type?: ServiceRequestType; 
    status?: ServiceRequestStatus;
  }): Promise<ServiceRequest[]> {
    const response = await api.get<{ success: boolean; data: ServiceRequest[] }>('/api/requests', { params });
    return response.data.data;
  }
}; 