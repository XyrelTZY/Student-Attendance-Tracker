import sequelize from '../database/db'

async function testDbConnection() {
  try {
    // Authenticate the connection
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testDbConnection();
