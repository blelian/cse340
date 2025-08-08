const express = require('express');
const router = express.Router();

const invController = require('../controllers/inventoryController');
const auth = require('../utilities/authAdmin');

// Public route - Inventory homepage
router.get('/', invController.buildManagement);

// Admin-protected management page
router.get('/management', auth.checkLogin, auth.checkAdmin, invController.buildManagement);

// Classification route for filtered inventory
router.get('/type/:classificationId', invController.buildByClassificationId);

module.exports = router;
