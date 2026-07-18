import PurchaseOrder from '../models/PurchaseOrder.js';
import PurchaseRequest from '../models/PurchaseRequest.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// Create purchase order from request
export const createPurchaseOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { 
      purchaseRequestId, 
      supplierId, 
      branchId, 
      items, 
      expectedDeliveryDate,
      paymentTerms,
      notes 
    } = req.body;

    // Calculate totals
    let subtotal = 0;
    const orderItems = items.map(item => {
      const itemTotal = parseFloat(item.quantity) * parseFloat(item.unitPrice);
      subtotal += itemTotal;
      return {
        ...item,
        totalPrice: itemTotal,
      };
    });

    const taxAmount = parseFloat(req.body.taxAmount || 0);
    const discount = parseFloat(req.body.discount || 0);
    const totalAmount = subtotal + taxAmount - discount;

    // Create purchase order
    const purchaseOrder = await PurchaseOrder.create({
      tenantId,
      purchaseRequestId,
      supplierId,
      branchId,
      orderNumber: `PO-${Date.now()}`,
      orderDate: new Date(),
      expectedDeliveryDate,
      items: orderItems,
      subtotal,
      taxAmount,
      discount,
      totalAmount,
      status: 'pending',
      paymentTerms,
      paymentStatus: 'unpaid',
      notes,
      createdBy: userId,
    }, { transaction });

    // Update purchase request status if linked
    if (purchaseRequestId) {
      await PurchaseRequest.update(
        { status: 'ordered' },
        { where: { id: purchaseRequestId, tenantId }, transaction }
      );
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Purchase order created',
      data: purchaseOrder,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create purchase order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create purchase order',
      error: error.message,
    });
  }
};

// Approve purchase order
export const approvePurchaseOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;

    const purchaseOrder = await PurchaseOrder.findOne({
      where: { id, tenantId, status: 'pending' },
      transaction,
    });

    if (!purchaseOrder) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found or already processed',
      });
    }

    await purchaseOrder.update({
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date(),
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Purchase order approved',
      data: purchaseOrder,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to approve purchase order',
      error: error.message,
    });
  }
};

// Reject purchase order
export const rejectPurchaseOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;
    const { reason } = req.body;

    const purchaseOrder = await PurchaseOrder.findOne({
      where: { id, tenantId, status: 'pending' },
      transaction,
    });

    if (!purchaseOrder) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found or already processed',
      });
    }

    await purchaseOrder.update({
      status: 'rejected',
      rejectedBy: userId,
      rejectedAt: new Date(),
      rejectionReason: reason,
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Purchase order rejected',
      data: purchaseOrder,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to reject purchase order',
      error: error.message,
    });
  }
};

// Send purchase order to supplier
export const sendToSupplier = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const purchaseOrder = await PurchaseOrder.findOne({
      where: { id, tenantId, status: 'approved' },
      transaction,
    });

    if (!purchaseOrder) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Approved purchase order not found',
      });
    }

    await purchaseOrder.update({
      status: 'sent',
      sentAt: new Date(),
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Purchase order sent to supplier',
      data: purchaseOrder,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to send purchase order',
      error: error.message,
    });
  }
};

