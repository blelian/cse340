const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/detail/:invId', inventoryController.buildById);
router.get('/', inventoryController.buildManagement);
router.get('/add-classification', inventoryController.buildAddClassification);
router.post('/add-classification', inventoryController.addClassification);
router.get('/add-inventory', inventoryController.buildAddInventory);
router.post('/add-inventory', inventoryController.addInventory);
router.get('/type/:classificationId', inventoryController.buildByClassificationId);

module.exports = router;
