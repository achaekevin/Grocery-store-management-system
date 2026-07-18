import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import sequelize from '../config/sequelize.js';
import { Op } from 'sequelize';

// Get income summary
export const getIncomeSummary = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, startDate, endDate } = req.query;

    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const income = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalIncome'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
        [sequelize.fn('AVG', sequelize.col('totalAmount')), 'averageOrderValue'],
      ],
      raw: true,
    });

    const paymentMethods = await Payment.findAll({
      where: {
        tenantId,
        status: 'completed',
        ...(startDate && endDate && {
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        }),
      },
      attributes: [
        'paymentMethod',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['paymentMethod'],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        summary: income[0],
        byPaymentMethod: paymentMethods,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch income summary',
      error: error.message,
    });
  }
};

// Get expenses summary
export const getExpensesSummary = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, startDate, endDate } = req.query;

    // This would query from an Expense model
    // Placeholder implementation
    res.json({
      success: true,
      data: {
        totalExpenses: 0,
        byCategory: [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses summary',
      error: error.message,
    });
  }
};

// Get profit summary
export const getProfitSummary = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, startDate, endDate } = req.query;

    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const orders = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
        [sequelize.fn('SUM', sequelize.col('costPrice')), 'cost'],
      ],
      raw: true,
    });

    const revenue = parseFloat(orders[0]?.revenue || 0);
    const cost = parseFloat(orders[0]?.cost || 0);
    const profit = revenue - cost;
    const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        revenue,
        cost,
        profit,
        profitMargin: `${profitMargin}%`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profit summary',
      error: error.message,
    });
  }
};

// Get cash flow
export const getCashFlow = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, startDate, endDate } = req.query;

    const where = { tenantId };
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const cashIn = await Payment.findAll({
      where: { ...where, status: 'completed' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
      ],
      raw: true,
    });

    const cashOut = 0; // Would come from expenses

    res.json({
      success: true,
      data: {
        cashIn: parseFloat(cashIn[0]?.total || 0),
        cashOut,
        netCashFlow: parseFloat(cashIn[0]?.total || 0) - cashOut,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cash flow',
      error: error.message,
    });
  }
};

// Get tax summary
export const getTaxSummary = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, startDate, endDate } = req.query;

    const where = { tenantId, status: 'completed' };
    if (branchId) where.branchId = branchId;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const taxes = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('taxAmount')), 'totalTax'],
      ],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        totalTax: parseFloat(taxes[0]?.totalTax || 0),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tax summary',
      error: error.message,
    });
  }
};

// Daily closing
export const dailyClosing = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.user;
    const { branchId, date } = req.body;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const where = {
      tenantId,
      branchId,
      status: 'completed',
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    const sales = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSales'],
        [sequelize.fn('SUM', sequelize.col('taxAmount')), 'totalTax'],
      ],
      raw: true,
    });

    const payments = await Payment.findAll({
      where: {
        tenantId,
        status: 'completed',
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        'paymentMethod',
        [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
      ],
      group: ['paymentMethod'],
      raw: true,
    });

    res.json({
      success: true,
      message: 'Daily closing completed',
      data: {
        date,
        sales: sales[0],
        paymentBreakdown: payments,
        closedBy: userId,
        closedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to perform daily closing',
      error: error.message,
    });
  }
};

// Monthly closing
export const monthlyClosing = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.user;
    const { branchId, year, month } = req.body;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const where = {
      tenantId,
      status: 'completed',
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };
    if (branchId) where.branchId = branchId;

    const sales = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSales'],
        [sequelize.fn('SUM', sequelize.col('taxAmount')), 'totalTax'],
      ],
      raw: true,
    });

    res.json({
      success: true,
      message: 'Monthly closing completed',
      data: {
        year,
        month,
        sales: sales[0],
        closedBy: userId,
        closedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to perform monthly closing',
      error: error.message,
    });
  }
};

export default {
  getIncomeSummary,
  getExpensesSummary,
  getProfitSummary,
  getCashFlow,
  getTaxSummary,
  dailyClosing,
  monthlyClosing,
};
