import express from 'express';
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

const router = express.Router();

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
 */
router.use('/auth', authRoutes);
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

// Additional routes to be added:
// router.use('/purchases', purchaseRoutes);
// router.use('/expenses', expenseRoutes);
// router.use('/roles', roleRoutes);
// router.use('/settings', settingRoutes);

export default router;
