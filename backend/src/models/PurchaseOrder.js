import { Model, DataTypes } from 'sequelize';

class PurchaseOrder extends Model {
  static associate(models) {
    // PurchaseOrder belongs to Business
    PurchaseOrder.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    // PurchaseOrder belongs to Branch
    PurchaseOrder.belongsTo(models.Branch, {
      foreignKey: 'branchId',
      as: 'branch',
    });

    // PurchaseOrder belongs to Supplier
    PurchaseOrder.belongsTo(models.Supplier, {
      foreignKey: 'supplierId',
      as: 'supplier',
    });

    // PurchaseOrder belongs to User (created by)
    PurchaseOrder.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });

    // PurchaseOrder has many PurchaseItems
    PurchaseOrder.hasMany(models.PurchaseItem, {
      foreignKey: 'purchaseOrderId',
      as: 'items',
    });
  }
}

export default (sequelize) => {
  PurchaseOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'business_id',
        references: {
          model: 'businesses',
          key: 'id',
        },
      },
      branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'branch_id',
        references: {
          model: 'branches',
          key: 'id',
        },
      },
      supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'supplier_id',
        references: {
          model: 'suppliers',
          key: 'id',
        },
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'created_by',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      orderNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'order_number',
      },
      orderDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'order_date',
      },
      expectedDeliveryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'expected_delivery_date',
      },
      actualDeliveryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'actual_delivery_date',
      },
      subtotal: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      tax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      discount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      shippingCost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'shipping_cost',
      },
      total: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      amountPaid: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'amount_paid',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'ordered', 'partially_received', 'received', 'cancelled'),
        defaultValue: 'pending',
      },
      paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'partial', 'paid'),
        defaultValue: 'unpaid',
        field: 'payment_status',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      modelName: 'PurchaseOrder',
      tableName: 'purchase_orders',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['order_number'],
        },
        {
          fields: ['business_id'],
        },
        {
          fields: ['branch_id'],
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
        {
          fields: ['order_date'],
        },
      ],
    }
  );

  return PurchaseOrder;
};
