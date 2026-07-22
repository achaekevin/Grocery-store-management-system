import Joi from 'joi';

export const createBranchSchema = Joi.object({
  name: Joi.string().max(255).required(),
  code: Joi.string().max(50).required(),
  phone: Joi.string().max(20).optional().allow('', null),
  email: Joi.string().email().max(255).optional().allow('', null),
  address: Joi.string().optional().allow('', null),
  city: Joi.string().max(100).optional().allow('', null),
  region: Joi.string().max(100).optional().allow('', null),
  postalCode: Joi.string().max(20).optional().allow('', null),
  managerId: Joi.number().integer().optional().allow(null),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

export const updateBranchSchema = Joi.object({
  name: Joi.string().max(255),
  code: Joi.string().max(50),
  phone: Joi.string().max(20).allow('', null),
  email: Joi.string().email().max(255).allow('', null),
  address: Joi.string().allow('', null),
  city: Joi.string().max(100).allow('', null),
  region: Joi.string().max(100).allow('', null),
  postalCode: Joi.string().max(20).allow('', null),
  managerId: Joi.number().integer().allow(null),
  status: Joi.string().valid('active', 'inactive'),
}).min(1);

export default {
  createBranchSchema,
  updateBranchSchema,
};
