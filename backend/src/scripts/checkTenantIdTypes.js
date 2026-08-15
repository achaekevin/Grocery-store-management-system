import sequelize from '../config/sequelize.js';

const checkTenantIdTypes = async () => {
  const [supplierCols] = await sequelize.query("SHOW COLUMNS FROM suppliers WHERE Field = 'tenant_id'");
  console.log('suppliers.tenant_id details:', supplierCols[0]);

  const [customerCols] = await sequelize.query("SHOW COLUMNS FROM customers WHERE Field = 'tenant_id'");
  console.log('customers.tenant_id details:', customerCols[0]);

  process.exit(0);
};

checkTenantIdTypes();
