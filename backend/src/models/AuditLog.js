import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class AuditLog extends Model {
  static associate(models) {
    // AuditLog belongs to User
    AuditLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    // AuditLog belongs to Business
    AuditLog.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });
  }
}

AuditLog.init(
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'e.g., CREATE, UPDATE, DELETE, LOGIN, LOGOUT',
      },
      module: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'e.g., Product, Sale, User, Inventory',
      },
      recordId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'record_id',
        comment: 'ID of the affected record',
      },
      oldValues: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'old_values',
        comment: 'JSON of previous values',
      },
      newValues: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'new_values',
        comment: 'JSON of new values',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'user_agent',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
    },
    {
      sequelize,
      modelName: 'AuditLog',
      tableName: 'audit_logs',
      timestamps: false,
      underscored: true,
      indexes: [
        {
          fields: ['business_id'],
        },
        {
          fields: ['user_id'],
        },
        {
          fields: ['action'],
        },
        {
          fields: ['module'],
        },
        {
          fields: ['created_at'],
        },
      ],
    }
  );

export default AuditLog;
