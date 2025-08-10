// routes/admin.js
const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const adminController = require("../controllers/adminController");
const pool = require("../database");

// Protect all admin routes here
router.use(authenticateToken, requireAdmin);

// Dashboard route - respond at /admin (root of admin)
router.get("/", adminController.buildDashboard);

// User management routes

// List all users
router.get("/users", async (req, res, next) => {
  try {
    // Support for getNav if implemented
    const nav = adminController.getNav ? await adminController.getNav() : [];
    const users = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account"
    );
    res.render("admin/users/list", {
      title: "User Management",
      nav,
      users: users.rows,
      isAdmin: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
});

// Render edit user form
router.get("/users/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id=$1",
      [id]
    );
    if (user.rowCount === 0) {
      return res.status(404).send("User not found");
    }
    const nav = adminController.getNav ? await adminController.getNav() : [];
    res.render("admin/users/edit", {
      title: "Edit User",
      nav,
      user: user.rows[0],
      errors: null,
      isAdmin: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
});

// Handle user update
router.post("/users/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, account_type } = req.body;
    await pool.query(
      `UPDATE account SET account_firstname=$1, account_lastname=$2, account_email=$3, account_type=$4 WHERE account_id=$5`,
      [first_name, last_name, email, account_type, id]
    );
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
});

// Delete user
router.post("/users/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM account WHERE account_id=$1", [id]);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
