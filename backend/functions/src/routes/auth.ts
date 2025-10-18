
import { Router } from 'express';
import * as admin from 'firebase-admin';

const router = Router();
const db = admin.firestore();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ error: 'Name, email, and password are required' });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      mobile,
      role: 'USER',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).send({ error: 'Something went wrong' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).send({ error: 'User not found' });
    }

    return res.status(200).send(userDoc.data());
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).send({ error: 'Something went wrong' });
  }
});

export default router;
