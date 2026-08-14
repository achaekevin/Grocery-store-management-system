import * as branchService from '../services/branch.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';

export const createBranch = async (req, res) => {
  try {
    const cleanedBody = { ...req.body };
    ['phone', 'email', 'address', 'city', 'region', 'postalCode'].forEach((field) => {
      if (cleanedBody[field] === '') {
        cleanedBody[field] = null;
      }
    });

    const branchData = {
      ...cleanedBody,
      tenantId: req.user.tenantId,
    };

    const branch = await branchService.createBranch(branchData);

    logger.info(`Branch created: ${branch.id} by user ${req.user.id}`);
    return ApiResponse.created(res, 'Branch created successfully', branch);
  } catch (error) {
    logger.error('Create branch error:', error);
    return ApiResponse.internal(res, 'Failed to create branch', [error.message]);
  }
};

export const getBranches = async (req, res) => {
  try {
    // Add tenantId filter for multi-tenant isolation
    const filters = {
      ...req.query,
      tenantId: req.user.tenantId,
    };

    const { count, branches } = await branchService.getBranches(
      filters,
      req.pagination
    );

    const { page, limit } = req.pagination;
    const totalPages = Math.ceil(count / limit);

    return ApiResponse.paginated(res, 'Branches retrieved successfully', branches, {
      currentPage: page,
      perPage: limit,
      totalItems: count,
      totalPages,
    });
  } catch (error) {
    logger.error('Get branches error:', error);
    return ApiResponse.internal(res, 'Failed to retrieve branches', [error.message]);
  }
};

export const getBranch = async (req, res) => {
  try {
    const branch = await branchService.getBranchById(req.params.id);
    return ApiResponse.success(res, 'Branch retrieved successfully', branch);
  } catch (error) {
    logger.error('Get branch error:', error);
    return ApiResponse.internal(res, 'Failed to retrieve branch', [error.message]);
  }
};

export const updateBranch = async (req, res) => {
  try {
    const cleanedBody = { ...req.body };
    ['phone', 'email', 'address', 'city', 'region', 'postalCode'].forEach((field) => {
      if (cleanedBody[field] === '') {
        cleanedBody[field] = null;
      }
    });

    const branch = await branchService.updateBranch(req.params.id, cleanedBody);

    logger.info(`Branch updated: ${req.params.id} by user ${req.user.id}`);
    return ApiResponse.success(res, 'Branch updated successfully', branch);
  } catch (error) {
    logger.error('Update branch error:', error);
    return ApiResponse.internal(res, 'Failed to update branch', [error.message]);
  }
};

export const deleteBranch = async (req, res) => {
  try {
    await branchService.deleteBranch(req.params.id);

    logger.info(`Branch deleted: ${req.params.id} by user ${req.user.id}`);
    return ApiResponse.success(res, 'Branch deleted successfully');
  } catch (error) {
    logger.error('Delete branch error:', error);
    return ApiResponse.internal(res, 'Failed to delete branch', [error.message]);
  }
};

export const getBranchStatistics = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const stats = await branchService.getBranchStatistics(
      req.params.id,
      dateFrom,
      dateTo
    );

    return ApiResponse.success(res, 'Branch statistics retrieved', stats);
  } catch (error) {
    logger.error('Get branch statistics error:', error);
    return ApiResponse.internal(res, 'Failed to retrieve branch statistics', [error.message]);
  }
};

export default {
  createBranch,
  getBranches,
  getBranch,
  updateBranch,
  deleteBranch,
  getBranchStatistics,
};
