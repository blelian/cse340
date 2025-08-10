// database/index.js
const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Use different connection strings for production and test/dev
const connectionString = isProduction
  ? process.env.DATABASE_URL
  : process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL; // fallback to DATABASE_URL if DATABASE_URL_LOCAL not set

const pool = new Pool({
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
