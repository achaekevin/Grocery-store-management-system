'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('offline_queue', {
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
      branch_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'branches',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      action_type: {
        type: Sequelize.ENUM(
          'create_order',
          'update_inventory',
          'create_customer',
          'update_product',
          'record_payment',
          'other'
        ),
        allowNull: false,
      },
      payload: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'The data to be synchronized',
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed'),
        defaultValue: 'pending',
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      last_attempt_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      synced_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('offline_queue', ['tenant_id', 'status']);
    await queryInterface.addIndex('offline_queue', ['branch_id']);
    await queryInterface.addIndex('offline_queue', ['action_type']);
    await queryInterface.addIndex('offline_queue', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('offline_queue');
  },
};
