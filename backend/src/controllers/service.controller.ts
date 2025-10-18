import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logger } from '../utils/logger';
import crypto from 'crypto';

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, imageUrl, duration } = req.body;

    // Generate a unique token for the service request
    const token = crypto.randomBytes(16).toString('hex');

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        duration,
        token,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      status: 'success',
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      status: 'success',
      data: { services },
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceByToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    const service = await prisma.service.findUnique({
      where: { token },
    });

    if (!service) {
      throw new AppError(404, 'Service request not found');
    }

    res.json({
      status: 'success',
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

export const updateServiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { status } = req.body;

    const service = await prisma.service.update({
      where: { token },
      data: { status },
    });

    res.json({
      status: 'success',
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    await prisma.service.delete({
      where: { token },
    });

    res.json({
      status: 'success',
      message: 'Service request deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}; 