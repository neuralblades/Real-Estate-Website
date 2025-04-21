'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the column exists
      const tableInfo = await queryInterface.describeTable('Properties');
      
      if (!tableInfo.paymentPlan) {
        // Add the column
        await queryInterface.addColumn('Properties', 'paymentPlan', {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Check if the column exists before removing
      const tableInfo = await queryInterface.describeTable('Properties');
      
      if (tableInfo.paymentPlan) {
        await queryInterface.removeColumn('Properties', 'paymentPlan');
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  }
};
