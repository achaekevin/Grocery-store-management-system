import { Op } from 'sequelize';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Create a new customer
 */
export const createCustomer = async (customerData) => {
  try {
    // Check if phone already exists
    const existingCustomer = await db.Customer.findOne({
      where: {
        businessId: customerData.businessId,
        phone: customerData.phone,
      },
    });

    if (existingCustomer) {
      throw ApiError.conflict('Customer with this phone number already exists');
    }

    // Check if email already exists (if provided)
    if (customerData.email) {
      const existingEmail = await db.Customer.findOne({
        where: {
          businessId: customerData.businessId,
          email: customerData.email,
        },
      });

      if (existingEmail) {
        throw ApiError.conflict('Customer with this email already exists');
      }
    }

    const customer = await db.Customer.create(customerData);

    return customer;
  } catch (error) {
    logger.error('Create customer failed:', error);
    throw error;
  }
};

/**
 * Get all customers with filters and pagination
 */
export const getCustomers = async (filters, pagination) => {
  const {
    search,
    loyaltyTier,
    status,
    minLoyaltyPoints,
    city,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

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
  if (loyaltyTier) where.loyaltyTier = loyaltyTier;
  if (status) where.status = status;
  if (minLoyaltyPoints) where.loyaltyPoints = { [Op.gte]: minLoyaltyPoints };
  if (city) where.city = city;

  const { count, rows } = await db.Customer.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortBy, sortOrder.toUpperCase()]],
  });

  return { count, customers: rows };
};

/**
 * Get customer by ID
 */
export const getCustomerById = async (customerId) => {
  const customer = await db.Customer.findByPk(customerId, {
    include: [
      {
        model: db.Sale,
        as: 'sales',
        limit: 10,
        order: [['createdAt', 'DESC']],
      },
      {
        model: db.LoyaltyTransaction,
        as: 'loyaltyTransactions',
        limit: 10,
        order: [['createdAt', 'DESC']],
      },
    ],
  });

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  return customer;
};

/**
 * Update customer
 */
export const updateCustomer = async (customerId, updateData) => {
  const customer = await db.Customer.findByPk(customerId);

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  // Check if phone is being changed and already exists
  if (updateData.phone && updateData.phone !== customer.phone) {
    const existingCustomer = await db.Customer.findOne({
      where: {
        businessId: customer.businessId,
        phone: updateData.phone,
        id: { [Op.ne]: customerId },
      },
    });

    if (existingCustomer) {
      throw ApiError.conflict('Customer with this phone number already exists');
    }
  }

  // Check if email is being changed and already exists
  if (updateData.email && updateData.email !== customer.email) {
    const existingEmail = await db.Customer.findOne({
      where: {
        businessId: customer.businessId,
        email: updateData.email,
        id: { [Op.ne]: customerId },
      },
    });

    if (existingEmail) {
      throw ApiError.conflict('Customer with this email already exists');
    }
  }

  await customer.update(updateData);

  return customer;
};

/**
 * Delete customer
 */
export const deleteCustomer = async (customerId) => {
  const customer = await db.Customer.findByPk(customerId);

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  // Soft delete
  await customer.destroy();

  return true;
};

/**
 * Add/adjust loyalty points
 */
export const adjustLoyaltyPoints = async (customerId, branchId, pointsData) => {
  const transaction = await db.sequelize.transaction();

  try {
    const customer = await db.Customer.findByPk(customerId);

    if (!customer) {
      throw ApiError.notFound('Customer not found');
    }

    const { points, type, description } = pointsData;
    const pointsBefore = customer.loyaltyPoints;
    let pointsAfter;

    if (type === 'redeemed') {
      if (customer.loyaltyPoints < Math.abs(points)) {
        throw ApiError.badRequest('Insufficient loyalty points');
      }
      pointsAfter = pointsBefore - Math.abs(points);
    } else {
      pointsAfter = pointsBefore + Math.abs(points);
    }

    // Update customer points
    await customer.update({ loyaltyPoints: pointsAfter }, { transaction });

    // Create loyalty transaction
    await db.LoyaltyTransaction.create(
      {
        customerId,
        branchId,
        type,
        points: type === 'redeemed' ? -Math.abs(points) : Math.abs(points),
        pointsBefore,
        pointsAfter,
        description,
      },
      { transaction }
    );

    await transaction.commit();

    return customer;
  } catch (error) {
    await transaction.rollback();
    logger.error('Adjust loyalty points failed:', error);
    throw error;
  }
};

/**
 * Get customer purchase history
 */
export const getCustomerPurchaseHistory = async (customerId, pagination) => {
  const { limit, offset } = pagination;

  const customer = await db.Customer.findByPk(customerId);

  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  const { count, rows } = await db.Sale.findAndCountAll({
    where: { customerId },
    include: [
      {
        model: db.SaleItem,
        as: 'items',
        include: [{ model: db.Product, as: 'product', attributes: ['name'] }],
      },
      {
        model: db.Branch,
        as: 'branch',
        attributes: ['name'],
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return { count, sales: rows };
};

/**
 * Get top customers by spending
 */
export const getTopCustomers = async (businessId, limit = 10) => {
  const customers = await db.Customer.findAll({
    where: { businessId },
    order: [['totalSpent', 'DESC']],
    limit,
  });

  return customers;
};

export default {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  adjustLoyaltyPoints,
  getCustomerPurchaseHistory,
  getTopCustomers,
};
