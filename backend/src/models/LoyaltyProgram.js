import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const LoyaltyProgram = sequelize.define('LoyaltyProgram', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'tenant_id',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pointsPerCurrency: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1.0,
    field: 'points_per_currency',
  },
  currencyPerPoint: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    defaultValue: 0.01,
    field: 'currency_per_point',
  },
  minPointsRedemption: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    field: 'min_points_redemption',
  },
  membershipTiers: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'membership_tiers',
  },
  benefits: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'end_date',
  },
}, {
  tableName: 'loyalty_programs',
  underscored: true,
  paranoid: true,
  timestamps: true,
});

export default LoyaltyProgram;
