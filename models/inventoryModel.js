// models/inventoryModel.js
const pool = require('../database');

// Get all classifications
async function getClassifications() {
  const result = await pool.query(
    'SELECT classification_id, classification_name FROM classification ORDER BY classification_name'
  );
  return result.rows;
}

// Get all classifications (for dropdowns)
async function getAllClassifications() {
  const result = await pool.query('SELECT * FROM classification ORDER BY classification_name');
  return result.rows;
}

// Get inventory by classificationId with JOIN (✅ fix included)
async function getInventoryByClassificationId(classificationId) {
  const sql = `
    SELECT 
      i.inv_id, i.inv_make, i.inv_model, i.inv_description, 
      i.inv_image, i.inv_thumbnail, i.inv_price, i.inv_year, 
      i.inv_miles, i.inv_color, i.classification_id, 
      c.classification_name
    FROM 
      inventory i
    JOIN 
      classification c ON i.classification_id = c.classification_id
    WHERE 
      i.classification_id = $1
    ORDER BY 
      i.inv_make, i.inv_model
  `;
  const result = await pool.query(sql, [classificationId]);
  return result.rows;
}

// Get single vehicle by ID
async function getVehicleById(invId) {
  const result = await pool.query(
    `SELECT * FROM inventory WHERE inv_id = $1`,
    [invId]
  );
  return result.rows[0];
}

// Add a new classification
async function addClassification(classification_name) {
  const sql = `
    INSERT INTO classification (classification_name)
    VALUES ($1)
    RETURNING *;
  `;
  const result = await pool.query(sql, [classification_name]);
  return result.rows[0];
}

// Add a new vehicle to inventory
async function addInventory(data) {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = data;

  const sql = `
    INSERT INTO inventory (
      inv_make, inv_model, inv_description, inv_image, 
      inv_thumbnail, inv_price, inv_year, inv_miles, 
      inv_color, classification_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `;

  const values = [
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  ];

  const result = await pool.query(sql, values);
  return result.rows[0];
}

module.exports = {
  getClassifications,
  getAllClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
};
