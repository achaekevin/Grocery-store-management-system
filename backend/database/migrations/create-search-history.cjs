'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('search_history', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      entity_type: {
        type: Sequelize.ENUM(
          'products',
          'customers',
          'suppliers',
          'users',
          'orders',
          'branches',
          'categories',
          'transactions'
        ),
        allowNull: true,
      },
      results_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      filters: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('search_history', ['user_id', 'created_at']);
    await queryInterface.addIndex('search_history', ['query']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('search_history');
  },
};
