import sequelize from '../config/sequelize.js';

const listAllPermissions = async () => {
  const [perms] = await sequelize.query("SELECT id, name FROM permissions");
  console.log('All Permissions in DB:', perms);
  process.exit(0);
};

listAllPermissions();
