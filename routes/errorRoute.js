const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

// Route to intentionally trigger a 500 error for testing error handling
router.get('/trigger-error', errorController.triggerError);

module.exports = router;
