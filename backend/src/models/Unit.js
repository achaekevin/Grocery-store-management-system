import { Model, DataTypes } from 'sequelize';

class Unit extends Model {
  static associate(models) {
    Unit.hasMany(models.Product, {
      foreignKey: 'unitId',
      as: 'products',
    });
  }
}

export default (sequelize) => {
  Unit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      abbreviation: {
        type: DataTypes.STRING(10),
        allowNull: false,
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
      modelName: 'Unit',
      tableName: 'units',
      timestamps: true,
      underscored: true,
    }
  );

  return Unit;
};
