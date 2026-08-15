import sequelize from '../config/sequelize.js';

const checkIdTypes = async () => {
  const [supplierCols] = await sequelize.query("SHOW COLUMNS FROM suppliers WHERE Field = 'id'");
  console.log('suppliers.id details:', supplierCols[0]);

  const [customerCols] = await sequelize.query("SHOW COLUMNS FROM customers WHERE Field = 'id'");
  console.log('customers.id details:', customerCols[0]);

  process.exit(0);
};

checkIdTypes();
