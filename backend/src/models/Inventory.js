import { Model, DataTypes } from 'sequelize';

class Inventory extends Model {
  static associate(models) {
    // Inventory belongs to Branch
    Inventory.belongsTo(models.Branch, {
      foreignKey: 'branchId',
      as: 'branch',
    });

    // Inventory belongs to Product
    Inventory.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });

    // Inventory has many InventoryMovements
    Inventory.hasMany(models.InventoryMovement, {
      foreignKey: 'inventoryId',
      as: 'movements',
    });
  }
}

export default (sequelize) => {
  Inventory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        defaultValue: 0.00,
        validate: {
          min: 0,
        },
      },
      reorderLevel: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 10.00,
        field: 'reorder_level',
      },
      reorderQuantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'reorder_quantity',
        comment: 'Quantity to order when stock reaches reorder level',
      },
      lastRestockedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_restocked_at',
      },
      lastStockCheckAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_stock_check_at',
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
      modelName: 'Inventory',
      tableName: 'inventory',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['branch_id', 'product_id'],
          name: 'unique_branch_product',
        },
        {
          fields: ['branch_id'],
        },
        {
          fields: ['product_id'],
        },
        {
          fields: ['quantity'],
        },
      ],
    }
  );

  return Inventory;
};
