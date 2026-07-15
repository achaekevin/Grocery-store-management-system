import { Model, DataTypes } from 'sequelize';

class PurchaseItem extends Model {
  static associate(models) {
    // PurchaseItem belongs to PurchaseOrder
    PurchaseItem.belongsTo(models.PurchaseOrder, {
      foreignKey: 'purchaseOrderId',
      as: 'purchaseOrder',
    });

    // PurchaseItem belongs to Product
    PurchaseItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

export default (sequelize) => {
  PurchaseItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      purchaseOrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'purchase_order_id',
        references: {
          model: 'purchase_orders',
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id',
        references: {
          model: 'products',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      quantityReceived: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'quantity_received',
      },
      unitCost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'unit_cost',
        validate: {
          min: 0,
        },
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
      total: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      expiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'expiry_date',
      },
      batchNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'batch_number',
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
    },
    {
      sequelize,
      modelName: 'PurchaseItem',
      tableName: 'purchase_items',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['purchase_order_id'],
        },
        {
          fields: ['product_id'],
        },
      ],
    }
  );

  return PurchaseItem;
};
