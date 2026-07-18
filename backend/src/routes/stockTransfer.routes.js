import express from 'express';
import {
  createTransfer,
  approveTransfer,
  shipTransfer,
  receiveTransfer,
  cancelTransfer,
  getTransfers,
  getTransferById,
} from '../controllers/stockTransfer.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Transfer management
router.post('/', checkPermission('transfer.create'), createTransfer);
router.get('/', checkPermission('transfer.view'), getTransfers);
router.get('/:id', checkPermission('transfer.view'), getTransferById);
router.put('/:id/approve', checkPermission('transfer.approve'), approveTransfer);
router.put('/:id/ship', checkPermission('transfer.ship'), shipTransfer);
router.put('/:id/receive', checkPermission('transfer.receive'), receiveTransfer);
router.put('/:id/cancel', checkPermission('transfer.cancel'), cancelTransfer);

export default router;
