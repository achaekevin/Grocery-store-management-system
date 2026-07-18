import Activity from '../models/Activity.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// Log activity
export const logActivity = async (activityData) => {
  try {
    return await Activity.create(activityData);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// Get all activities
export const getActivities = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { 
      userId, 
      activityType, 
      entityType, 
      startDate, 
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const where = { tenantId };
    if (userId) where.userId = userId;
    if (activityType) where.activityType = activityType;
    if (entityType) where.entityType = entityType;
    
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: activities } = await Activity.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: activities,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message,
    });
  }
};

// Get activity by ID
export const getActivityById = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const activity = await Activity.findOne({
      where: { id, tenantId },
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
      error: error.message,
    });
  }
};

// Get activities by user
export const getActivitiesByUser = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const activities = await Activity.findAll({
      where: { tenantId, userId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activities',
      error: error.message,
    });
  }
};

// Get activities by entity
export const getActivitiesByEntity = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { entityType, entityId } = req.params;

    const activities = await Activity.findAll({
      where: { tenantId, entityType, entityId },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entity activities',
      error: error.message,
    });
  }
};

// Get activity statistics
export const getActivityStats = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { startDate, endDate } = req.query;

    const where = { tenantId };
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const totalActivities = await Activity.count({ where });
    
    const byType = await Activity.findAll({
      where,
      attributes: [
        'activityType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['activityType'],
      raw: true,
    });

    const byUser = await Activity.findAll({
      where,
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['userId'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
      raw: true,
    });

    res.json({
      success: true,
      data: {
        total: totalActivities,
        byType,
        topUsers: byUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity statistics',
      error: error.message,
    });
  }
};

export default {
  logActivity,
  getActivities,
  getActivityById,
  getActivitiesByUser,
  getActivitiesByEntity,
  getActivityStats,
};
