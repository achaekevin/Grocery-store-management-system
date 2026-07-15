import express from 'express';
import * as supplierController from '../controllers/supplier.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { paginate } from '../middleware/pagination.js';
import {
  createSupplierSchema,
  updateSupplierSchema,
} from '../validators/supplier.validator.js';

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  requirePermission('suppliers:create'),
  validate(createSupplierSchema),
  supplierController.createSupplier
);

router.get(
  '/',
  requirePermission('suppliers:read'),
  paginate,
  supplierController.getSuppliers
);

router.get(
  '/:id',
  requirePermission('suppliers:read'),
  supplierController.getSupplier
);

router.put(
  '/:id',
  requirePermission('suppliers:update'),
  validate(updateSupplierSchema),
  supplierController.updateSupplier
);

router.delete(
  '/:id',
  requirePermission('suppliers:delete'),
  supplierController.deleteSupplier
);

router.get(
  '/:id/purchase-history',
  requirePermission('suppliers:read'),
  paginate,
  supplierController.getSupplierPurchaseHistory
);

export default router;
