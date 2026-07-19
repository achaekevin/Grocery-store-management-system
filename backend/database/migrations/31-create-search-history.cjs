'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('search_history', {
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
      query: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      search_type: {
        type: Sequelize.ENUM(
          'product',
          'customer',
          'supplier',
          'user',
          'order',
          'branch',
          'category',
          'transaction',
          'all'
        ),
        defaultValue: 'all',
      },
      result_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      clicked_result_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      clicked_result_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      filters: {
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

    await queryInterface.addIndex('search_history', ['tenant_id', 'user_id']);
    await queryInterface.addIndex('search_history', ['search_type']);
    await queryInterface.addIndex('search_history', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('search_history');
  },
};
