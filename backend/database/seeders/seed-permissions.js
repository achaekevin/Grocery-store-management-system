export default {
  up: async (queryInterface, Sequelize) => {
    const permissions = [];

    // Module and actions
    const modules = [
      'products',
      'sales',
      'inventory',
      'customers',
      'suppliers',
      'purchases',
      'expenses',
      'branches',
      'users',
      'reports',
      'settings',
      'payments',
    ];

    const actions = ['create', 'read', 'update', 'delete'];

    // Generate CRUD permissions
    modules.forEach((module) => {
      actions.forEach((action) => {
        permissions.push({
          module,
          action,
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${module}`,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    });

    // Add special permissions
    const specialPermissions = [
      { module: 'sales', action: 'refund', description: 'Refund sales' },
      { module: 'inventory', action: 'transfer', description: 'Transfer inventory between branches' },
      { module: 'inventory', action: 'stock-take', description: 'Perform stock take' },
      { module: 'customers', action: 'loyalty', description: 'Manage loyalty points' },
      { module: 'payments', action: 'mpesa', description: 'Process M-Pesa payments' },
      { module: 'reports', action: 'export', description: 'Export reports' },
    ];

    specialPermissions.forEach((perm) => {
      permissions.push({
        ...perm,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    await queryInterface.bulkInsert('permissions', permissions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
