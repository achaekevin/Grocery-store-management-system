import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SearchHistory = sequelize.define('SearchHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'tenant_id',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  query: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  searchType: {
    type: DataTypes.ENUM(
      'product',
      'customer',
      'supplier',
      'user',
      'order',
      'branch',
      'category',
      'transaction',
      'all'
    ),
    defaultValue: 'all',
    field: 'search_type',
  },
  resultCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'result_count',
  },
  clickedResultId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'clicked_result_id',
  },
  clickedResultType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'clicked_result_type',
  },
  filters: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'search_history',
  underscored: true,
  timestamps: true,
  paranoid: false,
});

export default SearchHistory;
