// controllers/accountController.js
const utilities = require('../utilities');
const accountModel = require('../models/accountModel');
const bcrypt = require('bcryptjs');

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('account/register', {
      title: 'Register',
      nav,
      errors: null,
      account_firstname: null,
      account_lastname: null,
      account_email: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Register the user in DB
    const regResult = await accountModel.registerAccount({
      account_firstname,
      account_lastname,
      account_email,
      account_password: hashedPassword,
    });

    if (regResult) {
      // Success: redirect to login
      req.flash("notice", "Registration successful. Please log in.");
      res.redirect('/account/login');
    } else {
      // Failure: re-render form with error and sticky data
      const nav = await utilities.getNav();
      res.render('account/register', {
        title: 'Register',
        nav,
        errors: [{ msg: 'Registration failed. Please try again.' }],
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildRegister,
  registerAccount,
};
