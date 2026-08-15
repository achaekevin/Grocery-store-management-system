import { Op } from 'sequelize';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Create a new customer
 */
export const createCustomer = async (customerData) => {
  try {
    const tenantId = customerData.tenantId || customerData.businessId || 1;

    // Check if phone already exists
    if (customerData.phone) {
      const existingCustomer = await db.Customer.findOne({
        where: {
          tenantId,
          phone: customerData.phone,
        },
      });

      if (existingCustomer) {
        throw ApiError.conflict('Customer with this phone number already exists');
      }
    }

    // Name splitting if firstName / lastName not provided directly
    let firstName = customerData.firstName;
    let lastName = customerData.lastName;
    if (!firstName && customerData.name) {
      const parts = customerData.name.trim().split(' ');
      firstName = parts[0] || 'Customer';
      lastName = parts.slice(1).join(' ') || '';
    }

    const customer = await db.Customer.create({
      tenantId,
      customerCode: customerData.customerCode || `CUST-${Math.floor(10000 + Math.random() * 90000)}`,
      firstName: firstName || 'Customer',
      lastName: lastName || '',
      email: customerData.email || null,
      phone: customerData.phone,
      address: customerData.address || null,
      city: customerData.city || null,
      postalCode: customerData.postalCode || null,
      membershipLevel: customerData.loyaltyTier || customerData.membershipLevel || 'Bronze',
      loyaltyPoints: customerData.loyaltyPoints || 0,
      notes: customerData.notes || null,
      isActive: customerData.isActive !== undefined ? customerData.isActive : true,
    });

    return customer;
  } catch (error) {
    logger.error('Create customer failed:', error);
    throw error;
  }
};

/**
 * Get all customers with filters and pagination
 */
export const getCustomers = async (filters = {}, pagination = {}) => {
  const {
    search,
    status,
    city,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const limit = pagination.limit || 50;
  const offset = pagination.offset || 0;

  const where = {};

  // Text search
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
  }

  if (status === 'active') where.isActive = true;
  if (status === 'inactive') where.isActive = false;
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
  const customer = await db.Customer.findByPk(customerId);

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

  let firstName = updateData.firstName;
  let lastName = updateData.lastName;
  if (!firstName && updateData.name) {
    const parts = updateData.name.trim().split(' ');
    firstName = parts[0];
    lastName = parts.slice(1).join(' ');
  }

  await customer.update({
    ...(firstName && { firstName }),
    ...(lastName !== undefined && { lastName }),
    ...(updateData.email !== undefined && { email: updateData.email }),
    ...(updateData.phone && { phone: updateData.phone }),
    ...(updateData.address !== undefined && { address: updateData.address }),
    ...(updateData.city !== undefined && { city: updateData.city }),
    ...(updateData.loyaltyPoints !== undefined && { loyaltyPoints: updateData.loyaltyPoints }),
    ...(updateData.notes !== undefined && { notes: updateData.notes }),
  });

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

  await customer.destroy();
  return true;
};

export const adjustLoyaltyPoints = async (customerId, branchId, data) => {
  const customer = await db.Customer.findByPk(customerId);
  if (!customer) {
    throw ApiError.notFound('Customer not found');
  }

  const pointsChange = data.type === 'redeemed' ? -Math.abs(data.points) : Math.abs(data.points);
  customer.loyaltyPoints = Math.max(0, (customer.loyaltyPoints || 0) + pointsChange);
  await customer.save();

  return customer;
};

export const getCustomerPurchaseHistory = async (customerId, pagination) => {
  const limit = pagination?.limit || 10;
  const offset = pagination?.offset || 0;
  const { count, rows } = await db.Sale.findAndCountAll({
    where: { customerId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
  return { count, sales: rows };
};

export const getTopCustomers = async (tenantId, limit = 10) => {
  const customers = await db.Customer.findAll({
    limit,
    order: [['totalPurchases', 'DESC']],
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
