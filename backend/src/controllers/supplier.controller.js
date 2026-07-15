import * as supplierService from '../services/supplier.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';

export const createSupplier = async (req, res) => {
  try {
    const supplierData = {
      ...req.body,
      businessId: req.user.businessId,
    };

    const supplier = await supplierService.createSupplier(supplierData);

    logger.info(`Supplier created: ${supplier.id} by user ${req.user.id}`);
    res.status(201).json(ApiResponse.created('Supplier created successfully', supplier));
  } catch (error) {
    throw error;
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const { count, suppliers } = await supplierService.getSuppliers(
      req.query,
      req.pagination
    );

    const { page, limit } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    res.json(
      ApiResponse.paginated('Suppliers retrieved successfully', suppliers, {
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

export const getSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    res.json(ApiResponse.success('Supplier retrieved successfully', supplier));
  } catch (error) {
    throw error;
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.updateSupplier(req.params.id, req.body);

    logger.info(`Supplier updated: ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('Supplier updated successfully', supplier));
  } catch (error) {
    throw error;
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    await supplierService.deleteSupplier(req.params.id);

    logger.info(`Supplier deleted: ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('Supplier deleted successfully'));
  } catch (error) {
    throw error;
  }
};

export const getSupplierPurchaseHistory = async (req, res) => {
  try {
    const { count, orders } = await supplierService.getSupplierPurchaseHistory(
      req.params.id,
      req.pagination
    );

    const { page, limit } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    res.json(
      ApiResponse.paginated('Purchase history retrieved', orders, {
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

export default {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierPurchaseHistory,
};
