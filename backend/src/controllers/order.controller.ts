import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logger } from '../utils/logger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaClient, CartItem, Tree } from '@prisma/client';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { token } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { token },
      include: {
        items: {
          include: {
            tree: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty or not found'
      });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.tree.price * item.quantity);
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total: totalAmount,
          status: 'PENDING', // Assuming OrderStatus is removed or replaced
          items: {
            create: cart.items.map(item => ({
              treeId: item.treeId,
              quantity: item.quantity,
              price: item.tree.price
            }))
          }
        },
        include: {
          items: true
        }
      });

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            tree: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      status: 'success',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: {
            tree: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    res.json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            tree: true,
          },
        },
      },
    });

    res.json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
}; 