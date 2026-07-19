import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Branch extends Model {
  static associate(models) {
    // Branch belongs to Business
    Branch.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    // Branch has many users
    Branch.hasMany(models.User, {
      foreignKey: 'branchId',
      as: 'users',
    });

    // Branch has many products
    Branch.hasMany(models.Product, {
      foreignKey: 'branchId',
      as: 'products',
    });

    // Branch has many sales
    Branch.hasMany(models.Sale, {
      foreignKey: 'branchId',
      as: 'sales',
    });

    // Branch has one manager (User)
    Branch.belongsTo(models.User, {
      foreignKey: 'managerId',
      as: 'manager',
    });
  }
}

Branch.init(
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
        validate: {
          notEmpty: true,
        },
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      region: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      postalCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'postal_code',
      },
      managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'manager_id',
        references: {
          model: 'users',
          key: 'id',
        },
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
      modelName: 'Branch',
      tableName: 'branches',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          fields: ['business_id'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['manager_id'],
        },
        {
          unique: true,
          fields: ['code'],
        },
      ],
    }
  );

export default Branch;
