import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Customer extends Model {
  static associate(models) {
    Customer.belongsTo(models.Business, {
      foreignKey: 'tenantId',
      as: 'business',
    });

    Customer.hasMany(models.Sale, {
      foreignKey: 'customerId',
      as: 'sales',
    });
  }

  // Virtual getter for full name
  get name() {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim() || 'Customer';
  }
}

Customer.init(
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
    },
    customerCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'customer_code',
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'last_name',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'email',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'phone',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'address',
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'city',
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'postal_code',
    },
    loyaltyPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'loyalty_points',
    },
    membershipLevel: {
      type: DataTypes.STRING(50),
      defaultValue: 'Bronze',
      field: 'membership_level',
    },
    totalPurchases: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      field: 'total_purchases',
    },
    totalOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_orders',
    },
    outstandingBalance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      field: 'outstanding_balance',
    },
    creditLimit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      field: 'credit_limit',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notes',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
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
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Customer;
