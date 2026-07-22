import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Branch extends Model {
  static associate(models) {
    // Branch belongs to Tenant
    Branch.belongsTo(models.Tenant, {
      foreignKey: 'tenantId',
      as: 'tenant',
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

    // Branch has many inventory items
    Branch.hasMany(models.Inventory, {
      foreignKey: 'branchId',
      as: 'inventory',
    });

    // Branch has many users
    Branch.hasMany(models.User, {
      foreignKey: 'branchId',
      as: 'users',
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
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'tenant_id',
        references: {
          model: 'tenants',
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
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
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
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      postalCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'postal_code',
      },
      managerId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'manager_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      openingTime: {
        type: DataTypes.TIME,
        allowNull: true,
        field: 'opening_time',
      },
      closingTime: {
        type: DataTypes.TIME,
        allowNull: true,
        field: 'closing_time',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      settings: {
        type: DataTypes.JSON,
        defaultValue: {},
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
          unique: true,
          fields: ['tenant_id', 'code'],
        },
        {
          fields: ['manager_id'],
        },
        {
          fields: ['is_active'],
        },
      ],
    }
  );

export default Branch;
