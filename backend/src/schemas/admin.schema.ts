import { z } from 'zod';

// Dashboard validation
export const dashboardStatsSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
});

// User management validation
export const getAllUsersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => parseInt(val || '1')),
    limit: z.string().optional().transform(val => parseInt(val || '10')),
    search: z.string().optional(),
    role: z.enum(['USER', 'ADMIN']).optional()
  })
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z.string().uuid()
  }),
  body: z.object({
    role: z.enum(['USER', 'ADMIN'])
  })
});

// Tree management validation
export const createTreeSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    stock: z.number().int().min(0, 'Stock must be non-negative'),
    imageUrl: z.string().url('Invalid image URL').optional(),
    category: z.string().min(1, 'Category is required'),
    scientificName: z.string().optional(),
    growthTime: z.string().optional(),
    height: z.string().optional(),
    benefits: z.array(z.string()).optional()
  })
});

export const updateTreeSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
    imageUrl: z.string().url().optional(),
    category: z.string().min(1).optional(),
    scientificName: z.string().optional(),
    growthTime: z.string().optional(),
    height: z.string().optional(),
    benefits: z.array(z.string()).optional()
  })
});

export const deleteTreeSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const getAllTreesSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => parseInt(val || '1')),
    limit: z.string().optional().transform(val => parseInt(val || '10')),
    search: z.string().optional(),
    category: z.string().optional()
  })
});

// Order management validation
export const getAllOrdersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => parseInt(val || '1')),
    limit: z.string().optional().transform(val => parseInt(val || '10')),
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
    search: z.string().optional()
  })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  })
});

// Service request management validation
export const getAllServiceRequestsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => parseInt(val || '1')),
    limit: z.string().optional().transform(val => parseInt(val || '10')),
    status: z.enum(['PENDING', 'IN_PROCESS', 'VERIFICATION', 'FULFILLED', 'CANCELLED']).optional(),
    type: z.enum(['TREE_PLANTATION', 'WASTE_MANAGEMENT', 'ENVIRONMENTAL_CONSULTING', 'ECO_TOURISM', 'OTHER']).optional(),
    search: z.string().optional()
  })
});

export const updateServiceRequestStatusSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    status: z.enum(['PENDING', 'IN_PROCESS', 'VERIFICATION', 'FULFILLED', 'CANCELLED'])
  })
}); 