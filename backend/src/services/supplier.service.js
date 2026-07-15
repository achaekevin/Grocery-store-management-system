import { Op } from 'sequelize';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Create a new supplier
 */
export const createSupplier = async (supplierData) => {
  try {
    // Check if phone already exists
    const existingSupplier = await db.Supplier.findOne({
      where: {
        businessId: supplierData.businessId,
        phone: supplierData.phone,
      },
    });

    if (existingSupplier) {
      throw ApiError.conflict('Supplier with this phone number already exists');
    }

    const supplier = await db.Supplier.create(supplierData);
    return supplier;
  } catch (error) {
    logger.error('Create supplier failed:', error);
    throw error;
  }
};

/**
 * Get all suppliers
 */
export const getSuppliers = async (filters, pagination) => {
  const { search, status, city, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
  const { limit, offset } = pagination;

  const where = {};

  // Text search
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filters
  if (status) where.status = status;
  if (city) where.city = city;

  const { count, rows } = await db.Supplier.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortBy, sortOrder.toUpperCase()]],
  });

  return { count, suppliers: rows };
};

/**
 * Get supplier by ID
 */
export const getSupplierById = async (supplierId) => {
  const supplier = await db.Supplier.findByPk(supplierId, {
    include: [
      {
        model: db.PurchaseOrder,
        as: 'purchaseOrders',
        limit: 10,
        order: [['createdAt', 'DESC']],
      },
    ],
  });

  if (!supplier) {
    throw ApiError.notFound('Supplier not found');
  }

  return supplier;
};

/**
 * Update supplier
 */
export const updateSupplier = async (supplierId, updateData) => {
  const supplier = await db.Supplier.findByPk(supplierId);

  if (!supplier) {
    throw ApiError.notFound('Supplier not found');
  }

  // Check if phone is being changed and already exists
  if (updateData.phone && updateData.phone !== supplier.phone) {
    const existingSupplier = await db.Supplier.findOne({
      where: {
        businessId: supplier.businessId,
        phone: updateData.phone,
        id: { [Op.ne]: supplierId },
      },
    });

    if (existingSupplier) {
      throw ApiError.conflict('Supplier with this phone number already exists');
    }
  }

  await supplier.update(updateData);

  return supplier;
};

/**
 * Delete supplier
 */
export const deleteSupplier = async (supplierId) => {
  const supplier = await db.Supplier.findByPk(supplierId);

  if (!supplier) {
    throw ApiError.notFound('Supplier not found');
  }

  // Check if supplier has purchase orders
  const ordersCount = await db.PurchaseOrder.count({ where: { supplierId } });
  if (ordersCount > 0) {
    throw ApiError.badRequest('Cannot delete supplier with existing purchase orders');
  }

  // Soft delete
  await supplier.destroy();

  return true;
};

/**
 * Get supplier purchase history
 */
export const getSupplierPurchaseHistory = async (supplierId, pagination) => {
  const { limit, offset } = pagination;

  const supplier = await db.Supplier.findByPk(supplierId);

  if (!supplier) {
    throw ApiError.notFound('Supplier not found');
  }

  const { count, rows } = await db.PurchaseOrder.findAndCountAll({
    where: { supplierId },
    include: [
      {
        model: db.PurchaseItem,
        as: 'items',
        include: [{ model: db.Product, as: 'product', attributes: ['name'] }],
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return { count, orders: rows };
};

/**
 * Update supplier balance
 */
export const updateSupplierBalance = async (supplierId, amount, type = 'add') => {
  const supplier = await db.Supplier.findByPk(supplierId);

  if (!supplier) {
    throw ApiError.notFound('Supplier not found');
  }

  const currentBalance = parseFloat(supplier.balance);
  let newBalance;

  if (type === 'add') {
    newBalance = currentBalance + amount;
  } else if (type === 'subtract') {
    newBalance = currentBalance - amount;
    if (newBalance < 0) {
      throw ApiError.badRequest('Insufficient balance');
    }
  } else {
    newBalance = amount;
  }

  await supplier.update({ balance: newBalance });

  return supplier;
};

export default {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierPurchaseHistory,
  updateSupplierBalance,
};
