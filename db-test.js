const pool = require('./database');

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful! Current time:', result.rows[0].now);
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    pool.end();
  }
}

testConnection();
