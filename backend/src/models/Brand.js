import { Model, DataTypes } from 'sequelize';

class Brand extends Model {
  static associate(models) {
    Brand.hasMany(models.Product, {
      foreignKey: 'brandId',
      as: 'products',
    });
  }
}

export default (sequelize) => {
  Brand.init(
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
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
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
      modelName: 'Brand',
      tableName: 'brands',
      timestamps: true,
      underscored: true,
    }
  );

  return Brand;
};
