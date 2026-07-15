import * as customerService from '../services/customer.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';

/**
 * Create customer
 */
export const createCustomer = async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      businessId: req.user.businessId,
    };

    const customer = await customerService.createCustomer(customerData);

    logger.info(`Customer created: ${customer.id} by user ${req.user.id}`);
    res.status(201).json(ApiResponse.created('Customer created successfully', customer));
  } catch (error) {
    throw error;
  }
};

/**
 * Get all customers
 */
export const getCustomers = async (req, res) => {
  try {
    const { count, customers } = await customerService.getCustomers(
      req.query,
      req.pagination
    );

    const { page, limit } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    res.json(
      ApiResponse.paginated('Customers retrieved successfully', customers, {
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
 * Get customer by ID
 */
export const getCustomer = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    res.json(ApiResponse.success('Customer retrieved successfully', customer));
  } catch (error) {
    throw error;
  }
};

/**
 * Update customer
 */
export const updateCustomer = async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);

    logger.info(`Customer updated: ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('Customer updated successfully', customer));
  } catch (error) {
    throw error;
  }
};

/**
 * Delete customer
 */
export const deleteCustomer = async (req, res) => {
  try {
    await customerService.deleteCustomer(req.params.id);

    logger.info(`Customer deleted: ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('Customer deleted successfully'));
  } catch (error) {
    throw error;
  }
};

/**
 * Adjust loyalty points
 */
export const adjustLoyaltyPoints = async (req, res) => {
  try {
    const customer = await customerService.adjustLoyaltyPoints(
      req.params.id,
      req.user.branchId,
      req.body
    );

    logger.info(`Loyalty points adjusted for customer ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('Loyalty points adjusted successfully', customer));
  } catch (error) {
    throw error;
  }
};

/**
 * Get customer purchase history
 */
export const getCustomerPurchaseHistory = async (req, res) => {
  try {
    const { count, sales } = await customerService.getCustomerPurchaseHistory(
      req.params.id,
      req.pagination
    );

    const { page, limit } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    res.json(
      ApiResponse.paginated('Purchase history retrieved', sales, {
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
 * Get top customers
 */
export const getTopCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const customers = await customerService.getTopCustomers(req.user.businessId, limit);

    res.json(ApiResponse.success('Top customers retrieved', customers));
  } catch (error) {
    throw error;
  }
};

export default {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  adjustLoyaltyPoints,
  getCustomerPurchaseHistory,
  getTopCustomers,
};
