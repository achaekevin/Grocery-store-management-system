import Joi from 'joi';

/**
 * Validation schema for creating a sale
 */
export const createSaleSchema = Joi.object({
  branchId: Joi.number().integer().positive().required(),
  customerId: Joi.number().integer().positive().allow(null),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().min(0.01).precision(2).required(),
        unitPrice: Joi.number().min(0).precision(2).required(),
        discount: Joi.number().min(0).max(100).precision(2).default(0),
        tax: Joi.number().min(0).precision(2).default(0),
      })
    )
    .min(1)
    .required(),
  payments: Joi.array()
    .items(
      Joi.object({
        method: Joi.string().valid('cash', 'mpesa', 'card', 'bank_transfer', 'credit').required(),
        amount: Joi.number().min(0).precision(2).required(),
        reference: Joi.string().max(100).allow('', null),
        phoneNumber: Joi.string().max(20).allow(null),
      })
    )
    .min(1)
    .required(),
  subtotal: Joi.number().min(0).precision(2).required(),
  tax: Joi.number().min(0).precision(2).default(0),
  discount: Joi.number().min(0).precision(2).default(0),
  total: Joi.number().min(0).precision(2).required(),
  amountPaid: Joi.number().min(0).precision(2).required(),
  changeAmount: Joi.number().precision(2).default(0),
  notes: Joi.string().allow('', null),
  loyaltyPointsEarned: Joi.number().integer().min(0).default(0),
  loyaltyPointsRedeemed: Joi.number().integer().min(0).default(0),
});

/**
 * Validation schema for holding a sale
 */
export const holdSaleSchema = Joi.object({
  branchId: Joi.number().integer().positive().required(),
  customerId: Joi.number().integer().positive().allow(null),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().min(0.01).precision(2).required(),
        unitPrice: Joi.number().min(0).precision(2).required(),
        discount: Joi.number().min(0).max(100).precision(2).default(0),
      })
    )
    .min(1)
    .required(),
  subtotal: Joi.number().min(0).precision(2).required(),
  notes: Joi.string().max(500).allow('', null),
});

/**
 * Validation schema for refund
 */
export const refundSaleSchema = Joi.object({
  reason: Joi.string().max(500).required(),
  items: Joi.array()
    .items(
      Joi.object({
        saleItemId: Joi.number().integer().positive().required(),
        quantity: Joi.number().min(0.01).precision(2).required(),
      })
    )
    .min(1)
    .required(),
  refundAmount: Joi.number().min(0).precision(2).required(),
});

/**
 * Validation schema for sale filters
 */
export const saleFiltersSchema = Joi.object({
  branchId: Joi.number().integer().positive(),
  customerId: Joi.number().integer().positive(),
  cashierId: Joi.number().integer().positive(),
  status: Joi.string().valid('completed', 'refunded', 'cancelled', 'on_hold'),
  paymentMethod: Joi.string().valid('cash', 'mpesa', 'card', 'bank_transfer', 'credit'),
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
  minAmount: Joi.number().min(0),
  maxAmount: Joi.number().min(0),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'total', 'saleNumber').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

/**
 * Validation schema for M-Pesa STK Push
 */
export const mpesaStkPushSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^(254|0)[17]\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid Kenyan number',
    }),
  amount: Joi.number().min(1).precision(2).required(),
  accountReference: Joi.string().max(100).required(),
  transactionDesc: Joi.string().max(255).default('Payment'),
});

export default {
  createSaleSchema,
  holdSaleSchema,
  refundSaleSchema,
  saleFiltersSchema,
  mpesaStkPushSchema,
};
