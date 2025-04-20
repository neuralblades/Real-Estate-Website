'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists
    const tableInfo = await queryInterface.describeTable('Properties');
    
    if (!tableInfo.isOffplan) {
      // Column doesn't exist, so add it
      await queryInterface.addColumn('Properties', 'isOffplan', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    // Update existing properties - set isOffplan to true for properties with category 'offplan'
    await queryInterface.sequelize.query(`
      UPDATE "Properties" 
      SET "isOffplan" = CASE 
        WHEN category = 'offplan' THEN true
        ELSE false
      END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Properties');
    
    if (tableInfo.isOffplan) {
      await queryInterface.removeColumn('Properties', 'isOffplan');
    }
  }
};