// Receive goods (complete purchase order)
export const receiveGoods = async (req, res) => {
  const dbTransaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;
    const { receivedItems, notes } = req.body;

    const purchaseOrder = await PurchaseOrder.findOne({
      where: { id, tenantId, status: { [Op.in]: ['sent', 'partial'] } },
      transaction: dbTransaction,
    });

    if (!purchaseOrder) {
      await dbTransaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found or not in valid status',
      });
    }

    // Process received items and update inventory
    for (const receivedItem of receivedItems) {
      const { productId, variantId, quantityReceived, unitCost, batchNumber, expiryDate } = receivedItem;

      // Get current inventory
      let inventory = await Inventory.findOne({
        where: { 
          tenantId, 
          branchId: purchaseOrder.branchId, 
          productId,
          variantId: variantId || null,
        },
        transaction: dbTransaction,
      });

      const quantityBefore = inventory ? parseFloat(inventory.quantity) : 0;
      const quantityAfter = quantityBefore + parseFloat(quantityReceived);

      // Create inventory transaction
      await InventoryTransaction.create({
        tenantId,
        branchId: purchaseOrder.branchId,
        productId,
        variantId,
        transactionType: 'purchase',
        quantityBefore,
        quantityChange: parseFloat(quantityReceived),
        quantityAfter,
        unitCost: parseFloat(unitCost),
        totalCost: parseFloat(quantityReceived) * parseFloat(unitCost),
        batchNumber,
        expiryDate,
        supplierId: purchaseOrder.supplierId,
        referenceId: purchaseOrder.id,
        referenceType: 'purchase_order',
        referenceNumber: purchaseOrder.orderNumber,
        notes: `Purchase from PO ${purchaseOrder.orderNumber}`,
        userId,
      }, { transaction: dbTransaction });

      // Update or create inventory
      if (inventory) {
        await inventory.update({
          quantity: quantityAfter,
          lastStockIn: new Date(),
        }, { transaction: dbTransaction });
      } else {
        await Inventory.create({
          tenantId,
          branchId: purchaseOrder.branchId,
          productId,
          variantId,
          quantity: quantityAfter,
          lastStockIn: new Date(),
        }, { transaction: dbTransaction });
      }
    }

    // Update purchase order status
    const allItemsReceived = receivedItems.every(item => 
      parseFloat(item.quantityReceived) >= parseFloat(item.quantityOrdered)
    );

    await purchaseOrder.update({
      status: allItemsReceived ? 'completed' : 'partial',
      receivedAt: new Date(),
      receivedBy: userId,
      receivedItems,
      notes: `${purchaseOrder.notes || ''}\n${notes || ''}`,
    }, { transaction: dbTransaction });

    await dbTransaction.commit();

    res.json({
      success: true,
      message: 'Goods received and inventory updated',
      data: purchaseOrder,
    });
  } catch (error) {
    await dbTransaction.rollback();
    console.error('Receive goods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to receive goods',
      error: error.message,
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId } = req.user;
    const { id } = req.params;
    const { paymentStatus, paidAmount, paymentDate, paymentMethod, paymentReference } = req.body;

    const purchaseOrder = await PurchaseOrder.findOne({
      where: { id, tenantId },
      transaction,
    });

    if (!purchaseOrder) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found',
      });
    }

    await purchaseOrder.update({
      paymentStatus,
      paidAmount: parseFloat(paidAmount),
      paymentDate,
      paymentMethod,
      paymentReference,
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Payment status updated',
      data: purchaseOrder,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message,
    });
  }
};

// Cancel purchase order
export const cancelPurchaseOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tenantId, id: userId } = req.user;
    const { id } = req.params;
    const { reason } = req.body;

    const purchaseOrder = await PurchaseOrder.findOne({
      where: { 
        id, 
        tenantId, 
        status: { [Op.notIn]: ['completed', 'cancelled'] },
      },
      transaction,
    });

    if (!purchaseOrder) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found or cannot be cancelled',
      });
    }

    await purchaseOrder.update({
      status: 'cancelled',
      cancelledBy: userId,
      cancelledAt: new Date(),
      cancellationReason: reason,
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Purchase order cancelled',
      data: purchaseOrder,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Failed to cancel purchase order',
      error: error.message,
    });
  }
};

// Get all purchase orders
export const getPurchaseOrders = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { branchId, status, supplierId, startDate, endDate } = req.query;

    const where = { tenantId };
    if (branchId) where.branchId = branchId;
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;
    
    if (startDate && endDate) {
      where.orderDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const purchaseOrders = await PurchaseOrder.findAll({
      where,
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
      order: [['orderDate', 'DESC']],
    });

    res.json({
      success: true,
      data: purchaseOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase orders',
      error: error.message,
    });
  }
};

// Get purchase order by ID
export const getPurchaseOrderById = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const purchaseOrder = await PurchaseOrder.findOne({
      where: { id, tenantId },
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'email', 'phone', 'address'],
        },
        {
          model: PurchaseRequest,
          as: 'purchaseRequest',
          attributes: ['id', 'requestNumber', 'status'],
        },
      ],
    });

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found',
      });
    }

    res.json({
      success: true,
      data: purchaseOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase order',
      error: error.message,
    });
  }
};

export default {
  createPurchaseOrder,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  sendToSupplier,
  receiveGoods,
  updatePaymentStatus,
  cancelPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
};
