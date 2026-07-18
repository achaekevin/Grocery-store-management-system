'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loyalty_programs', {
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
      points_per_currency: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1.0,
        comment: 'Points earned per currency unit spent',
      },
      currency_per_point: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 0.01,
        comment: 'Currency value of one point',
      },
      min_points_redemption: {
        type: Sequelize.INTEGER,
        defaultValue: 100,
      },
      membership_tiers: {
        type: Sequelize.JSONB,
        allowNull: false,
        comment: 'Array of tier configurations (bronze, silver, gold, etc.)',
      },
      benefits: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Benefits per tier',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('loyalty_programs', ['tenant_id']);
    await queryInterface.addIndex('loyalty_programs', ['is_active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loyalty_programs');
  },
};
