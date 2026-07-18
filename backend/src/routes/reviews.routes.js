import express from 'express';
import {
  getReviews,
  getProductReviews,
  createReview,
  updateReviewStatus,
  markReviewHelpful,
  deleteReview,
  getReviewStats,
} from '../controllers/reviews.controller.js';
import { authenticate } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all reviews
router.get('/', getReviews);

// Get review statistics
router.get('/stats', getReviewStats);

// Get product reviews
router.get('/product/:productId', getProductReviews);

// Create review
router.post('/', createReview);

// Update review status
router.patch('/:id/status', checkPermission('reviews:manage'), updateReviewStatus);

// Mark review as helpful
router.post('/:id/helpful', markReviewHelpful);

// Delete review
router.delete('/:id', checkPermission('reviews:delete'), deleteReview);

export default router;
