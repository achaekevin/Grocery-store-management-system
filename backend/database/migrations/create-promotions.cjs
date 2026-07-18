'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('promotions', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      promotion_type: {
        type: Sequelize.ENUM(
          'percentage_discount',
          'fixed_discount',
          'buy_x_get_y',
          'bundle',
          'free_shipping',
          'loyalty_bonus'
        ),
        allowNull: false,
      },
      discount_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      conditions: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Minimum purchase, specific products, categories, etc.',
      },
      applicable_to: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Products, categories, or branches this promotion applies to',
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
      },
      usage_limit: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Maximum number of times this promotion can be used',
      },
      usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Higher priority promotions are applied first',
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

    await queryInterface.addIndex('promotions', ['tenant_id']);
    await queryInterface.addIndex('promotions', ['code']);
    await queryInterface.addIndex('promotions', ['is_active']);
    await queryInterface.addIndex('promotions', ['start_date', 'end_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('promotions');
  },
};
