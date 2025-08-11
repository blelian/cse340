// routes/admin.js
const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const adminController = require("../controllers/adminController");
const utilities = require("../utilities");   // << added here
const pool = require("../database");

// Protect all admin routes: first authenticate token
router.use(authenticateToken);

// Admin dashboard (accessible only by admins)
router.get("/", requireAdmin, adminController.buildDashboard);

// EMPLOYEE MANAGEMENT: Admin only
router.get("/employees", requireAdmin, async (req, res, next) => {
  try {
    const nav = await utilities.getNav();  // Fix: get nav from utilities
    const employees = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account"
    );
    res.render("admin/employees/list", {
      title: "Employee Management",
      nav,
      users: employees.rows,
      isAdmin: true,
      user: req.user,
      useFormsCSS: true, // Needed for employee forms if any
    });
  } catch (error) {
    next(error);
  }
});

// Employee edit page (example)
router.get("/employees/edit/:id", requireAdmin, async (req, res, next) => {
  try {
    const nav = await utilities.getNav();  // Fix here too
    const employeeId = req.params.id;

    // TODO: Fetch employee data if needed to pass to the edit form

    res.render("admin/employees/edit", {
      title: "Edit Employee",
      nav,
      user: req.user,
      employeeId,
      useFormsCSS: true,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
});

// Inventory routes under /admin/inventory handled in separate router (adminInventory.js)

module.exports = router;
