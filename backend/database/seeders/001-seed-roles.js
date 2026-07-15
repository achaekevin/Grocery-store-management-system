export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Super Admin',
        description: 'Full system access - business owner',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Branch Manager',
        description: 'Branch management and operations',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Cashier',
        description: 'POS operations and sales',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Inventory Clerk',
        description: 'Inventory and stock management',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Accountant',
        description: 'Financial reports and expenses',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
