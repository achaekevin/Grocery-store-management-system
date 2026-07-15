export default {
  up: async (queryInterface, Sequelize) => {
    // Note: businessId will need to be set dynamically
    // This is a template for demo categories
    const categories = [
      { name: 'Beverages', description: 'Drinks and beverages' },
      { name: 'Dairy Products', description: 'Milk, cheese, yogurt' },
      { name: 'Bakery', description: 'Bread, cakes, pastries' },
      { name: 'Meat & Seafood', description: 'Fresh and frozen meat' },
      { name: 'Fruits & Vegetables', description: 'Fresh produce' },
      { name: 'Canned Goods', description: 'Canned and preserved foods' },
      { name: 'Snacks', description: 'Chips, cookies, candy' },
      { name: 'Household Items', description: 'Cleaning supplies, toiletries' },
      { name: 'Personal Care', description: 'Health and beauty products' },
      { name: 'Baby Products', description: 'Diapers, baby food, formula' },
    ];

    // These would be inserted when a business registers
    // For now, this is a template
    console.log('Category seeder template created. Categories will be added per business.');
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete('categories', null, {});
  },
};
