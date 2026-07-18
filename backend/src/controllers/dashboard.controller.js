import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import Inventory from '../models/Inventory.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import sequelize from '../config/sequelize.js';
import cacheService from '../services/cache.service.js';
import { Op } from 'sequelize';

/**
 * Get dashboard statistics (aggregated)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId } = req.query;

    // Check cache first
    const cached = await cacheService.getDashboardStats(tenantId, branchId);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;

    // Today's sales
    const todaySales = await Order.findOne({
      where: {
        ...where,
        createdAt: { [Op.gte]: today },
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      raw: true,
    });

    // Monthly sales
    const monthlySales = await Order.findOne({
      where: {
        ...where,
        createdAt: { [Op.gte]: firstDayOfMonth },
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      raw: true,
    });

    // Products count
    const productsCount = await Product.count({
      where: { tenantId, status: 'active' },
    });

    // Customers count
    const customersCount = await Customer.count({
      where: { tenantId },
    });

    // Suppliers count
    const suppliersCount = await Supplier.count({
      where: { tenantId, status: 'active' },
    });

    // Low stock items
    const lowStockCount = await Inventory.count({
      where: {
        tenantId,
        ...(branchId && { branchId }),
        quantity: {
          [Op.lte]: sequelize.col('product.stockAlert'),
        },
      },
      include: [{
        model: Product,
        as: 'product',
        attributes: [],
      }],
    });

    // Expired products
    const expiredCount = await Product.count({
      where: {
        tenantId,
        expiryDate: { [Op.lt]: new Date() },
      },
    });

    // Pending purchase orders
    const pendingOrdersCount = await PurchaseOrder.count({
      where: {
        tenantId,
        ...(branchId && { branchId }),
        status: 'pending',
      },
    });

    // Revenue trend (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueTrend = await Order.findAll({
      where: {
        ...where,
        createdAt: { [Op.gte]: sevenDaysAgo },
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true,
    });

    // Top selling products (last 30 days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topProducts = await Order.findAll({
      where: {
        ...where,
        createdAt: { [Op.gte]: thirtyDaysAgo },
      },
      attributes: [
        'items',
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
      ],
      limit: 10,
      raw: true,
    });

    const stats = {
      todaySales: parseFloat(todaySales?.total || 0),
      todayOrders: parseInt(todaySales?.count || 0),
      monthlySales: parseFloat(monthlySales?.total || 0),
      monthlyOrders: parseInt(monthlySales?.count || 0),
      products: productsCount,
      customers: customersCount,
      suppliers: suppliersCount,
      lowStock: lowStockCount,
      expiredProducts: expiredCount,
      pendingOrders: pendingOrdersCount,
      revenueTrend,
      topProducts: topProducts.slice(0, 5),
    };

    // Cache for 5 minutes
    await cacheService.cacheDashboardStats(tenantId, branchId, stats);

    res.json({
      success: true,
      data: stats,
      cached: false,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message,
    });
  }
};

/**
 * Get quick stats (lightweight)
 */
export const getQuickStats = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;

    const todaySales = await Order.sum('totalAmount', {
      where: {
        ...where,
        createdAt: { [Op.gte]: today },
      },
    });

    const lowStock = await Inventory.count({
      where: {
        tenantId,
        ...(branchId && { branchId }),
        quantity: {
          [Op.lte]: sequelize.col('product.stockAlert'),
        },
      },
      include: [{
        model: Product,
        as: 'product',
        attributes: [],
      }],
    });

    res.json({
      success: true,
      data: {
        todaySales: parseFloat(todaySales || 0),
        lowStock,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quick stats',
      error: error.message,
    });
  }
};

export default {
  getDashboardStats,
  getQuickStats,
};
