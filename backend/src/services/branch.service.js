import { Op } from 'sequelize';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Create a new branch
 */
export const createBranch = async (branchData) => {
  try {
    const branch = await db.Branch.create(branchData);
    return branch;
  } catch (error) {
    logger.error('Create branch failed:', error);
    throw error;
  }
};

/**
 * Get all branches
 */
export const getBranches = async (filters, pagination) => {
  const { search, status, city, sortBy = 'createdAt', sortOrder = 'desc', tenantId } = filters;
  const { limit, offset } = pagination;

  const where = {};

  // Filter by tenant (multi-tenant isolation)
  if (tenantId) {
    where.tenantId = tenantId;
  }

  // Text search
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filters
  if (status !== undefined) where.isActive = status === 'active';
  if (city) where.city = city;

  const { count, rows } = await db.Branch.findAndCountAll({
    where,
    include: [
      {
        model: db.Tenant,
        as: 'tenant',
        attributes: ['id', 'name'],
      },
    ],
    limit,
    offset,
    order: [[sortBy, sortOrder.toUpperCase()]],
  });

  return { count, branches: rows };
};

/**
 * Get branch by ID
 */
export const getBranchById = async (branchId) => {
  const branch = await db.Branch.findByPk(branchId, {
    include: [
      { model: db.Tenant, as: 'tenant' },
      {
        model: db.User,
        as: 'users',
        attributes: ['id', 'name', 'email', 'phone', 'status'],
        include: [{ model: db.Role, as: 'role', attributes: ['name'] }],
      },
    ],
  });

  if (!branch) {
    throw ApiError.notFound('Branch not found');
  }

  return branch;
};

/**
 * Update branch
 */
export const updateBranch = async (branchId, updateData) => {
  const branch = await db.Branch.findByPk(branchId);

  if (!branch) {
    throw ApiError.notFound('Branch not found');
  }

  await branch.update(updateData);

  return await getBranchById(branchId);
};

/**
 * Delete branch
 */
export const deleteBranch = async (branchId) => {
  const branch = await db.Branch.findByPk(branchId);

  if (!branch) {
    throw ApiError.notFound('Branch not found');
  }

  // Check if branch has users
  const usersCount = await db.User.count({ where: { branchId } });
  if (usersCount > 0) {
    throw ApiError.badRequest('Cannot delete branch with active users');
  }

  // Check if branch has inventory
  const inventoryCount = await db.Inventory.count({ where: { branchId } });
  if (inventoryCount > 0) {
    throw ApiError.badRequest('Cannot delete branch with inventory items');
  }

  // Soft delete
  await branch.destroy();

  return true;
};

/**
 * Get branch statistics
 */
export const getBranchStatistics = async (branchId, dateFrom, dateTo) => {
  const where = { branchId };

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt[Op.gte] = dateFrom;
    if (dateTo) where.createdAt[Op.lte] = dateTo;
  }

  // Sales statistics
  const salesStats = await db.Sale.findOne({
    where,
    attributes: [
      [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalSales'],
      [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalRevenue'],
      [db.sequelize.fn('AVG', db.sequelize.col('total')), 'averageOrderValue'],
    ],
  });

  // Product count
  const productCount = await db.Inventory.count({ where: { branchId } });

  // Low stock count
  const lowStockCount = await db.Inventory.count({
    where: {
      branchId,
      [Op.and]: db.sequelize.where(
        db.sequelize.col('quantity'),
        Op.lte,
        db.sequelize.col('reorder_level')
      ),
    },
  });

  // Customer count (purchases at this branch)
  const customerCount = await db.Sale.count({
    where: { branchId, customerId: { [Op.ne]: null } },
    distinct: true,
    col: 'customerId',
  });

  return {
    sales: salesStats.get(),
    productCount,
    lowStockCount,
    customerCount,
  };
};

export default {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getBranchStatistics,
};
