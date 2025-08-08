// controllers/accountController.js
const utilities = require('../utilities');
const accountModel = require('../models/accountModel');
const bcrypt = require('bcryptjs');

// Show the login page
async function buildLogin(req, res) {
  res.render('account/login', {
    title: 'Login',
    nav: await utilities.getNav(),
    errors: null,
    account_email: '',
  });
}

// Process login form submission
async function loginAccount(req, res) {
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    return res.status(401).render('account/login', {
      title: 'Login',
      nav: await utilities.getNav(),
      errors: [{ msg: 'Invalid email or password' }],
      account_email,
    });
  }

  const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
  if (!passwordMatch) {
    return res.status(401).render('account/login', {
      title: 'Login',
      nav: await utilities.getNav(),
      errors: [{ msg: 'Invalid email or password' }],
      account_email,
    });
  }

  // Save account data in session (omit password)
  req.session.account = {
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
  };

  // Redirect to originally requested page or dashboard
  const redirectTo = req.session.redirectTo || '/account';
  delete req.session.redirectTo;
  res.redirect(redirectTo);
}

// Show registration page
async function buildRegister(req, res) {
  res.render('account/register', {
    title: 'Register',
    nav: await utilities.getNav(),
    errors: null,
    account_firstname: '',
    account_lastname: '',
    account_email: '',
  });
}

// Process registration form submission
async function registerAccount(req, res) {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const newAccount = {
      account_firstname,
      account_lastname,
      account_email,
      account_password: hashedPassword,
    };

    const regResult = await accountModel.registerAccount(newAccount);

    if (regResult) {
      // Registration success, redirect to login with success message
      req.flash('success', 'Registration successful. Please log in.');
      res.redirect('/account/login');
    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).render('account/register', {
      title: 'Register',
      nav: await utilities.getNav(),
      errors: [{ msg: 'An error occurred during registration. Please try again.' }],
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
  }
}

// Show account dashboard for logged-in users
async function showDashboard(req, res) {
  if (!req.session.account) {
    return res.redirect('/account/login');
  }

  res.render('account/account', {
    title: 'Dashboard',
    nav: await utilities.getNav(),
    accountData: req.session.account,
  });
}

// Logout and destroy session
async function logoutAccount(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.clearCookie('sessionId');
    res.redirect('/account/login');
  });
}

module.exports = {
  buildLogin,
  loginAccount,
  buildRegister,
  registerAccount,
  showDashboard,
  logoutAccount,
};
