import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class MpesaTransaction extends Model {
  static associate(models) {
    // MpesaTransaction belongs to Business
    MpesaTransaction.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    // MpesaTransaction belongs to Branch
    MpesaTransaction.belongsTo(models.Branch, {
      foreignKey: 'branchId',
      as: 'branch',
    });
  }
}

MpesaTransaction.init(
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
        allowNull: true,
        field: 'branch_id',
        references: {
          model: 'branches',
          key: 'id',
        },
      },
      merchantRequestId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'merchant_request_id',
      },
      checkoutRequestId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        field: 'checkout_request_id',
      },
      mpesaReceiptNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'mpesa_receipt_number',
      },
      transactionType: {
        type: DataTypes.ENUM('STK_PUSH', 'C2B', 'B2C', 'B2B'),
        allowNull: false,
        field: 'transaction_type',
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'phone_number',
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      accountReference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'account_reference',
      },
      transactionDesc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'transaction_desc',
      },
      resultCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: 'result_code',
      },
      resultDesc: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'result_desc',
      },
      status: {
        type: DataTypes.ENUM('pending', 'success', 'failed', 'cancelled'),
        defaultValue: 'pending',
      },
      callbackData: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'callback_data',
        comment: 'Full callback JSON response',
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
      modelName: 'MpesaTransaction',
      tableName: 'mpesa_transactions',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['checkout_request_id'],
        },
        {
          fields: ['mpesa_receipt_number'],
        },
        {
          fields: ['business_id'],
        },
        {
          fields: ['branch_id'],
        },
        {
          fields: ['phone_number'],
        },
        {
          fields: ['status'],
        },
      ],
    }
  );

export default MpesaTransaction;
