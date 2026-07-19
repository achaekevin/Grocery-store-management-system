'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loyalty_transactions', {
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
      customer_loyalty_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'customer_loyalty',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      transaction_type: {
        type: Sequelize.ENUM('earned', 'redeemed', 'expired', 'adjusted', 'bonus'),
        allowNull: false,
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Positive for earned, negative for redeemed',
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('loyalty_transactions', ['tenant_id']);
    await queryInterface.addIndex('loyalty_transactions', ['customer_loyalty_id']);
    await queryInterface.addIndex('loyalty_transactions', ['order_id']);
    await queryInterface.addIndex('loyalty_transactions', ['transaction_type']);
    await queryInterface.addIndex('loyalty_transactions', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loyalty_transactions');
  },
};
