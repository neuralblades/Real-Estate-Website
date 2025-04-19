const { sequelize } = require('../models');
const initDb = require('./initDb');
const path = require('path');

async function setupDb() {
  try {
    // Initialize database
    await initDb();

    console.log('Syncing database models...');

    // Sync all models with force option to drop tables if they exist
    await sequelize.sync({ force: true });
    console.log('Database models synced successfully');

    // Run seeders
    console.log('Running seeders...');
    const seederPath = path.join(__dirname, '../seeders/20250419000000-demo-data.js');

    // Import and run the seeder directly
    const seeder = require(seederPath);
    await seeder.up(sequelize.getQueryInterface(), sequelize);

    console.log('Seeders executed successfully');
    console.log('Database setup completed');
    console.log('\nYou can now start the server with: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    console.log('\nMake sure PostgreSQL is running and accessible with the provided credentials.');
    console.log('You can install PostgreSQL from: https://www.postgresql.org/download/');
    process.exit(1);
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  setupDb();
}

module.exports = setupDb;
