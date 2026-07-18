import StockTransfer from '../models/StockTransfer.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import Branch from '../models/Branch.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// Create stock transfer request
export const createTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { fromBranchId, toBranchId, productId, variantId, quantity, notes } = req.body;

    // Check if source has sufficient stock
    const sourceInventory = await Inventory.findOne({
      where: { tenantId, branchId: fromBranchId, productId, variantId },
      transaction,
    });

    if (!sourceInventory || parseFloat(sourceInventory.quantity) < parseFloat(quantity)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock in source branch',
      });
    }

    // Create transfer record
    const transfer = await StockTransfer.create({
      tenantId,
      fromBranchId,
      toBranchId,
      productId,
      variantId,
      quantity: parseFloat(quantity),
      status: 'pending',
      requestedBy: userId,
      notes,
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Transfer request created',
      data: transfer,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transfer request',
      error: error.message,
    });
  }
};

// Approve transfer
export const approveTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;

    const transfer = await StockTransfer.findOne({
      where: { id, tenantId, status: 'pending' },
      transaction,
    });

    if (!transfer) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Transfer request not found',
      });
    }

    // Check source inventory
    const sourceInventory = await Inventory.findOne({
      where: { 
        tenantId, 
        branchId: transfer.fromBranchId, 
        productId: transfer.productId,
        variantId: transfer.variantId,
      },
      transaction,
    });

    if (!sourceInventory || parseFloat(sourceInventory.quantity) < parseFloat(transfer.quantity)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock in source branch',
      });
    }

    // Update transfer status
    await transfer.update({
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date(),
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Transfer approved',
      data: transfer,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to approve transfer',
      error: error.message,
    });
  }
};

// Ship transfer (deduct from source)
export const shipTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;

    const transfer = await StockTransfer.findOne({
      where: { id, tenantId, status: 'approved' },
      transaction,
    });

    if (!transfer) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Approved transfer not found',
      });
    }

    // Deduct from source
    const sourceInventory = await Inventory.findOne({
      where: { 
        tenantId, 
        branchId: transfer.fromBranchId, 
        productId: transfer.productId,
        variantId: transfer.variantId,
      },
      transaction,
    });

    if (!sourceInventory || parseFloat(sourceInventory.quantity) < parseFloat(transfer.quantity)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    const sourceQtyBefore = parseFloat(sourceInventory.quantity);
    const sourceQtyAfter = sourceQtyBefore - parseFloat(transfer.quantity);

    // Create inventory transaction for source
    await InventoryTransaction.create({
      tenantId,
      branchId: transfer.fromBranchId,
      productId: transfer.productId,
      variantId: transfer.variantId,
      transactionType: 'transfer_out',
      quantityBefore: sourceQtyBefore,
      quantityChange: -parseFloat(transfer.quantity),
      quantityAfter: sourceQtyAfter,
      referenceId: transfer.id,
      referenceType: 'stock_transfer',
      notes: `Transfer to branch ${transfer.toBranchId}`,
      userId,
    }, { transaction });

    // Update source inventory
    await sourceInventory.update({
      quantity: sourceQtyAfter,
    }, { transaction });

    // Update transfer status
    await transfer.update({
      status: 'in_transit',
      shippedBy: userId,
      shippedAt: new Date(),
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Transfer shipped',
      data: transfer,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to ship transfer',
      error: error.message,
    });
  }
};

// Receive transfer (add to destination)
export const receiveTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;
    const { receivedQuantity, notes } = req.body;

    const transfer = await StockTransfer.findOne({
      where: { id, tenantId, status: 'in_transit' },
      transaction,
    });

    if (!transfer) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Transfer in transit not found',
      });
    }

    const qtyReceived = parseFloat(receivedQuantity || transfer.quantity);

    // Get or create destination inventory
    let destInventory = await Inventory.findOne({
      where: { 
        tenantId, 
        branchId: transfer.toBranchId, 
        productId: transfer.productId,
        variantId: transfer.variantId,
      },
      transaction,
    });

    const destQtyBefore = destInventory ? parseFloat(destInventory.quantity) : 0;
    const destQtyAfter = destQtyBefore + qtyReceived;

    // Create inventory transaction for destination
    await InventoryTransaction.create({
      tenantId,
      branchId: transfer.toBranchId,
      productId: transfer.productId,
      variantId: transfer.variantId,
      transactionType: 'transfer_in',
      quantityBefore: destQtyBefore,
      quantityChange: qtyReceived,
      quantityAfter: destQtyAfter,
      referenceId: transfer.id,
      referenceType: 'stock_transfer',
      notes: `Transfer from branch ${transfer.fromBranchId}`,
      userId,
    }, { transaction });

    // Update or create destination inventory
    if (destInventory) {
      await destInventory.update({
        quantity: destQtyAfter,
      }, { transaction });
    } else {
      await Inventory.create({
        tenantId,
        branchId: transfer.toBranchId,
        productId: transfer.productId,
        variantId: transfer.variantId,
        quantity: destQtyAfter,
      }, { transaction });
    }

    // Update transfer status
    await transfer.update({
      status: 'completed',
      receivedBy: userId,
      receivedAt: new Date(),
      receivedQuantity: qtyReceived,
      notes: notes || transfer.notes,
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Transfer received',
      data: transfer,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to receive transfer',
      error: error.message,
    });
  }
};

// Cancel transfer
export const cancelTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;
    const { reason } = req.body;

    const transfer = await StockTransfer.findOne({
      where: { id, tenantId, status: { [Op.in]: ['pending', 'approved'] } },
      transaction,
    });

    if (!transfer) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Transfer not found or cannot be cancelled',
      });
    }

    await transfer.update({
      status: 'cancelled',
      cancelledBy: userId,
      cancelledAt: new Date(),
      notes: `${transfer.notes || ''}\nCancellation reason: ${reason}`,
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Transfer cancelled',
      data: transfer,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to cancel transfer',
      error: error.message,
    });
  }
};

// Get all transfers
export const getTransfers = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, status } = req.query;

    const where = { tenantId };
    if (status) where.status = status;
    
    // Filter by branch (either source or destination)
    if (branchId) {
      where[Op.or] = [
        { fromBranchId: branchId },
        { toBranchId: branchId },
      ];
    }

    const transfers = await StockTransfer.findAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku'],
        },
        {
          model: Branch,
          as: 'fromBranch',
          attributes: ['id', 'name'],
        },
        {
          model: Branch,
          as: 'toBranch',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: transfers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transfers',
      error: error.message,
    });
  }
};

// Get transfer by ID
export const getTransferById = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const transfer = await StockTransfer.findOne({
      where: { id, tenantId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku'],
        },
        {
          model: Branch,
          as: 'fromBranch',
          attributes: ['id', 'name'],
        },
        {
          model: Branch,
          as: 'toBranch',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found',
      });
    }

    res.json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transfer',
      error: error.message,
    });
  }
};

export default {
  createTransfer,
  approveTransfer,
  shipTransfer,
  receiveTransfer,
  cancelTransfer,
  getTransfers,
  getTransferById,
};
