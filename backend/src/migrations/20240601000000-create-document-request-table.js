'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the table already exists
      const tables = await queryInterface.showAllTables();
      if (tables.includes('DocumentRequests')) {
        console.log('DocumentRequests table already exists, skipping creation');
        return;
      }

      // Create the DocumentRequests table
      await queryInterface.createTable('DocumentRequests', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: false
        },
        propertyId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Properties',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        propertyTitle: {
          type: Sequelize.STRING,
          allowNull: false
        },
        requestType: {
          type: Sequelize.ENUM('brochure', 'floorplan'),
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('pending', 'sent', 'completed'),
          defaultValue: 'pending'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });

      console.log('DocumentRequests table created successfully');
    } catch (error) {
      console.error('Error creating DocumentRequests table:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Drop the table
      await queryInterface.dropTable('DocumentRequests');
      
      // Drop the ENUM types
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_DocumentRequests_requestType"`
      );
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_DocumentRequests_status"`
      );
    } catch (error) {
      console.error('Error dropping DocumentRequests table:', error);
      throw error;
    }
  }
};
