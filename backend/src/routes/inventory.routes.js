import express from 'express';
import {
  stockIn,
  stockOut,
  adjustInventory,
  recordDamage,
  recordExpired,
  getInventoryHistory,
  getLowStock,
} from '../controllers/inventory.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Stock management
router.post('/stock-in', checkPermission('inventory.stock_in'), stockIn);
router.post('/stock-out', checkPermission('inventory.stock_out'), stockOut);
router.post('/adjust', checkPermission('inventory.adjust'), adjustInventory);
router.post('/damage', checkPermission('inventory.record_damage'), recordDamage);
router.post('/expired', checkPermission('inventory.record_expired'), recordExpired);

// Inventory reports
router.get('/history', checkPermission('inventory.view_history'), getInventoryHistory);
router.get('/low-stock', checkPermission('inventory.view_reports'), getLowStock);

export default router;
