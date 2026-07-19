import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class ExpenseCategory extends Model {
  static associate(models) {
    // ExpenseCategory belongs to Business
    ExpenseCategory.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    // ExpenseCategory has many Expenses
    ExpenseCategory.hasMany(models.Expense, {
      foreignKey: 'categoryId',
      as: 'expenses',
    });
  }
}

ExpenseCategory.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    },
    {
      sequelize,
      modelName: 'ExpenseCategory',
      tableName: 'expense_categories',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['business_id'],
        },
      ],
    }
  );

export default ExpenseCategory;
