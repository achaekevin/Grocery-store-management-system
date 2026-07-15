import db from '../models/index.js';
import logger from '../config/logger.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Interactive setup script
 */
const setup = async () => {
  try {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║   🚀 GroceryOS Backend Setup                         ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    // Test database connection
    logger.info('Testing database connection...');
    await db.testConnection();
    logger.info('✓ Database connected successfully');

    // Ask if user wants to sync database
    const syncDb = await question('Do you want to sync database schema? (yes/no): ');

    if (syncDb.toLowerCase() === 'yes') {
      logger.info('Initializing models...');
      await db.initModels();
      logger.info('✓ Models initialized');

      logger.info('Syncing database...');
      await db.sequelize.sync({ force: false, alter: true });
      logger.info('✓ Database synced');
    }

    // Ask if user wants to seed data
    const seedData = await question('Do you want to seed initial data (roles, permissions)? (yes/no): ');

    if (seedData.toLowerCase() === 'yes') {
      logger.info('Seeding roles...');
      await db.Role.bulkCreate([
        {
          name: 'Super Admin',
          description: 'Full system access',
          isSystem: true,
        },
        {
          name: 'Branch Manager',
          description: 'Branch management',
          isSystem: true,
        },
        {
          name: 'Cashier',
          description: 'POS operations',
          isSystem: true,
        },
        {
          name: 'Inventory Clerk',
          description: 'Inventory management',
          isSystem: true,
        },
        {
          name: 'Accountant',
          description: 'Financial reports',
          isSystem: true,
        },
      ], { ignoreDuplicates: true });
      logger.info('✓ Roles seeded');

      logger.info('Seeding permissions...');
      const permissions = [];
      const modules = ['products', 'sales', 'inventory', 'customers', 'suppliers', 
                       'purchases', 'expenses', 'branches', 'users', 'reports', 'settings', 'payments'];
      const actions = ['create', 'read', 'update', 'delete'];

      modules.forEach((module) => {
        actions.forEach((action) => {
          permissions.push({ module, action, description: `${action} ${module}` });
        });
      });

      permissions.push(
        { module: 'sales', action: 'refund', description: 'Refund sales' },
        { module: 'inventory', action: 'transfer', description: 'Transfer inventory' },
        { module: 'customers', action: 'loyalty', description: 'Manage loyalty' },
        { module: 'payments', action: 'mpesa', description: 'M-Pesa payments' },
        { module: 'reports', action: 'export', description: 'Export reports' }
      );

      await db.Permission.bulkCreate(permissions, { ignoreDuplicates: true });
      logger.info('✓ Permissions seeded');

      // Assign all permissions to Super Admin
      const superAdmin = await db.Role.findOne({ where: { name: 'Super Admin' } });
      const allPerms = await db.Permission.findAll();
      
      const rolePerms = allPerms.map(p => ({
        roleId: superAdmin.id,
        permissionId: p.id,
      }));

      await db.RolePermission.bulkCreate(rolePerms, { ignoreDuplicates: true });
      logger.info('✓ Permissions assigned to Super Admin');
    }

    console.log('\n✅ Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Register your first business at: POST /api/v1/auth/register');
    console.log('3. Start using the API!\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    logger.error('Setup failed:', error);
    rl.close();
    process.exit(1);
  }
};

// Run setup
setup();
