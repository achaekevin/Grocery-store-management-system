import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const HeldTransaction = sequelize.define('HeldTransaction', {
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
  cashierId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'cashier_id',
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'customer_id',
  },
  transactionData: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'transaction_data',
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
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  heldAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'held_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at',
  },
  resumedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'resumed_at',
  },
  status: {
    type: DataTypes.ENUM('held', 'resumed', 'cancelled', 'expired'),
    defaultValue: 'held',
  },
}, {
  tableName: 'held_transactions',
  underscored: true,
  timestamps: true,
  paranoid: false,
});

export default HeldTransaction;
