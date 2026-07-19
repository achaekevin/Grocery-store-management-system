import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Business extends Model {
  static associate(models) {
    // Business has many branches
    Business.hasMany(models.Branch, {
      foreignKey: 'businessId',
      as: 'branches',
      onDelete: 'CASCADE',
    });

    // Business has many users
    Business.hasMany(models.User, {
      foreignKey: 'businessId',
      as: 'users',
      onDelete: 'CASCADE',
    });

    // Business has one settings
    Business.hasOne(models.Setting, {
      foreignKey: 'businessId',
      as: 'settings',
      onDelete: 'CASCADE',
    });
  }
}

Business.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      logo: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.TEXT,
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
        defaultValue: 'Kenya',
      },
      postalCode: {
        type: DataTypes.STRING,
        field: 'postal_code',
      },
      taxId: {
        type: DataTypes.STRING,
        field: 'tax_id',
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'KES',
      },
      timezone: {
        type: DataTypes.STRING,
        defaultValue: 'Africa/Nairobi',
      },
      subscriptionPlan: {
        type: DataTypes.ENUM('free', 'basic', 'professional', 'enterprise'),
        defaultValue: 'free',
        field: 'subscription_plan',
      },
      subscriptionStatus: {
        type: DataTypes.ENUM('active', 'trial', 'suspended', 'cancelled'),
        defaultValue: 'trial',
        field: 'subscription_status',
      },
      subscriptionEndsAt: {
        type: DataTypes.DATE,
        field: 'subscription_ends_at',
      },
      settings: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
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
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      modelName: 'Business',
      tableName: 'tenants',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['subscription_plan'],
        },
      ],
    }
  );

export default Business;

