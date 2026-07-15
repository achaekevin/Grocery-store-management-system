import Joi from 'joi';

/**
 * Validation schema for creating a customer
 */
export const createCustomerSchema = Joi.object({
  name: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).allow('', null),
  phone: Joi.string().max(20).required(),
  address: Joi.string().allow('', null),
  city: Joi.string().max(100).allow('', null),
  country: Joi.string().max(100).default('Kenya'),
  dateOfBirth: Joi.date().allow(null),
  gender: Joi.string().valid('male', 'female', 'other').allow(null),
  loyaltyTier: Joi.string().valid('bronze', 'silver', 'gold', 'platinum').default('bronze'),
  creditLimit: Joi.number().min(0).precision(2).default(0),
  notes: Joi.string().allow('', null),
});

/**
 * Validation schema for updating a customer
 */
export const updateCustomerSchema = Joi.object({
  name: Joi.string().max(255),
  email: Joi.string().email().max(255).allow('', null),
  phone: Joi.string().max(20),
  address: Joi.string().allow('', null),
  city: Joi.string().max(100).allow('', null),
  country: Joi.string().max(100),
  dateOfBirth: Joi.date().allow(null),
  gender: Joi.string().valid('male', 'female', 'other').allow(null),
  loyaltyTier: Joi.string().valid('bronze', 'silver', 'gold', 'platinum'),
  creditLimit: Joi.number().min(0).precision(2),
  status: Joi.string().valid('active', 'inactive'),
  notes: Joi.string().allow('', null),
}).min(1);

/**
 * Validation schema for loyalty points adjustment
 */
export const loyaltyPointsSchema = Joi.object({
  points: Joi.number().integer().required(),
  type: Joi.string().valid('earned', 'redeemed', 'adjustment').required(),
  description: Joi.string().max(255).allow('', null),
});

/**
 * Validation schema for customer filters
 */
export const customerFiltersSchema = Joi.object({
  search: Joi.string().allow(''),
  loyaltyTier: Joi.string().valid('bronze', 'silver', 'gold', 'platinum'),
  status: Joi.string().valid('active', 'inactive'),
  minLoyaltyPoints: Joi.number().integer().min(0),
  city: Joi.string().max(100),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('name', 'createdAt', 'loyaltyPoints', 'totalSpent').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export default {
  createCustomerSchema,
  updateCustomerSchema,
  loyaltyPointsSchema,
  customerFiltersSchema,
};
