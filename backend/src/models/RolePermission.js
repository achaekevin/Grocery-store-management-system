import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class RolePermission extends Model {
  static associate(models) {
    // RolePermission belongs to Role
    RolePermission.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    // RolePermission belongs to Permission
    RolePermission.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });
  }
}

RolePermission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'permission_id',
        references: {
          model: 'permissions',
          key: 'id',
        },
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
      modelName: 'RolePermission',
      tableName: 'role_permissions',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['role_id', 'permission_id'],
          name: 'unique_role_permission',
        },
        {
          fields: ['role_id'],
        },
        {
          fields: ['permission_id'],
        },
      ],
    }
  );

export default RolePermission;
