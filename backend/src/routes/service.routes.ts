import { Router } from 'express';
import {
  createService,
  getServices,
  getServiceByToken,
  updateServiceStatus,
  deleteService,
} from '../controllers/service.controller';

const router = Router();

// Create a new service request
router.post('/', createService);

// Get all service requests
router.get('/', getServices);

// Get service request by token
router.get('/:token', getServiceByToken);

// Update service request status
router.patch('/:token/status', updateServiceStatus);

// Delete service request
router.delete('/:token', deleteService);

export default router; 