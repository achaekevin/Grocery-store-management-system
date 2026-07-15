export default {
  up: async (queryInterface, Sequelize) => {
    // Note: businessId will need to be set dynamically
    // This is a template for demo units
    const units = [
      { name: 'Piece', symbol: 'pc' },
      { name: 'Kilogram', symbol: 'kg' },
      { name: 'Gram', symbol: 'g' },
      { name: 'Liter', symbol: 'L' },
      { name: 'Milliliter', symbol: 'ml' },
      { name: 'Pack', symbol: 'pk' },
      { name: 'Box', symbol: 'box' },
      { name: 'Dozen', symbol: 'dz' },
      { name: 'Carton', symbol: 'ctn' },
      { name: 'Bag', symbol: 'bag' },
    ];

    // These would be inserted when a business registers
    console.log('Unit seeder template created. Units will be added per business.');
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete('units', null, {});
  },
};
