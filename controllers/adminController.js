// controllers/adminController.js
const utilities = require("../utilities");
const userModel = require("../models/userModel");         // Assuming you have this
const invModel = require("../models/inventoryModel");

async function buildDashboard(req, res, next) {
  try {
    const nav = await utilities.getNav();
    // You could fetch summary stats or reports here if needed
    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      nav,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

// List all users for admin user management
async function listUsers(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const users = await userModel.getAllUsers();  // getAllUsers() to be implemented in userModel
    res.render("admin/users", {
      title: "Manage Users",
      nav,
      users,
    });
  } catch (error) {
    next(error);
  }
}

// List inventory items for admin management
async function listInventory(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const inventory = await invModel.getAllInventory();
    res.render("admin/inventory", {
      title: "Manage Inventory",
      nav,
      inventory,
    });
  } catch (error) {
    next(error);
  }
}

// Other admin utilities, like reports, settings, etc., could be added here

module.exports = {
  buildDashboard,
  listUsers,
  listInventory,
};
