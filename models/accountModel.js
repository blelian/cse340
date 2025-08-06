// models/accountModel.js
const pool = require('../database'); // Your DB connection pool

/**
 * Registers a new account in the database.
 * @param {Object} accountData - Contains account_firstname, account_lastname, account_email, account_password (hashed)
 * @returns {Promise} resolves to insert result
 */
async function registerAccount(accountData) {
  try {
    const sql = `INSERT INTO accounts (account_firstname, account_lastname, account_email, account_password)
                 VALUES ($1, $2, $3, $4) RETURNING *;`;
    const values = [
      accountData.account_firstname,
      accountData.account_lastname,
      accountData.account_email,
      accountData.account_password,
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  registerAccount,
};
