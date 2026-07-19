import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Setting extends Model {
  static associate(models) {
    // Setting belongs to Business
    Setting.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });
  }
}

Setting.init(
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
      key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Setting key (e.g., tax_rate, currency)',
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Setting value (JSON or string)',
      },
      type: {
        type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
        defaultValue: 'string',
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'e.g., general, tax, email, notification',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_public',
        comment: 'Whether setting can be accessed without auth',
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
      modelName: 'Setting',
      tableName: 'settings',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['business_id', 'key'],
          name: 'unique_business_key',
        },
        {
          fields: ['category'],
        },
      ],
    }
  );

export default Setting;
