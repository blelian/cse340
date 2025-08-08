// routes/accountRoute.js
const express = require('express');
const router = express.Router();

const regValidate = require('../utilities/account-validation');
const utilities = require('../utilities');
const accountController = require('../controllers/accountController');

// Middleware to check if user is logged in
router.use((req, res, next) => {
  res.locals.account = req.session.account || null;
  next();
});

// Account dashboard - requires login
router.get(
  '/',
  utilities.checkLogin,  // your middleware to ensure session.account exists
  utilities.handleErrors(accountController.showDashboard)
);

// Logout route
router.get(
  '/logout',
  utilities.handleErrors(accountController.logoutAccount)
);

// Login page
router.get(
  '/login',
  utilities.handleErrors(accountController.buildLogin)
);

// Login form POST
router.post(
  '/login',
  utilities.handleErrors(accountController.loginAccount)
);

// Registration page
router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegister)
);

// Registration form POST with validation
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
