import express from 'express';
import {
  globalSearch,
  getSearchHistory,
  getPopularSearches,
  recordClickedResult,
  clearSearchHistory,
} from '../controllers/search.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Global search
router.get('/', globalSearch);

// Get search history
router.get('/history', getSearchHistory);

// Get popular searches
router.get('/popular', getPopularSearches);

// Record clicked result
router.post('/click', recordClickedResult);

// Clear search history
router.delete('/history', clearSearchHistory);

export default router;
