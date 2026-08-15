import * as supplierService from '../services/supplier.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';

export const createSupplier = async (req, res) => {
  try {
    const businessId = req.user?.tenantId || req.user?.businessId || req.user?.business?.id || 1;
    const supplierData = {
      ...req.body,
      businessId,
    };

    const supplier = await supplierService.createSupplier(supplierData);

    logger.info(`Supplier created: ${supplier.id} by user ${req.user?.id}`);
    return ApiResponse.created(res, 'Supplier created successfully', supplier);
  } catch (error) {
    logger.error('Error creating supplier:', error);
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to create supplier',
      errors: error.errors || [error.message],
    });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const pagination = req.pagination || {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      offset: 0,
    };

    const { count, suppliers } = await supplierService.getSuppliers(
      req.query,
      pagination
    );

    const { page, limit } = pagination;
    const totalPages = Math.ceil(count / limit) || 1;

    return ApiResponse.paginated(res, 'Suppliers retrieved successfully', suppliers, {
      currentPage: page,
      perPage: limit,
      totalItems: count,
      totalPages,
    });
  } catch (error) {
    logger.error('Error getting suppliers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve suppliers',
      data: [],
    });
  }
};

export const getSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    return ApiResponse.success(res, 'Supplier retrieved successfully', supplier);
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message || 'Supplier not found',
    });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.updateSupplier(req.params.id, req.body);

    logger.info(`Supplier updated: ${req.params.id} by user ${req.user?.id}`);
    return ApiResponse.success(res, 'Supplier updated successfully', supplier);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to update supplier',
    });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    await supplierService.deleteSupplier(req.params.id);

    logger.info(`Supplier deleted: ${req.params.id} by user ${req.user?.id}`);
    return ApiResponse.success(res, 'Supplier deleted successfully');
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to delete supplier',
    });
  }
};

export const getSupplierPurchaseHistory = async (req, res) => {
  try {
    const pagination = req.pagination || { page: 1, limit: 10, offset: 0 };
    const { count, orders } = await supplierService.getSupplierPurchaseHistory(
      req.params.id,
      pagination
    );

    return ApiResponse.paginated(res, 'Purchase history retrieved', orders, {
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

export default {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierPurchaseHistory,
};
