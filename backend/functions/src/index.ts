
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import treeRoutes from './routes/trees';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/trees', treeRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Firebase!');
});

// Export the Express API as a Cloud Function
export const api = functions.https.onRequest(app);
