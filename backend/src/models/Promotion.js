import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Promotion = sequelize.define('Promotion', {
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
  promotionType: {
    type: DataTypes.ENUM(
      'percentage_discount',
      'fixed_discount',
      'buy_x_get_y',
      'bundle',
      'free_shipping',
      'loyalty_bonus'
    ),
    allowNull: false,
    field: 'promotion_type',
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'discount_value',
  },
  conditions: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  applicableTo: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'applicable_to',
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'usage_limit',
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'usage_count',
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'promotions',
  underscored: true,
  paranoid: true,
  timestamps: true,
});

export default Promotion;

