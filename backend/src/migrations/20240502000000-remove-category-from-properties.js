'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the column exists
      const tableInfo = await queryInterface.describeTable('Properties');
      
      if (tableInfo.category) {
        // Remove the column
        await queryInterface.removeColumn('Properties', 'category');
        
        // Drop the ENUM type
        await queryInterface.sequelize.query(
          `DROP TYPE IF EXISTS "enum_Properties_category"`
        );
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      const tableInfo = await queryInterface.describeTable('Properties');
      
      if (!tableInfo.category) {
        // Create the ENUM type first
        await queryInterface.sequelize.query(
          `CREATE TYPE "enum_Properties_category" AS ENUM ('buy', 'rent')`
        );

        // Add the column back
        await queryInterface.addColumn('Properties', 'category', {
          type: Sequelize.ENUM('buy', 'rent'),
          allowNull: false,
          defaultValue: 'buy',
        });

        // Update existing properties based on their status
        await queryInterface.sequelize.query(`
          UPDATE "Properties"
          SET category = CASE
            WHEN status = 'for-rent' THEN 'rent'
            WHEN status = 'rented' THEN 'rent'
            ELSE 'buy'
          END
        `);
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  }
};
