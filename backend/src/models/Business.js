import { Model, DataTypes } from 'sequelize';

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

export default (sequelize) => {
  Business.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 255],
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      taxId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'tax_id',
      },
      currency: {
        type: DataTypes.STRING(10),
        defaultValue: 'KSh',
      },
      status: {
        type: DataTypes.ENUM('active', 'suspended', 'inactive'),
        defaultValue: 'active',
      },
      subscriptionPlan: {
        type: DataTypes.ENUM('free', 'basic', 'premium', 'enterprise'),
        defaultValue: 'free',
        field: 'subscription_plan',
      },
      subscriptionExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'subscription_expires_at',
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_verified',
      },
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'verified_at',
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
      modelName: 'Business',
      tableName: 'businesses',
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

  return Business;
};
