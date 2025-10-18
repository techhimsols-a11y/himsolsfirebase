
import { Router } from 'express';
import * as admin from 'firebase-admin';

const router = Router();
const db = admin.firestore();

// Get or create cart
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is sent in the request body
    let cartRef = db.collection('carts').doc(userId);
    let cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      await cartRef.set({ userId, items: [], createdAt: admin.firestore.FieldValue.serverTimestamp() });
      cartDoc = await cartRef.get();
    }

    res.status(200).send({ id: cartDoc.id, ...cartDoc.data() });
  } catch (error) {
    console.error('Error getting or creating cart:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

// Add to cart
router.post('/:cartId/items', async (req, res) => {
  try {
    const { cartId } = req.params;
    const { treeId, quantity } = req.body;

    const treeDoc = await db.collection('trees').doc(treeId).get();
    if (!treeDoc.exists) {
      return res.status(404).send({ error: 'Tree not found' });
    }

    const cartRef = db.collection('carts').doc(cartId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).send({ error: 'Cart not found' });
    }

    const items = cartDoc.data()?.items || [];
    const existingItemIndex = items.findIndex((item: any) => item.treeId === treeId);

    if (existingItemIndex > -1) {
      items[existingItemIndex].quantity += quantity;
    } else {
      items.push({ treeId, quantity });
    }

    await cartRef.update({ items });
    res.status(200).send({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

// Update cart item
router.patch('/:cartId/items/:itemId', async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;

    const cartRef = db.collection('carts').doc(cartId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).send({ error: 'Cart not found' });
    }

    const items = cartDoc.data()?.items || [];
    const itemIndex = items.findIndex((item: any) => item.treeId === itemId);

    if (itemIndex === -1) {
      return res.status(404).send({ error: 'Item not found in cart' });
    }

    items[itemIndex].quantity = quantity;

    await cartRef.update({ items });
    res.status(200).send({ message: 'Cart item updated' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

// Remove from cart
router.delete('/:cartId/items/:itemId', async (req, res) => {
  try {
    const { cartId, itemId } = req.params;

    const cartRef = db.collection('carts').doc(cartId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).send({ error: 'Cart not found' });
    }

    const items = cartDoc.data()?.items || [];
    const updatedItems = items.filter((item: any) => item.treeId !== itemId);

    await cartRef.update({ items: updatedItems });
    res.status(200).send({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

// Clear cart
router.delete('/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;

    const cartRef = db.collection('carts').doc(cartId);
    await cartRef.update({ items: [] });

    res.status(200).send({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

export default router;
