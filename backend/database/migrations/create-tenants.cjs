'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tenants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
        defaultValue: 'Kenya',
      },
      postal_code: {
        type: Sequelize.STRING,
      },
      tax_id: {
        type: Sequelize.STRING,
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'KES',
      },
      timezone: {
        type: Sequelize.STRING,
        defaultValue: 'Africa/Nairobi',
      },
      subscription_plan: {
        type: Sequelize.ENUM('free', 'basic', 'professional', 'enterprise'),
        defaultValue: 'free',
      },
      subscription_status: {
        type: Sequelize.ENUM('active', 'trial', 'suspended', 'cancelled'),
        defaultValue: 'trial',
      },
      subscription_ends_at: {
        type: Sequelize.DATE,
      },
      settings: {
        type: Sequelize.JSON,
        defaultValue: {},
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

    await queryInterface.addIndex('tenants', ['slug']);
    await queryInterface.addIndex('tenants', ['email']);
    await queryInterface.addIndex('tenants', ['subscription_status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tenants');
  },
};
