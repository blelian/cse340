// models/inventoryModel.js
const pool = require('../database');

// Get all inventory items for a specific classification
async function getInventoryByClassificationId(classificationId) {
  const sql = `
    SELECT inv.*, cls.classification_name
    FROM inventory inv
    JOIN classification cls ON inv.classification_id = cls.classification_id
    WHERE inv.classification_id = $1
    ORDER BY inv.inv_make, inv.inv_model;
  `;
  const result = await pool.query(sql, [classificationId]);
  return result.rows;
}

// Get all inventory items
async function getAllInventory() {
  const sql = `
    SELECT inv.*, cls.classification_name
    FROM inventory inv
    JOIN classification cls ON inv.classification_id = cls.classification_id
    ORDER BY inv.inv_make, inv.inv_model;
  `;
  const result = await pool.query(sql);
  return result.rows;
}

// Get all classifications
async function getClassifications() {
  const sql = "SELECT * FROM classification ORDER BY classification_name";
  const result = await pool.query(sql);
  return result.rows;
}

// Add a new classification
async function addClassification(classification_name) {
  const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
  const result = await pool.query(sql, [classification_name]);
  return result.rows[0];
}

// Add a new inventory item
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  const sql = `
    INSERT INTO inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

// Get inventory item by ID
async function getInventoryById(inv_id) {
  const sql = `
    SELECT *
    FROM inventory
    WHERE inv_id = $1
  `;
  const result = await pool.query(sql, [inv_id]);
  return result.rows[0];
}

// Update an inventory item by ID
async function updateInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id) {
  const sql = `
    UPDATE inventory
    SET
      inv_make = $1,
      inv_model = $2,
      inv_year = $3,
      inv_description = $4,
      inv_image = $5,
      inv_thumbnail = $6,
      inv_price = $7,
      inv_miles = $8,
      inv_color = $9,
      classification_id = $10
    WHERE inv_id = $11
    RETURNING *;
  `;
  const values = [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id];
  const result = await pool.query(sql, values);
  return result.rows[0];
}

// Delete an inventory item by ID
async function deleteInventory(inv_id) {
  const sql = `
    DELETE FROM inventory
    WHERE inv_id = $1
    RETURNING *;
  `;
  const result = await pool.query(sql, [inv_id]);
  return result.rows[0];
}

module.exports = {
  getInventoryByClassificationId,
  getAllInventory,
  getClassifications,
  addClassification,
  addInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
