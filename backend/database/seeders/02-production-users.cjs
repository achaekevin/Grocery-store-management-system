'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, clear existing demo users
    await queryInterface.bulkDelete('users', {
      email: 'john@demo.groceryos.co.ke'
    }, {});

    // Get the tenant ID
    const [tenants] = await queryInterface.sequelize.query(
      `SELECT id FROM tenants LIMIT 1;`
    );
    const tenantId = tenants[0]?.id;

    if (!tenantId) {
      console.log('No tenant found. Please run 01-demo-data seeder first.');
      return;
    }

    // Get role IDs
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE tenant_id = ?;`,
      { replacements: [tenantId] }
    );
    
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.name] = role.id;
    });

    // Hash passwords
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Create users from CREDENTIALS.txt
    const users = [
      {
        id: uuidv4(),
        tenant_id: tenantId,
        role_id: roleMap['Admin'] || Object.values(roleMap)[0],
        first_name: 'Super',
        last_name: 'Admin',
        email: 'admin@groceryos.com',
        password: await hashPassword('Admin@123'),
        phone: '+254700000001',
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        tenant_id: tenantId,
        role_id: roleMap['Manager'] || Object.values(roleMap)[1] || Object.values(roleMap)[0],
        first_name: 'Branch',
        last_name: 'Manager',
        email: 'manager@groceryos.com',
        password: await hashPassword('Manager@123'),
        phone: '+254700000002',
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        tenant_id: tenantId,
        role_id: roleMap['Cashier'] || Object.values(roleMap)[2] || Object.values(roleMap)[0],
        first_name: 'John',
        last_name: 'Cashier',
        email: 'cashier@groceryos.com',
        password: await hashPassword('Cashier@123'),
        phone: '+254700000003',
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        tenant_id: tenantId,
        role_id: roleMap['Inventory'] || Object.values(roleMap)[3] || Object.values(roleMap)[0],
        first_name: 'Mary',
        last_name: 'Inventory',
        email: 'inventory@groceryos.com',
        password: await hashPassword('Inventory@123'),
        phone: '+254700000004',
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        tenant_id: tenantId,
        role_id: roleMap['Accountant'] || Object.values(roleMap)[4] || Object.values(roleMap)[0],
        first_name: 'James',
        last_name: 'Accountant',
        email: 'accountant@groceryos.com',
        password: await hashPassword('Accountant@123'),
        phone: '+254700000005',
        is_active: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
    
    console.log('✅ Production users created successfully!');
    console.log('Login credentials:');
    console.log('  - admin@groceryos.com / Admin@123');
    console.log('  - manager@groceryos.com / Manager@123');
    console.log('  - cashier@groceryos.com / Cashier@123');
    console.log('  - inventory@groceryos.com / Inventory@123');
    console.log('  - accountant@groceryos.com / Accountant@123');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'admin@groceryos.com',
          'manager@groceryos.com',
          'cashier@groceryos.com',
          'inventory@groceryos.com',
          'accountant@groceryos.com'
        ]
      }
    }, {});
  }
};
