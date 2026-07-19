import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Role extends Model {
  static associate(models) {
    // Role has many users
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users',
    });

    // Role belongs to many Permissions
    Role.belongsToMany(models.Permission, {
      through: 'role_permissions',
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions',
    });
  }
}

export default (sequelize) => {
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isIn: [['Super Admin', 'Branch Manager', 'Cashier', 'Inventory Clerk', 'Accountant']],
        },
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isSystem: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_system',
        comment: 'System roles cannot be deleted',
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
      modelName: 'Role',
      tableName: 'roles',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['name'],
        },
        {
          unique: true,
          fields: ['slug'],
        },
      ],
    }
  );

  return Role;
};


