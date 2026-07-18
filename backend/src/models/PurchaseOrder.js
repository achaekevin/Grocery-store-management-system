import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PurchaseOrder = sequelize.define('PurchaseOrder', {
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
  poNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'po_number',
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'supplier_id',
  },
  status: {
    type: DataTypes.ENUM(
      'draft',
      'pending_approval',
      'approved',
      'sent_to_supplier',
      'partially_received',
      'received',
      'cancelled',
      'closed'
    ),
    defaultValue: 'draft',
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Array of {productId, variantId, quantity, unitCost, total}',
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'tax_amount',
  },
  discountAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'discount_amount',
  },
  shippingCost: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'shipping_cost',
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  paymentTerms: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'payment_terms',
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'partially_paid', 'paid'),
    defaultValue: 'unpaid',
    field: 'payment_status',
  },
  paidAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'paid_amount',
  },
  expectedDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expected_delivery_date',
  },
  actualDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'actual_delivery_date',
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'created_by',
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'approved_by',
  },
  receivedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'received_by',
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  internalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'internal_notes',
  },
  attachments: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of file paths/URLs',
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'purchase_orders',
  underscored: true,
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['tenant_id', 'branch_id'],
    },
    {
      fields: ['po_number'],
      unique: true,
    },
    {
      fields: ['supplier_id'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['payment_status'],
    },
  ],
});

export default PurchaseOrder;
