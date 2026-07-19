'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_preferences', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      theme: {
        type: Sequelize.ENUM('light', 'dark', 'system'),
        defaultValue: 'system',
      },
      accent_color: {
        type: Sequelize.STRING(7),
        defaultValue: '#3B82F6',
      },
      font_size: {
        type: Sequelize.ENUM('small', 'medium', 'large'),
        defaultValue: 'medium',
      },
      compact_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      language: {
        type: Sequelize.STRING(10),
        defaultValue: 'en',
      },
      timezone: {
        type: Sequelize.STRING(50),
        defaultValue: 'UTC',
      },
      date_format: {
        type: Sequelize.STRING(50),
        defaultValue: 'YYYY-MM-DD',
      },
      time_format: {
        type: Sequelize.ENUM('12h', '24h'),
        defaultValue: '24h',
      },
      currency_format: {
        type: Sequelize.STRING(10),
        defaultValue: 'USD',
      },
      notifications_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      notification_sound: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      email_notifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      default_dashboard: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      sidebar_collapsed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      items_per_page: {
        type: Sequelize.INTEGER,
        defaultValue: 25,
      },
      preferences: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional custom preferences',
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

    await queryInterface.addIndex('user_preferences', ['user_id']);
    await queryInterface.addIndex('user_preferences', ['theme']);
    await queryInterface.addIndex('user_preferences', ['language']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_preferences');
  },
};
