import * as customerService from '../services/customer.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';

/**
 * Create customer
 */
export const createCustomer = async (req, res) => {
  try {
    const businessId = req.user?.tenantId || req.user?.businessId || req.user?.business?.id || 1;
    const name = req.body.name || `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim() || 'New Customer';

    const customerData = {
      ...req.body,
      name,
      businessId,
    };

    const customer = await customerService.createCustomer(customerData);

    logger.info(`Customer created: ${customer.id} by user ${req.user?.id}`);
    return ApiResponse.created(res, 'Customer created successfully', customer);
  } catch (error) {
    logger.error('Error creating customer:', error);
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to create customer',
      errors: error.errors || [error.message],
    });
  }
};

/**
 * Get all customers
 */
export const getCustomers = async (req, res) => {
  try {
    const pagination = req.pagination || {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      offset: 0,
    };

    const { count, customers } = await customerService.getCustomers(
      req.query,
      pagination
    );

    const { page, limit } = pagination;
    const totalPages = Math.ceil(count / limit) || 1;

    return ApiResponse.paginated(res, 'Customers retrieved successfully', customers, {
      currentPage: page,
      perPage: limit,
      totalItems: count,
      totalPages,
    });
  } catch (error) {
    logger.error('Error getting customers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers',
      data: [],
    });
  }
};

/**
 * Get customer by ID
 */
export const getCustomer = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    return ApiResponse.success(res, 'Customer retrieved successfully', customer);
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message || 'Customer not found',
    });
  }
};

/**
 * Update customer
 */
export const updateCustomer = async (req, res) => {
  try {
    const name = req.body.name || (req.body.firstName ? `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim() : undefined);
    const updateData = {
      ...req.body,
      ...(name && { name }),
    };

    const customer = await customerService.updateCustomer(req.params.id, updateData);

    logger.info(`Customer updated: ${req.params.id} by user ${req.user?.id}`);
    return ApiResponse.success(res, 'Customer updated successfully', customer);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to update customer',
    });
  }
};

/**
 * Delete customer
 */
export const deleteCustomer = async (req, res) => {
  try {
    await customerService.deleteCustomer(req.params.id);

    logger.info(`Customer deleted: ${req.params.id} by user ${req.user?.id}`);
    return ApiResponse.success(res, 'Customer deleted successfully');
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to delete customer',
    });
  }
};

/**
 * Adjust loyalty points
 */
export const adjustLoyaltyPoints = async (req, res) => {
  try {
    const customer = await customerService.adjustLoyaltyPoints(
      req.params.id,
      req.user?.branchId || 1,
      req.body
    );

    logger.info(`Loyalty points adjusted for customer ${req.params.id} by user ${req.user?.id}`);
    return ApiResponse.success(res, 'Loyalty points adjusted successfully', customer);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to adjust loyalty points',
    });
  }
};

/**
 * Get customer purchase history
 */
export const getCustomerPurchaseHistory = async (req, res) => {
  try {
    const pagination = req.pagination || { page: 1, limit: 10, offset: 0 };
    const { count, sales } = await customerService.getCustomerPurchaseHistory(
      req.params.id,
      pagination
    );

    return ApiResponse.paginated(res, 'Purchase history retrieved', sales, {
      currentPage: pagination.page,
      perPage: pagination.limit,
      totalItems: count,
      totalPages: Math.ceil(count / pagination.limit) || 1,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to get purchase history',
    });
  }
};

/**
 * Get top customers
 */
export const getTopCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const businessId = req.user?.tenantId || req.user?.businessId || req.user?.business?.id || 1;
    const customers = await customerService.getTopCustomers(businessId, limit);

    return ApiResponse.success(res, 'Top customers retrieved', customers);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get top customers',
    });
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
