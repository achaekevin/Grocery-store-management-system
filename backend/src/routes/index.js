import express from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import posRoutes from './pos.routes.js';
import inventoryRoutes from './inventory.routes.js';
import customerRoutes from './customer.routes.js';
import mpesaRoutes from './mpesa.routes.js';

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

// Additional routes to be added:
// router.use('/users', userRoutes);
// router.use('/branches', branchRoutes);
// router.use('/suppliers', supplierRoutes);
// router.use('/purchases', purchaseRoutes);
// router.use('/expenses', expenseRoutes);
// router.use('/reports', reportRoutes);
// router.use('/roles', roleRoutes);
// router.use('/settings', settingRoutes);

export default router;
