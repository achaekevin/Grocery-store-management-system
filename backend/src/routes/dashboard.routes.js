import express from 'express';
import {
  getDashboardStats,
  getQuickStats,
} from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Dashboard statistics
router.get('/stats', checkPermission('dashboard.view'), getDashboardStats);
router.get('/quick-stats', checkPermission('dashboard.view'), getQuickStats);

export default router;
