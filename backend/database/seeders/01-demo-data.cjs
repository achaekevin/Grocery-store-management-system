'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // 1. CREATE BUSINESS (TENANT)
    const tenantId = uuidv4();
    await queryInterface.bulkInsert('tenants', [
      {
        id: tenantId,
        name: 'Demo Grocery Stores Ltd',
        slug: 'demo-grocery',
        email: 'admin@demo.groceryos.co.ke',
        phone: '+254700000000',
        address: 'Westlands, Nairobi',
        city: 'Nairobi',
        country: 'Kenya',
        tax_id: 'KRA-P051234567A',
        subscription_plan: 'professional',
        subscription_status: 'active',
        subscription_ends_at: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 2. CREATE ROLES
    const superAdminRoleId = uuidv4();
    await queryInterface.bulkInsert('roles', [
      {
        id: superAdminRoleId,
        tenant_id: tenantId,
        name: 'Super Admin',
        description: 'Full system access',
        created_at: now,
        updated_at: now,
      },
    ]);

    // 3. CREATE BRANCH
    const branchId = uuidv4();
    await queryInterface.bulkInsert('branches', [
      {
        id: branchId,
        tenant_id: tenantId,
        name: 'Main Branch',
        code: 'MAIN-01',
        phone: '+254700111000',
        email: 'main@demo.groceryos.co.ke',
        address: 'Westlands Shopping Centre',
        city: 'Nairobi',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 4. CREATE USER
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const userId = uuidv4();
    await queryInterface.bulkInsert('users', [
      {
        id: userId,
        tenant_id: tenantId,
        role_id: superAdminRoleId,
        first_name: 'John',
        last_name: 'Kariuki',
        email: 'john@demo.groceryos.co.ke',
        phone: '+254700000001',
        password: hashedPassword,
        is_active: true,
        email_verified_at: now,
        two_factor_enabled: false,
        created_at: now,
        updated_at: now,
      },
    ]);

    console.log('\n✅ Demo data seeded successfully!');
    console.log('📧 Login Email: john@demo.groceryos.co.ke');
    console.log('🔑 Password: Password123!\n');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('branches', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('tenants', null, {});
  },
};
