'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_loyalty', {
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
      customer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      program_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'loyalty_programs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      points_balance: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      lifetime_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      tier: {
        type: Sequelize.STRING(50),
        defaultValue: 'bronze',
      },
      tier_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      last_activity_at: {
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

    await queryInterface.addIndex('customer_loyalty', ['tenant_id', 'customer_id']);
    await queryInterface.addIndex('customer_loyalty', ['program_id']);
    await queryInterface.addIndex('customer_loyalty', ['tier']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_loyalty');
  },
};
