import * as branchService from '../services/branch.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../config/logger.js';

export const createBranch = async (req, res) => {
  try {
    const branchData = {
      ...req.body,
      tenantId: req.user.tenantId,
    };

    const branch = await branchService.createBranch(branchData);

    logger.info(`Branch created: ${branch.id} by user ${req.user.id}`);
    res.status(201).json(ApiResponse.created('Branch created successfully', branch));
  } catch (error) {
    throw error;
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

    res.json(
      ApiResponse.paginated('Branches retrieved successfully', branches, {
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

export const getBranch = async (req, res) => {
  try {
    const branch = await branchService.getBranchById(req.params.id);
    res.json(ApiResponse.success('Branch retrieved successfully', branch));
  } catch (error) {
    throw error;
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await branchService.updateBranch(req.params.id, req.body);

    logger.info(`Branch updated: ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('Branch updated successfully', branch));
  } catch (error) {
    throw error;
  }
};

export const deleteBranch = async (req, res) => {
  try {
    await branchService.deleteBranch(req.params.id);

    logger.info(`Branch deleted: ${req.params.id} by user ${req.user.id}`);
    res.json(ApiResponse.success('Branch deleted successfully'));
  } catch (error) {
    throw error;
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

    res.json(ApiResponse.success('Branch statistics retrieved', stats));
  } catch (error) {
    throw error;
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
