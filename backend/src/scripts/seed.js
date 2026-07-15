import db from '../models/index.js';
import logger from '../config/logger.js';

/**
 * Seed initial system data
 */
const seedDatabase = async () => {
  try {
    logger.info('Starting database seed...');

    // Test connection
    await db.testConnection();

    // Initialize models
    await db.initModels();

    // Sync database
    await db.sequelize.sync({ force: false });

    // Seed Roles
    logger.info('Seeding roles...');
    const roles = await db.Role.bulkCreate([
      {
        name: 'Super Admin',
        description: 'Full system access - business owner',
        isSystem: true,
      },
      {
        name: 'Branch Manager',
        description: 'Branch management and operations',
        isSystem: true,
      },
      {
        name: 'Cashier',
        description: 'POS operations and sales',
        isSystem: true,
      },
      {
        name: 'Inventory Clerk',
        description: 'Inventory and stock management',
        isSystem: true,
      },
      {
        name: 'Accountant',
        description: 'Financial reports and expenses',
        isSystem: true,
      },
    ]);

    logger.info(`Created ${roles.length} roles`);

    // Seed Permissions
    logger.info('Seeding permissions...');
    const permissions = [];

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

    modules.forEach((module) => {
      actions.forEach((action) => {
        permissions.push({
          module,
          action,
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${module}`,
        });
      });
    });

    // Add special permissions
    permissions.push(
      { module: 'sales', action: 'refund', description: 'Refund sales' },
      { module: 'inventory', action: 'transfer', description: 'Transfer inventory' },
      { module: 'inventory', action: 'stock-take', description: 'Perform stock take' },
      { module: 'customers', action: 'loyalty', description: 'Manage loyalty points' },
      { module: 'payments', action: 'mpesa', description: 'Process M-Pesa payments' },
      { module: 'reports', action: 'export', description: 'Export reports' }
    );

    const createdPermissions = await db.Permission.bulkCreate(permissions);
    logger.info(`Created ${createdPermissions.length} permissions`);

    // Assign all permissions to Super Admin
    logger.info('Assigning permissions to roles...');
    const superAdmin = roles[0];
    const allPermissionIds = createdPermissions.map((p) => p.id);

    const rolePermissions = allPermissionIds.map((permId) => ({
      roleId: superAdmin.id,
      permissionId: permId,
    }));

    await db.RolePermission.bulkCreate(rolePermissions);
    logger.info(`Assigned ${rolePermissions.length} permissions to Super Admin`);

    logger.info('Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Database seed failed:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
