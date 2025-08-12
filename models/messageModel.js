const pool = require("../database/index");

class Message {
  static async insert(name, email, message) {
    const sql = `
      INSERT INTO messages (name, email, message)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const values = [name, email, message];
    const result = await pool.query(sql, values);
    return result.rows[0].id;
  }
}

module.exports = Message;
