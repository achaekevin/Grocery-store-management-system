import Joi from 'joi';

/**
 * Validation schema for stock adjustment
 */
export const stockAdjustmentSchema = Joi.object({
  branchId: Joi.number().integer().positive().required(),
  productId: Joi.number().integer().positive().required(),
  type: Joi.string()
    .valid('stock_in', 'stock_out', 'adjustment', 'damage', 'expired', 'transfer_in', 'transfer_out')
    .required(),
  quantity: Joi.number().min(0.01).precision(2).required(),
  reason: Joi.string().max(255).required(),
  notes: Joi.string().allow('', null),
  referenceType: Joi.string().max(50).allow(null),
  referenceId: Joi.number().integer().positive().allow(null),
});

/**
 * Validation schema for batch stock update
 */
export const batchStockUpdateSchema = Joi.object({
  branchId: Joi.number().integer().positive().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().min(0.01).precision(2).required(),
        type: Joi.string()
          .valid('stock_in', 'stock_out', 'adjustment')
          .required(),
        reason: Joi.string().max(255).required(),
      })
    )
    .min(1)
    .required(),
});

/**
 * Validation schema for branch transfer
 */
export const branchTransferSchema = Joi.object({
  fromBranchId: Joi.number().integer().positive().required(),
  toBranchId: Joi.number().integer().positive().required()
    .invalid(Joi.ref('fromBranchId'))
    .messages({
      'any.invalid': 'Cannot transfer to the same branch',
    }),
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().min(0.01).precision(2).required(),
  notes: Joi.string().max(500).allow('', null),
});

/**
 * Validation schema for inventory filters
 */
export const inventoryFiltersSchema = Joi.object({
  branchId: Joi.number().integer().positive(),
  productId: Joi.number().integer().positive(),
  categoryId: Joi.number().integer().positive(),
  lowStock: Joi.boolean(),
  outOfStock: Joi.boolean(),
  search: Joi.string().allow(''),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('quantity', 'lastRestockedAt', 'productName').default('quantity'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
});

/**
 * Validation schema for inventory movement filters
 */
export const movementFiltersSchema = Joi.object({
  branchId: Joi.number().integer().positive(),
  productId: Joi.number().integer().positive(),
  userId: Joi.number().integer().positive(),
  type: Joi.string().valid(
    'stock_in',
    'stock_out',
    'sale',
    'return',
    'adjustment',
    'damage',
    'expired',
    'transfer_in',
    'transfer_out'
  ),
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'quantityChanged').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

/**
 * Validation schema for stock take
 */
export const stockTakeSchema = Joi.object({
  branchId: Joi.number().integer().positive().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        countedQuantity: Joi.number().min(0).precision(2).required(),
        notes: Joi.string().max(255).allow('', null),
      })
    )
    .min(1)
    .required(),
  notes: Joi.string().max(500).allow('', null),
});

export default {
  stockAdjustmentSchema,
  batchStockUpdateSchema,
  branchTransferSchema,
  inventoryFiltersSchema,
  movementFiltersSchema,
  stockTakeSchema,
};
