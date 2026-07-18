import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const UserPreference = sequelize.define('UserPreference', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'user_id',
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark', 'system'),
    defaultValue: 'system',
  },
  accentColor: {
    type: DataTypes.STRING(7),
    defaultValue: '#3B82F6',
    field: 'accent_color',
  },
  fontSize: {
    type: DataTypes.ENUM('small', 'medium', 'large'),
    defaultValue: 'medium',
    field: 'font_size',
  },
  compactMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'compact_mode',
  },
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'en',
  },
  timezone: {
    type: DataTypes.STRING(50),
    defaultValue: 'UTC',
  },
  dateFormat: {
    type: DataTypes.STRING(50),
    defaultValue: 'YYYY-MM-DD',
    field: 'date_format',
  },
  timeFormat: {
    type: DataTypes.ENUM('12h', '24h'),
    defaultValue: '24h',
    field: 'time_format',
  },
  currencyFormat: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD',
    field: 'currency_format',
  },
  notificationsEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notifications_enabled',
  },
  notificationSound: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'notification_sound',
  },
  emailNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'email_notifications',
  },
  defaultDashboard: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'default_dashboard',
  },
  sidebarCollapsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'sidebar_collapsed',
  },
  itemsPerPage: {
    type: DataTypes.INTEGER,
    defaultValue: 25,
    field: 'items_per_page',
  },
  preferences: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'user_preferences',
  underscored: true,
  timestamps: true,
  paranoid: false,
});

export default UserPreference;
