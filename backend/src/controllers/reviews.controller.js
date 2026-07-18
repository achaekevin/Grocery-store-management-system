import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { Op } from 'sequelize';

// Get all reviews
export const getReviews = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { productId, customerId, status, page = 1, limit = 20 } = req.query;

    const where = { tenantId };
    if (productId) where.productId = productId;
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image'],
        },
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

// Get product reviews
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { tenantId } = req.user;

    const reviews = await Review.findAll({
      where: { tenantId, productId, status: 'approved' },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Rating distribution
    const distribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          total: reviews.length,
          averageRating: parseFloat(averageRating.toFixed(1)),
          distribution,
        },
      },
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product reviews',
      error: error.message,
    });
  }
};

// Create review
export const createReview = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { productId, customerId, rating, title, comment, orderId } = req.body;

    // Check if customer already reviewed this product
    const existingReview = await Review.findOne({
      where: { tenantId, productId, customerId },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    // Check if verified purchase
    let verifiedPurchase = false;
    if (orderId) {
      // Logic to verify if customer bought this product
      verifiedPurchase = true; // Simplified
    }

    const review = await Review.create({
      tenantId,
      productId,
      customerId,
      orderId,
      rating,
      title,
      comment,
      verifiedPurchase,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message,
    });
  }
};

// Update review status
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { status } = req.body;

    const review = await Review.findOne({
      where: { id, tenantId },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    await review.update({ status });

    res.json({
      success: true,
      message: 'Review status updated successfully',
      data: review,
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review status',
      error: error.message,
    });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const review = await Review.findOne({
      where: { id, tenantId },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    await review.increment('helpfulCount');

    res.json({
      success: true,
      message: 'Review marked as helpful',
      data: review,
    });
  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful',
      error: error.message,
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const review = await Review.findOne({
      where: { id, tenantId },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};

// Get review statistics
export const getReviewStats = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const [total, pending, approved, rejected] = await Promise.all([
      Review.count({ where: { tenantId } }),
      Review.count({ where: { tenantId, status: 'pending' } }),
      Review.count({ where: { tenantId, status: 'approved' } }),
      Review.count({ where: { tenantId, status: 'rejected' } }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics',
      error: error.message,
    });
  }
};
