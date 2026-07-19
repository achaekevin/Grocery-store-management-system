import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const SystemSetting = sequelize.define('SystemSetting', {
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
  category: {
    type: DataTypes.ENUM(
      'general',
      'business',
      'tax',
      'currency',
      'notification',
      'email',
      'receipt',
      'invoice',
      'theme',
      'security',
      'integration',
      'backup'
    ),
    allowNull: false,
  },
  key: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  value: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  dataType: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'array'),
    defaultValue: 'string',
    field: 'data_type',
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_public',
  },
  isEncrypted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_encrypted',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'system_settings',
  underscored: true,
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['tenant_id', 'key'],
    },
  ],
});

export default SystemSetting;

