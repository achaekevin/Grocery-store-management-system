'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('analytics_data', {
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
      metric_type: {
        type: Sequelize.ENUM(
          'revenue',
          'sales',
          'orders',
          'customers',
          'inventory_value',
          'profit',
          'expenses',
          'payment_method',
          'product_performance',
          'category_performance'
        ),
        allowNull: false,
      },
      period: {
        type: Sequelize.ENUM('hourly', 'daily', 'weekly', 'monthly', 'yearly'),
        allowNull: false,
      },
      period_start: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      period_end: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      data: {
        type: Sequelize.JSON,
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

    await queryInterface.addIndex('analytics_data', ['tenant_id', 'metric_type', 'period']);
    await queryInterface.addIndex('analytics_data', ['branch_id']);
    await queryInterface.addIndex('analytics_data', ['period_start', 'period_end']);
    await queryInterface.addIndex('analytics_data', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('analytics_data');
  },
};
