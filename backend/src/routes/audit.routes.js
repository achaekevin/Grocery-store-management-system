import express from 'express';
import {
  getActivities,
  getActivityById,
  getActivitiesByUser,
  getActivitiesByEntity,
  getActivityStats,
} from '../controllers/audit.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Activity logs
router.get('/', checkPermission('audit.view'), getActivities);
router.get('/stats', checkPermission('audit.view'), getActivityStats);
router.get('/:id', checkPermission('audit.view'), getActivityById);
router.get('/user/:userId', checkPermission('audit.view'), getActivitiesByUser);
router.get('/entity/:entityType/:entityId', checkPermission('audit.view'), getActivitiesByEntity);

export default router;
