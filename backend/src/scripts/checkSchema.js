import sequelize from '../config/sequelize.js';

const checkTableColumns = async () => {
  try {
    const [supplierCols] = await sequelize.query("DESCRIBE suppliers");
    console.log('Suppliers table columns:', supplierCols.map(c => c.Field));

    const [customerCols] = await sequelize.query("DESCRIBE customers");
    console.log('Customers table columns:', customerCols.map(c => c.Field));

    process.exit(0);
  } catch (error) {
    console.error('Error describing tables:', error.message);
    process.exit(1);
  }
};

checkTableColumns();
