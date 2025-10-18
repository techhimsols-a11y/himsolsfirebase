import { Router } from 'express';
import {
  createTree,
  getTrees,
  getTreeById,
  updateTree,
  deleteTree,
} from '../controllers/tree.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/', getTrees);
router.get('/:id', getTreeById);

// Protected routes
router.use(authenticate);
router.post('/', createTree);
router.patch('/:id', updateTree);
router.delete('/:id', deleteTree);

export default router; 