import Insight from '../models/Insight.js';
import { Op } from 'sequelize';

// Get all insights
export const getInsights = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { type, priority, dismissed } = req.query;

    const where = { tenantId };

    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (dismissed !== undefined) where.dismissed = dismissed === 'true';

    // Only show non-expired insights
    where[Op.or] = [
      { expiresAt: null },
      { expiresAt: { [Op.gt]: new Date() } }
    ];

    const insights = await Insight.findAll({
      where,
      order: [
        ['priority', 'DESC'],
        ['createdAt', 'DESC']
      ],
    });

    res.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch insights',
      error: error.message,
    });
  }
};

// Get insight by ID
export const getInsightById = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const insight = await Insight.findOne({
      where: { id, tenantId },
    });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found',
      });
    }

    res.json({
      success: true,
      data: insight,
    });
  } catch (error) {
    console.error('Get insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch insight',
      error: error.message,
    });
  }
};

// Create new insight
export const createInsight = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const insightData = {
      ...req.body,
      tenantId,
    };

    const insight = await Insight.create(insightData);

    res.status(201).json({
      success: true,
      message: 'Insight created successfully',
      data: insight,
    });
  } catch (error) {
    console.error('Create insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create insight',
      error: error.message,
    });
  }
};

// Dismiss insight
export const dismissInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const insight = await Insight.findOne({
      where: { id, tenantId },
    });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found',
      });
    }

    await insight.update({
      dismissed: true,
      dismissedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Insight dismissed successfully',
      data: insight,
    });
  } catch (error) {
    console.error('Dismiss insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to dismiss insight',
      error: error.message,
    });
  }
};

// Delete insight
export const deleteInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const insight = await Insight.findOne({
      where: { id, tenantId },
    });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found',
      });
    }

    await insight.destroy();

    res.json({
      success: true,
      message: 'Insight deleted successfully',
    });
  } catch (error) {
    console.error('Delete insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete insight',
      error: error.message,
    });
  }
};

// Get insights summary
export const getInsightsSummary = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const [total, critical, high, actionable, dismissed] = await Promise.all([
      Insight.count({ where: { tenantId, dismissed: false } }),
      Insight.count({ where: { tenantId, priority: 'critical', dismissed: false } }),
      Insight.count({ where: { tenantId, priority: 'high', dismissed: false } }),
      Insight.count({ where: { tenantId, actionable: true, dismissed: false } }),
      Insight.count({ where: { tenantId, dismissed: true } }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        critical,
        high,
        actionable,
        dismissed,
      },
    });
  } catch (error) {
    console.error('Get insights summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch insights summary',
      error: error.message,
    });
  }
};
