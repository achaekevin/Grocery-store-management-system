import Joi from 'joi';

/**
 * Validation schema for creating a product
 */
export const createProductSchema = Joi.object({
  branchId: Joi.number().integer().positive().required(),
  categoryId: Joi.number().integer().positive().required(),
  brandId: Joi.number().integer().positive().allow(null),
  unitId: Joi.number().integer().positive().required(),
  name: Joi.string().max(255).required(),
  description: Joi.string().allow('', null),
  sku: Joi.string().max(100).allow(null),
  barcode: Joi.string().max(100).allow(null),
  costPrice: Joi.number().min(0).precision(2).required(),
  sellingPrice: Joi.number().min(0).precision(2).required(),
  quantity: Joi.number().min(0).precision(2).default(0),
  reorderLevel: Joi.number().min(0).precision(2).default(10),
  expiryDate: Joi.date().allow(null),
  image: Joi.string().max(500).allow(null),
  taxRate: Joi.number().min(0).max(100).precision(2).default(0),
  discount: Joi.number().min(0).max(100).precision(2).default(0),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

/**
 * Validation schema for updating a product
 */
export const updateProductSchema = Joi.object({
  categoryId: Joi.number().integer().positive(),
  brandId: Joi.number().integer().positive().allow(null),
  unitId: Joi.number().integer().positive(),
  name: Joi.string().max(255),
  description: Joi.string().allow('', null),
  sku: Joi.string().max(100).allow(null),
  barcode: Joi.string().max(100).allow(null),
  costPrice: Joi.number().min(0).precision(2),
  sellingPrice: Joi.number().min(0).precision(2),
  quantity: Joi.number().min(0).precision(2),
  reorderLevel: Joi.number().min(0).precision(2),
  expiryDate: Joi.date().allow(null),
  image: Joi.string().max(500).allow(null),
  taxRate: Joi.number().min(0).max(100).precision(2),
  discount: Joi.number().min(0).max(100).precision(2),
  status: Joi.string().valid('active', 'inactive'),
}).min(1);

/**
 * Validation schema for bulk update
 */
export const bulkUpdateSchema = Joi.object({
  productIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
  updates: Joi.object({
    categoryId: Joi.number().integer().positive(),
    brandId: Joi.number().integer().positive().allow(null),
    status: Joi.string().valid('active', 'inactive'),
    discount: Joi.number().min(0).max(100).precision(2),
    taxRate: Joi.number().min(0).max(100).precision(2),
  }).min(1).required(),
});

/**
 * Validation schema for product filters
 */
export const productFiltersSchema = Joi.object({
  search: Joi.string().allow(''),
  categoryId: Joi.number().integer().positive(),
  brandId: Joi.number().integer().positive(),
  branchId: Joi.number().integer().positive(),
  status: Joi.string().valid('active', 'inactive'),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  lowStock: Joi.boolean(),
  expired: Joi.boolean(),
  expiringIn: Joi.number().integer().positive(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('name', 'createdAt', 'sellingPrice', 'quantity').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

/**
 * Validation schema for generating barcode
 */
export const generateBarcodeSchema = Joi.object({
  type: Joi.string().valid('code128', 'ean13', 'ean8', 'upca').default('code128'),
  width: Joi.number().integer().min(1).max(5).default(2),
  height: Joi.number().integer().min(20).max(200).default(50),
  includeText: Joi.boolean().default(true),
});

export default {
  createProductSchema,
  updateProductSchema,
  bulkUpdateSchema,
  productFiltersSchema,
  generateBarcodeSchema,
};
