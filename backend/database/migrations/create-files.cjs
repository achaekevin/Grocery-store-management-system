'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('files', {
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
      uploaded_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      original_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      file_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      file_url: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'File size in bytes',
      },
      file_type: {
        type: Sequelize.ENUM(
          'product_image',
          'logo',
          'receipt',
          'invoice',
          'report',
          'document',
          'avatar',
          'other'
        ),
        defaultValue: 'other',
      },
      related_entity_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Type of entity this file is related to (e.g., product, customer)',
      },
      related_entity_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'ID of the related entity',
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Additional file metadata (dimensions, duration, etc.)',
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

    await queryInterface.addIndex('files', ['tenant_id', 'file_type']);
    await queryInterface.addIndex('files', ['uploaded_by']);
    await queryInterface.addIndex('files', ['related_entity_type', 'related_entity_id']);
    await queryInterface.addIndex('files', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('files');
  },
};
