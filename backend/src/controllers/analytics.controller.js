import AnalyticsData from '../models/AnalyticsData.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// Get analytics data
export const getAnalytics = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { metricType, period, branchId, startDate, endDate } = req.query;

    const where = { tenantId };

    if (metricType) where.metricType = metricType;
    if (period) where.period = period;
    if (branchId) where.branchId = branchId;

    if (startDate && endDate) {
      where.periodStart = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const analytics = await AnalyticsData.findAll({
      where,
      order: [['periodStart', 'ASC']],
    });

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message,
    });
  }
};

// Get dashboard summary
export const getDashboardSummary = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const where = {
      tenantId,
      periodStart: {
        [Op.gte]: today,
      },
    };

    if (branchId) where.branchId = branchId;

    // Get today's metrics
    const [revenue, sales, orders, customers] = await Promise.all([
      AnalyticsData.findOne({
        where: { ...where, metricType: 'revenue', period: 'daily' },
        attributes: [[sequelize.fn('SUM', sequelize.col('value')), 'total']],
      }),
      AnalyticsData.findOne({
        where: { ...where, metricType: 'sales', period: 'daily' },
        attributes: [[sequelize.fn('SUM', sequelize.col('count')), 'total']],
      }),
      AnalyticsData.findOne({
        where: { ...where, metricType: 'orders', period: 'daily' },
        attributes: [[sequelize.fn('SUM', sequelize.col('count')), 'total']],
      }),
      AnalyticsData.findOne({
        where: { ...where, metricType: 'customers', period: 'daily' },
        attributes: [[sequelize.fn('SUM', sequelize.col('count')), 'total']],
      }),
    ]);

    res.json({
      success: true,
      data: {
        revenue: parseFloat(revenue?.dataValues?.total || 0),
        sales: parseInt(sales?.dataValues?.total || 0),
        orders: parseInt(orders?.dataValues?.total || 0),
        customers: parseInt(customers?.dataValues?.total || 0),
      },
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: error.message,
    });
  }
};

// Get revenue trends
export const getRevenueTrends = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { period = 'daily', days = 30, branchId } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const where = {
      tenantId,
      metricType: 'revenue',
      period,
      periodStart: {
        [Op.gte]: startDate,
      },
    };

    if (branchId) where.branchId = branchId;

    const trends = await AnalyticsData.findAll({
      where,
      order: [['periodStart', 'ASC']],
    });

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error('Get revenue trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue trends',
      error: error.message,
    });
  }
};

// Record analytics data
export const recordAnalytics = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const analyticsData = {
      ...req.body,
      tenantId,
    };

    const record = await AnalyticsData.create(analyticsData);

    res.status(201).json({
      success: true,
      message: 'Analytics recorded successfully',
      data: record,
    });
  } catch (error) {
    console.error('Record analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record analytics',
      error: error.message,
    });
  }
};

// Get top performing products
export const getTopProducts = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { limit = 10, days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const topProducts = await AnalyticsData.findAll({
      where: {
        tenantId,
        metricType: 'product_performance',
        periodStart: {
          [Op.gte]: startDate,
        },
      },
      order: [['value', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top products',
      error: error.message,
    });
  }
};

// Get branch performance
export const getBranchPerformance = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { period = 'monthly', months = 6 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const performance = await AnalyticsData.findAll({
      where: {
        tenantId,
        metricType: 'revenue',
        period,
        periodStart: {
          [Op.gte]: startDate,
        },
      },
      order: [['branchId', 'ASC'], ['periodStart', 'ASC']],
    });

    // Group by branch
    const groupedData = performance.reduce((acc, item) => {
      const branchId = item.branchId || 'all';
      if (!acc[branchId]) {
        acc[branchId] = [];
      }
      acc[branchId].push(item);
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedData,
    });
  } catch (error) {
    console.error('Get branch performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branch performance',
      error: error.message,
    });
  }
};
