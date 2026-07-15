import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { paginate } from '../middleware/pagination.js';
import { uploadSingle } from '../middleware/upload.js';
import {
  createProductSchema,
  updateProductSchema,
  bulkUpdateSchema,
  productFiltersSchema,
  generateBarcodeSchema,
} from '../validators/product.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 * @access  Private - products:create
 */
router.post(
  '/',
  requirePermission('products:create'),
  uploadSingle('productImage'),
  validate(createProductSchema),
  productController.createProduct
);

/**
 * @route   GET /api/v1/products
 * @desc    Get all products
 * @access  Private - products:read
 */
router.get(
  '/',
  requirePermission('products:read'),
  paginate,
  validate(productFiltersSchema, 'query'),
  productController.getProducts
);

/**
 * @route   GET /api/v1/products/low-stock
 * @desc    Get low stock products
 * @access  Private - products:read
 */
router.get(
  '/low-stock',
  requirePermission('products:read'),
  productController.getLowStockProducts
);

/**
 * @route   GET /api/v1/products/expiring
 * @desc    Get expiring products
 * @access  Private - products:read
 */
router.get(
  '/expiring',
  requirePermission('products:read'),
  productController.getExpiringProducts
);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product by ID
 * @access  Private - products:read
 */
router.get(
  '/:id',
  requirePermission('products:read'),
  productController.getProduct
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product
 * @access  Private - products:update
 */
router.put(
  '/:id',
  requirePermission('products:update'),
  uploadSingle('productImage'),
  validate(updateProductSchema),
  productController.updateProduct
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product
 * @access  Private - products:delete
 */
router.delete(
  '/:id',
  requirePermission('products:delete'),
  productController.deleteProduct
);

/**
 * @route   PATCH /api/v1/products/bulk-update
 * @desc    Bulk update products
 * @access  Private - products:update
 */
router.patch(
  '/bulk-update',
  requirePermission('products:update'),
  validate(bulkUpdateSchema),
  productController.bulkUpdateProducts
);

/**
 * @route   GET /api/v1/products/:id/barcode
 * @desc    Generate barcode for product
 * @access  Private - products:read
 */
router.get(
  '/:id/barcode',
  requirePermission('products:read'),
  validate(generateBarcodeSchema, 'query'),
  productController.generateBarcode
);

/**
 * @route   GET /api/v1/products/:id/qrcode
 * @desc    Generate QR code for product
 * @access  Private - products:read
 */
router.get(
  '/:id/qrcode',
  requirePermission('products:read'),
  productController.generateQRCode
);

export default router;
