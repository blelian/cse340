require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../database"); // adjust path if needed

async function seedUsers() {
  try {
    // Clear existing test users with these emails
    await pool.query(
      `DELETE FROM account WHERE account_email = ANY($1::text[])`,
      [["admin@example.com", "user@example.com"]]
    );

    // Hash passwords
    const adminPassword = await bcrypt.hash("AdminPass123!", 10);
    const userPassword = await bcrypt.hash("UserPass123!", 10);

    // Insert admin user with correct 'admin' role (lowercase)
    await pool.query(
      `INSERT INTO account 
       (account_firstname, account_lastname, account_email, account_password, account_type)
       VALUES ($1, $2, $3, $4, $5)`,
      ["Admin", "User", "admin@example.com", adminPassword, "admin"]
    );

    // Insert regular user with correct 'client' role (lowercase)
    await pool.query(
      `INSERT INTO account 
       (account_firstname, account_lastname, account_email, account_password, account_type)
       VALUES ($1, $2, $3, $4, $5)`,
      ["Regular", "User", "user@example.com", userPassword, "client"]
    );

    console.log("✅ Seeded test users: admin and regular user");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
