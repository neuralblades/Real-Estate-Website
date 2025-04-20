'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // First, check if the category column exists and has the correct type
      const tableInfo = await queryInterface.describeTable('Properties');
      
      if (tableInfo.category) {
        // Update any properties with category 'offplan' to have the correct values
        await queryInterface.sequelize.query(`
          UPDATE "Properties"
          SET 
            category = CASE 
              WHEN status = 'for-rent' THEN 'rent'
              ELSE 'buy'
            END,
            "isOffplan" = true
          WHERE category = 'offplan'
        `);
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // No down migration needed as this is a data correction
  }
};
