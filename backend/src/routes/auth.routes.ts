import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
  adminLogin
} from '../controllers/auth.controller';
import { authenticate, optionalAuth } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(authenticate);
router.patch('/change-password', changePassword);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _optionalAuth = optionalAuth; // Keep for future use

export default router;
