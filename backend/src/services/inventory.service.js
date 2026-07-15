import { Op } from 'sequelize';
import db from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';
import { createLowStockNotification } from '../helpers/notification.js';

/**
 * Get inventory with filters
 */
export const getInventory = async (filters, pagination) => {
  const {
    branchId,
    productId,
    categoryId,
    lowStock,
    outOfStock,
    search,
    sortBy = 'quantity',
    sortOrder = 'asc',
  } = filters;

  const { limit, offset } = pagination;

  const where = {};
  const productWhere = {};

  if (branchId) where.branchId = branchId;
  if (productId) where.productId = productId;

  if (lowStock) {
    where[Op.and] = db.sequelize.where(
      db.sequelize.col('Inventory.quantity'),
      Op.lte,
      db.sequelize.col('Inventory.reorder_level')
    );
  }

  if (outOfStock) {
    where.quantity = 0;
  }

  if (search) {
    productWhere[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } },
      { barcode: { [Op.like]: `%${search}%` } },
    ];
  }

  if (categoryId) productWhere.categoryId = categoryId;

  const { count, rows } = await db.Inventory.findAndCountAll({
    where,
    include: [
      {
        model: db.Product,
        as: 'product',
        where: Object.keys(productWhere).length > 0 ? productWhere : undefined,
        include: [
          { model: db.Category, as: 'category', attributes: ['name'] },
          { model: db.Unit, as: 'unit', attributes: ['name', 'symbol'] },
        ],
      },
      { model: db.Branch, as: 'branch', attributes: ['name'] },
    ],
    limit,
    offset,
    order: [[sortBy, sortOrder.toUpperCase()]],
    distinct: true,
  });

  return { count, inventory: rows };
};

/**
 * Adjust stock
 */
export const adjustStock = async (adjustmentData, userId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { branchId, productId, type, quantity, reason, notes, referenceType, referenceId } = adjustmentData;

    // Get or create inventory
    let inventory = await db.Inventory.findOne({
      where: { branchId, productId },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!inventory) {
      // Create new inventory record
      inventory = await db.Inventory.create(
        {
          branchId,
          productId,
          quantity: 0,
        },
        { transaction }
      );
    }

    const quantityBefore = inventory.quantity;
    let quantityChanged;
    let quantityAfter;

    // Calculate new quantity based on type
    if (['stock_in', 'transfer_in', 'adjustment'].includes(type)) {
      quantityChanged = quantity;
      quantityAfter = quantityBefore + quantity;
    } else if (['stock_out', 'damage', 'expired', 'transfer_out'].includes(type)) {
      if (quantityBefore < quantity) {
        throw ApiError.badRequest('Insufficient stock for this operation');
      }
      quantityChanged = -quantity;
      quantityAfter = quantityBefore - quantity;
    } else {
      throw ApiError.badRequest('Invalid adjustment type');
    }

    // Update inventory
    await inventory.update(
      {
        quantity: quantityAfter,
        lastRestockedAt: type === 'stock_in' ? new Date() : inventory.lastRestockedAt,
      },
      { transaction }
    );

    // Create inventory movement
    const movement = await db.InventoryMovement.create(
      {
        inventoryId: inventory.id,
        productId,
        branchId,
        userId,
        type,
        quantityBefore,
        quantityChanged,
        quantityAfter,
        referenceType,
        referenceId,
        reason,
        notes,
      },
      { transaction }
    );

    await transaction.commit();

    // Check if stock is low and send notification
    if (quantityAfter <= inventory.reorderLevel) {
      const product = await db.Product.findByPk(productId);
      const business = await db.Branch.findByPk(branchId, {
        include: [{ model: db.Business, as: 'business' }],
      });
      
      if (product && business) {
        await createLowStockNotification(business.business.id, product, quantityAfter);
      }
    }

    return movement;
  } catch (error) {
    await transaction.rollback();
    logger.error('Stock adjustment failed:', error);
    throw error;
  }
};

/**
 * Batch stock update
 */
export const batchStockUpdate = async (updateData, userId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { branchId, items } = updateData;
    const movements = [];

    for (const item of items) {
      const movement = await adjustStock(
        {
          branchId,
          productId: item.productId,
          type: item.type,
          quantity: item.quantity,
          reason: item.reason,
        },
        userId
      );
      movements.push(movement);
    }

    await transaction.commit();

    return movements;
  } catch (error) {
    await transaction.rollback();
    logger.error('Batch stock update failed:', error);
    throw error;
  }
};

/**
 * Transfer stock between branches
 */
