import LoyaltyProgram from '../models/LoyaltyProgram.js';
import CustomerLoyalty from '../models/CustomerLoyalty.js';
import Customer from '../models/Customer.js';
import { Op } from 'sequelize';

// Get all loyalty programs
export const getLoyaltyPrograms = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const programs = await LoyaltyProgram.findAll({
      where: { tenantId },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error('Get loyalty programs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch loyalty programs',
      error: error.message,
    });
  }
};

// Get active loyalty program
export const getActiveProgram = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const program = await LoyaltyProgram.findOne({
      where: { tenantId, isActive: true },
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'No active loyalty program found',
      });
    }

    res.json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error('Get active program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active program',
      error: error.message,
    });
  }
};

// Create loyalty program
export const createLoyaltyProgram = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const program = await LoyaltyProgram.create({
      ...req.body,
      tenantId,
    });

    res.status(201).json({
      success: true,
      message: 'Loyalty program created successfully',
      data: program,
    });
  } catch (error) {
    console.error('Create loyalty program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create loyalty program',
      error: error.message,
    });
  }
};

// Update loyalty program
export const updateLoyaltyProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const program = await LoyaltyProgram.findOne({
      where: { id, tenantId },
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty program not found',
      });
    }

    await program.update(req.body);

    res.json({
      success: true,
      message: 'Loyalty program updated successfully',
      data: program,
    });
  } catch (error) {
    console.error('Update loyalty program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update loyalty program',
      error: error.message,
    });
  }
};

// Get customer loyalty
export const getCustomerLoyalty = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { tenantId } = req.user;

    const loyalty = await CustomerLoyalty.findOne({
      where: { tenantId, customerId },
      include: [
        {
          model: LoyaltyProgram,
          as: 'program',
        },
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!loyalty) {
      return res.status(404).json({
        success: false,
        message: 'Customer loyalty not found',
      });
    }

    res.json({
      success: true,
      data: loyalty,
    });
  } catch (error) {
    console.error('Get customer loyalty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer loyalty',
      error: error.message,
    });
  }
};

// Enroll customer in loyalty program
export const enrollCustomer = async (req, res) => {
  try {
    const { customerId, programId } = req.body;
    const { tenantId } = req.user;

    // Check if already enrolled
    const existing = await CustomerLoyalty.findOne({
      where: { tenantId, customerId, programId },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Customer already enrolled in this program',
      });
    }

    const loyalty = await CustomerLoyalty.create({
      tenantId,
      customerId,
      programId,
      pointsBalance: 0,
      lifetimePoints: 0,
      tier: 'bronze',
      joinedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Customer enrolled successfully',
      data: loyalty,
    });
  } catch (error) {
    console.error('Enroll customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll customer',
      error: error.message,
    });
  }
};

// Add points
export const addPoints = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { points, reason } = req.body;
    const { tenantId } = req.user;

    const loyalty = await CustomerLoyalty.findOne({
      where: { tenantId, customerId },
    });

    if (!loyalty) {
      return res.status(404).json({
        success: false,
        message: 'Customer loyalty not found',
      });
    }

    await loyalty.update({
      pointsBalance: loyalty.pointsBalance + points,
      lifetimePoints: loyalty.lifetimePoints + points,
      lastActivityAt: new Date(),
    });

    // Check for tier upgrade
    const program = await LoyaltyProgram.findByPk(loyalty.programId);
    if (program && program.membershipTiers) {
      const tiers = program.membershipTiers;
      for (const tier of tiers) {
        if (loyalty.lifetimePoints >= tier.requiredPoints && loyalty.tier !== tier.name) {
          await loyalty.update({
            tier: tier.name,
            tierStartDate: new Date(),
          });
          break;
        }
      }
    }

    res.json({
      success: true,
      message: 'Points added successfully',
      data: loyalty,
    });
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add points',
      error: error.message,
    });
  }
};

// Redeem points
export const redeemPoints = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { points } = req.body;
    const { tenantId } = req.user;

    const loyalty = await CustomerLoyalty.findOne({
      where: { tenantId, customerId },
      include: [{ model: LoyaltyProgram, as: 'program' }],
    });

    if (!loyalty) {
      return res.status(404).json({
        success: false,
        message: 'Customer loyalty not found',
      });
    }

    if (loyalty.pointsBalance < points) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient points balance',
      });
    }

    if (points < loyalty.program.minPointsRedemption) {
      return res.status(400).json({
        success: false,
        message: `Minimum ${loyalty.program.minPointsRedemption} points required for redemption`,
      });
    }

    await loyalty.update({
      pointsBalance: loyalty.pointsBalance - points,
      lastActivityAt: new Date(),
    });

    const value = points * parseFloat(loyalty.program.currencyPerPoint);

    res.json({
      success: true,
      message: 'Points redeemed successfully',
      data: {
        loyalty,
        redeemedPoints: points,
        redemptionValue: value,
      },
    });
  } catch (error) {
    console.error('Redeem points error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to redeem points',
      error: error.message,
    });
  }
};

// Get loyalty statistics
export const getLoyaltyStats = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const [totalMembers, activePrograms, totalPoints] = await Promise.all([
      CustomerLoyalty.count({ where: { tenantId } }),
      LoyaltyProgram.count({ where: { tenantId, isActive: true } }),
      CustomerLoyalty.sum('points_balance', { where: { tenantId } }),
    ]);

    // Tier distribution
    const tierDistribution = await CustomerLoyalty.findAll({
      where: { tenantId },
      attributes: [
        'tier',
        [sequelize.fn('COUNT', sequelize.col('tier')), 'count'],
      ],
      group: ['tier'],
    });

    res.json({
      success: true,
      data: {
        totalMembers,
        activePrograms,
        totalPoints: totalPoints || 0,
        tierDistribution,
      },
    });
  } catch (error) {
    console.error('Get loyalty stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch loyalty statistics',
      error: error.message,
    });
  }
};
