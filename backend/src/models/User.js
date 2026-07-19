import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import bcrypt from 'bcryptjs';

class User extends Model {
  static associate(models) {
    // User belongs to Business
    User.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    // User belongs to Branch
    User.belongsTo(models.Branch, {
      foreignKey: 'branchId',
      as: 'branch',
    });

    // User belongs to Role
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    // User has many audit logs
    User.hasMany(models.AuditLog, {
      foreignKey: 'userId',
      as: 'auditLogs',
    });
  }

  // Instance method to check password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Method to get safe user object (without password)
  toSafeObject() {
    const { password, twoFactorSecret, ...safeUser } = this.get();
    return safeUser;
  }
}

User.init(
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
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'role_id',
        references: {
          model: 'roles',
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
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_email_verified',
      },
      emailVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'email_verified_at',
      },
      twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'two_factor_enabled',
      },
      twoFactorSecret: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'two_factor_secret',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at',
      },
      lastLoginIp: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'last_login_ip',
      },
      passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'password_changed_at',
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'refresh_token',
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
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
        {
          fields: ['business_id'],
        },
        {
          fields: ['branch_id'],
        },
        {
          fields: ['role_id'],
        },
        {
          fields: ['status'],
        },
      ],
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            user.passwordChangedAt = new Date();
          }
        },
      },
    }
  );

export default User;
