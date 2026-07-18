import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Payment from '../models/Payment.js';
import sequelize from '../config/sequelize.js';
import cacheService from './cache.service.js';
import { Op } from 'sequelize';

class AnalyticsService {
  /**
   * Get best-selling products
   */
  async getBestSellingProducts(tenantId, branchId, startDate, endDate, limit = 10) {
    const cacheKey = `analytics:best-selling:${tenantId}:${branchId}:${startDate}:${endDate}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // This is a simplified version - you'd need to parse items JSON
    const orders = await Order.findAll({
      where,
      attributes: ['items'],
      raw: true,
    });

    const productSales = {};
    orders.forEach(order => {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            productName: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantity += parseFloat(item.quantity);
        productSales[item.productId].revenue += parseFloat(item.price) * parseFloat(item.quantity);
      });
    });

    const result = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);

    await cacheService.set(cacheKey, result, 1800);
    return result;
  }

  /**
   * Get slow-moving products
   */
  async getSlowMovingProducts(tenantId, branchId, days = 30, limit = 10) {
    const cacheKey = `analytics:slow-moving:${tenantId}:${branchId}:${days}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;

    const orders = await Order.findAll({
      where: {
        ...where,
        createdAt: { [Op.gte]: daysAgo },
      },
      attributes: ['items'],
      raw: true,
    });

    const productSales = {};
    orders.forEach(order => {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      items.forEach(item => {
        productSales[item.productId] = (productSales[item.productId] || 0) + parseFloat(item.quantity);
      });
    });

    // Get all products
    const allProducts = await Product.findAll({
      where: { tenantId, status: 'active' },
      attributes: ['id', 'name', 'sku'],
      raw: true,
    });

    const slowMoving = allProducts
      .map(product => ({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantitySold: productSales[product.id] || 0,
      }))
      .sort((a, b) => a.quantitySold - b.quantitySold)
      .slice(0, limit);

    await cacheService.set(cacheKey, slowMoving, 1800);
    return slowMoving;
  }

  /**
   * Get branch performance
   */
  async getBranchPerformance(tenantId, startDate, endDate) {
    const cacheKey = `analytics:branch-performance:${tenantId}:${startDate}:${endDate}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const where = { tenantId, status: 'completed' };
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const performance = await Order.findAll({
      where,
      attributes: [
        'branchId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
        [sequelize.fn('AVG', sequelize.col('totalAmount')), 'avgOrderValue'],
      ],
      group: ['branchId'],
      raw: true,
    });

    await cacheService.set(cacheKey, performance, 1800);
    return performance;
  }

  /**
   * Calculate revenue growth
   */
  async getRevenueGrowth(tenantId, branchId) {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;

    const currentMonthRevenue = await Order.sum('totalAmount', {
      where: {
        ...where,
        createdAt: { [Op.gte]: currentMonth },
      },
    });

    const lastMonthRevenue = await Order.sum('totalAmount', {
      where: {
        ...where,
        createdAt: {
          [Op.between]: [lastMonth, lastMonthEnd],
        },
      },
    });

    const current = parseFloat(currentMonthRevenue || 0);
    const previous = parseFloat(lastMonthRevenue || 0);
    const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return {
      currentMonth: current,
      lastMonth: previous,
      growth: growth.toFixed(2),
      direction: growth >= 0 ? 'up' : 'down',
    };
  }

  /**
   * Calculate profit margin
   */
  async getProfitMargin(tenantId, branchId, startDate, endDate) {
    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const result = await Order.findOne({
      where,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
        [sequelize.fn('SUM', sequelize.col('costPrice')), 'cost'],
      ],
      raw: true,
    });

    const revenue = parseFloat(result?.revenue || 0);
    const cost = parseFloat(result?.cost || 0);
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      revenue,
      cost,
      profit,
      margin: margin.toFixed(2),
    };
  }

  /**
   * Customer retention rate
   */
  async getCustomerRetention(tenantId, branchId) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date(today);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;

    // Customers who bought in last 30-60 days
    const previousPeriodCustomers = await Order.findAll({
      where: {
        ...where,
        createdAt: {
          [Op.between]: [sixtyDaysAgo, thirtyDaysAgo],
        },
      },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('customerId')), 'customerId']],
      raw: true,
    });

    // Customers who bought in last 30 days
    const currentPeriodCustomers = await Order.findAll({
      where: {
        ...where,
        createdAt: { [Op.gte]: thirtyDaysAgo },
      },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('customerId')), 'customerId']],
      raw: true,
    });

    const previousIds = previousPeriodCustomers.map(c => c.customerId);
    const currentIds = currentPeriodCustomers.map(c => c.customerId);
    const retained = currentIds.filter(id => previousIds.includes(id)).length;

    const retentionRate = previousIds.length > 0 ? (retained / previousIds.length) * 100 : 0;

    return {
      previousPeriod: previousIds.length,
      currentPeriod: currentIds.length,
      retained,
      retentionRate: retentionRate.toFixed(2),
    };
  }

  /**
   * Average basket size
   */
  async getAverageBasketSize(tenantId, branchId, startDate, endDate) {
    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const result = await Order.findOne({
      where,
      attributes: [
        [sequelize.fn('AVG', sequelize.col('totalAmount')), 'avgBasket'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
      ],
      raw: true,
    });

    return {
      averageBasketSize: parseFloat(result?.avgBasket || 0).toFixed(2),
      totalOrders: parseInt(result?.totalOrders || 0),
    };
  }

  /**
   * Sales by payment method
   */
  async getSalesByPaymentMethod(tenantId, branchId, startDate, endDate) {
    const where = { tenantId, status: 'completed' };
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const result = await Payment.findAll({
      where,
      attributes: [
        'paymentMethod',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
      ],
      group: ['paymentMethod'],
      raw: true,
    });

    return result.map(r => ({
      method: r.paymentMethod,
      count: parseInt(r.count),
      total: parseFloat(r.total),
    }));
  }

  /**
   * Peak shopping hours
   */
  async getPeakShoppingHours(tenantId, branchId, days = 30) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;

    const result = await Order.findAll({
      where: {
        ...where,
        createdAt: { [Op.gte]: daysAgo },
      },
      attributes: [
        [sequelize.fn('HOUR', sequelize.col('createdAt')), 'hour'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
      ],
      group: [sequelize.fn('HOUR', sequelize.col('createdAt'))],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      raw: true,
    });

    return result.map(r => ({
      hour: parseInt(r.hour),
      orders: parseInt(r.orders),
      revenue: parseFloat(r.revenue),
    }));
  }
}

export default new AnalyticsService();
