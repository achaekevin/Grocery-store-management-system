'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('receipt_templates', {
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
      header: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      footer: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      logo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      show_qr_code: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      show_barcode: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      paper_size: {
        type: Sequelize.ENUM('58mm', '80mm', 'A4', 'letter'),
        defaultValue: '80mm',
      },
      font_size: {
        type: Sequelize.ENUM('small', 'medium', 'large'),
        defaultValue: 'medium',
      },
      template_config: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Layout, styles, and field visibility configuration',
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

    await queryInterface.addIndex('receipt_templates', ['tenant_id']);
    await queryInterface.addIndex('receipt_templates', ['is_default']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('receipt_templates');
  },
};
