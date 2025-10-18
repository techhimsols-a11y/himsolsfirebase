import { Tree } from '@/types/tree';
import { api } from '@/lib/axios';

interface ApiResponse<T> {
  status: string;
  data: {
    tree: T;
  };
}

interface ApiListResponse<T> {
  status: string;
  data: {
    trees: T[];
  };
}


export const getAllTrees = async (): Promise<Tree[]> => {
  try {
    const response = await api.get<ApiListResponse<Tree>>('/api/trees');
    
    // Check if response.data exists and has trees array
    if (!response.data?.data?.trees || !Array.isArray(response.data.data.trees)) {
      console.error('Invalid response format:', response.data);
      return [];
    }
    
    return response.data.data.trees;
  } catch (error) {
    console.error('Error fetching trees:', error);
    throw error;
  }
};

export const getTreeById = async (id: string): Promise<Tree> => {
  try {
    const response = await api.get<ApiResponse<Tree>>(`/api/trees/${id}`);
    
    if (!response.data?.data?.tree) {
      throw new Error('Invalid response format');
    }
    
    return response.data.data.tree;
  } catch (error) {
    console.error('Error fetching tree:', error);
    throw error;
  }
};

// Add more API functions as needed 