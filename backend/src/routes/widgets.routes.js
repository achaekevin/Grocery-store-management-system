import express from 'express';
import {
  getWidgetLayouts,
  getDefaultLayout,
  createWidgetLayout,
  updateWidgetLayout,
  deleteWidgetLayout,
  setDefaultLayout,
} from '../controllers/widgets.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all widget layouts
router.get('/', getWidgetLayouts);

// Get default layout
router.get('/default', getDefaultLayout);

// Create widget layout
router.post('/', createWidgetLayout);

// Update widget layout
router.put('/:id', updateWidgetLayout);

// Set default layout
router.patch('/:id/default', setDefaultLayout);

// Delete widget layout
router.delete('/:id', deleteWidgetLayout);

export default router;
