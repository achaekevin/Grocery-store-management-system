import express from 'express';
import {
  getPromotions,
  getActivePromotions,
  getPromotionByCode,
  createPromotion,
  updatePromotion,
  applyPromotion,
  deletePromotion,
  getPromotionStats,
} from '../controllers/promotions.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all promotions
router.get('/', getPromotions);

// Get active promotions
router.get('/active', getActivePromotions);

// Get promotion statistics
router.get('/stats', getPromotionStats);

// Get promotion by code
router.get('/code/:code', getPromotionByCode);

// Create promotion
router.post('/', checkPermission('promotions:create'), createPromotion);

// Update promotion
router.put('/:id', checkPermission('promotions:manage'), updatePromotion);

// Apply promotion
router.post('/apply', applyPromotion);

// Delete promotion
router.delete('/:id', checkPermission('promotions:delete'), deletePromotion);

export default router;
