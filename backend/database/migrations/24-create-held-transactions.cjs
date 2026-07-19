'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('held_transactions', {
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
        allowNull: false,
        references: {
          model: 'branches',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cashier_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      customer_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      transaction_data: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Complete transaction state including items, discounts, etc.',
      },
      subtotal: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      tax_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      held_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      resumed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('held', 'resumed', 'cancelled', 'expired'),
        defaultValue: 'held',
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

    await queryInterface.addIndex('held_transactions', ['tenant_id', 'branch_id']);
    await queryInterface.addIndex('held_transactions', ['cashier_id']);
    await queryInterface.addIndex('held_transactions', ['status']);
    await queryInterface.addIndex('held_transactions', ['held_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('held_transactions');
  },
};
