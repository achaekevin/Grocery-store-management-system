import Notification from '../models/Notification.js';

class NotificationService {
  constructor() {
    this.io = null;
  }

  /**
   * Initialize Socket.IO
   */
  initialize(io) {
    this.io = io;
    
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join business room
      socket.on('join:business', (businessId) => {
        socket.join(`business:${businessId}`);
        console.log(`Socket ${socket.id} joined business:${businessId}`);
      });

      // Join branch room
      socket.on('join:branch', (branchId) => {
        socket.join(`branch:${branchId}`);
        console.log(`Socket ${socket.id} joined branch:${branchId}`);
      });

      // Join user room
      socket.on('join:user', (userId) => {
        socket.join(`user:${userId}`);
        console.log(`Socket ${socket.id} joined user:${userId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  /**
   * Create and send notification
   */
  async sendNotification(notificationData) {
    try {
      // Save to database
      const notification = await Notification.create(notificationData);

      // Send via Socket.IO
      if (this.io) {
        const { tenantId, userId, branchId, businessId } = notificationData;

        // Send to specific user
        if (userId) {
          this.io.to(`user:${userId}`).emit('notification', notification);
        }

        // Send to branch
        if (branchId) {
          this.io.to(`branch:${branchId}`).emit('notification', notification);
        }

        // Send to business
        if (businessId) {
          this.io.to(`business:${businessId}`).emit('notification', notification);
        }
      }

      return notification;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Notification types
   */
  async lowStockAlert(productData, tenantId, branchId) {
    return this.sendNotification({
      tenantId,
      branchId,
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: `Product "${productData.name}" is running low. Current stock: ${productData.quantity}`,
      priority: 'high',
      data: { productId: productData.id },
    });
  }

  async saleCompleted(saleData, tenantId, branchId) {
    return this.sendNotification({
      tenantId,
      branchId,
      type: 'sale_completed',
      title: 'Sale Completed',
      message: `Sale #${saleData.saleNumber} completed. Total: ${saleData.total}`,
      priority: 'medium',
      data: { saleId: saleData.id },
    });
  }

  async paymentReceived(paymentData, tenantId, branchId) {
    return this.sendNotification({
      tenantId,
      branchId,
      type: 'payment_received',
      title: 'Payment Received',
      message: `Payment of ${paymentData.amount} received via ${paymentData.method}`,
      priority: 'medium',
      data: { paymentId: paymentData.id },
    });
  }

  async purchaseDelivered(purchaseData, tenantId, branchId) {
    return this.sendNotification({
      tenantId,
      branchId,
      type: 'purchase_delivered',
      title: 'Purchase Delivered',
      message: `Purchase order #${purchaseData.orderNumber} has been delivered`,
      priority: 'medium',
      data: { purchaseOrderId: purchaseData.id },
    });
  }

  async productExpiring(productData, tenantId, branchId) {
    return this.sendNotification({
      tenantId,
      branchId,
      type: 'product_expiring',
      title: 'Product Expiring Soon',
      message: `Product "${productData.name}" is expiring on ${productData.expiryDate}`,
      priority: 'high',
      data: { productId: productData.id },
    });
  }

  async branchTransfer(transferData, tenantId) {
    return this.sendNotification({
      tenantId,
      branchId: transferData.toBranchId,
      type: 'branch_transfer',
      title: 'Stock Transfer',
      message: `Stock transfer from branch ${transferData.fromBranchId} received`,
      priority: 'medium',
      data: { transferId: transferData.id },
    });
  }

  async refundCompleted(refundData, tenantId, branchId) {
    return this.sendNotification({
      tenantId,
      branchId,
      type: 'refund_completed',
      title: 'Refund Completed',
      message: `Refund of ${refundData.amount} processed successfully`,
      priority: 'medium',
      data: { refundId: refundData.id },
    });
  }

  async userCreated(userData, tenantId) {
    return this.sendNotification({
      tenantId,
      userId: userData.id,
      type: 'user_created',
      title: 'Welcome!',
      message: `Your account has been created successfully`,
      priority: 'low',
      data: { userId: userData.id },
    });
  }
}

export default new NotificationService();
