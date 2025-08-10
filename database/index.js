// database/index.js
const { Pool } = require('pg');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

// Enable SSL for production and test environments
const useSSL = env === 'production' || env === 'test';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
