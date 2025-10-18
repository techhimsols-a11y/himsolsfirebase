
import { Router } from 'express';
import * as admin from 'firebase-admin';

const router = Router();
const db = admin.firestore();

// Create an order
router.post('/', async (req, res) => {
  try {
    const { userId, cartId } = req.body;

    const cartRef = db.collection('carts').doc(cartId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists || !cartDoc.data()?.items.length) {
      return res.status(400).send({ error: 'Cart is empty' });
    }

    const items = cartDoc.data()?.items;
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const treeDoc = await db.collection('trees').doc(item.treeId).get();
      if (treeDoc.exists) {
        total += treeDoc.data()?.price * item.quantity;
        orderItems.push({
          treeId: item.treeId,
          quantity: item.quantity,
          price: treeDoc.data()?.price,
        });
      }
    }

    const orderRef = await db.collection('orders').add({
      userId,
      items: orderItems,
      total,
      status: 'PENDING',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await cartRef.update({ items: [] });

    res.status(201).send({ id: orderRef.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

// Get user's orders
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('orders').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).send(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

// Get a single order
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const doc = await db.collection('orders').doc(orderId).get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Order not found' });
    }

    res.status(200).send({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});


// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    await db.collection('orders').doc(orderId).update({ status });

    res.status(200).send({ message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

export default router;
