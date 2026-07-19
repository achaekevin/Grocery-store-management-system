'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('report_templates', {
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
      type: {
        type: Sequelize.ENUM(
          'sales',
          'inventory',
          'financial',
          'customer',
          'supplier',
          'employee',
          'branch',
          'tax',
          'custom'
        ),
        allowNull: false,
      },
      format: {
        type: Sequelize.ENUM('pdf', 'excel', 'csv', 'json'),
        defaultValue: 'pdf',
      },
      template_config: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Stores report structure, columns, filters, and formatting',
      },
      is_scheduled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      schedule_config: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Cron expression and recipients for scheduled reports',
      },
      is_system: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this is a system-provided template',
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

    await queryInterface.addIndex('report_templates', ['tenant_id', 'type']);
    await queryInterface.addIndex('report_templates', ['is_scheduled']);
    await queryInterface.addIndex('report_templates', ['is_system']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('report_templates');
  },
};
