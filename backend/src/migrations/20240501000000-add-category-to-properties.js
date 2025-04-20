'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists
    const tableInfo = await queryInterface.describeTable('Properties');

    if (!tableInfo.category) {
      // Create the ENUM type first
      await queryInterface.sequelize.query(
        `CREATE TYPE "enum_Properties_category" AS ENUM ('buy', 'rent')`
      );

      // Add the column
      await queryInterface.addColumn('Properties', 'category', {
        type: Sequelize.ENUM('buy', 'rent'),
        allowNull: false,
        defaultValue: 'buy',
      });
    }

    // Update existing properties based on their status
    await queryInterface.sequelize.query(`
      UPDATE "Properties"
      SET category = CASE
        WHEN status = 'for-rent' THEN 'rent'
        WHEN status = 'rented' THEN 'rent'
        ELSE 'buy'
      END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Properties', 'category');
  }
};
