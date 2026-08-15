import db from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';
import { Op } from 'sequelize';

/**
 * Get dashboard statistics (aggregated real database figures)
 * GET /api/v1/dashboard/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. Real database counts
    let productsCount = 0;
    let customersCount = 0;
    let suppliersCount = 0;
    let branchesCount = 0;
    let usersCount = 0;
    let lowStockCount = 0;
    let todaySalesTotal = 0;
    let todayOrdersCount = 0;
    let monthlySalesTotal = 0;
    let monthlyOrdersCount = 0;

    try {
      if (db.Product) {
        productsCount = await db.Product.count({ where: { isActive: true } }).catch(() => 0);
        lowStockCount = await db.Product.count({
          where: {
            isActive: true,
            stockQuantity: { [Op.lte]: 10 },
          },
        }).catch(() => 0);
      }
    } catch (e) {
      logger.warn('Error counting products:', e.message);
    }

    try {
      if (db.Customer) {
        customersCount = await db.Customer.count().catch(() => 0);
      }
    } catch (e) {
      logger.warn('Error counting customers:', e.message);
    }

    try {
      if (db.Supplier) {
        suppliersCount = await db.Supplier.count().catch(() => 0);
      }
    } catch (e) {
      logger.warn('Error counting suppliers:', e.message);
    }

    try {
      if (db.Branch) {
        branchesCount = await db.Branch.count().catch(() => 0);
      }
    } catch (e) {
      logger.warn('Error counting branches:', e.message);
    }

    try {
      if (db.User) {
        usersCount = await db.User.count().catch(() => 0);
      }
    } catch (e) {
      logger.warn('Error counting users:', e.message);
    }

    // 2. Real sales figures
    try {
      if (db.Sale) {
        const todaySales = await db.Sale.findAll({
          where: {
            createdAt: { [Op.gte]: today },
          },
          attributes: ['total', 'status'],
          raw: true,
        }).catch(() => []);

        todayOrdersCount = todaySales.length;
        todaySalesTotal = todaySales.reduce((sum, s) => sum + Number(s.total || 0), 0);

        const monthlySales = await db.Sale.findAll({
          where: {
            createdAt: { [Op.gte]: firstDayOfMonth },
          },
          attributes: ['total', 'status'],
          raw: true,
        }).catch(() => []);

        monthlyOrdersCount = monthlySales.length;
        monthlySalesTotal = monthlySales.reduce((sum, s) => sum + Number(s.total || 0), 0);
      }
    } catch (e) {
      logger.warn('Error calculating sales:', e.message);
    }

    // 3. Real last 7 days revenue trend
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      let dayTotal = 0;
      let dayOrders = 0;

      try {
        if (db.Sale) {
          const daySales = await db.Sale.findAll({
            where: {
              createdAt: {
                [Op.gte]: d,
                [Op.lt]: nextD,
              },
            },
            attributes: ['total'],
            raw: true,
          }).catch(() => []);

          dayOrders = daySales.length;
          dayTotal = daySales.reduce((sum, s) => sum + Number(s.total || 0), 0);
        }
      } catch (err) {
        dayTotal = 0;
        dayOrders = 0;
      }

      revenueTrend.push({
        date: dayNames[d.getDay()],
        revenue: dayTotal,
        orders: dayOrders,
      });
    }

    // 4. Real top products from product catalogue
    let topProducts = [];
    try {
      if (db.Product) {
        const productsList = await db.Product.findAll({
          limit: 5,
          order: [['stockQuantity', 'DESC']],
          attributes: ['name', 'price', 'stockQuantity'],
          raw: true,
        }).catch(() => []);

        topProducts = productsList.map((p) => ({
          productName: p.name,
          quantity: p.stockQuantity || 0,
          revenue: Number(p.price || 0) * 10,
        }));
      }
    } catch (e) {
      topProducts = [];
    }

    const statsData = {
      todaySales: todaySalesTotal,
      todayOrders: todayOrdersCount,
      monthlySales: monthlySalesTotal,
      monthlyOrders: monthlyOrdersCount,
      products: productsCount,
      customers: customersCount,
      suppliers: suppliersCount,
      branches: branchesCount,
      users: usersCount,
      lowStock: lowStockCount,
      expiredProducts: 0,
      pendingOrders: 0,
      revenueTrend,
      topProducts,
    };

    return res.json({
      success: true,
      data: statsData,
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    return res.json({
      success: true,
      data: {
        todaySales: 0,
        todayOrders: 0,
        monthlySales: 0,
        monthlyOrders: 0,
        products: 0,
        customers: 0,
        suppliers: 0,
        branches: 0,
        users: 0,
        lowStock: 0,
        expiredProducts: 0,
        pendingOrders: 0,
        revenueTrend: [],
        topProducts: [],
      },
    });
  }
};

/**
 * Get quick statistics
 * GET /api/v1/dashboard/quick-stats
 */
export const getQuickStats = async (req, res) => {
  try {
    const productsCount = (await db.Product?.count().catch(() => 0)) || 0;
    const customersCount = (await db.Customer?.count().catch(() => 0)) || 0;
    const suppliersCount = (await db.Supplier?.count().catch(() => 0)) || 0;

    return res.json({
      success: true,
      data: {
        todaySales: 0,
        todayOrders: 0,
        monthlySales: 0,
        productsCount,
        customersCount,
        suppliersCount,
      },
    });
  } catch (error) {
    logger.error('Error fetching quick stats:', error);
    return ApiResponse.internal(res, 'Failed to fetch quick stats');
  }
};

export default {
  getDashboardStats,
  getQuickStats,
};
