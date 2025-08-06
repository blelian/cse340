const express = require('express');
const router = express.Router();

const regValidate = require('../utilities/account-validation');
const utilities = require('../utilities');
const accountController = require('../controllers/accountController');

// Show registration form
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Process registration form submission with validation
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
