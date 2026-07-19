'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoice_templates', {
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
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      layout: {
        type: Sequelize.ENUM('classic', 'modern', 'minimal', 'professional'),
        defaultValue: 'professional',
      },
      primary_color: {
        type: Sequelize.STRING(7),
        defaultValue: '#000000',
      },
      secondary_color: {
        type: Sequelize.STRING(7),
        defaultValue: '#666666',
      },
      logo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      logo_position: {
        type: Sequelize.ENUM('left', 'center', 'right'),
        defaultValue: 'left',
      },
      show_payment_terms: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      payment_terms: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      show_notes: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      template_config: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Complete template configuration including sections and fields',
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

    await queryInterface.addIndex('invoice_templates', ['tenant_id']);
    await queryInterface.addIndex('invoice_templates', ['is_default']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoice_templates');
  },
};
