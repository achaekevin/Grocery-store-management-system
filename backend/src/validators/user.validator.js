import Joi from 'joi';

/**
 * Validation schema for creating a user
 */
export const createUserSchema = Joi.object({
  branchId: Joi.number().integer().positive().allow(null),
  roleId: Joi.number().integer().positive().required(),
  name: Joi.string().max(255).required(),
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
  branchId: Joi.number().integer().positive().allow(null),
  roleId: Joi.number().integer().positive(),
  name: Joi.string().max(255),
  phone: Joi.string().max(20),
  avatar: Joi.string().max(500).allow('', null),
  status: Joi.string().valid('active', 'inactive', 'suspended'),
}).min(1);

/**
 * Validation schema for updating user profile
 */
export const updateProfileSchema = Joi.object({
  name: Joi.string().max(255),
  phone: Joi.string().max(20),
  avatar: Joi.string().max(500).allow('', null),
}).min(1);

/**
 * Validation schema for user filters
 */
export const userFiltersSchema = Joi.object({
  search: Joi.string().allow(''),
  branchId: Joi.number().integer().positive(),
  roleId: Joi.number().integer().positive(),
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
