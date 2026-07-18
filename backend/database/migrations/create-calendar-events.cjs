'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calendar_events', {
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
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      event_type: {
        type: Sequelize.ENUM(
          'delivery',
          'expiry',
          'meeting',
          'promotion',
          'shift',
          'maintenance',
          'inventory_check',
          'other'
        ),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      all_day: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      attendees: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Array of user IDs',
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'scheduled',
      },
      reminder: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Reminder configuration',
      },
      related_entity_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      related_entity_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
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

    await queryInterface.addIndex('calendar_events', ['tenant_id', 'event_type']);
    await queryInterface.addIndex('calendar_events', ['branch_id']);
    await queryInterface.addIndex('calendar_events', ['start_date', 'end_date']);
    await queryInterface.addIndex('calendar_events', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('calendar_events');
  },
};
