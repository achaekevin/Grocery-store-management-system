import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Notification extends Model {
  static associate(models) {
    // Notification belongs to User
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    // Notification belongs to Business
    Notification.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });
  }
}

export default (sequelize) => {
  Notification.init(
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
        comment: 'Null for broadcast notifications',
      },
      type: {
        type: DataTypes.ENUM(
          'info',
          'success',
          'warning',
          'error',
          'low_stock',
          'expiry_alert',
          'payment',
          'sale',
          'purchase'
        ),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL to navigate when clicked',
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read',
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'read_at',
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
      modelName: 'Notification',
      tableName: 'notifications',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['business_id'],
        },
        {
          fields: ['user_id'],
        },
        {
          fields: ['is_read'],
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

  return Notification;
};


