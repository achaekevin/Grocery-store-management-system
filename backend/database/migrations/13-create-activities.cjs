'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activities', {
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
        allowNull: false,
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
        onDelete: 'SET NULL',
      },
      type: {
        type: Sequelize.ENUM(
          'user_login',
          'user_logout',
          'product_added',
          'product_updated',
          'product_deleted',
          'sale_completed',
          'order_created',
          'order_updated',
          'stock_transferred',
          'branch_created',
          'customer_registered',
          'supplier_added',
          'payment_received',
          'inventory_adjusted',
          'user_created',
          'settings_changed'
        ),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.STRING,
      },
      entity_id: {
        type: Sequelize.UUID,
      },
      changes: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      metadata: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
      ip_address: {
        type: Sequelize.STRING,
      },
      user_agent: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('activities', ['tenant_id']);
    await queryInterface.addIndex('activities', ['user_id']);
    await queryInterface.addIndex('activities', ['branch_id']);
    await queryInterface.addIndex('activities', ['type']);
    await queryInterface.addIndex('activities', ['entity_type', 'entity_id']);
    await queryInterface.addIndex('activities', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activities');
  },
};
