const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

async function initDb() {
  try {
    // Create a Sequelize instance without database name
    const sequelize = new Sequelize(
      'postgres',
      config.username,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: 'postgres',
        logging: console.log,
      }
    );

    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');

    // Create database if it doesn't exist
    try {
      await sequelize.query(`CREATE DATABASE ${config.database};`);
      console.log(`Database ${config.database} created successfully`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`Database ${config.database} already exists`);
      } else {
        throw error;
      }
    }

    // Close connection
    await sequelize.close();
    console.log('PostgreSQL database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    console.log('\nMake sure PostgreSQL is running and accessible with the provided credentials.');
    console.log('You can install PostgreSQL from: https://www.postgresql.org/download/');
    console.log('\nOr use a cloud-hosted PostgreSQL service like:');
    console.log('- ElephantSQL (https://www.elephantsql.com/) - Free tier available');
    console.log('- Supabase (https://supabase.com/) - Free tier available');
    console.log('- Render (https://render.com/) - Free tier available');
    console.log('- Railway (https://railway.app/) - Free tier available');
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  initDb();
}

module.exports = initDb;
