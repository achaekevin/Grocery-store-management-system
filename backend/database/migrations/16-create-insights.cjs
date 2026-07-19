'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('insights', {
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
      type: {
        type: Sequelize.ENUM(
          'stock_out_prediction',
          'best_selling_category',
          'slow_moving_inventory',
          'sales_forecast',
          'profit_forecast',
          'reorder_recommendation',
          'pricing_suggestion',
          'seasonal_trend',
          'customer_behavior',
          'supplier_performance'
        ),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'medium',
      },
      confidence: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      impact: {
        type: Sequelize.ENUM('positive', 'negative', 'neutral'),
        defaultValue: 'neutral',
      },
      recommendation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      data: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      actionable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      action_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      dismissed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      dismissed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      metadata: {
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('insights', ['tenant_id']);
    await queryInterface.addIndex('insights', ['type']);
    await queryInterface.addIndex('insights', ['priority']);
    await queryInterface.addIndex('insights', ['dismissed']);
    await queryInterface.addIndex('insights', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('insights');
  },
};
