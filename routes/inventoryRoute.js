const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Detail view of a single vehicle
router.get('/detail/:invId', inventoryController.buildById);

// Inventory Management Dashboard
router.get('/', inventoryController.buildManagement);

// Add Classification
router.get('/add-classification', inventoryController.buildAddClassification);
router.post('/add-classification', inventoryController.addClassification);

// Add Inventory Item
router.get('/add-inventory', inventoryController.buildAddInventory);
router.post('/add-inventory', inventoryController.addInventory);

module.exports = router;
