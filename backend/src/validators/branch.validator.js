import Joi from 'joi';

export const createBranchSchema = Joi.object({
  name: Joi.string().max(255).required(),
  phone: Joi.string().max(20).required(),
  email: Joi.string().email().max(255).allow('', null),
  address: Joi.string().required(),
  city: Joi.string().max(100).required(),
  country: Joi.string().max(100).default('Kenya'),
  manager: Joi.string().max(255).allow('', null),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

export const updateBranchSchema = Joi.object({
  name: Joi.string().max(255),
  phone: Joi.string().max(20),
  email: Joi.string().email().max(255).allow('', null),
  address: Joi.string(),
  city: Joi.string().max(100),
  country: Joi.string().max(100),
  manager: Joi.string().max(255).allow('', null),
  status: Joi.string().valid('active', 'inactive'),
}).min(1);

export default {
  createBranchSchema,
  updateBranchSchema,
};
