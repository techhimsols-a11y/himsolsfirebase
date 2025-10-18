import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

// Dashboard Analytics
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalTrees,
      totalServiceRequests,
      recentOrders,
      recentServiceRequests,
      monthlyStats
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.tree.count(),
      prisma.serviceRequest.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { 
          user: { select: { name: true, email: true } },
          items: { include: { tree: true } }
        }
      }),
      prisma.serviceRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      // Monthly statistics for charts
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true }
      })
    ]);

    res.json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          totalOrders,
          totalTrees,
          totalServiceRequests
        },
        recentOrders,
        recentServiceRequests,
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// User Management
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            requests: true
          }
        }
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where });

    res.json({
      status: 'success',
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      throw new AppError(400, 'Invalid role. Must be USER or ADMIN');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Tree Management
export const createTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, stock, imageUrl, category, scientificName, growthTime, height, benefits } = req.body;

    if (!name || !description || !price || !stock || !category) {
      throw new AppError(400, 'Missing required fields');
    }

    const tree = await prisma.tree.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl: imageUrl || '',
        category,
        scientificName: scientificName || '',
        growthTime: growthTime || '',
        height: height || '',
        benefits: Array.isArray(benefits) ? benefits : [benefits || '']
      }
    });

    res.status(201).json({
      status: 'success',
      data: { tree }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.benefits && !Array.isArray(updateData.benefits)) {
      updateData.benefits = [updateData.benefits];
    }

    const tree = await prisma.tree.update({
      where: { id },
      data: updateData
    });

    res.json({
      status: 'success',
      data: { tree }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Check if tree exists
    const tree = await prisma.tree.findUnique({
      where: { id }
    });

    if (!tree) {
      throw new AppError(404, 'Tree not found');
    }

    await prisma.tree.delete({
      where: { id }
    });

    res.json({
      status: 'success',
      message: 'Tree deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTrees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (category) where.category = category;

    const trees = await prisma.tree.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.tree.count({ where });

    res.json({
      status: 'success',
      data: {
        trees,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Order Management
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { user: { name: { contains: search as string, mode: 'insensitive' } } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } }
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { tree: true } }
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.order.count({ where });

    res.json({
      status: 'success',
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new AppError(400, 'Invalid status');
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { tree: true } }
      }
    });

    res.json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// Service Request Management
export const getAllServiceRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, status, type, search } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { customerName: { contains: search as string, mode: 'insensitive' } },
        { customerEmail: { contains: search as string, mode: 'insensitive' } },
        { customerMobile: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const serviceRequests = await prisma.serviceRequest.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.serviceRequest.count({ where });

    res.json({
      status: 'success',
      data: {
        serviceRequests,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateServiceRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'IN_PROCESS', 'VERIFICATION', 'FULFILLED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new AppError(400, 'Invalid status');
    }

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id },
      data: { status }
    });

    res.json({
      status: 'success',
      data: { serviceRequest }
    });
  } catch (error) {
    next(error);
  }
}; 