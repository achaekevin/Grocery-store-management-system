import express from 'express';
import * as reportController from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

router.get(
  '/sales',
  requirePermission('reports:read'),
  reportController.getSalesReport
);

router.get(
  '/inventory',
  requirePermission('reports:read'),
  reportController.getInventoryReport
);

router.get(
  '/customers',
  requirePermission('reports:read'),
  reportController.getCustomerReport
);

router.get(
  '/profit-loss',
  requirePermission('reports:read'),
  reportController.getProfitLossReport
);

router.get(
  '/dashboard',
  authenticate,
  reportController.getDashboardStats
);

router.get(
  '/export/sales',
  requirePermission('reports:export'),
  reportController.exportSalesExcel
);

router.get(
  '/export/inventory',
  requirePermission('reports:export'),
  reportController.exportInventoryExcel
);

export default router;
