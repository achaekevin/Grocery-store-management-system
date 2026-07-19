'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('system_settings', {
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
      category: {
        type: Sequelize.ENUM(
          'general',
          'business',
          'tax',
          'currency',
          'notification',
          'email',
          'receipt',
          'invoice',
          'theme',
          'security',
          'integration',
          'backup'
        ),
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      value: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      data_type: {
        type: Sequelize.ENUM('string', 'number', 'boolean', 'json', 'array'),
        defaultValue: 'string',
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this setting can be accessed by clients',
      },
      is_encrypted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      description: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('system_settings', ['tenant_id', 'category']);
    await queryInterface.addIndex('system_settings', ['tenant_id', 'key'], {
      unique: true,
    });
    await queryInterface.addIndex('system_settings', ['is_public']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('system_settings');
  },
};
