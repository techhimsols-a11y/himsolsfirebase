
import { Router } from 'express';
import * as admin from 'firebase-admin';

const router = Router();
const db = admin.firestore();

// Create a tree
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, category, scientificName, growthTime, height, benefits } = req.body;

    const treeRef = await db.collection('trees').add({
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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).send({ id: treeRef.id });
  } catch (error) {
    console.error('Error creating tree:', error);
    return res.status(500).send({ error: 'Something went wrong' });
  }
});

// Get all trees
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('trees').orderBy('createdAt', 'desc').get();
    const trees = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).send(trees);
  } catch (error) {
    console.error('Error getting trees:', error);
    return res.status(500).send({ error: 'Something went wrong' });
  }
});

// Get a single tree
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('trees').doc(id).get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Tree not found' });
    }

    return res.status(200).send({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error getting tree:', error);
    return res.status(500).send({ error: 'Something went wrong' });
  }
});

// Update a tree
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl, category, scientificName, growthTime, height, benefits } = req.body;

    await db.collection('trees').doc(id).update({
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
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).send({ message: 'Tree updated successfully' });
  } catch (error) {
    console.error('Error updating tree:', error);
    return res.status(500).send({ error: 'Something went wrong' });
  }
});

// Delete a tree
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('trees').doc(id).delete();

    return res.status(200).send({ message: 'Tree deleted successfully' });
  } catch (error) {
    console.error('Error deleting tree:', error);
    return res.status(500).send({ error: 'Something went wrong' });
  }
});

export default router;
