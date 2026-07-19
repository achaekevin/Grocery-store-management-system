import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const InventoryTransaction = sequelize.define('InventoryTransaction', {
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
    allowNull: false,
    field: 'branch_id',
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id',
  },
  variantId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'variant_id',
  },
  transactionType: {
    type: DataTypes.ENUM(
      'stock_in',
      'stock_out',
      'adjustment',
      'transfer_out',
      'transfer_in',
      'return',
      'damage',
      'expired',
      'sale',
      'purchase'
    ),
    allowNull: false,
    field: 'transaction_type',
  },
  referenceType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'reference_type',
    comment: 'order, purchase_order, transfer, etc.',
  },
  referenceId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'reference_id',
  },
  quantityBefore: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'quantity_before',
  },
  quantityChange: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'quantity_change',
    comment: 'Positive for additions, negative for reductions',
  },
  quantityAfter: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'quantity_after',
  },
  unitCost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'unit_cost',
  },
  totalCost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'total_cost',
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  batchNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'batch_number',
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expiry_date',
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'supplier_id',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    comment: 'User who performed the transaction',
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'inventory_transactions',
  underscored: true,
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['tenant_id', 'branch_id'],
    },
    {
      fields: ['product_id'],
    },
    {
      fields: ['transaction_type'],
    },
    {
      fields: ['reference_type', 'reference_id'],
    },
    {
      fields: ['created_at'],
    },
  ],
});

export default InventoryTransaction;

