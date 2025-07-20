const pool = require('../database/');

async function getVehicleById(invId) {
  const result = await pool.query(
    'SELECT * FROM public.inventory WHERE inv_id = $1',
    [invId]
  );
  return result.rows[0];
}

module.exports = { getVehicleById };
