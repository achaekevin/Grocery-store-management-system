import express from 'express';
import {
  createPurchaseOrder,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  sendToSupplier,
  receiveGoods,
  updatePaymentStatus,
  cancelPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
} from '../controllers/purchaseOrder.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Purchase order management
router.post('/', checkPermission('purchase.create'), createPurchaseOrder);
router.get('/', checkPermission('purchase.view'), getPurchaseOrders);
router.get('/:id', checkPermission('purchase.view'), getPurchaseOrderById);
router.put('/:id/approve', checkPermission('purchase.approve'), approvePurchaseOrder);
router.put('/:id/reject', checkPermission('purchase.reject'), rejectPurchaseOrder);
router.put('/:id/send', checkPermission('purchase.send'), sendToSupplier);
router.put('/:id/receive', checkPermission('purchase.receive'), receiveGoods);
router.put('/:id/payment', checkPermission('purchase.update_payment'), updatePaymentStatus);
router.put('/:id/cancel', checkPermission('purchase.cancel'), cancelPurchaseOrder);

export default router;
