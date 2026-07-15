import * as productService from '../services/product.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { generateBarcodeBase64 } from '../helpers/barcode.js';
import { generateQRCodeBase64 } from '../helpers/qrcode.js';
import logger from '../config/logger.js';

/**
 * Create product
 */
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      businessId: req.user.businessId,
    };

    const product = await productService.createProduct(productData, req.user.id);

    logger.info(`Product created: ${product.id} by user ${req.user.id}`);
    res.status(201).json(ApiResponse.created('Product created successfully', product));
  } catch (error) {
    throw error;
  }
};

/**
 * Get all products
 */
export const getProducts = async (req, res) => {
  try {
    const { count, products } = await productService.getProducts(
      req.query,
      req.pagination
    );

    const { page, limit } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    res.json(
      ApiResponse.paginated('Products retrieved successfully', products, {
        currentPage: page,
        perPage: limit,
        totalItems: count,
        totalPages,
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get product by ID
 */
export const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(ApiResponse.success('Product retrieved successfully', product));
  } catch (error) {
    throw error;
  }
};

/**
 * Update product
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    logger.info(`Product updated: ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('Product updated successfully', product));
  } catch (error) {
    throw error;
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);

    logger.info(`Product deleted: ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('Product deleted successfully'));
  } catch (error) {
    throw error;
  }
};

/**
 * Bulk update products
 */
export const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, updates } = req.body;
    const affectedRows = await productService.bulkUpdateProducts(productIds, updates);

    logger.info(`Bulk update: ${affectedRows} products by user ${req.user.id}`);
    res.json(
      ApiResponse.success(`${affectedRows} products updated successfully`, {
        affectedRows,
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Generate barcode for product
 */
export const generateBarcode = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    
    if (!product.barcode) {
      throw ApiError.badRequest('Product does not have a barcode');
    }

    const barcodeBase64 = await generateBarcodeBase64(product.barcode, req.query);

    res.json(
      ApiResponse.success('Barcode generated successfully', {
        barcode: barcodeBase64,
        product: {
          id: product.id,
          name: product.name,
          barcode: product.barcode,
        },
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Generate QR code for product
 */
export const generateQRCode = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    const productData = JSON.stringify({
      id: product.id,
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      price: product.sellingPrice,
    });

    const qrCodeBase64 = await generateQRCodeBase64(productData);

    res.json(
      ApiResponse.success('QR code generated successfully', {
        qrCode: qrCodeBase64,
        product: {
          id: product.id,
          name: product.name,
        },
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get low stock products
 */
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await productService.getLowStockProducts(
      req.user.businessId,
      req.query.branchId
    );

    res.json(ApiResponse.success('Low stock products retrieved', products));
  } catch (error) {
    throw error;
  }
};

/**
 * Get expiring products
 */
export const getExpiringProducts = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const products = await productService.getExpiringProducts(
      req.user.businessId,
      days
    );

    res.json(ApiResponse.success('Expiring products retrieved', products));
  } catch (error) {
    throw error;
  }
};

export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
  generateBarcode,
  generateQRCode,
  getLowStockProducts,
  getExpiringProducts,
};
