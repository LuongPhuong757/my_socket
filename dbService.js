require('dotenv').config();
const mysql = require('mysql2/promise');

exports.getDbConnection = async () => {
  try {
    const config = {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    };
    return await mysql.createConnection(config);
  } catch (error) {
    console.log(
      '🚀 ~ file: dbService.js ~ line 15 ~ exports.getDbConnection= ~ error',
      error
    );
  }
};
