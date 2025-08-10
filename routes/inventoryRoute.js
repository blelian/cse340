// routes/inventoryRoute.js
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");

// View inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// JSON route for dropdown
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

module.exports = router;
