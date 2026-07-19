import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const StockTransfer = sequelize.define('StockTransfer', {
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
  transferNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'transfer_number',
  },
  fromBranchId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'from_branch_id',
  },
  toBranchId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'to_branch_id',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_transit', 'received', 'cancelled'),
    defaultValue: 'pending',
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Array of {productId, variantId, quantity, unitCost}',
  },
  totalItems: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_items',
  },
  totalQuantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_quantity',
  },
  totalValue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'total_value',
  },
  requestedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'requested_by',
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'approved_by',
  },
  sentBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'sent_by',
  },
  receivedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'received_by',
  },
  requestedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'requested_at',
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at',
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'sent_at',
  },
  receivedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'received_at',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'stock_transfers',
  underscored: true,
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['tenant_id'],
    },
    {
      fields: ['transfer_number'],
      unique: true,
    },
    {
      fields: ['from_branch_id'],
    },
    {
      fields: ['to_branch_id'],
    },
    {
      fields: ['status'],
    },
  ],
});

export default StockTransfer;

