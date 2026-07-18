import express from 'express';
import {
  getIncomeSummary,
  getExpensesSummary,
  getProfitSummary,
  getCashFlow,
  getTaxSummary,
  dailyClosing,
  monthlyClosing,
} from '../controllers/financial.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Financial reports
router.get('/income', checkPermission('financial.view'), getIncomeSummary);
router.get('/expenses', checkPermission('financial.view'), getExpensesSummary);
router.get('/profit', checkPermission('financial.view'), getProfitSummary);
router.get('/cash-flow', checkPermission('financial.view'), getCashFlow);
router.get('/tax', checkPermission('financial.view'), getTaxSummary);

// Closings
router.post('/daily-closing', checkPermission('financial.closing'), dailyClosing);
router.post('/monthly-closing', checkPermission('financial.closing'), monthlyClosing);

export default router;
