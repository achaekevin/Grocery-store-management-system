import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Sale extends Model {
  static associate(models) {
    Sale.belongsTo(models.Branch, {
      foreignKey: 'branchId',
      as: 'branch',
    });

    Sale.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'cashier',
    });

    Sale.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });

    Sale.hasMany(models.SaleItem, {
      foreignKey: 'saleId',
      as: 'items',
      onDelete: 'CASCADE',
    });

    Sale.hasMany(models.Payment, {
      foreignKey: 'saleId',
      as: 'payments',
      onDelete: 'CASCADE',
    });
  }
}

Sale.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      saleNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'sale_number',
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
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'customer_id',
        references: {
          model: 'customers',
          key: 'id',
        },
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        field: 'amount_paid',
      },
      change: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('completed', 'pending', 'cancelled', 'refunded', 'on_hold'),
        defaultValue: 'completed',
      },
      paymentMethod: {
        type: DataTypes.ENUM('cash', 'mpesa', 'card', 'bank_transfer', 'credit'),
        allowNull: true,
        field: 'payment_method',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'cancelled_at',
      },
      cancelledBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'cancelled_by',
      },
      refundedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'refunded_at',
      },
      refundedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'refunded_by',
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
      modelName: 'Sale',
      tableName: 'sales',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['sale_number'],
        },
        {
          fields: ['branch_id'],
        },
        {
          fields: ['user_id'],
        },
        {
          fields: ['customer_id'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['created_at'],
        },
      ],
    }
  );

export default Sale;
