import InventoryTransaction from '../models/InventoryTransaction.js';
import StockTransfer from '../models/StockTransfer.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import { Op } from 'sequelize';
import sequelize from '../config/sequelize.js';

// Stock In
export const stockIn = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { branchId, productId, variantId, quantity, unitCost, batchNumber, expiryDate, supplierId, notes } = req.body;

    // Get current inventory
    const inventory = await Inventory.findOne({
      where: { tenantId, branchId, productId, variantId },
      transaction,
    });

    const quantityBefore = inventory ? parseFloat(inventory.quantity) : 0;
    const quantityAfter = quantityBefore + parseFloat(quantity);

    // Create inventory transaction
    const invTransaction = await InventoryTransaction.create({
      tenantId,
      branchId,
      productId,
      variantId,
      transactionType: 'stock_in',
      quantityBefore,
      quantityChange: parseFloat(quantity),
      quantityAfter,
      unitCost: parseFloat(unitCost),
      totalCost: parseFloat(quantity) * parseFloat(unitCost),
      batchNumber,
      expiryDate,
      supplierId,
      notes,
      userId,
    }, { transaction });

    // Update or create inventory record
    if (inventory) {
      await inventory.update({
        quantity: quantityAfter,
        lastStockIn: new Date(),
      }, { transaction });
    } else {
      await Inventory.create({
        tenantId,
        branchId,
        productId,
        variantId,
        quantity: quantityAfter,
        lastStockIn: new Date(),
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Stock in successful',
      data: invTransaction,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Stock in error:', error);
    res.status(500).json({
      success: false,
      message: 'Stock in failed',
      error: error.message,
    });
  }
};

// Stock Out
export const stockOut = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { branchId, productId, variantId, quantity, reason, notes } = req.body;

    // Get current inventory
    const inventory = await Inventory.findOne({
      where: { tenantId, branchId, productId, variantId },
      transaction,
    });

    if (!inventory) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Inventory not found',
      });
    }

    const quantityBefore = parseFloat(inventory.quantity);
    
    if (quantityBefore < parseFloat(quantity)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    const quantityAfter = quantityBefore - parseFloat(quantity);

    // Create inventory transaction
    const invTransaction = await InventoryTransaction.create({
      tenantId,
      branchId,
      productId,
      variantId,
      transactionType: 'stock_out',
      quantityBefore,
      quantityChange: -parseFloat(quantity),
      quantityAfter,
      reason,
      notes,
      userId,
    }, { transaction });

    // Update inventory
    await inventory.update({
      quantity: quantityAfter,
      lastStockOut: new Date(),
    }, { transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Stock out successful',
      data: invTransaction,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Stock out error:', error);
    res.status(500).json({
      success: false,
      message: 'Stock out failed',
      error: error.message,
    });
  }
};

// Inventory Adjustment
export const adjustInventory = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { branchId, productId, variantId, newQuantity, reason, notes } = req.body;

    // Get current inventory
    const inventory = await Inventory.findOne({
      where: { tenantId, branchId, productId, variantId },
      transaction,
    });

    if (!inventory) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Inventory not found',
      });
    }

    const quantityBefore = parseFloat(inventory.quantity);
    const quantityChange = parseFloat(newQuantity) - quantityBefore;

    // Create inventory transaction
    const invTransaction = await InventoryTransaction.create({
      tenantId,
      branchId,
      productId,
      variantId,
      transactionType: 'adjustment',
      quantityBefore,
      quantityChange,
      quantityAfter: parseFloat(newQuantity),
      reason,
      notes,
      userId,
    }, { transaction });

    // Update inventory
    await inventory.update({
      quantity: parseFloat(newQuantity),
    }, { transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Inventory adjusted successfully',
      data: invTransaction,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Adjust inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Inventory adjustment failed',
      error: error.message,
    });
  }
};

// Record Damaged Stock
export const recordDamage = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { branchId, productId, variantId, quantity, reason, notes } = req.body;

    const inventory = await Inventory.findOne({
      where: { tenantId, branchId, productId, variantId },
      transaction,
    });

    if (!inventory || parseFloat(inventory.quantity) < parseFloat(quantity)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    const quantityBefore = parseFloat(inventory.quantity);
    const quantityAfter = quantityBefore - parseFloat(quantity);

    const invTransaction = await InventoryTransaction.create({
      tenantId,
      branchId,
      productId,
      variantId,
      transactionType: 'damage',
      quantityBefore,
      quantityChange: -parseFloat(quantity),
      quantityAfter,
      reason,
      notes,
      userId,
    }, { transaction });

    await inventory.update({ quantity: quantityAfter }, { transaction });
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Damaged stock recorded',
      data: invTransaction,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to record damage',
      error: error.message,
    });
  }
};

// Record Expired Stock
export const recordExpired = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { branchId, productId, variantId, quantity, batchNumber, notes } = req.body;

    const inventory = await Inventory.findOne({
      where: { tenantId, branchId, productId, variantId },
      transaction,
    });

    if (!inventory || parseFloat(inventory.quantity) < parseFloat(quantity)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    const quantityBefore = parseFloat(inventory.quantity);
    const quantityAfter = quantityBefore - parseFloat(quantity);

    const invTransaction = await InventoryTransaction.create({
      tenantId,
      branchId,
      productId,
      variantId,
      transactionType: 'expired',
      quantityBefore,
      quantityChange: -parseFloat(quantity),
      quantityAfter,
      batchNumber,
      notes,
      userId,
    }, { transaction });

    await inventory.update({ quantity: quantityAfter }, { transaction });
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Expired stock recorded',
      data: invTransaction,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to record expired stock',
      error: error.message,
    });
  }
};

// Get inventory history
export const getInventoryHistory = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, productId, startDate, endDate, transactionType } = req.query;

    const where = { tenantId };
    if (branchId) where.branchId = branchId;
    if (productId) where.productId = productId;
    if (transactionType) where.transactionType = transactionType;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const history = await InventoryTransaction.findAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 100,
    });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory history',
      error: error.message,
    });
  }
};

// Get low stock items
export const getLowStock = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId } = req.query;

    const where = { tenantId };
    if (branchId) where.branchId = branchId;

    const lowStockItems = await Inventory.findAll({
      where: {
        ...where,
        quantity: {
          [Op.lte]: sequelize.col('product.stock_alert'),
        },
      },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku', 'stockAlert'],
        },
      ],
    });

    res.json({
      success: true,
      data: lowStockItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock items',
      error: error.message,
    });
  }
};

export default {
  stockIn,
  stockOut,
  adjustInventory,
  recordDamage,
  recordExpired,
  getInventoryHistory,
  getLowStock,
};
