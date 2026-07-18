import Promotion from '../models/Promotion.js';
import { Op } from 'sequelize';

// Get all promotions
export const getPromotions = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { isActive, type } = req.query;

    const where = { tenantId };
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (type) where.promotionType = type;

    const promotions = await Promotion.findAll({
      where,
      order: [['priority', 'DESC'], ['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotions',
      error: error.message,
    });
  }
};

// Get active promotions
export const getActivePromotions = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const now = new Date();

    const promotions = await Promotion.findAll({
      where: {
        tenantId,
        isActive: true,
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now },
        [Op.or]: [
          { usageLimit: null },
          { usageCount: { [Op.lt]: sequelize.col('usage_limit') } },
        ],
      },
      order: [['priority', 'DESC']],
    });

    res.json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    console.error('Get active promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active promotions',
      error: error.message,
    });
  }
};

// Get promotion by code
export const getPromotionByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const { tenantId } = req.user;
    const now = new Date();

    const promotion = await Promotion.findOne({
      where: {
        tenantId,
        code,
        isActive: true,
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now },
      },
    });

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found or expired',
      });
    }

    // Check usage limit
    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Promotion usage limit reached',
      });
    }

    res.json({
      success: true,
      data: promotion,
    });
  } catch (error) {
    console.error('Get promotion by code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotion',
      error: error.message,
    });
  }
};

// Create promotion
export const createPromotion = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const promotion = await Promotion.create({
      ...req.body,
      tenantId,
    });

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: promotion,
    });
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create promotion',
      error: error.message,
    });
  }
};

// Update promotion
export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const promotion = await Promotion.findOne({
      where: { id, tenantId },
    });

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
    }

    await promotion.update(req.body);

    res.json({
      success: true,
      message: 'Promotion updated successfully',
      data: promotion,
    });
  } catch (error) {
    console.error('Update promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update promotion',
      error: error.message,
    });
  }
};

// Apply promotion
export const applyPromotion = async (req, res) => {
  try {
    const { code, orderData } = req.body;
    const { tenantId } = req.user;

    const promotion = await Promotion.findOne({
      where: { tenantId, code, isActive: true },
    });

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promotion code',
      });
    }

    // Check if promotion is valid
    const now = new Date();
    if (now < promotion.startDate || now > promotion.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Promotion has expired',
      });
    }

    // Check usage limit
    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Promotion usage limit reached',
      });
    }

    // Calculate discount
    let discount = 0;
    const subtotal = parseFloat(orderData.subtotal);

    switch (promotion.promotionType) {
      case 'percentage_discount':
        discount = (subtotal * parseFloat(promotion.discountValue)) / 100;
        break;
      case 'fixed_discount':
        discount = parseFloat(promotion.discountValue);
        break;
      // Add more promotion types as needed
      default:
        discount = 0;
    }

    // Increment usage count
    await promotion.increment('usageCount');

    res.json({
      success: true,
      data: {
        promotion,
        discount,
        finalAmount: subtotal - discount,
      },
    });
  } catch (error) {
    console.error('Apply promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply promotion',
      error: error.message,
    });
  }
};

// Delete promotion
export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const promotion = await Promotion.findOne({
      where: { id, tenantId },
    });

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
    }

    await promotion.destroy();

    res.json({
      success: true,
      message: 'Promotion deleted successfully',
    });
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete promotion',
      error: error.message,
    });
  }
};

// Get promotion statistics
export const getPromotionStats = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const [total, active, expired] = await Promise.all([
      Promotion.count({ where: { tenantId } }),
      Promotion.count({
        where: {
          tenantId,
          isActive: true,
          startDate: { [Op.lte]: new Date() },
          endDate: { [Op.gte]: new Date() },
        },
      }),
      Promotion.count({
        where: {
          tenantId,
          endDate: { [Op.lt]: new Date() },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        active,
        expired,
      },
    });
  } catch (error) {
    console.error('Get promotion stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotion statistics',
      error: error.message,
    });
  }
};
