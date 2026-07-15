import * as posService from '../services/pos.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';

/**
 * Create new sale
 */
export const createSale = async (req, res) => {
  try {
    const saleData = {
      ...req.body,
      businessId: req.user.businessId,
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
    const saleData = {
      ...req.body,
      businessId: req.user.businessId,
    };

    const sale = await posService.holdSale(saleData, req.user.id);

    logger.info(`Sale held: ${sale.saleNumber} by user ${req.user.id}`);
    res.status(201).json(ApiResponse.created('Sale held successfully', sale));
  } catch (error) {
    throw error;
  }
};

/**
 * Resume held sale
 */
export const resumeSale = async (req, res) => {
  try {
    const sale = await posService.getSaleById(req.params.id);

    if (sale.status !== 'on_hold') {
      throw ApiError.badRequest('Sale is not on hold');
    }

    res.json(ApiResponse.success('Sale retrieved for resumption', sale));
  } catch (error) {
    throw error;
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

export default {
  createSale,
  getSales,
  getSale,
  holdSale,
  resumeSale,
  refundSale,
  getSalesSummary,
};
