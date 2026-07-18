import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const PurchaseRequest = sequelize.define('PurchaseRequest', {
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
  requestNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'request_number',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Array of {productId, variantId, quantity, estimatedCost, reason}',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected', 'converted', 'cancelled'),
    defaultValue: 'draft',
  },
  estimatedTotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'estimated_total',
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
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason',
  },
  purchaseOrderId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'purchase_order_id',
    comment: 'Link to created PO when converted',
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
  tableName: 'purchase_requests',
  underscored: true,
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['tenant_id', 'branch_id'],
    },
    {
      fields: ['request_number'],
      unique: true,
    },
    {
      fields: ['status'],
    },
    {
      fields: ['priority'],
    },
  ],
});

export default PurchaseRequest;
