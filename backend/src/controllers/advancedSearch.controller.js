import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import Order from '../models/Order.js';
import { Op } from 'sequelize';

/**
 * Advanced search across multiple entities
 */
export const advancedSearch = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { query, type, limit = 20 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const results = {};

    // Search products
    if (!type || type === 'products') {
      results.products = await Product.findAll({
        where: {
          tenantId,
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { sku: { [Op.like]: `%${query}%` } },
            { barcode: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
          ],
        },
        limit: parseInt(limit),
        attributes: ['id', 'name', 'sku', 'barcode', 'price', 'image'],
      });
    }

    // Search customers
    if (!type || type === 'customers') {
      results.customers = await Customer.findAll({
        where: {
          tenantId,
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
            { phone: { [Op.like]: `%${query}%` } },
          ],
        },
        limit: parseInt(limit),
        attributes: ['id', 'name', 'email', 'phone'],
      });
    }

    // Search suppliers
    if (!type || type === 'suppliers') {
      results.suppliers = await Supplier.findAll({
        where: {
          tenantId,
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
            { phone: { [Op.like]: `%${query}%` } },
          ],
        },
        limit: parseInt(limit),
        attributes: ['id', 'name', 'email', 'phone'],
      });
    }

    // Search orders by invoice number
    if (!type || type === 'orders') {
      results.orders = await Order.findAll({
        where: {
          tenantId,
          [Op.or]: [
            { orderNumber: { [Op.like]: `%${query}%` } },
            { invoiceNumber: { [Op.like]: `%${query}%` } },
          ],
        },
        limit: parseInt(limit),
        attributes: ['id', 'orderNumber', 'invoiceNumber', 'totalAmount', 'status', 'createdAt'],
      });
    }

    res.json({
      success: true,
      query,
      data: results,
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    });
  }
};

/**
 * Search by barcode
 */
export const searchByBarcode = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { barcode } = req.params;

    const product = await Product.findOne({
      where: {
        tenantId,
        barcode,
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
    res.status(500).json({
      success: false,
      message: 'Barcode search failed',
      error: error.message,
    });
  }
};

/**
 * Search by SKU
 */
export const searchBySKU = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { sku } = req.params;

    const product = await Product.findOne({
      where: {
        tenantId,
        sku,
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
    res.status(500).json({
      success: false,
      message: 'SKU search failed',
      error: error.message,
    });
  }
};

/**
 * Search by invoice number
 */
export const searchByInvoice = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { invoiceNumber } = req.params;

    const order = await Order.findOne({
      where: {
        tenantId,
        invoiceNumber,
      },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Invoice search failed',
      error: error.message,
    });
  }
};

/**
 * Full-text search (simplified)
 */
export const fullTextSearch = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Query must be at least 3 characters',
      });
    }

    const products = await Product.findAll({
      where: {
        tenantId,
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
          { sku: { [Op.like]: `%${query}%` } },
          { barcode: { [Op.like]: `%${query}%` } },
        ],
      },
      limit: 50,
    });

    res.json({
      success: true,
      query,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Full-text search failed',
      error: error.message,
    });
  }
};

export default {
  advancedSearch,
  searchByBarcode,
  searchBySKU,
  searchByInvoice,
  fullTextSearch,
};
