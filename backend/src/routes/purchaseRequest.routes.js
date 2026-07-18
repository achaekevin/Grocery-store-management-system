import express from 'express';
import {
  createPurchaseRequest,
  approvePurchaseRequest,
  rejectPurchaseRequest,
  cancelPurchaseRequest,
  getPurchaseRequests,
  getPurchaseRequestById,
  updatePurchaseRequest,
} from '../controllers/purchaseRequest.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Purchase request management
router.post('/', checkPermission('purchase.request'), createPurchaseRequest);
router.get('/', checkPermission('purchase.view'), getPurchaseRequests);
router.get('/:id', checkPermission('purchase.view'), getPurchaseRequestById);
router.put('/:id', checkPermission('purchase.request'), updatePurchaseRequest);
router.put('/:id/approve', checkPermission('purchase.approve'), approvePurchaseRequest);
router.put('/:id/reject', checkPermission('purchase.reject'), rejectPurchaseRequest);
router.put('/:id/cancel', checkPermission('purchase.cancel'), cancelPurchaseRequest);

export default router;
