import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Product extends Model {
  static associate(models) {
    // Product belongs to Branch
    Product.belongsTo(models.Branch, {
      foreignKey: 'branchId',
      as: 'branch',
    });

    // Product belongs to Category
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });

    // Product belongs to Brand
    Product.belongsTo(models.Brand, {
      foreignKey: 'brandId',
      as: 'brand',
    });

    // Product belongs to Unit
    Product.belongsTo(models.Unit, {
      foreignKey: 'unitId',
      as: 'unit',
    });

    // Product has many inventory movements
    Product.hasMany(models.InventoryMovement, {
      foreignKey: 'productId',
      as: 'movements',
    });

    // Product has many sale items
    Product.hasMany(models.SaleItem, {
      foreignKey: 'productId',
      as: 'saleItems',
    });
  }
}

Product.init(
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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'category_id',
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      brandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'brand_id',
        references: {
          model: 'brands',
          key: 'id',
        },
      },
      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'unit_id',
        references: {
          model: 'units',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      barcode: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      costPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'cost_price',
        validate: {
          min: 0,
        },
      },
      sellingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'selling_price',
        validate: {
          min: 0,
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      reorderLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        field: 'reorder_level',
        validate: {
          min: 0,
        },
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expiry_date',
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      taxable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'discontinued'),
        defaultValue: 'active',
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
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['sku'],
        },
        {
          unique: true,
          fields: ['barcode'],
          where: {
            barcode: {
              [sequelize.Sequelize.Op.ne]: null,
            },
          },
        },
        {
          fields: ['branch_id'],
        },
        {
          fields: ['category_id'],
        },
        {
          fields: ['brand_id'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['name'],
        },
      ],
    }
  );

export default Product;
