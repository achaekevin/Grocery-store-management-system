import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AnalyticsData = sequelize.define('AnalyticsData', {
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
  branchId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'branch_id',
  },
  metricType: {
    type: DataTypes.ENUM(
      'revenue',
      'sales',
      'orders',
      'customers',
      'inventory_value',
      'profit',
      'expenses',
      'payment_method',
      'product_performance',
      'category_performance'
    ),
    allowNull: false,
    field: 'metric_type',
  },
  period: {
    type: DataTypes.ENUM('hourly', 'daily', 'weekly', 'monthly', 'yearly'),
    allowNull: false,
  },
  periodStart: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'period_start',
  },
  periodEnd: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'period_end',
  },
  value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'analytics_data',
  underscored: true,
  timestamps: true,
  paranoid: false,
});

export default AnalyticsData;
