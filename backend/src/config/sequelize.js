import { Sequelize } from 'sequelize';
import config from './index.js';
import logger from './logger.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = {
  host: config.database.host,
  port: config.database.port,
  dialect: config.database.dialect,
  logging: env === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: config.database.poolMax || 5,
    min: config.database.poolMin || 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft deletes
  },
};

// Add SSL for production if needed
if (env === 'production' && config.database.ssl) {
  dbConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  dbConfig
);

// Test connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    return false;
  }
};

export default sequelize;
