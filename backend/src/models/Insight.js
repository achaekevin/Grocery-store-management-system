import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Insight = sequelize.define('Insight', {
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
  type: {
    type: DataTypes.ENUM(
      'stock_out_prediction',
      'best_selling_category',
      'slow_moving_inventory',
      'sales_forecast',
      'profit_forecast',
      'reorder_recommendation',
      'pricing_suggestion',
      'seasonal_trend',
      'customer_behavior',
      'supplier_performance'
    ),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
  },
  confidence: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  impact: {
    type: DataTypes.ENUM('positive', 'negative', 'neutral'),
    defaultValue: 'neutral',
  },
  recommendation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  actionable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  actionUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'action_url',
  },
  dismissed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dismissedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'dismissed_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at',
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'insights',
  underscored: true,
  paranoid: true,
  timestamps: true,
});

export default Insight;

