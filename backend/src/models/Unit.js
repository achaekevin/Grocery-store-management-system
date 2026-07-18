import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Unit = sequelize.define('Unit', {
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
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  shortName: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'short_name',
  },
  baseUnit: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'base_unit',
    comment: 'Reference to base unit for conversion',
  },
  conversionFactor: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    field: 'conversion_factor',
    comment: 'Multiplier to convert to base unit',
  },
  type: {
    type: DataTypes.ENUM('weight', 'volume', 'length', 'piece', 'other'),
    defaultValue: 'piece',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'units',
  underscored: true,
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['tenant_id', 'short_name'],
      unique: true,
    },
  ],
});

// Self-referencing for base unit
Unit.belongsTo(Unit, { as: 'base', foreignKey: 'baseUnit' });

export default Unit;
