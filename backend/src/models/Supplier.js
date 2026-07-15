import { Model, DataTypes } from 'sequelize';

class Supplier extends Model {
  static associate(models) {
    // Supplier belongs to Business
    Supplier.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    // Supplier has many PurchaseOrders
    Supplier.hasMany(models.PurchaseOrder, {
      foreignKey: 'supplierId',
      as: 'purchaseOrders',
    });
  }
}

export default (sequelize) => {
  Supplier.init(
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
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'Kenya',
      },
      taxId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'tax_id',
      },
      balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
          min: 0,
        },
      },
      creditLimit: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        field: 'credit_limit',
        defaultValue: 0.00,
      },
      paymentTerms: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'payment_terms',
        comment: 'e.g., Net 30, Net 60, COD',
      },
      contactPerson: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'contact_person',
      },
      notes: {
        type: DataTypes.TEXT,
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
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      modelName: 'Supplier',
      tableName: 'suppliers',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          fields: ['business_id'],
        },
        {
          fields: ['phone'],
        },
        {
          fields: ['email'],
        },
        {
          fields: ['status'],
        },
      ],
    }
  );

  return Supplier;
};
