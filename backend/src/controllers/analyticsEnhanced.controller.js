import analyticsService from '../services/analytics.service.js';

/**
 * Get best-selling products
 */
export const getBestSellingProducts = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, startDate, endDate, limit } = req.query;

    const data = await analyticsService.getBestSellingProducts(
      tenantId,
      branchId,
      startDate,
      endDate,
      limit
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch best-selling products',
      error: error.message,
    });
  }
};

/**
 * Get slow-moving products
 */
export const getSlowMovingProducts = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, days, limit } = req.query;

    const data = await analyticsService.getSlowMovingProducts(
      tenantId,
      branchId,
      days,
      limit
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slow-moving products',
      error: error.message,
    });
  }
};

/**
 * Get branch performance
 */
export const getBranchPerformance = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { startDate, endDate } = req.query;

    const data = await analyticsService.getBranchPerformance(
      tenantId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branch performance',
      error: error.message,
    });
  }
};

/**
 * Get revenue growth
 */
export const getRevenueGrowth = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId } = req.query;

    const data = await analyticsService.getRevenueGrowth(tenantId, branchId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue growth',
      error: error.message,
    });
  }
};

/**
 * Get profit margin
 */
export const getProfitMargin = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, startDate, endDate } = req.query;

    const data = await analyticsService.getProfitMargin(
      tenantId,
      branchId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profit margin',
      error: error.message,
    });
  }
};

/**
 * Get customer retention
 */
export const getCustomerRetention = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId } = req.query;

    const data = await analyticsService.getCustomerRetention(tenantId, branchId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer retention',
      error: error.message,
    });
  }
};

/**
 * Get average basket size
 */
export const getAverageBasketSize = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, startDate, endDate } = req.query;

    const data = await analyticsService.getAverageBasketSize(
      tenantId,
      branchId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch average basket size',
      error: error.message,
    });
  }
};

/**
 * Get sales by payment method
 */
export const getSalesByPaymentMethod = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, startDate, endDate } = req.query;

    const data = await analyticsService.getSalesByPaymentMethod(
      tenantId,
      branchId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales by payment method',
      error: error.message,
    });
  }
};

/**
 * Get peak shopping hours
 */
export const getPeakShoppingHours = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, days } = req.query;

    const data = await analyticsService.getPeakShoppingHours(
      tenantId,
      branchId,
      days
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch peak shopping hours',
      error: error.message,
    });
  }
};

export default {
  getBestSellingProducts,
  getSlowMovingProducts,
  getBranchPerformance,
  getRevenueGrowth,
  getProfitMargin,
  getCustomerRetention,
  getAverageBasketSize,
  getSalesByPaymentMethod,
  getPeakShoppingHours,
};
