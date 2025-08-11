// routes/adminInventory.js
const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const adminInventoryController = require("../controllers/adminInventoryController");

// Protect all admin inventory routes
router.use(authenticateToken, requireAdmin);

// Inventory management list page
router.get("/", adminInventoryController.listInventory);

// Add inventory page
router.get("/add", adminInventoryController.showAddForm);

// Handle add inventory POST
router.post("/add", adminInventoryController.handleAdd);

// Edit inventory page
router.get("/edit/:id", adminInventoryController.showEditForm);

// Handle edit inventory POST
router.post("/edit/:id", adminInventoryController.handleEdit);

// Handle delete inventory POST
router.post("/delete/:id", adminInventoryController.handleDelete);

// Classification routes
router.get("/add-classification", adminInventoryController.showAddClassificationForm);
router.post("/add-classification", adminInventoryController.handleAddClassification);

module.exports = router;
