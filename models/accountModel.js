// models/accountModel.js
const pool = require('../database');

async function getAccountByEmail(email) {
  try {
    const sql = 'SELECT * FROM account WHERE account_email = $1;';
    const result = await pool.query(sql, [email]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

async function registerAccount(accountData) {
  try {
    const sql = `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    const values = [
      accountData.account_firstname,
      accountData.account_lastname,
      accountData.account_email,
      accountData.account_password,
      accountData.account_type || 'Client',
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAccountByEmail,
  registerAccount,
};
