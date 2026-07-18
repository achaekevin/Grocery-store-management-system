import PurchaseRequest from '../models/PurchaseRequest.js';
import Product from '../models/Product.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// Create purchase request
export const createPurchaseRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { branchId, items, priority, notes, requiredBy } = req.body;

    const purchaseRequest = await PurchaseRequest.create({
      tenantId,
      branchId,
      requestNumber: `PR-${Date.now()}`,
      requestDate: new Date(),
      requiredBy,
      items,
      status: 'pending',
      priority: priority || 'medium',
      notes,
      requestedBy: userId,
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Purchase request created',
      data: purchaseRequest,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create purchase request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create purchase request',
      error: error.message,
    });
  }
};

// Approve purchase request
export const approvePurchaseRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;

    const purchaseRequest = await PurchaseRequest.findOne({
      where: { id, tenantId, status: 'pending' },
      transaction,
    });

    if (!purchaseRequest) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Purchase request not found or already processed',
      });
    }

    await purchaseRequest.update({
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date(),
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Purchase request approved',
      data: purchaseRequest,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to approve purchase request',
      error: error.message,
    });
  }
};

// Reject purchase request
export const rejectPurchaseRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;
    const { reason } = req.body;

    const purchaseRequest = await PurchaseRequest.findOne({
      where: { id, tenantId, status: 'pending' },
      transaction,
    });

    if (!purchaseRequest) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Purchase request not found or already processed',
      });
    }

    await purchaseRequest.update({
      status: 'rejected',
      rejectedBy: userId,
      rejectedAt: new Date(),
      rejectionReason: reason,
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Purchase request rejected',
      data: purchaseRequest,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to reject purchase request',
      error: error.message,
    });
  }
};

// Cancel purchase request
export const cancelPurchaseRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;
    const { reason } = req.body;

    const purchaseRequest = await PurchaseRequest.findOne({
      where: { 
        id, 
        tenantId, 
        status: { [Op.in]: ['pending', 'approved'] },
      },
      transaction,
    });

    if (!purchaseRequest) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Purchase request not found or cannot be cancelled',
      });
    }

    await purchaseRequest.update({
      status: 'cancelled',
      cancelledBy: userId,
      cancelledAt: new Date(),
      cancellationReason: reason,
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Purchase request cancelled',
      data: purchaseRequest,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to cancel purchase request',
      error: error.message,
    });
  }
};

// Get all purchase requests
export const getPurchaseRequests = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, status, priority } = req.query;

    const where = { tenantId };
    if (branchId) where.branchId = branchId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const purchaseRequests = await PurchaseRequest.findAll({
      where,
      order: [['requestDate', 'DESC']],
    });

    res.json({
      success: true,
      data: purchaseRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase requests',
      error: error.message,
    });
  }
};

// Get purchase request by ID
export const getPurchaseRequestById = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const purchaseRequest = await PurchaseRequest.findOne({
      where: { id, tenantId },
    });

    if (!purchaseRequest) {
      return res.status(404).json({
        success: false,
        message: 'Purchase request not found',
      });
    }

    res.json({
      success: true,
      data: purchaseRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase request',
      error: error.message,
    });
  }
};

// Update purchase request
export const updatePurchaseRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId } = req.user;
    const { id } = req.params;
    const { items, priority, notes, requiredBy } = req.body;

    const purchaseRequest = await PurchaseRequest.findOne({
      where: { id, tenantId, status: 'pending' },
      transaction,
    });

    if (!purchaseRequest) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Purchase request not found or cannot be updated',
      });
    }

    await purchaseRequest.update({
      items,
      priority,
      notes,
      requiredBy,
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Purchase request updated',
      data: purchaseRequest,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to update purchase request',
      error: error.message,
    });
  }
};

export default {
  createPurchaseRequest,
  approvePurchaseRequest,
  rejectPurchaseRequest,
  cancelPurchaseRequest,
  getPurchaseRequests,
  getPurchaseRequestById,
  updatePurchaseRequest,
};
