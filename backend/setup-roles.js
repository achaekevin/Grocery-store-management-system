import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function setupRoles() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'groceryos_db',
  });

  try {
    console.log('🔍 Checking current roles...\n');

    // Get tenant ID
    const [tenants] = await connection.execute(
      'SELECT id FROM tenants LIMIT 1'
    );
    const tenantId = tenants[0].id;

    // Check existing roles
    const [existingRoles] = await connection.execute(
      'SELECT id, name, slug FROM roles WHERE tenant_id = ?',
      [tenantId]
    );

    console.log('Current roles:');
    existingRoles.forEach((role) => {
      console.log(`  - ${role.name} (${role.slug})`);
    });

    // Define the 5 roles we need
    const rolesToCreate = [
      { name: 'Super Admin', slug: 'super-admin', description: 'Full system access and user management' },
      { name: 'Manager', slug: 'manager', description: 'Branch management and reporting' },
      { name: 'Cashier', slug: 'cashier', description: 'POS and sales operations' },
      { name: 'Inventory Clerk', slug: 'inventory-clerk', description: 'Stock and inventory management' },
      { name: 'Accountant', slug: 'accountant', description: 'Financial reports and expense management' },
    ];

    console.log('\n📝 Creating/Updating roles...\n');

    const roleIds = {};

    for (const role of rolesToCreate) {
      // Check if role exists
      const existing = existingRoles.find(r => r.slug === role.slug);

      if (existing) {
        // Update existing role
        await connection.execute(
          'UPDATE roles SET name = ?, description = ? WHERE id = ?',
          [role.name, role.description, existing.id]
        );
        roleIds[role.slug] = existing.id;
        console.log(`✅ Updated: ${role.name}`);
      } else {
        // Create new role
        const [result] = await connection.execute(
          `INSERT INTO roles (id, tenant_id, name, slug, description, is_system, created_at, updated_at) 
           VALUES (UUID(), ?, ?, ?, ?, false, NOW(), NOW())`,
          [tenantId, role.name, role.slug, role.description]
        );
        
        // Get the created role ID
        const [newRole] = await connection.execute(
          'SELECT id FROM roles WHERE slug = ? AND tenant_id = ?',
          [role.slug, tenantId]
        );
        roleIds[role.slug] = newRole[0].id;
        console.log(`✅ Created: ${role.name}`);
      }
    }

    console.log('\n👥 Assigning roles to users...\n');

    // Assign roles to specific users
    const userRoleMap = [
      { email: 'admin@groceryos.com', roleSlug: 'super-admin' },
      { email: 'manager@groceryos.com', roleSlug: 'manager' },
      { email: 'cashier@groceryos.com', roleSlug: 'cashier' },
      { email: 'inventory@groceryos.com', roleSlug: 'inventory-clerk' },
      { email: 'accountant@groceryos.com', roleSlug: 'accountant' },
    ];

    for (const mapping of userRoleMap) {
      await connection.execute(
        'UPDATE users SET role_id = ? WHERE email = ?',
        [roleIds[mapping.roleSlug], mapping.email]
      );
      console.log(`✅ ${mapping.email} → ${mapping.roleSlug}`);
    }

    console.log('\n✅ Verifying role assignments...\n');

    const [users] = await connection.execute(
      `SELECT u.email, u.first_name, u.last_name, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email IN (?, ?, ?, ?, ?)`,
      [
        'admin@groceryos.com',
        'manager@groceryos.com',
        'cashier@groceryos.com',
        'inventory@groceryos.com',
        'accountant@groceryos.com',
      ]
    );

    console.log('User Role Assignments:');
    users.forEach((user) => {
      console.log(`  ${user.first_name} ${user.last_name} (${user.email}) → ${user.role_name}`);
    });

    console.log('\n🎉 Role setup completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

setupRoles();
