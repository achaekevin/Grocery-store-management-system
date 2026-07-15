import { Model, DataTypes } from 'sequelize';

class Expense extends Model {
  static associate(models) {
    // Expense belongs to Business
    Expense.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    // Expense belongs to Branch
    Expense.belongsTo(models.Branch, {
      foreignKey: 'branchId',
      as: 'branch',
    });

    // Expense belongs to ExpenseCategory
    Expense.belongsTo(models.ExpenseCategory, {
      foreignKey: 'categoryId',
      as: 'category',
    });

    // Expense belongs to User (created by)
    Expense.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
  }
}

export default (sequelize) => {
  Expense.init(
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
          model: 'expense_categories',
          key: 'id',
        },
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'created_by',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      expenseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'expense_number',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      expenseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'expense_date',
      },
      paymentMethod: {
        type: DataTypes.ENUM('cash', 'mpesa', 'card', 'bank_transfer', 'cheque'),
        allowNull: false,
        field: 'payment_method',
      },
      reference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Invoice number, receipt number, etc.',
      },
      receipt: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL or path to receipt image/document',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'paid', 'rejected'),
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
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      modelName: 'Expense',
      tableName: 'expenses',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['expense_number'],
        },
        {
          fields: ['business_id'],
        },
        {
          fields: ['branch_id'],
        },
        {
          fields: ['category_id'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['expense_date'],
        },
      ],
    }
  );

  return Expense;
};
