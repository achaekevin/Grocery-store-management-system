export default {
  up: async (queryInterface, Sequelize) => {
    // Super Admin - All permissions
    const allPermissions = await queryInterface.sequelize.query(
      'SELECT id FROM permissions',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const superAdminPermissions = allPermissions.map((perm) => ({
      role_id: 1, // Super Admin
      permission_id: perm.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Branch Manager - Most permissions except user management
    const branchManagerModules = [
      'products',
      'sales',
      'inventory',
      'customers',
      'suppliers',
      'purchases',
      'expenses',
      'reports',
      'payments',
    ];

    const branchManagerPerms = await queryInterface.sequelize.query(
      `SELECT id FROM permissions WHERE module IN (${branchManagerModules.map(() => '?').join(',')})`,
      {
        replacements: branchManagerModules,
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const branchManagerPermissions = branchManagerPerms.map((perm) => ({
      role_id: 2, // Branch Manager
      permission_id: perm.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Cashier - Sales and customer management only
    const cashierPerms = await queryInterface.sequelize.query(
      `SELECT id FROM permissions WHERE (module = 'sales' OR module = 'customers' OR module = 'payments') AND action IN ('create', 'read')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const cashierPermissions = cashierPerms.map((perm) => ({
      role_id: 3, // Cashier
      permission_id: perm.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Inventory Clerk - Inventory and products
    const inventoryPerms = await queryInterface.sequelize.query(
      `SELECT id FROM permissions WHERE module IN ('inventory', 'products', 'suppliers')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const inventoryPermissions = inventoryPerms.map((perm) => ({
      role_id: 4, // Inventory Clerk
      permission_id: perm.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Accountant - Reports and expenses
    const accountantPerms = await queryInterface.sequelize.query(
      `SELECT id FROM permissions WHERE module IN ('reports', 'expenses', 'sales') AND action = 'read'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const accountantPermissions = accountantPerms.map((perm) => ({
      role_id: 5, // Accountant
      permission_id: perm.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert all role-permission mappings
    await queryInterface.bulkInsert('role_permissions', [
      ...superAdminPermissions,
      ...branchManagerPermissions,
      ...cashierPermissions,
      ...inventoryPermissions,
      ...accountantPermissions,
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};
