// ---------------------------
// database/index.js
// ---------------------------
const { Pool } = require('pg');
require('dotenv').config();

const isLocal = process.env.NODE_ENV !== 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Use SSL only when NOT local (production)
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

module.exports = pool;
