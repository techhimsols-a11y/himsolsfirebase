import { Router } from 'express';
import {
  createCart,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller';

const router = Router();

// Create a new cart
router.post('/', createCart);

// Get cart by token
router.get('/:token', getCart);

// Add item to cart
router.post('/:token/items', addToCart);

// Update cart item
router.patch('/:token/items/:itemId', updateCartItem);

// Remove item from cart
router.delete('/:token/items/:itemId', removeFromCart);

// Clear cart
router.delete('/:token', clearCart);

export default router; 