'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists
    const tableInfo = await queryInterface.describeTable('Properties');

    if (!tableInfo.headerImage) {
      // Add the column
      await queryInterface.addColumn('Properties', 'headerImage', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Check if the column exists before removing
    const tableInfo = await queryInterface.describeTable('Properties');
    
    if (tableInfo.headerImage) {
      await queryInterface.removeColumn('Properties', 'headerImage');
    }
  }
};
