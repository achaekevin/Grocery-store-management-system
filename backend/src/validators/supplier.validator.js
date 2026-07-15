import Joi from 'joi';

export const createSupplierSchema = Joi.object({
  name: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).allow('', null),
  phone: Joi.string().max(20).required(),
  address: Joi.string().allow('', null),
  city: Joi.string().max(100).allow('', null),
  country: Joi.string().max(100).default('Kenya'),
  taxId: Joi.string().max(50).allow('', null),
  creditLimit: Joi.number().min(0).precision(2).default(0),
  paymentTerms: Joi.string().max(100).allow('', null),
  contactPerson: Joi.string().max(255).allow('', null),
  notes: Joi.string().allow('', null),
});

export const updateSupplierSchema = Joi.object({
  name: Joi.string().max(255),
  email: Joi.string().email().max(255).allow('', null),
  phone: Joi.string().max(20),
  address: Joi.string().allow('', null),
  city: Joi.string().max(100).allow('', null),
  country: Joi.string().max(100),
  taxId: Joi.string().max(50).allow('', null),
  creditLimit: Joi.number().min(0).precision(2),
  paymentTerms: Joi.string().max(100).allow('', null),
  contactPerson: Joi.string().max(255).allow('', null),
  notes: Joi.string().allow('', null),
  status: Joi.string().valid('active', 'inactive'),
}).min(1);

export default {
  createSupplierSchema,
  updateSupplierSchema,
};
