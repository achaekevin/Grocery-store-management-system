import db from '../models/index.js';
import logger from '../config/logger.js';

/**
 * Create notification
 */
export const createNotification = async ({
  businessId,
  userId = null,
  type,
  title,
  message,
  link = null,
}) => {
  try {
    const notification = await db.Notification.create({
      businessId,
      userId,
      type,
      title,
      message,
      link,
      isRead: false,
    });

    return notification;
  } catch (error) {
    logger.error('Create notification failed:', error);
    throw error;
  }
};

/**
 * Create low stock notification
 */
export const createLowStockNotification = async (businessId, product, currentStock) => {
  return createNotification({
    businessId,
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: `${product.name} is running low on stock. Current quantity: ${currentStock}`,
    link: `/products/${product.id}`,
  });
};

/**
 * Create expiry notification
 */
export const createExpiryNotification = async (businessId, product, expiryDate) => {
  return createNotification({
    businessId,
    type: 'expiry_alert',
    title: 'Product Expiry Alert',
    message: `${product.name} will expire on ${expiryDate}`,
    link: `/products/${product.id}`,
  });
};

/**
 * Create payment notification
 */
export const createPaymentNotification = async (businessId, userId, amount, paymentMethod) => {
  return createNotification({
    businessId,
    userId,
    type: 'payment',
    title: 'Payment Received',
    message: `Payment of ${amount} received via ${paymentMethod}`,
  });
};

/**
 * Create sale notification
 */
export const createSaleNotification = async (businessId, userId, saleId, total) => {
  return createNotification({
    businessId,
    userId,
    type: 'sale',
    title: 'New Sale',
    message: `New sale completed. Total: ${total}`,
    link: `/sales/${saleId}`,
  });
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    const notification = await db.Notification.findByPk(notificationId);
    
    if (notification) {
      await notification.update({
        isRead: true,
        readAt: new Date(),
      });
    }

    return notification;
  } catch (error) {
    logger.error('Mark notification as read failed:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId) => {
  try {
    await db.Notification.update(
      {
        isRead: true,
        readAt: new Date(),
      },
      {
        where: {
          userId,
          isRead: false,
        },
      }
    );
  } catch (error) {
    logger.error('Mark all notifications as read failed:', error);
    throw error;
  }
};

/**
 * Get unread count
 */
export const getUnreadCount = async (userId) => {
  try {
    const count = await db.Notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return count;
  } catch (error) {
    logger.error('Get unread count failed:', error);
    throw error;
  }
};

/**
 * Delete old notifications
 */
export const deleteOldNotifications = async (daysOld = 30) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - daysOld);

    const result = await db.Notification.destroy({
      where: {
        createdAt: {
          [db.Sequelize.Op.lt]: date,
        },
        isRead: true,
      },
    });

    logger.info(`Deleted ${result} old notifications`);
    return result;
  } catch (error) {
    logger.error('Delete old notifications failed:', error);
    throw error;
  }
};

export default {
  createNotification,
  createLowStockNotification,
  createExpiryNotification,
  createPaymentNotification,
  createSaleNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteOldNotifications,
};
