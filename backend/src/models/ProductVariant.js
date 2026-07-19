import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const ProductVariant = sequelize.define('ProductVariant', {
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
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'e.g., 500ml, 1L, 2L',
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  barcode: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  unitId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'unit_id',
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Quantity in the specified unit',
  },
  costPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'cost_price',
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'selling_price',
  },
  comparePrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'compare_price',
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  dimensions: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Length, width, height',
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_default',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'product_variants',
  underscored: true,
  paranoid: true,
  timestamps: true,
  indexes: [
    {
      fields: ['tenant_id', 'product_id'],
    },
    {
      fields: ['sku'],
      unique: true,
    },
    {
      fields: ['barcode'],
    },
  ],
});

export default ProductVariant;

