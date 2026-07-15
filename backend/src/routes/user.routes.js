import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { paginate } from '../middleware/pagination.js';
import { uploadSingle } from '../middleware/upload.js';
import {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  userFiltersSchema,
} from '../validators/user.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put(
  '/profile',
  uploadSingle('avatar'),
  validate(updateProfileSchema),
  userController.updateProfile
);

router.post(
  '/',
  requirePermission('users:create'),
  validate(createUserSchema),
  userController.createUser
);

router.get(
  '/',
  requirePermission('users:read'),
  paginate,
  validate(userFiltersSchema, 'query'),
  userController.getUsers
);

router.get(
  '/:id',
  requirePermission('users:read'),
  userController.getUser
);

router.put(
  '/:id',
  requirePermission('users:update'),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  requirePermission('users:delete'),
  userController.deleteUser
);

router.get(
  '/:id/activity',
  requirePermission('users:read'),
  userController.getUserActivity
);

export default router;
