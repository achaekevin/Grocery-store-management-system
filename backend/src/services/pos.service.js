import { Op } from 'sequelize';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';
import { createNotification } from '../helpers/notification.js';

/**
 * Generate unique sale number
 */
const generateSaleNumber = async (branchId) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const prefix = `SALE-${year}${month}${day}-${branchId}-`;
  
  const lastSale = await db.Sale.findOne({
    where: {
      saleNumber: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [['createdAt', 'DESC']],
  });

  let sequence = 1;
  if (lastSale) {
    const lastSequence = parseInt(lastSale.saleNumber.split('-').pop());
    sequence = lastSequence + 1;
  }

  return `${prefix}${String(sequence).padStart(4, '0')}`;
};

/**
 * Calculate loyalty points earned
 */
const calculateLoyaltyPoints = (total, loyaltyTier = 'bronze') => {
  const pointsRate = {
    bronze: 0.01, // 1% of total
    silver: 0.02, // 2%
    gold: 0.03,   // 3%
    platinum: 0.05, // 5%
  };

  return Math.floor(total * (pointsRate[loyaltyTier] || 0.01));
};

/**
 * Create a new sale (POS transaction)
 */
export const createSale = async (saleData, userId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      branchId,
      customerId,
      items,
      payments,
      subtotal,
      tax,
      discount,
      total,
      amountPaid,
      changeAmount,
      notes,
      loyaltyPointsRedeemed = 0,
    } = saleData;

    // Generate sale number
    const saleNumber = await generateSaleNumber(branchId);

    // Get customer for loyalty calculation
    let customer = null;
    let loyaltyPointsEarned = 0;
    
    if (customerId) {
      customer = await db.Customer.findByPk(customerId);
      
      if (customer) {
        loyaltyPointsEarned = calculateLoyaltyPoints(total, customer.loyaltyTier);
      }
    }

    // Create sale
    const sale = await db.Sale.create(
      {
        businessId: saleData.businessId,
        branchId,
        customerId,
        cashierId: userId,
        saleNumber,
        saleDate: new Date(),
        subtotal,
        tax,
        discount,
        total,
        amountPaid,
        changeAmount,
        status: 'completed',
        paymentStatus: amountPaid >= total ? 'paid' : 'partial',
        loyaltyPointsEarned,
        loyaltyPointsRedeemed,
        notes,
      },
      { transaction }
    );

    // Create sale items and update inventory
    for (const item of items) {
      const { productId, quantity, unitPrice, discount: itemDiscount, tax: itemTax } = item;

      // Check product availability
      const inventory = await db.Inventory.findOne({
        where: { branchId, productId },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!inventory) {
        throw ApiError.badRequest(`Product ${productId} not available in this branch`);
      }

      if (inventory.quantity < quantity) {
        throw ApiError.badRequest(`Insufficient stock for product ${productId}`);
      }

      // Create sale item
      const itemTotal = quantity * unitPrice * (1 - itemDiscount / 100) * (1 + itemTax / 100);
      
      await db.SaleItem.create(
        {
          saleId: sale.id,
          productId,
          quantity,
          unitPrice,
          discount: itemDiscount || 0,
          tax: itemTax || 0,
          subtotal: quantity * unitPrice,
          total: itemTotal,
        },
        { transaction }
      );

      // Update inventory
      const quantityBefore = inventory.quantity;
      const quantityAfter = quantityBefore - quantity;
      
      await inventory.update({ quantity: quantityAfter }, { transaction });

      // Create inventory movement
      await db.InventoryMovement.create(
        {
          inventoryId: inventory.id,
          productId,
          branchId,
          userId,
          type: 'sale',
          quantityBefore,
          quantityChanged: -quantity,
          quantityAfter,
          referenceType: 'Sale',
          referenceId: sale.id,
          reason: `Sale ${saleNumber}`,
        },
        { transaction }
      );
    }

    // Create payments
    for (const payment of payments) {
      await db.Payment.create(
        {
          saleId: sale.id,
          branchId,
          userId,
          paymentMethod: payment.method,
          amount: payment.amount,
          reference: payment.reference,
          mpesaReceiptNumber: payment.mpesaReceiptNumber,
          phoneNumber: payment.phoneNumber,
          status: 'completed',
        },
        { transaction }
      );
    }

    // Update customer loyalty and spending
    if (customer) {
      const newLoyaltyPoints = customer.loyaltyPoints + loyaltyPointsEarned - loyaltyPointsRedeemed;
      const newTotalSpent = parseFloat(customer.totalSpent) + total;

      await customer.update(
        {
          loyaltyPoints: newLoyaltyPoints,
          totalSpent: newTotalSpent,
          lastPurchaseAt: new Date(),
        },
        { transaction }
      );

      // Create loyalty transactions
      if (loyaltyPointsEarned > 0) {
        await db.LoyaltyTransaction.create(
          {
            customerId,
            branchId,
            saleId: sale.id,
            type: 'earned',
            points: loyaltyPointsEarned,
            pointsBefore: customer.loyaltyPoints,
            pointsAfter: customer.loyaltyPoints + loyaltyPointsEarned,
            description: `Earned from sale ${saleNumber}`,
          },
          { transaction }
        );
      }

      if (loyaltyPointsRedeemed > 0) {
        await db.LoyaltyTransaction.create(
          {
            customerId,
            branchId,
            saleId: sale.id,
            type: 'redeemed',
            points: -loyaltyPointsRedeemed,
            pointsBefore: customer.loyaltyPoints + loyaltyPointsEarned,
            pointsAfter: newLoyaltyPoints,
            description: `Redeemed in sale ${saleNumber}`,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    // Create notification
    await createNotification({
      businessId: saleData.businessId,
      userId,
      type: 'sale',
      title: 'New Sale',
      message: `Sale ${saleNumber} completed. Total: ${total}`,
      link: `/sales/${sale.id}`,
    });

    // Fetch complete sale with relations
    return await db.Sale.findByPk(sale.id, {
      include: [
        {
          model: db.SaleItem,
          as: 'items',
          include: [{ model: db.Product, as: 'product' }],
        },
        { model: db.Payment, as: 'payments' },
        { model: db.Customer, as: 'customer' },
        { model: db.User, as: 'cashier', attributes: ['id', 'name'] },
      ],
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Create sale failed:', error);
    throw error;
  }
};

/**
 * Get all sales with filters
 */
export const getSales = async (filters, pagination) => {
  const {
    branchId,
    customerId,
    cashierId,
    status,
    paymentMethod,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const { limit, offset } = pagination;

  const where = {};
  const paymentWhere = {};

  if (branchId) where.branchId = branchId;
  if (customerId) where.customerId = customerId;
  if (cashierId) where.cashierId = cashierId;
  if (status) where.status = status;
  if (minAmount) where.total = { [Op.gte]: minAmount };
  if (maxAmount) where.total = { ...where.total, [Op.lte]: maxAmount };

  if (dateFrom || dateTo) {
    where.saleDate = {};
    if (dateFrom) where.saleDate[Op.gte] = dateFrom;
    if (dateTo) where.saleDate[Op.lte] = dateTo;
  }

  if (paymentMethod) paymentWhere.paymentMethod = paymentMethod;

  const { count, rows } = await db.Sale.findAndCountAll({
    where,
    include: [
      {
        model: db.SaleItem,
        as: 'items',
        include: [{ model: db.Product, as: 'product', attributes: ['name'] }],
      },
      {
        model: db.Payment,
        as: 'payments',
        where: Object.keys(paymentWhere).length > 0 ? paymentWhere : undefined,
      },
      { model: db.Customer, as: 'customer', attributes: ['name', 'phone'] },
      { model: db.User, as: 'cashier', attributes: ['name'] },
      { model: db.Branch, as: 'branch', attributes: ['name'] },
    ],
    limit,
    offset,
    order: [[sortBy, sortOrder.toUpperCase()]],
    distinct: true,
  });

  return { count, sales: rows };
};

/**
 * Get sale by ID
 */
export const getSaleById = async (saleId) => {
  const sale = await db.Sale.findByPk(saleId, {
    include: [
      {
        model: db.SaleItem,
        as: 'items',
        include: [{ model: db.Product, as: 'product' }],
      },
      { model: db.Payment, as: 'payments' },
      { model: db.Customer, as: 'customer' },
      { model: db.User, as: 'cashier', attributes: ['id', 'name', 'email'] },
      { model: db.Branch, as: 'branch' },
    ],
  });

  if (!sale) {
    throw ApiError.notFound('Sale not found');
  }

  return sale;
};

/**
 * Hold a sale
 */
export const holdSale = async (saleData, userId) => {
  try {
    const { branchId, customerId, items, subtotal, notes } = saleData;

    const saleNumber = await generateSaleNumber(branchId);

    const sale = await db.Sale.create({
      businessId: saleData.businessId,
      branchId,
      customerId,
      cashierId: userId,
      saleNumber,
      saleDate: new Date(),
      subtotal,
      total: subtotal,
      status: 'on_hold',
      notes,
    });

    // Save sale items (without updating inventory)
    for (const item of items) {
      await db.SaleItem.create({
        saleId: sale.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        subtotal: item.quantity * item.unitPrice,
        total: item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100),
      });
    }

    return await getSaleById(sale.id);
  } catch (error) {
    logger.error('Hold sale failed:', error);
    throw error;
  }
};

/**
 * Refund a sale
 */
export const refundSale = async (saleId, refundData, userId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const sale = await db.Sale.findByPk(saleId, { transaction });

    if (!sale) {
      throw ApiError.notFound('Sale not found');
    }

    if (sale.status === 'refunded') {
      throw ApiError.badRequest('Sale already refunded');
    }

    const { reason, items: refundItems, refundAmount } = refundData;

    // Update inventory for refunded items
    for (const refundItem of refundItems) {
      const saleItem = await db.SaleItem.findByPk(refundItem.saleItemId, { transaction });
      
      if (!saleItem) {
        throw ApiError.badRequest(`Sale item ${refundItem.saleItemId} not found`);
      }

      // Update inventory
      const inventory = await db.Inventory.findOne({
        where: {
          branchId: sale.branchId,
          productId: saleItem.productId,
        },
        transaction,
      });

      if (inventory) {
        const quantityBefore = inventory.quantity;
        const quantityAfter = quantityBefore + refundItem.quantity;
        
        await inventory.update({ quantity: quantityAfter }, { transaction });

        // Create inventory movement
        await db.InventoryMovement.create(
          {
            inventoryId: inventory.id,
            productId: saleItem.productId,
            branchId: sale.branchId,
            userId,
            type: 'return',
            quantityBefore,
            quantityChanged: refundItem.quantity,
            quantityAfter,
            referenceType: 'Sale',
            referenceId: saleId,
            reason: `Refund: ${reason}`,
          },
          { transaction }
        );
      }
    }

    // Update sale status
    await sale.update(
      {
        status: 'refunded',
        notes: `${sale.notes || ''}\nRefund: ${reason}`,
      },
      { transaction }
    );

    await transaction.commit();

    return await getSaleById(saleId);
  } catch (error) {
    await transaction.rollback();
    logger.error('Refund sale failed:', error);
    throw error;
  }
};

/**
 * Get sales summary
 */
export const getSalesSummary = async (businessId, branchId, dateFrom, dateTo) => {
  const where = { businessId };
  
  if (branchId) where.branchId = branchId;
  if (dateFrom || dateTo) {
    where.saleDate = {};
    if (dateFrom) where.saleDate[Op.gte] = dateFrom;
    if (dateTo) where.saleDate[Op.lte] = dateTo;
  }

  const summary = await db.Sale.findOne({
    where,
    attributes: [
      [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalSales'],
      [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalRevenue'],
      [db.sequelize.fn('AVG', db.sequelize.col('total')), 'averageOrderValue'],
    ],
  });

  return summary;
};

export default {
  createSale,
  getSales,
  getSaleById,
  holdSale,
  refundSale,
  getSalesSummary,
};
