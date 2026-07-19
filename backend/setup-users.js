import db from './src/models/index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const setup = async () => {
  try {
    await db.testConnection();
    await db.initModels();

    console.log('✅ Connected to database');

    // Create tenant if doesn't exist
    let tenant = await db.sequelize.query(
      'SELECT id, name FROM tenants LIMIT 1',
      { type: db.Sequelize.QueryTypes.SELECT }
    );

    if (!tenant || tenant.length === 0) {
      const tenantId = uuidv4();
      await db.sequelize.query(
        `INSERT INTO tenants (id, name, email, phone, created_at, updated_at)
         VALUES (?, 'Demo Grocery Store', 'demo@groceryos.com', '+254712345678', NOW(), NOW())`,
        { replacements: [tenantId] }
      );
      tenant = [{ id: tenantId, name: 'Demo Grocery Store' }];
      console.log('✅ Created tenant');
    } else {
      console.log(`✅ Found tenant: ${tenant[0].name}`);
    }

    const tenantId = tenant[0].id;

    // Create roles
    const roleNames = ['Admin', 'Manager', 'Cashier', 'Inventory', 'Accountant'];
    const roleIds = {};

    for (const roleName of roleNames) {
      const roleId = uuidv4();
      roleIds[roleName] = roleId;
      
      await db.sequelize.query(
        `INSERT IGNORE INTO roles (id, tenant_id, name, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE id=id`,
        { replacements: [roleId, tenantId, roleName, `${roleName} role`] }
      );
    }
    
    console.log(`✅ Created/verified roles`);

    // Get actual role IDs
    const roles = await db.sequelize.query(
      `SELECT id, name FROM roles WHERE tenant_id = ?`,
      { replacements: [tenantId], type: db.Sequelize.QueryTypes.SELECT }
    );

    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.name] = role.id;
    });

    console.log('Roles:', roleMap);

    // Delete old users
    await db.sequelize.query(
      `DELETE FROM users WHERE email IN ('john@demo.groceryos.co.ke', 'admin@groceryos.com', 'manager@groceryos.com', 'cashier@groceryos.com', 'inventory@groceryos.com', 'accountant@groceryos.com')`
    );
    console.log('✅ Cleared old users');

    // Hash password
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Create users
    const users = [
      {
        first_name: 'Super',
        last_name: 'Admin',
        email: 'admin@groceryos.com',
        password: 'Admin@123',
        role: 'Admin'
      },
      {
        first_name: 'Branch',
        last_name: 'Manager',
        email: 'manager@groceryos.com',
        password: 'Manager@123',
        role: 'Manager'
      },
      {
        first_name: 'John',
        last_name: 'Cashier',
        email: 'cashier@groceryos.com',
        password: 'Cashier@123',
        role: 'Cashier'
      },
      {
        first_name: 'Mary',
        last_name: 'Inventory',
        email: 'inventory@groceryos.com',
        password: 'Inventory@123',
        role: 'Inventory'
      },
      {
        first_name: 'James',
        last_name: 'Accountant',
        email: 'accountant@groceryos.com',
        password: 'Accountant@123',
        role: 'Accountant'
      }
    ];

    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      const roleId = roleMap[user.role] || roles[0].id;
      
      await db.sequelize.query(
        `INSERT INTO users (id, tenant_id, role_id, first_name, last_name, email, phone, password, is_active, email_verified_at, created_at, updated_at)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW(), NOW())`,
        {
          replacements: [
            tenantId,
            roleId,
            user.first_name,
            user.last_name,
            user.email,
            `+25470000000${users.indexOf(user) + 1}`,
            hashedPassword
          ]
        }
      );
      console.log(`✅ Created user: ${user.email}`);
    }

    console.log('\n✅ All users created successfully!');
    console.log('\nLogin credentials from CREDENTIALS.txt:');
    console.log('  - admin@groceryos.com / Admin@123');
    console.log('  - manager@groceryos.com / Manager@123');
    console.log('  - cashier@groceryos.com / Cashier@123');
    console.log('  - inventory@groceryos.com / Inventory@123');
    console.log('  - accountant@groceryos.com / Accountant@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

setup();
