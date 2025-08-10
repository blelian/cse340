// routes/adminInventory.js
const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const adminInvController = require("../controllers/adminInventoryController");

// Protect all admin inventory routes
router.use(authenticateToken, requireAdmin);

// List inventory items
router.get("/", adminInvController.listInventory);

// Show add inventory form
router.get("/add", adminInvController.showAddForm);

// Process add inventory form
router.post("/add", adminInvController.addInventory);

// Show edit inventory form
router.get("/edit/:id", adminInvController.showEditForm);

// Process edit inventory form
router.post("/edit/:id", adminInvController.updateInventory);

// Delete inventory item
router.post("/delete/:id", adminInvController.deleteInventory);

// Add classification routes
router.get("/add-classification", adminInvController.showAddClassificationForm);
router.post("/add-classification", adminInvController.addClassification);

module.exports = router;
