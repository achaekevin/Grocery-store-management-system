import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Permission extends Model {
  static associate(models) {
    // Permission belongs to many Roles
    Permission.belongsToMany(models.Role, {
      through: 'role_permissions',
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'roles',
    });
  }
}

Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      module: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Module name (e.g., products, sales, customers)',
      },
      action: {
        type: DataTypes.ENUM('create', 'read', 'update', 'delete'),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        comment: 'Permission name (e.g., products.create)',
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
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'permissions',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['name'],
        },
        {
          fields: ['module'],
        },
        {
          fields: ['action'],
        },
      ],
    }
  );

export default Permission;
