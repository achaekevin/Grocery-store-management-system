import express from 'express';
import * as customerController from '../controllers/customer.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { paginate } from '../middleware/pagination.js';
import {
  createCustomerSchema,
  updateCustomerSchema,
  loyaltyPointsSchema,
  customerFiltersSchema,
} from '../validators/customer.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/customers
 * @desc    Create new customer
 * @access  Private - customers:create
 */
router.post(
  '/',
  requirePermission('customers:create'),
  validate(createCustomerSchema),
  customerController.createCustomer
);

/**
 * @route   GET /api/v1/customers
 * @desc    Get all customers
 * @access  Private - customers:read
 */
router.get(
  '/',
  requirePermission('customers:read'),
  paginate,
  validate(customerFiltersSchema, 'query'),
  customerController.getCustomers
);

/**
 * @route   GET /api/v1/customers/top
 * @desc    Get top customers by spending
 * @access  Private - customers:read
 */
router.get(
  '/top',
  requirePermission('customers:read'),
  customerController.getTopCustomers
);

/**
 * @route   GET /api/v1/customers/:id
 * @desc    Get customer by ID
 * @access  Private - customers:read
 */
router.get(
  '/:id',
  requirePermission('customers:read'),
  customerController.getCustomer
);

/**
 * @route   PUT /api/v1/customers/:id
 * @desc    Update customer
 * @access  Private - customers:update
 */
router.put(
  '/:id',
  requirePermission('customers:update'),
  validate(updateCustomerSchema),
  customerController.updateCustomer
);

/**
 * @route   DELETE /api/v1/customers/:id
 * @desc    Delete customer
 * @access  Private - customers:delete
 */
router.delete(
  '/:id',
  requirePermission('customers:delete'),
  customerController.deleteCustomer
);

/**
 * @route   POST /api/v1/customers/:id/loyalty-points
 * @desc    Adjust customer loyalty points
 * @access  Private - customers:loyalty
 */
router.post(
  '/:id/loyalty-points',
  requirePermission('customers:loyalty'),
  validate(loyaltyPointsSchema),
  customerController.adjustLoyaltyPoints
);

/**
 * @route   GET /api/v1/customers/:id/purchase-history
 * @desc    Get customer purchase history
 * @access  Private - customers:read
 */
router.get(
  '/:id/purchase-history',
  requirePermission('customers:read'),
  paginate,
  customerController.getCustomerPurchaseHistory
);

export default router;
