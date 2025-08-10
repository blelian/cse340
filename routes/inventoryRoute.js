// routes/inventoryRoute.js
const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// Route: Display inventory by classification ID (renders a page)
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route: Provide inventory JSON data for a classification (for dropdowns or API)
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

module.exports = router;
