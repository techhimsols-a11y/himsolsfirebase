import express from 'express';
import {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
  deleteServiceRequest,
} from '../controllers/serviceRequest.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/', createServiceRequest);
router.get('/:requestId', getServiceRequestById);

// Protected routes (require authentication)
router.get('/', authenticate, getServiceRequests);
router.patch('/:requestId', authenticate, updateServiceRequest);
router.delete('/:requestId', authenticate, deleteServiceRequest);

export default router; 