import express from 'express';
import {
  getLoyaltyPrograms,
  getActiveProgram,
  createLoyaltyProgram,
  updateLoyaltyProgram,
  getCustomerLoyalty,
  enrollCustomer,
  addPoints,
  redeemPoints,
  getLoyaltyStats,
} from '../controllers/loyalty.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all loyalty programs
router.get('/programs', getLoyaltyPrograms);

// Get active program
router.get('/programs/active', getActiveProgram);

// Get loyalty statistics
router.get('/stats', getLoyaltyStats);

// Create loyalty program
router.post('/programs', checkPermission('loyalty:manage'), createLoyaltyProgram);

// Update loyalty program
router.put('/programs/:id', checkPermission('loyalty:manage'), updateLoyaltyProgram);

// Get customer loyalty
router.get('/customers/:customerId', getCustomerLoyalty);

// Enroll customer
router.post('/enroll', enrollCustomer);

// Add points
router.post('/customers/:customerId/points/add', addPoints);

// Redeem points
router.post('/customers/:customerId/points/redeem', redeemPoints);

export default router;
