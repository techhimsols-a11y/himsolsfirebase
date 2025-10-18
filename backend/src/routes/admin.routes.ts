import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  createTree,
  updateTree,
  deleteTree,
  getAllTrees,
  getAllOrders,
  updateOrderStatus,
  getAllServiceRequests,
  updateServiceRequestStatus
} from '../controllers/admin.controller';
import {
  dashboardStatsSchema,
  getAllUsersSchema,
  updateUserRoleSchema,
  createTreeSchema,
  updateTreeSchema,
  deleteTreeSchema,
  getAllTreesSchema,
  getAllOrdersSchema,
  updateOrderStatusSchema,
  getAllServiceRequestsSchema,
  updateServiceRequestStatusSchema
} from '../schemas/admin.schema';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN'));

// Dashboard
router.get('/dashboard', validateRequest(dashboardStatsSchema), getDashboardStats);

// User Management
router.get('/users', validateRequest(getAllUsersSchema), getAllUsers);
router.patch('/users/:userId/role', validateRequest(updateUserRoleSchema), updateUserRole);

// Tree Management
router.get('/trees', validateRequest(getAllTreesSchema), getAllTrees);
router.post('/trees', validateRequest(createTreeSchema), createTree);
router.put('/trees/:id', validateRequest(updateTreeSchema), updateTree);
router.delete('/trees/:id', validateRequest(deleteTreeSchema), deleteTree);

// Order Management
router.get('/orders', validateRequest(getAllOrdersSchema), getAllOrders);
router.patch('/orders/:id/status', validateRequest(updateOrderStatusSchema), updateOrderStatus);

// Service Request Management
router.get('/service-requests', validateRequest(getAllServiceRequestsSchema), getAllServiceRequests);
router.patch('/service-requests/:id/status', validateRequest(updateServiceRequestStatusSchema), updateServiceRequestStatus);

export default router; 