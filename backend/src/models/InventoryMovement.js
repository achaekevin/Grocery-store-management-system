import { Model, DataTypes } from 'sequelize';

class InventoryMovement extends Model {
  static associate(models) {
    // InventoryMovement belongs to Inventory
    InventoryMovement.belongsTo(models.Inventory, {
      foreignKey: 'inventoryId',
      as: 'inventory',
    });

    // InventoryMovement belongs to Product
    InventoryMovement.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });

    // InventoryMovement belongs to Branch
    InventoryMovement.belongsTo(models.Branch, {
      foreignKey: 'branchId',
      as: 'branch',
    });

    // InventoryMovement belongs to User
    InventoryMovement.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export default (sequelize) => {
  InventoryMovement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inventoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'inventory_id',
        references: {
          model: 'inventory',
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
      branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'branch_id',
        references: {
          model: 'branches',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM(
          'stock_in',
          'stock_out',
          'sale',
          'return',
          'adjustment',
          'damage',
          'expired',
          'transfer_in',
          'transfer_out'
        ),
        allowNull: false,
      },
      quantityBefore: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'quantity_before',
      },
      quantityChanged: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'quantity_changed',
        comment: 'Can be positive or negative',
      },
      quantityAfter: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'quantity_after',
      },
      referenceType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'reference_type',
        comment: 'e.g., Sale, PurchaseOrder, Adjustment',
      },
      referenceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'reference_id',
        comment: 'ID of the referenced record',
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Reason for movement',
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
      modelName: 'InventoryMovement',
      tableName: 'inventory_movements',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['inventory_id'],
        },
        {
          fields: ['product_id'],
        },
        {
          fields: ['branch_id'],
        },
        {
          fields: ['user_id'],
        },
        {
          fields: ['type'],
        },
        {
          fields: ['reference_type', 'reference_id'],
        },
        {
          fields: ['created_at'],
        },
      ],
    }
  );

  return InventoryMovement;
};
