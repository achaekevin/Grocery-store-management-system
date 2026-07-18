import * as posService from '../services/pos.service.js';
import Product from '../models/Product.js';
import HeldTransaction from '../models/HeldTransaction.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';
import barcodeHelper from '../helpers/barcode.js';

/**
 * Lookup product by barcode or QR
 */
export const lookupProduct = async (req, res) => {
  try {
    const { code } = req.params;
    const { tenantId } = req.user;

    const product = await Product.findOne({
      where: {
        tenantId,
        barcode: code,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error('Lookup product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to lookup product',
      error: error.message,
    });
  }
};

/**
 * Create new sale with enhanced features
 */
export const createSale = async (req, res) => {
  try {
    const saleData = {
      ...req.body,
      tenantId: req.user.tenantId,
      businessId: req.user.businessId,
      cashierId: req.user.id,
    };

    const sale = await posService.createSale(saleData, req.user.id);

    // Emit real-time notification via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`business:${req.user.businessId}`).emit('new-sale', {
        saleId: sale.id,
        saleNumber: sale.saleNumber,
        total: sale.total,
        branchId: sale.branchId,
      });
    }

    logger.info(`Sale created: ${sale.saleNumber} by user ${req.user.id}`);
    res.status(201).json(ApiResponse.created('Sale completed successfully', sale));
  } catch (error) {
    throw error;
  }
};

/**
 * Get all sales
 */
export const getSales = async (req, res) => {
  try {
    const { count, sales } = await posService.getSales(req.query, req.pagination);

    const { page, limit } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    res.json(
      ApiResponse.paginated('Sales retrieved successfully', sales, {
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
 * Get sale by ID
 */
export const getSale = async (req, res) => {
  try {
    const sale = await posService.getSaleById(req.params.id);
    res.json(ApiResponse.success('Sale retrieved successfully', sale));
  } catch (error) {
    throw error;
  }
};

/**
 * Hold a sale
 */
export const holdSale = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.user;
    const { branchId, customerId, items, notes } = req.body;

    const heldTransaction = await HeldTransaction.create({
      tenantId,
      branchId,
      customerId,
      items,
      notes,
      heldBy: userId,
    });

    logger.info(`Sale held: ${heldTransaction.id} by user ${userId}`);
    res.status(201).json({
      success: true,
      message: 'Sale held successfully',
      data: heldTransaction,
    });
  } catch (error) {
    logger.error('Hold sale error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to hold sale',
      error: error.message,
    });
  }
};

/**
 * Get all held sales
 */
export const getHeldSales = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId } = req.query;

    const where = { tenantId };
    if (branchId) where.branchId = branchId;

    const heldSales = await HeldTransaction.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: heldSales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch held sales',
      error: error.message,
    });
  }
};

/**
 * Resume held sale
 */
export const resumeSale = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const heldTransaction = await HeldTransaction.findOne({
      where: { id, tenantId },
    });

    if (!heldTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Held transaction not found',
      });
    }

    res.json({
      success: true,
      message: 'Sale retrieved for resumption',
      data: heldTransaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resume sale',
      error: error.message,
    });
  }
};

/**
 * Delete held sale
 */
export const deleteHeldSale = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const deleted = await HeldTransaction.destroy({
      where: { id, tenantId },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Held transaction not found',
      });
    }

    res.json({
      success: true,
      message: 'Held sale deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete held sale',
      error: error.message,
    });
  }
};

/**
 * Refund a sale
 */
export const refundSale = async (req, res) => {
  try {
    const sale = await posService.refundSale(req.params.id, req.body, req.user.id);

    logger.info(`Sale refunded: ${sale.saleNumber} by user ${req.user.id}`);
    res.json(ApiResponse.success('Sale refunded successfully', sale));
  } catch (error) {
    throw error;
  }
};

/**
 * Get sales summary
 */
export const getSalesSummary = async (req, res) => {
  try {
    const { branchId, dateFrom, dateTo } = req.query;

    const summary = await posService.getSalesSummary(
      req.user.businessId,
      branchId,
      dateFrom,
      dateTo
    );

    res.json(ApiResponse.success('Sales summary retrieved', summary));
  } catch (error) {
    throw error;
  }
};

/**
 * Calculate sale total with discounts and taxes
 */
export const calculateTotal = async (req, res) => {
  try {
    const { items, discountType, discountValue, couponCode, taxRate } = req.body;

    let subtotal = 0;
    items.forEach(item => {
      subtotal += parseFloat(item.price) * parseFloat(item.quantity);
    });

    let discount = 0;
    if (discountType === 'percentage') {
      discount = (subtotal * parseFloat(discountValue)) / 100;
    } else if (discountType === 'fixed') {
      discount = parseFloat(discountValue);
    }

    // Apply coupon if provided
    if (couponCode) {
      // Coupon logic would go here
    }

    const afterDiscount = subtotal - discount;
    const tax = (afterDiscount * parseFloat(taxRate || 0)) / 100;
    const total = afterDiscount + tax;

    res.json({
      success: true,
      data: {
        subtotal,
        discount,
        tax,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate total',
      error: error.message,
    });
  }
};

export default {
  lookupProduct,
  createSale,
  getSales,
  getSale,
  holdSale,
  getHeldSales,
  resumeSale,
  deleteHeldSale,
  refundSale,
  getSalesSummary,
  calculateTotal,
};
