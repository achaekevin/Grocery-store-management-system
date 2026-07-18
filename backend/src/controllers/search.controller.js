import { Op } from 'sequelize';
import SearchHistory from '../models/SearchHistory.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Branch from '../models/Branch.js';
import Category from '../models/Category.js';

// Global search
export const globalSearch = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.user;
    const { query, type = 'all', limit = 10 } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    const searchPattern = `%${query}%`;
    const results = {};
    let totalCount = 0;

    // Search products
    if (type === 'all' || type === 'product') {
      const products = await Product.findAll({
        where: {
          tenantId,
          [Op.or]: [
            { name: { [Op.like]: searchPattern } },
            { sku: { [Op.like]: searchPattern } },
            { barcode: { [Op.like]: searchPattern } },
          ],
        },
        limit: parseInt(limit),
        attributes: ['id', 'name', 'sku', 'barcode', 'price', 'image'],
      });
      results.products = products;
      totalCount += products.length;
    }

    // Search customers
    if (type === 'all' || type === 'customer') {
      const customers = await Customer.findAll({
        where: {
          tenantId,
          [Op.or]: [
            { name: { [Op.like]: searchPattern } },
            { email: { [Op.like]: searchPattern } },
            { phone: { [Op.like]: searchPattern } },
          ],
        },
        limit: parseInt(limit),
        attributes: ['id', 'name', 'email', 'phone'],
      });
      results.customers = customers;
      totalCount += customers.length;
    }

    // Search suppliers
    if (type === 'all' || type === 'supplier') {
      const suppliers = await Supplier.findAll({
        where: {
          tenantId,
          [Op.or]: [
            { name: { [Op.like]: searchPattern } },
            { email: { [Op.like]: searchPattern } },
            { phone: { [Op.like]: searchPattern } },
          ],
        },
        limit: parseInt(limit),
        attributes: ['id', 'name', 'email', 'phone'],
      });
      results.suppliers = suppliers;
      totalCount += suppliers.length;
    }

    // Search users
    if (type === 'all' || type === 'user') {
      const users = await User.findAll({
        where: {
          tenantId,
          [Op.or]: [
            { firstName: { [Op.like]: searchPattern } },
            { lastName: { [Op.like]: searchPattern } },
            { email: { [Op.like]: searchPattern } },
          ],
        },
        limit: parseInt(limit),
        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
      });
      results.users = users;
      totalCount += users.length;
    }

    // Search orders
    if (type === 'all' || type === 'order') {
      const orders = await Order.findAll({
        where: {
          tenantId,
          [Op.or]: [
            { orderNumber: { [Op.like]: searchPattern } },
          ],
        },
        limit: parseInt(limit),
        attributes: ['id', 'orderNumber', 'total', 'status', 'createdAt'],
      });
      results.orders = orders;
      totalCount += orders.length;
    }

    // Search branches
    if (type === 'all' || type === 'branch') {
      const branches = await Branch.findAll({
        where: {
          tenantId,
          [Op.or]: [
            { name: { [Op.like]: searchPattern } },
            { code: { [Op.like]: searchPattern } },
          ],
        },
        limit: parseInt(limit),
        attributes: ['id', 'name', 'code', 'address'],
      });
      results.branches = branches;
      totalCount += branches.length;
    }

    // Search categories
    if (type === 'all' || type === 'category') {
      const categories = await Category.findAll({
        where: {
          tenantId,
          name: { [Op.like]: searchPattern },
        },
        limit: parseInt(limit),
        attributes: ['id', 'name', 'description'],
      });
      results.categories = categories;
      totalCount += categories.length;
    }

    // Save search history
    await SearchHistory.create({
      tenantId,
      userId,
      query,
      searchType: type,
      resultCount: totalCount,
    });

    res.json({
      success: true,
      data: {
        query,
        type,
        results,
        totalCount,
      },
    });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    });
  }
};

// Get search history
export const getSearchHistory = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.user;
    const { limit = 10 } = req.query;

    const history = await SearchHistory.findAll({
      where: { tenantId, userId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      attributes: ['id', 'query', 'searchType', 'resultCount', 'createdAt'],
    });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Get search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch search history',
      error: error.message,
    });
  }
};

// Get popular searches
export const getPopularSearches = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { limit = 10 } = req.query;

    const popularSearches = await SearchHistory.findAll({
      where: { tenantId },
      attributes: [
        'query',
        [sequelize.fn('COUNT', sequelize.col('query')), 'count'],
      ],
      group: ['query'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: popularSearches,
    });
  } catch (error) {
    console.error('Get popular searches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular searches',
      error: error.message,
    });
  }
};

// Record clicked result
export const recordClickedResult = async (req, res) => {
  try {
    const { searchId, resultId, resultType } = req.body;

    await SearchHistory.update(
      {
        clickedResultId: resultId,
        clickedResultType: resultType,
      },
      {
        where: { id: searchId },
      }
    );

    res.json({
      success: true,
      message: 'Click recorded successfully',
    });
  } catch (error) {
    console.error('Record clicked result error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record click',
      error: error.message,
    });
  }
};

// Clear search history
export const clearSearchHistory = async (req, res) => {
  try {
    const { tenantId, id: userId } = req.user;

    await SearchHistory.destroy({
      where: { tenantId, userId },
    });

    res.json({
      success: true,
      message: 'Search history cleared successfully',
    });
  } catch (error) {
    console.error('Clear search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear search history',
      error: error.message,
    });
  }
};
