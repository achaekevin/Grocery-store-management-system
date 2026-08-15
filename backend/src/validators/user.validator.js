import Joi from 'joi';

/**
 * Validation schema for creating a user
 */
export const createUserSchema = Joi.object({
  branchId: Joi.string().allow('', null),
  roleId: Joi.string().required(),
  name: Joi.string().max(255),
  firstName: Joi.string().max(100),
  lastName: Joi.string().max(100),
  email: Joi.string().email().max(255).required(),
  phone: Joi.string().max(20).required(),
  password: Joi.string().min(8).max(255).required(),
  avatar: Joi.string().max(500).allow('', null),
  status: Joi.string().valid('active', 'inactive', 'suspended').default('active'),
});

/**
 * Validation schema for updating a user
 */
export const updateUserSchema = Joi.object({
  branchId: Joi.string().allow('', null),
  roleId: Joi.string(),
  name: Joi.string().max(255),
  firstName: Joi.string().max(100),
  lastName: Joi.string().max(100),
  phone: Joi.string().max(20),
  avatar: Joi.string().max(500).allow('', null),
  status: Joi.string().valid('active', 'inactive', 'suspended'),
}).min(1);

/**
 * Validation schema for updating user profile
 */
export const updateProfileSchema = Joi.object({
  name: Joi.string().max(255).allow('', null),
  firstName: Joi.string().max(100).allow('', null),
  lastName: Joi.string().max(100).allow('', null),
  phone: Joi.string().max(20).allow('', null),
  avatar: Joi.string().max(500).allow('', null),
  preferences: Joi.object().allow(null),
}).min(1);

/**
 * Validation schema for user filters
 */
export const userFiltersSchema = Joi.object({
  search: Joi.string().allow(''),
  branchId: Joi.string().allow('', null),
  roleId: Joi.string().allow('', null),
  status: Joi.string().valid('active', 'inactive', 'suspended'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('name', 'createdAt', 'lastLoginAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export default {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  userFiltersSchema,
};
