'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tenants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      customer_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
      },
      city: {
        type: Sequelize.STRING,
      },
      postal_code: {
        type: Sequelize.STRING,
      },
      date_of_birth: {
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
      },
      loyalty_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      membership_level: {
        type: Sequelize.ENUM('bronze', 'silver', 'gold', 'platinum'),
        defaultValue: 'bronze',
      },
      total_purchases: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      total_orders: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      outstanding_balance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      credit_limit: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('customers', ['tenant_id', 'customer_code'], { unique: true });
    await queryInterface.addIndex('customers', ['tenant_id', 'phone']);
    await queryInterface.addIndex('customers', ['tenant_id', 'email']);
    await queryInterface.addIndex('customers', ['is_active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  },
};
