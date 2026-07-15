import express from 'express';
import * as mpesaController from '../controllers/mpesa.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { paginate } from '../middleware/pagination.js';
import { mpesaStkPushSchema } from '../validators/pos.validator.js';
import { mpesaLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   POST /api/v1/mpesa/stkpush
 * @desc    Initiate STK Push
 * @access  Private - payments:mpesa
 */
router.post(
  '/stkpush',
  authenticate,
  mpesaLimiter,
  requirePermission('payments:mpesa'),
  validate(mpesaStkPushSchema),
  mpesaController.stkPush
);

/**
 * @route   GET /api/v1/mpesa/query/:checkoutRequestId
 * @desc    Query STK Push status
 * @access  Private - payments:mpesa
 */
router.get(
  '/query/:checkoutRequestId',
  authenticate,
  requirePermission('payments:mpesa'),
  mpesaController.stkPushQuery
);

/**
 * @route   POST /api/v1/mpesa/callback
 * @desc    M-Pesa callback handler
 * @access  Public (called by Safaricom)
 */
router.post('/callback', mpesaController.callback);

/**
 * @route   GET /api/v1/mpesa/transactions
 * @desc    Get M-Pesa transactions
 * @access  Private - payments:read
 */
router.get(
  '/transactions',
  authenticate,
  requirePermission('payments:read'),
  paginate,
  mpesaController.getTransactions
);

export default router;
