import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logger } from '../utils/logger';
import crypto from 'crypto';

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { token },
      include: {
        items: {
          include: {
            tree: true,
          },
        },
      },
    });

    if (!cart) {
      // Create a new cart if it doesn't exist
      const newCart = await prisma.cart.create({
        data: { token },
        include: {
          items: {
            include: {
              tree: true,
            },
          },
        },
      });
      return res.json({
        status: 'success',
        data: { cart: newCart },
      });
    }

    res.json({
      status: 'success',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const createCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = crypto.randomBytes(16).toString('hex');

    const cart = await prisma.cart.create({
      data: { token },
      include: {
        items: {
          include: {
            tree: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { treeId, quantity } = req.body;

    // Check if tree exists and has enough stock
    const tree = await prisma.tree.findUnique({
      where: { id: treeId },
    });

    if (!tree) {
      throw new AppError(404, 'Tree not found');
    }

    if (tree.stock < quantity) {
      throw new AppError(400, 'Not enough stock available');
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { token },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { token },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        treeId,
      },
    });

    let cartItem;
    if (existingItem) {
      // Update quantity if item exists
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { tree: true },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          treeId,
          quantity,
        },
        include: { tree: true },
      });
    }

    res.json({
      status: 'success',
      data: { cartItem },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, itemId } = req.params;
    const { quantity } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { token },
    });

    if (!cart) {
      throw new AppError(404, 'Cart not found');
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: { tree: true },
    });

    if (!cartItem) {
      throw new AppError(404, 'Cart item not found');
    }

    if (cartItem.tree.stock < quantity) {
      throw new AppError(400, 'Not enough stock available');
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { tree: true },
    });

    res.json({
      status: 'success',
      data: { cartItem: updatedCartItem },
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, itemId } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { token },
    });

    if (!cart) {
      throw new AppError(404, 'Cart not found');
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    res.json({
      status: 'success',
      message: 'Item removed from cart',
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { token },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    res.json({
      status: 'success',
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    next(error);
  }
}; 