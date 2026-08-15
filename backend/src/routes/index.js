import express from 'express';
import { authLimiter, apiLimiter } from '../middleware/rateLimiter.js';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import posRoutes from './pos.routes.js';
import inventoryRoutes from './inventory.routes.js';
import customerRoutes from './customer.routes.js';
import mpesaRoutes from './mpesa.routes.js';
import userRoutes from './user.routes.js';
import branchRoutes from './branch.routes.js';
import supplierRoutes from './supplier.routes.js';
import reportRoutes from './report.routes.js';
import insightsRoutes from './insights.routes.js';
import analyticsRoutes from './analytics.routes.js';
import searchRoutes from './search.routes.js';
import widgetsRoutes from './widgets.routes.js';
import reviewsRoutes from './reviews.routes.js';
import loyaltyRoutes from './loyalty.routes.js';
import promotionsRoutes from './promotions.routes.js';
import stockTransferRoutes from './stockTransfer.routes.js';
import purchaseOrderRoutes from './purchaseOrder.routes.js';
import purchaseRequestRoutes from './purchaseRequest.routes.js';
import financialRoutes from './financial.routes.js';
import auditRoutes from './audit.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import advancedSearchRoutes from './advancedSearch.routes.js';
import analyticsEnhancedRoutes from './analyticsEnhanced.routes.js';
import customerPortalRoutes from './customerPortal.routes.js';
import roleRoutes from './role.routes.js';

const router = express.Router();

/**
 * Apply API rate limiter to all routes
 * 1000 requests per hour per IP
 */
router.use(apiLimiter);

/**
 * Health check route
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API routes
 * Auth routes have strict rate limiting (5 attempts per 15 minutes)
 */
router.use('/auth', authLimiter, authRoutes);
router.use('/products', productRoutes);
router.use('/pos', posRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/customers', customerRoutes);
router.use('/mpesa', mpesaRoutes);
router.use('/users', userRoutes);
router.use('/branches', branchRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/reports', reportRoutes);

// New feature routes
router.use('/insights', insightsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/search', searchRoutes);
router.use('/widgets', widgetsRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/loyalty', loyaltyRoutes);
router.use('/promotions', promotionsRoutes);

// Purchase and inventory management routes
router.use('/stock-transfers', stockTransferRoutes);
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/purchase-requests', purchaseRequestRoutes);

// Financial and audit routes
router.use('/financial', financialRoutes);
router.use('/audit', auditRoutes);

// Dashboard and analytics
router.use('/dashboard', dashboardRoutes);
router.use('/advanced-search', advancedSearchRoutes);
router.use('/analytics-enhanced', analyticsEnhancedRoutes);
router.use('/customer', customerPortalRoutes);

router.use('/roles', roleRoutes);

export default router;
