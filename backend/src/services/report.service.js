import { Op } from 'sequelize';
import db from '../models/index.js';
import logger from '../config/logger.js';

/**
 * Get sales report
 */
export const getSalesReport = async (businessId, filters) => {
  const { branchId, dateFrom, dateTo, groupBy = 'day' } = filters;

  const where = { businessId, status: 'completed' };

  if (branchId) where.branchId = branchId;

  if (dateFrom || dateTo) {
    where.saleDate = {};
    if (dateFrom) where.saleDate[Op.gte] = dateFrom;
    if (dateTo) where.saleDate[Op.lte] = dateTo;
  }

  // Summary statistics
  const summary = await db.Sale.findOne({
    where,
    attributes: [
      [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalSales'],
      [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalRevenue'],
      [db.sequelize.fn('SUM', db.sequelize.col('tax')), 'totalTax'],
      [db.sequelize.fn('SUM', db.sequelize.col('discount')), 'totalDiscount'],
      [db.sequelize.fn('AVG', db.sequelize.col('total')), 'averageOrderValue'],
    ],
  });

  // Top products
  const topProducts = await db.SaleItem.findAll({
    include: [
      {
        model: db.Sale,
        as: 'sale',
        where,
        attributes: [],
      },
      {
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'sku'],
      },
    ],
    attributes: [
      [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'totalQuantity'],
      [db.sequelize.fn('SUM', db.sequelize.col('SaleItem.total')), 'totalRevenue'],
    ],
    group: ['product_id'],
    order: [[db.sequelize.literal('totalRevenue'), 'DESC']],
    limit: 10,
    raw: true,
  });

  // Payment method breakdown
  const paymentBreakdown = await db.Payment.findAll({
    include: [
      {
        model: db.Sale,
        as: 'sale',
        where,
        attributes: [],
      },
    ],
    attributes: [
      'paymentMethod',
      [db.sequelize.fn('COUNT', db.sequelize.col('Payment.id')), 'count'],
      [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total'],
    ],
    group: ['payment_method'],
  });

  return {
    summary: summary.get(),
    topProducts,
    paymentBreakdown,
  };
};

/**
 * Get inventory report
 */
export const getInventoryReport = async (businessId, filters) => {
  const { branchId, categoryId, lowStock } = filters;

  const where = {};
  const productWhere = { businessId };
  const inventoryWhere = {};

  if (branchId) inventoryWhere.branchId = branchId;
  if (categoryId) productWhere.categoryId = categoryId;

  if (lowStock) {
    where[Op.and] = db.sequelize.where(
      db.sequelize.col('Inventory.quantity'),
      Op.lte,
      db.sequelize.col('Inventory.reorder_level')
    );
  }

  const inventory = await db.Inventory.findAll({
    where: { ...where, ...inventoryWhere },
    include: [
      {
        model: db.Product,
        as: 'product',
        where: productWhere,
        include: [
          { model: db.Category, as: 'category', attributes: ['name'] },
          { model: db.Unit, as: 'unit', attributes: ['name', 'symbol'] },
        ],
      },
      {
        model: db.Branch,
        as: 'branch',
        attributes: ['name'],
      },
    ],
  });

  // Calculate inventory value
  const inventoryValue = inventory.reduce((total, item) => {
    const costPrice = parseFloat(item.product?.costPrice || 0);
    const quantity = parseFloat(item.quantity || 0);
    return total + costPrice * quantity;
  }, 0);

  const sellingValue = inventory.reduce((total, item) => {
    const sellingPrice = parseFloat(item.product?.sellingPrice || 0);
    const quantity = parseFloat(item.quantity || 0);
    return total + sellingPrice * quantity;
  }, 0);

  return {
    inventory,
    summary: {
      totalItems: inventory.length,
      inventoryValue: inventoryValue.toFixed(2),
      potentialRevenue: sellingValue.toFixed(2),
      potentialProfit: (sellingValue - inventoryValue).toFixed(2),
    },
  };
};

/**
 * Get customer report
 */
export const getCustomerReport = async (businessId, filters) => {
  const { limit = 10, sortBy = 'totalSpent' } = filters;

  const customers = await db.Customer.findAll({
    where: { businessId },
    order: [[sortBy, 'DESC']],
    limit,
  });

  // Customer statistics
  const stats = await db.Customer.findOne({
    where: { businessId },
    attributes: [
      [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalCustomers'],
      [db.sequelize.fn('AVG', db.sequelize.col('total_spent')), 'avgSpending'],
      [db.sequelize.fn('SUM', db.sequelize.col('loyalty_points')), 'totalLoyaltyPoints'],
    ],
  });

  return {
    topCustomers: customers,
    statistics: stats.get(),
  };
};

/**
 * Get profit and loss report
 */
export const getProfitLossReport = async (businessId, filters) => {
  const { branchId, dateFrom, dateTo } = filters;

  const where = { businessId };

  if (branchId) where.branchId = branchId;

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt[Op.gte] = dateFrom;
    if (dateTo) where.createdAt[Op.lte] = dateTo;
  }

  // Sales revenue
  const salesData = await db.Sale.findOne({
    where: { ...where, status: 'completed' },
    attributes: [
      [db.sequelize.fn('SUM', db.sequelize.col('total')), 'revenue'],
      [db.sequelize.fn('SUM', db.sequelize.col('tax')), 'tax'],
    ],
  });

  // Cost of goods sold (from sale items)
  const cogsData = await db.SaleItem.findOne({
    include: [
      {
        model: db.Sale,
        as: 'sale',
        where: { ...where, status: 'completed' },
        attributes: [],
      },
      {
        model: db.Product,
        as: 'product',
        attributes: [],
      },
    ],
    attributes: [
      [
        db.sequelize.literal('SUM(SaleItem.quantity * product.cost_price)'),
        'totalCost',
      ],
    ],
    raw: true,
  });

  // Expenses
  const expensesData = await db.Expense.findOne({
    where,
    attributes: [[db.sequelize.fn('SUM', db.sequelize.col('amount')), 'totalExpenses']],
  });

  const revenue = parseFloat(salesData?.get('revenue') || 0);
  const cogs = parseFloat(cogsData?.totalCost || 0);
  const expenses = parseFloat(expensesData?.get('totalExpenses') || 0);
  const tax = parseFloat(salesData?.get('tax') || 0);

  const grossProfit = revenue - cogs;
  const netProfit = grossProfit - expenses;
  const profitMargin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(2) : 0;

  return {
    revenue: revenue.toFixed(2),
    cogs: cogs.toFixed(2),
    grossProfit: grossProfit.toFixed(2),
    expenses: expenses.toFixed(2),
    tax: tax.toFixed(2),
    netProfit: netProfit.toFixed(2),
    profitMargin: `${profitMargin}%`,
  };
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (businessId, branchId = null) => {
  const where = { businessId };
  if (branchId) where.branchId = branchId;

  // Today's sales
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySales = await db.Sale.findOne({
    where: {
      ...where,
      saleDate: { [Op.gte]: today },
      status: 'completed',
    },
    attributes: [
      [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
      [db.sequelize.fn('SUM', db.sequelize.col('total')), 'total'],
    ],
  });

  // Total customers
  const totalCustomers = await db.Customer.count({ where: { businessId } });

  // Low stock products
  const lowStockCount = await db.Inventory.count({
    where: {
      ...(branchId ? { branchId } : {}),
      [Op.and]: db.sequelize.where(
        db.sequelize.col('quantity'),
        Op.lte,
        db.sequelize.col('reorder_level')
      ),
    },
  });

  // Pending orders (if applicable)
  const pendingOrders = await db.PurchaseOrder.count({
    where: { businessId, status: 'pending' },
  });

  return {
    todaySales: todaySales.get(),
    totalCustomers,
    lowStockCount,
    pendingOrders,
  };
};

/**
 * Get expense report
 */
export const getExpenseReport = async (businessId, filters) => {
  const { branchId, dateFrom, dateTo, categoryId } = filters;

  const where = { businessId };

  if (branchId) where.branchId = branchId;
  if (categoryId) where.categoryId = categoryId;

  if (dateFrom || dateTo) {
    where.expenseDate = {};
    if (dateFrom) where.expenseDate[Op.gte] = dateFrom;
    if (dateTo) where.expenseDate[Op.lte] = dateTo;
  }

  // Get all expenses
  const expenses = await db.Expense.findAll({
    where,
    include: [
      {
        model: db.Branch,
        as: 'branch',
        attributes: ['name'],
      },
    ],
    order: [['expenseDate', 'DESC']],
  });

  // Summary
  const summary = await db.Expense.findOne({
    where,
    attributes: [
      [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalExpenses'],
      [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'totalAmount'],
      [db.sequelize.fn('AVG', db.sequelize.col('amount')), 'averageAmount'],
    ],
  });

  // Group by category
  const byCategory = await db.Expense.findAll({
    where,
    attributes: [
      'category',
      [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
      [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total'],
    ],
    group: ['category'],
    order: [[db.sequelize.literal('total'), 'DESC']],
  });

  return {
    expenses,
    summary: summary.get(),
    byCategory,
  };
};

/**
 * Get product performance report
 */
export const getProductPerformanceReport = async (businessId, filters) => {
  const { branchId, dateFrom, dateTo, limit = 20 } = filters;

  const saleWhere = { businessId, status: 'completed' };

  if (branchId) saleWhere.branchId = branchId;

  if (dateFrom || dateTo) {
    saleWhere.saleDate = {};
    if (dateFrom) saleWhere.saleDate[Op.gte] = dateFrom;
    if (dateTo) saleWhere.saleDate[Op.lte] = dateTo;
  }

  // Top performing products
  const topProducts = await db.SaleItem.findAll({
    include: [
      {
        model: db.Sale,
        as: 'sale',
        where: saleWhere,
        attributes: [],
      },
      {
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'sku', 'costPrice', 'sellingPrice'],
        include: [
          { model: db.Category, as: 'category', attributes: ['name'] },
        ],
      },
    ],
    attributes: [
      [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'totalQuantitySold'],
      [db.sequelize.fn('SUM', db.sequelize.col('SaleItem.total')), 'totalRevenue'],
      [db.sequelize.fn('COUNT', db.sequelize.literal('DISTINCT sale.id')), 'numberOfSales'],
    ],
    group: ['product_id'],
    order: [[db.sequelize.literal('totalRevenue'), 'DESC']],
    limit,
    raw: true,
  });

  // Worst performing products (lowest sales)
  const worstProducts = await db.SaleItem.findAll({
    include: [
      {
        model: db.Sale,
        as: 'sale',
        where: saleWhere,
        attributes: [],
      },
      {
        model: db.Product,
        as: 'product',
        attributes: ['id', 'name', 'sku'],
      },
    ],
    attributes: [
      [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'totalQuantitySold'],
      [db.sequelize.fn('SUM', db.sequelize.col('SaleItem.total')), 'totalRevenue'],
    ],
    group: ['product_id'],
    order: [[db.sequelize.literal('totalRevenue'), 'ASC']],
    limit: 10,
    raw: true,
  });

  return {
    topProducts,
    worstProducts,
  };
};

export default {
  getSalesReport,
  getInventoryReport,
  getCustomerReport,
  getProfitLossReport,
  getDashboardStats,
  getExpenseReport,
  getProductPerformanceReport,
};
