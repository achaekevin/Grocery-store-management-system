import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const WidgetLayout = sequelize.define('WidgetLayout', {
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_default',
  },
  layout: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  tableName: 'widget_layouts',
  underscored: true,
  paranoid: true,
  timestamps: true,
});

export default WidgetLayout;
