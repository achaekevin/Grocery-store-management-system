import express from 'express';
import {
  getInsights,
  getInsightById,
  createInsight,
  dismissInsight,
  deleteInsight,
  getInsightsSummary,
} from '../controllers/insights.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all insights
router.get('/', getInsights);

// Get insights summary
router.get('/summary', getInsightsSummary);

// Get insight by ID
router.get('/:id', getInsightById);

// Create insight (admin only)
router.post('/', checkPermission('insights:create'), createInsight);

// Dismiss insight
router.patch('/:id/dismiss', dismissInsight);

// Delete insight (admin only)
router.delete('/:id', checkPermission('insights:delete'), deleteInsight);

export default router;
