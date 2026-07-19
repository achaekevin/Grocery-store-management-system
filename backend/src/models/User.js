import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import bcrypt from 'bcryptjs';

// User model for authentication and authorization
class User extends Model {
  static associate(models) {
    // User belongs to Tenant (Business)
    User.belongsTo(models.Business, {
      foreignKey: 'tenantId',
      as: 'business',
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
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'role_id',
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      twoFactorSecret: {
        type: DataTypes.STRING,
        field: 'two_factor_secret',
      },
      twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'two_factor_enabled',
      },
      emailVerifiedAt: {
        type: DataTypes.DATE,
        field: 'email_verified_at',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        field: 'last_login_at',
      },
      lastLoginIp: {
        type: DataTypes.STRING,
        field: 'last_login_ip',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      preferences: {
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
          fields: ['tenant_id', 'email'],
        },
        {
          fields: ['tenant_id', 'role_id'],
        },
        {
          fields: ['is_active'],
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
