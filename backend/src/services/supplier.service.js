import { Op } from 'sequelize';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Create a new supplier
 */
export const createSupplier = async (supplierData) => {
  try {
    const tenantId = supplierData.tenantId || supplierData.businessId || 1;

    // Check if phone already exists
    if (supplierData.phone) {
      const existingSupplier = await db.Supplier.findOne({
        where: {
          tenantId,
          phone: supplierData.phone,
        },
      });

      if (existingSupplier) {
        throw ApiError.conflict('Supplier with this phone number already exists');
      }
    }

    const supplier = await db.Supplier.create({
      tenantId,
      name: supplierData.name,
      code: supplierData.code || `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      contactPerson: supplierData.contactPerson || null,
      email: supplierData.email || null,
      phone: supplierData.phone,
      address: supplierData.address || null,
      city: supplierData.city || null,
      country: supplierData.country || 'Kenya',
      taxId: supplierData.taxId || null,
      paymentTerms: supplierData.paymentTerms || null,
      creditLimit: supplierData.creditLimit || 0.00,
      notes: supplierData.notes || null,
      isActive: supplierData.isActive !== undefined ? supplierData.isActive : true,
    });

    return supplier;
  } catch (error) {
    logger.error('Create supplier failed:', error);
    throw error;
  }
};

/**
 * Get all suppliers
 */
export const getSuppliers = async (filters = {}, pagination = {}) => {
  const { search, status, city, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
  const limit = pagination.limit || 50;
  const offset = pagination.offset || 0;

  const where = {};

  // Text search
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
      { contactPerson: { [Op.like]: `%${search}%` } },
    ];
  }

  if (status === 'active') where.isActive = true;
  if (status === 'inactive') where.isActive = false;
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
  const supplier = await db.Supplier.findByPk(supplierId);

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

  await supplier.update({
    ...(updateData.name && { name: updateData.name }),
    ...(updateData.contactPerson !== undefined && { contactPerson: updateData.contactPerson }),
    ...(updateData.email !== undefined && { email: updateData.email }),
    ...(updateData.phone && { phone: updateData.phone }),
    ...(updateData.address !== undefined && { address: updateData.address }),
    ...(updateData.city !== undefined && { city: updateData.city }),
    ...(updateData.country !== undefined && { country: updateData.country }),
    ...(updateData.notes !== undefined && { notes: updateData.notes }),
    ...(updateData.isActive !== undefined && { isActive: updateData.isActive }),
  });

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

  await supplier.destroy();
  return true;
};

export const getSupplierPurchaseHistory = async (supplierId, pagination) => {
  const limit = pagination?.limit || 10;
  const offset = pagination?.offset || 0;
  return { count: 0, orders: [] };
};

export default {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierPurchaseHistory,
};
