import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class LoyaltyTransaction extends Model {
  static associate(models) {
    // LoyaltyTransaction belongs to Customer
    LoyaltyTransaction.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });

    // LoyaltyTransaction belongs to Branch
    LoyaltyTransaction.belongsTo(models.Branch, {
      foreignKey: 'branchId',
      as: 'branch',
    });

    // LoyaltyTransaction belongs to Sale (optional)
    LoyaltyTransaction.belongsTo(models.Sale, {
      foreignKey: 'saleId',
      as: 'sale',
    });
  }
}

export default (sequelize) => {
  LoyaltyTransaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'customer_id',
        references: {
          model: 'customers',
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
      saleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'sale_id',
        references: {
          model: 'sales',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM('earned', 'redeemed', 'expired', 'adjustment'),
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Positive for earned, negative for redeemed',
      },
      pointsBefore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'points_before',
      },
      pointsAfter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'points_after',
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expires_at',
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
      modelName: 'LoyaltyTransaction',
      tableName: 'loyalty_transactions',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['customer_id'],
        },
        {
          fields: ['branch_id'],
        },
        {
          fields: ['sale_id'],
        },
        {
          fields: ['type'],
        },
        {
          fields: ['created_at'],
        },
      ],
    }
  );

  return LoyaltyTransaction;
};


