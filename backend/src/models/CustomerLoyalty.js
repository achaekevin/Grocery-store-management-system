import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const CustomerLoyalty = sequelize.define('CustomerLoyalty', {
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
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'customer_id',
  },
  programId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'program_id',
  },
  pointsBalance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'points_balance',
  },
  lifetimePoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'lifetime_points',
  },
  tier: {
    type: DataTypes.STRING(50),
    defaultValue: 'bronze',
  },
  tierStartDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'tier_start_date',
  },
  joinedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'joined_at',
  },
  lastActivityAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_activity_at',
  },
}, {
  tableName: 'customer_loyalty',
  underscored: true,
  timestamps: true,
  paranoid: false,
});

export default CustomerLoyalty;
