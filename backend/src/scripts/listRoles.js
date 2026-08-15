import sequelize from '../config/sequelize.js';

const listRoles = async () => {
  const [roles] = await sequelize.query("SELECT id, name FROM roles");
  console.log('Available Roles:', roles);
  process.exit(0);
};

listRoles();
