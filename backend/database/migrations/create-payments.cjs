'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
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
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'card', 'mpesa', 'bank_transfer'),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      reference_number: {
        type: Sequelize.STRING,
      },
      mpesa_receipt: {
        type: Sequelize.STRING,
      },
      mpesa_phone: {
        type: Sequelize.STRING,
      },
      card_last_four: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'cancelled'),
        defaultValue: 'completed',
      },
      notes: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('payments', ['tenant_id']);
    await queryInterface.addIndex('payments', ['order_id']);
    await queryInterface.addIndex('payments', ['payment_method']);
    await queryInterface.addIndex('payments', ['status']);
    await queryInterface.addIndex('payments', ['reference_number']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  },
};
