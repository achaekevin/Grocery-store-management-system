import sequelize from '../config/sequelize.js';

const checkUsersAndTenants = async () => {
  const [users] = await sequelize.query("SELECT id, first_name, email, role_id, tenant_id FROM users");
  console.log('All Users:', users);

  const [tenants] = await sequelize.query("SELECT id, name FROM tenants");
  console.log('All Tenants:', tenants);

  const [suppliers] = await sequelize.query("SELECT id, name, tenant_id FROM suppliers");
  console.log('All Suppliers in DB:', suppliers);

  process.exit(0);
};

checkUsersAndTenants();
