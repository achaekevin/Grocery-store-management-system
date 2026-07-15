import express from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { paginate } from '../middleware/pagination.js';
import {
  stockAdjustmentSchema,
  batchStockUpdateSchema,
  branchTransferSchema,
  inventoryFiltersSchema,
  movementFiltersSchema,
  stockTakeSchema,
} from '../validators/inventory.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/inventory
 * @desc    Get inventory
 * @access  Private - inventory:read
 */
router.get(
  '/',
  requirePermission('inventory:read'),
  paginate,
  validate(inventoryFiltersSchema, 'query'),
  inventoryController.getInventory
);

/**
 * @route   POST /api/v1/inventory/adjust
 * @desc    Adjust stock
 * @access  Private - inventory:update
 */
router.post(
  '/adjust',
  requirePermission('inventory:update'),
  validate(stockAdjustmentSchema),
  inventoryController.adjustStock
);

/**
 * @route   POST /api/v1/inventory/batch-update
 * @desc    Batch stock update
 * @access  Private - inventory:update
 */
router.post(
  '/batch-update',
  requirePermission('inventory:update'),
  validate(batchStockUpdateSchema),
  inventoryController.batchStockUpdate
);

/**
 * @route   POST /api/v1/inventory/transfer
 * @desc    Transfer stock between branches
 * @access  Private - inventory:transfer
 */
router.post(
  '/transfer',
  requirePermission('inventory:transfer'),
  validate(branchTransferSchema),
  inventoryController.transferStock
);

/**
 * @route   GET /api/v1/inventory/movements
 * @desc    Get inventory movements
 * @access  Private - inventory:read
 */
router.get(
  '/movements',
  requirePermission('inventory:read'),
  paginate,
  validate(movementFiltersSchema, 'query'),
  inventoryController.getInventoryMovements
);

/**
 * @route   POST /api/v1/inventory/stock-take
 * @desc    Perform stock take
 * @access  Private - inventory:stock-take
 */
router.post(
  '/stock-take',
  requirePermission('inventory:stock-take'),
  validate(stockTakeSchema),
  inventoryController.performStockTake
);

export default router;
