import express from 'express';
import {
  getBestSellingProducts,
  getSlowMovingProducts,
  getBranchPerformance,
  getRevenueGrowth,
  getProfitMargin,
  getCustomerRetention,
  getAverageBasketSize,
  getSalesByPaymentMethod,
  getPeakShoppingHours,
} from '../controllers/analyticsEnhanced.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Analytics endpoints
router.get('/best-selling', checkPermission('analytics.view'), getBestSellingProducts);
router.get('/slow-moving', checkPermission('analytics.view'), getSlowMovingProducts);
router.get('/branch-performance', checkPermission('analytics.view'), getBranchPerformance);
router.get('/revenue-growth', checkPermission('analytics.view'), getRevenueGrowth);
router.get('/profit-margin', checkPermission('analytics.view'), getProfitMargin);
router.get('/customer-retention', checkPermission('analytics.view'), getCustomerRetention);
router.get('/basket-size', checkPermission('analytics.view'), getAverageBasketSize);
router.get('/payment-methods', checkPermission('analytics.view'), getSalesByPaymentMethod);
router.get('/peak-hours', checkPermission('analytics.view'), getPeakShoppingHours);

export default router;
