'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
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
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      branch_id: {
        type: Sequelize.UUID,
        references: {
          model: 'branches',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM(
          'low_stock',
          'new_order',
          'mpesa_payment',
          'failed_transaction',
          'expiring_product',
          'system_update',
          'user_action',
          'warning',
          'success',
          'error',
          'info'
        ),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'medium',
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      read_at: {
        type: Sequelize.DATE,
      },
      action_url: {
        type: Sequelize.STRING,
      },
      action_label: {
        type: Sequelize.STRING,
      },
      metadata: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('notifications', ['tenant_id', 'user_id']);
    await queryInterface.addIndex('notifications', ['type']);
    await queryInterface.addIndex('notifications', ['priority']);
    await queryInterface.addIndex('notifications', ['read']);
    await queryInterface.addIndex('notifications', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  },
};
