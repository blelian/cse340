// models/userModel.js
const pool = require("../database");

// Get all users (for admin management)
async function getAllUsers() {
  const sql = `
    SELECT account_id, account_firstname, account_lastname, account_email, account_type
    FROM account
    ORDER BY account_lastname, account_firstname
  `;
  const result = await pool.query(sql);
  return result.rows;
}

// Get user by ID (optional, for editing)
async function getUserById(account_id) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname, account_email, account_type
    FROM account
    WHERE account_id = $1
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows[0];
}

// You can add more functions here: addUser, updateUser, deleteUser, etc.

module.exports = {
  getAllUsers,
  getUserById,
};
