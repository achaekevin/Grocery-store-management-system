import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Customer extends Model {
  static associate(models) {
    Customer.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    Customer.hasMany(models.Sale, {
      foreignKey: 'customerId',
      as: 'sales',
    });

    Customer.hasMany(models.LoyaltyTransaction, {
      foreignKey: 'customerId',
      as: 'loyaltyTransactions',
    });
  }
}

Customer.init(
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
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      loyaltyPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'loyalty_points',
      },
      tier: {
        type: DataTypes.ENUM('Bronze', 'Silver', 'Gold', 'Platinum'),
        defaultValue: 'Bronze',
      },
      totalPurchases: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        field: 'total_purchases',
      },
      creditBalance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        field: 'credit_balance',
        comment: 'Amount owed by customer',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
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
      modelName: 'Customer',
      tableName: 'customers',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          fields: ['business_id'],
        },
        {
          fields: ['phone'],
        },
        {
          fields: ['email'],
        },
        {
          fields: ['tier'],
        },
      ],
    }
  );

export default Customer;
