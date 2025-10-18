import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createServiceRequestSchema = z.object({
  type: z.enum(['TREE_PLANTATION', 'WASTE_MANAGEMENT', 'ENVIRONMENTAL_CONSULTING', 'ECO_TOURISM', 'OTHER']),
  customerName: z.string().min(1),
  customerMobile: z.string().min(10),
  customerEmail: z.string().email().optional().or(z.literal('')),
  customerAddress: z.string().min(1),
  customerPincode: z.string().min(6),
  customerNotes: z.string().optional().or(z.literal('')),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })).optional(),
  total: z.number().min(0).optional(),
});

const updateServiceRequestSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROCESS', 'VERIFICATION', 'FULFILLED', 'CANCELLED']).optional(),
  customerNotes: z.string().optional(),
});

// Generate a unique request ID
const generateRequestId = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `TR${timestamp}`;
};

// Create a new service request
export const createServiceRequest = async (req: Request, res: Response) => {
  try {
    const validatedData = createServiceRequestSchema.parse(req.body);
    const requestId = generateRequestId();

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        requestId,
        type: validatedData.type,
        customerName: validatedData.customerName,
        customerMobile: validatedData.customerMobile,
        customerEmail: validatedData.customerEmail,
        customerAddress: validatedData.customerAddress,
        customerPincode: validatedData.customerPincode,
        customerNotes: validatedData.customerNotes,
        items: validatedData.items,
        total: validatedData.total,
        userId: req.user?.id, // If user is authenticated
      },
    });

    res.status(201).json({
      success: true,
      data: serviceRequest,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create service request',
      });
    }
  }
};

// Get all service requests (with optional filtering)
export const getServiceRequests = async (req: Request, res: Response) => {
  try {
    const { type, status, userId } = req.query;
    
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const serviceRequests = await prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: serviceRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service requests',
    });
  }
};

// Get a single service request by ID
export const getServiceRequestById = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { requestId },
    });

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        error: 'Service request not found',
      });
    }

    res.json({
      success: true,
      data: serviceRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service request',
    });
  }
};

// Update a service request
export const updateServiceRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const validatedData = updateServiceRequestSchema.parse(req.body);

    const serviceRequest = await prisma.serviceRequest.update({
      where: { requestId },
      data: validatedData,
    });

    res.json({
      success: true,
      data: serviceRequest,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to update service request',
      });
    }
  }
};

// Delete a service request
export const deleteServiceRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    await prisma.serviceRequest.delete({
      where: { requestId },
    });

    res.json({
      success: true,
      message: 'Service request deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete service request',
    });
  }
}; 