import express from 'express';
import * as posController from '../controllers/pos.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { paginate } from '../middleware/pagination.js';
import {
  createSaleSchema,
  holdSaleSchema,
  refundSaleSchema,
  saleFiltersSchema,
} from '../validators/pos.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/pos/sales
 * @desc    Create new sale
 * @access  Private - sales:create
 */
router.post(
  '/sales',
  requirePermission('sales:create'),
  validate(createSaleSchema),
  posController.createSale
);

/**
 * @route   GET /api/v1/pos/sales
 * @desc    Get all sales
 * @access  Private - sales:read
 */
router.get(
  '/sales',
  requirePermission('sales:read'),
  paginate,
  validate(saleFiltersSchema, 'query'),
  posController.getSales
);

/**
 * @route   GET /api/v1/pos/sales/summary
 * @desc    Get sales summary
 * @access  Private - sales:read
 */
router.get(
  '/sales/summary',
  requirePermission('sales:read'),
  posController.getSalesSummary
);

/**
 * @route   GET /api/v1/pos/sales/:id
 * @desc    Get sale by ID
 * @access  Private - sales:read
 */
router.get(
  '/sales/:id',
  requirePermission('sales:read'),
  posController.getSale
);

/**
 * @route   POST /api/v1/pos/sales/hold
 * @desc    Hold a sale
 * @access  Private - sales:create
 */
router.post(
  '/sales/hold',
  requirePermission('sales:create'),
  validate(holdSaleSchema),
  posController.holdSale
);

/**
 * @route   GET /api/v1/pos/sales/:id/resume
 * @desc    Resume held sale
 * @access  Private - sales:read
 */
router.get(
  '/sales/:id/resume',
  requirePermission('sales:read'),
  posController.resumeSale
);

/**
 * @route   POST /api/v1/pos/sales/:id/refund
 * @desc    Refund a sale
 * @access  Private - sales:refund
 */
router.post(
  '/sales/:id/refund',
  requirePermission('sales:refund'),
  validate(refundSaleSchema),
  posController.refundSale
);

export default router;