export const transferStock = async (transferData, userId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { fromBranchId, toBranchId, productId, quantity, notes } = transferData;

    // Get source inventory
    const sourceInventory = await db.Inventory.findOne({
      where: { branchId: fromBranchId, productId },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!sourceInventory) {
      throw ApiError.badRequest('Product not available in source branch');
    }

    if (sourceInventory.quantity < quantity) {
      throw ApiError.badRequest('Insufficient stock in source branch');
    }

    // Get or create destination inventory
    let destInventory = await db.Inventory.findOne({
      where: { branchId: toBranchId, productId },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!destInventory) {
      destInventory = await db.Inventory.create(
        {
          branchId: toBranchId,
          productId,
          quantity: 0,
        },
        { transaction }
      );
    }

    // Update source inventory
    const sourceQuantityBefore = sourceInventory.quantity;
    const sourceQuantityAfter = sourceQuantityBefore - quantity;
    await sourceInventory.update({ quantity: sourceQuantityAfter }, { transaction });

    // Update destination inventory
    const destQuantityBefore = destInventory.quantity;
    const destQuantityAfter = destQuantityBefore + quantity;
    await destInventory.update(
      {
        quantity: destQuantityAfter,
        lastRestockedAt: new Date(),
      },
      { transaction }
    );

    // Create movements for both branches
    await db.InventoryMovement.create(
      {
        inventoryId: sourceInventory.id,
        productId,
        branchId: fromBranchId,
        userId,
        type: 'transfer_out',
        quantityBefore: sourceQuantityBefore,
        quantityChanged: -quantity,
        quantityAfter: sourceQuantityAfter,
        reason: `Transfer to branch ${toBranchId}`,
        notes,
      },
      { transaction }
    );

    await db.InventoryMovement.create(
      {
        inventoryId: destInventory.id,
        productId,
        branchId: toBranchId,
        userId,
        type: 'transfer_in',
        quantityBefore: destQuantityBefore,
        quantityChanged: quantity,
        quantityAfter: destQuantityAfter,
        reason: `Transfer from branch ${fromBranchId}`,
        notes,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      sourceInventory,
      destInventory,
    };
  } catch (error) {
    await transaction.rollback();
    logger.error('Stock transfer failed:', error);
    throw error;
  }
};

/**
 * Get inventory movements
 */
export const getInventoryMovements = async (filters, pagination) => {
  const {
    branchId,
    productId,
    userId,
    type,
    dateFrom,
    dateTo,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const { limit, offset } = pagination;

  const where = {};

  if (branchId) where.branchId = branchId;
  if (productId) where.productId = productId;
  if (userId) where.userId = userId;
  if (type) where.type = type;

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt[Op.gte] = dateFrom;
    if (dateTo) where.createdAt[Op.lte] = dateTo;
  }

  const { count, rows } = await db.InventoryMovement.findAndCountAll({
    where,
    include: [
      {
        model: db.Product,
        as: 'product',
        attributes: ['name', 'sku'],
      },
      {
        model: db.Branch,
        as: 'branch',
        attributes: ['name'],
      },
      {
        model: db.User,
        as: 'user',
        attributes: ['name'],
      },
    ],
    limit,
    offset,
    order: [[sortBy, sortOrder.toUpperCase()]],
  });

  return { count, movements: rows };
};

/**
 * Perform stock take
 */
export const performStockTake = async (stockTakeData, userId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { branchId, items, notes } = stockTakeData;
    const adjustments = [];

    for (const item of items) {
      const { productId, countedQuantity, notes: itemNotes } = item;

      // Get current inventory
      const inventory = await db.Inventory.findOne({
        where: { branchId, productId },
        transaction,
      });

      if (!inventory) {
        continue;
      }

      const difference = countedQuantity - inventory.quantity;

      if (difference !== 0) {
        // Create adjustment
        const adjustment = await adjustStock(
          {
            branchId,
            productId,
            type: 'adjustment',
            quantity: Math.abs(difference),
            reason: `Stock take adjustment: ${difference > 0 ? 'shortage' : 'excess'}`,
            notes: `${notes || ''} ${itemNotes || ''}`.trim(),
          },
          userId
        );

        adjustments.push(adjustment);
      }
    }

    await transaction.commit();

    return adjustments;
  } catch (error) {
    await transaction.rollback();
    logger.error('Stock take failed:', error);
    throw error;
  }
};

export default {
  getInventory,
  adjustStock,
  batchStockUpdate,
  transferStock,
  getInventoryMovements,
  performStockTake,
};
