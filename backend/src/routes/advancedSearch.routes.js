import express from 'express';
import {
  advancedSearch,
  searchByBarcode,
  searchBySKU,
  searchByInvoice,
  fullTextSearch,
} from '../controllers/advancedSearch.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Search routes
router.get('/', advancedSearch);
router.get('/fulltext', fullTextSearch);
router.get('/barcode/:barcode', searchByBarcode);
router.get('/sku/:sku', searchBySKU);
router.get('/invoice/:invoiceNumber', searchByInvoice);

export default router;
