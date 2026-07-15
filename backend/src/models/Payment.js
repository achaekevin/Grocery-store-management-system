import { Model, DataTypes } from 'sequelize';

class Payment extends Model {
  static associate(models) {
    // Payment belongs to Sale
    Payment.belongsTo(models.Sale, {
      foreignKey: 'saleId',
      as: 'sale',
    });

    // Payment belongs to Branch
    Payment.belongsTo(models.Branch, {
      foreignKey: 'branchId',
      as: 'branch',
    });

    // Payment belongs to User (cashier)
    Payment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export default (sequelize) => {
  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      saleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sale_id',
        references: {
          model: 'sales',
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
      paymentMethod: {
        type: DataTypes.ENUM('cash', 'mpesa', 'card', 'bank_transfer', 'credit'),
        allowNull: false,
        field: 'payment_method',
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      reference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Transaction reference or receipt number',
      },
      mpesaReceiptNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'mpesa_receipt_number',
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'phone_number',
        comment: 'M-Pesa phone number',
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
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
      modelName: 'Payment',
      tableName: 'payments',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['sale_id'],
        },
        {
          fields: ['branch_id'],
        },
        {
          fields: ['user_id'],
        },
        {
          fields: ['payment_method'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['mpesa_receipt_number'],
        },
        {
          fields: ['created_at'],
        },
      ],
    }
  );

  return Payment;
};
