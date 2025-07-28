const pool = require('../database');

async function getVehicleById(invId) {
  const result = await pool.query(
    'SELECT * FROM public.inventory WHERE inv_id = $1',
    [invId]
  );
  return result.rows[0];
}

async function addClassification(classification_name) {
  const sql = `
    INSERT INTO classification (classification_name)
    VALUES ($1)
    RETURNING *;
  `;
  const result = await pool.query(sql, [classification_name]);
  return result.rows[0];
}

async function addInventory(data) {
  const sql = `
    INSERT INTO inventory (
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `;
  const values = [
    data.inv_make,
    data.inv_model,
    data.inv_year,
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    data.inv_price,
    data.inv_miles,
    data.inv_color,
    data.classification_id
  ];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

module.exports = {
  getVehicleById,
  addClassification,
  addInventory
};
