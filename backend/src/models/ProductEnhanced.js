import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Product = sequelize.define('Product', {
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
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'category_id',
  },
  brandId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'brand_id',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'short_description',
  },
  type: {
    type: DataTypes.ENUM('simple', 'variable', 'bundle', 'combo'),
    defaultValue: 'simple',
    comment: 'simple=single variant, variable=multiple variants, bundle/combo=multiple products',
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  },
  barcode: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of tags: ["organic", "gluten-free", "vegan"]',
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  thumbnail: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  costPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'cost_price',
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'selling_price',
  },
  comparePrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'compare_price',
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'tax_rate',
  },
  taxInclusive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'tax_inclusive',
  },
  // Bundle/Combo specific fields
  bundleItems: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'bundle_items',
    comment: 'Array of {productId, variantId, quantity} for bundles',
  },
  bundlePrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'bundle_price',
  },
  // Stock tracking
  trackInventory: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'track_inventory',
  },
  stockAlert: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'stock_alert',
    comment: 'Low stock threshold',
  },
  // Product attributes
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  dimensions: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  expiryTracking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'expiry_tracking',
  },
  shelfLife: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'shelf_life',
    comment: 'Shelf life in days',
  },
  // Display & Status
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'inactive', 'discontinued'),
    defaultValue: 'active',
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private', 'hidden'),
    defaultValue: 'public',
  },
  // SEO
  metaTitle: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'meta_title',
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'meta_description',
  },
  metaKeywords: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'meta_keywords',
  },
  // Additional data
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'products',
  underscored: true,
  paranoid: true,
  timestamps: true,
  indexes: [
    {
      fields: ['tenant_id', 'slug'],
      unique: true,
    },
    {
      fields: ['category_id'],
    },
    {
      fields: ['brand_id'],
    },
    {
      fields: ['sku'],
      unique: true,
      where: {
        sku: {
          [sequelize.Sequelize.Op.ne]: null,
        },
      },
    },
    {
      fields: ['status'],
    },
    {
      fields: ['type'],
    },
  ],
});

export default Product;
