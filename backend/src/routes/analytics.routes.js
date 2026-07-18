import express from 'express';
import {
  getAnalytics,
  getDashboardSummary,
  getRevenueTrends,
  recordAnalytics,
  getTopProducts,
  getBranchPerformance,
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get analytics data
router.get('/', getAnalytics);

// Get dashboard summary
router.get('/dashboard/summary', getDashboardSummary);

// Get revenue trends
router.get('/revenue/trends', getRevenueTrends);

// Get top products
router.get('/products/top', getTopProducts);

// Get branch performance
router.get('/branches/performance', getBranchPerformance);

// Record analytics data
router.post('/', recordAnalytics);

export default router;
