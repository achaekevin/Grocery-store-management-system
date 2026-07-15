import express from 'express';
import * as branchController from '../controllers/branch.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { paginate } from '../middleware/pagination.js';
import {
  createBranchSchema,
  updateBranchSchema,
} from '../validators/branch.validator.js';

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  requirePermission('branches:create'),
  validate(createBranchSchema),
  branchController.createBranch
);

router.get(
  '/',
  requirePermission('branches:read'),
  paginate,
  branchController.getBranches
);

router.get(
  '/:id',
  requirePermission('branches:read'),
  branchController.getBranch
);

router.put(
  '/:id',
  requirePermission('branches:update'),
  validate(updateBranchSchema),
  branchController.updateBranch
);

router.delete(
  '/:id',
  requirePermission('branches:delete'),
  branchController.deleteBranch
);

router.get(
  '/:id/statistics',
  requirePermission('branches:read'),
  branchController.getBranchStatistics
);

export default router;
