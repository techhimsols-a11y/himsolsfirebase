import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logger } from '../utils/logger';

export const createTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, stock, imageUrl, category, scientificName, growthTime, height, benefits } = req.body;

    const tree = await prisma.tree.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        category,
        scientificName,
        growthTime,
        height,
        benefits,
      },
    });

    res.status(201).json({
      status: 'success',
      data: { tree },
    });
  } catch (error) {
    next(error);
  }
};

export const getTrees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trees = await prisma.tree.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      status: 'success',
      data: { trees },
    });
  } catch (error) {
    next(error);
  }
};

export const getTreeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const tree = await prisma.tree.findUnique({
      where: { id },
    });

    if (!tree) {
      throw new AppError(404, 'Tree not found');
    }

    res.json({
      status: 'success',
      data: { tree },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl, category, scientificName, growthTime, height, benefits } = req.body;

    const tree = await prisma.tree.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        category,
        scientificName,
        growthTime,
        height,
        benefits,
      },
    });

    res.json({
      status: 'success',
      data: { tree },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.tree.delete({
      where: { id },
    });

    res.json({
      status: 'success',
      message: 'Tree deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}; 