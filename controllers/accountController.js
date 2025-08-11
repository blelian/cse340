const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utils = require("../utilities/");
const pool = require("../database/");

// Show login form
async function buildLogin(req, res) {
  const nav = await utils.getNav();
  const message = req.query.message;
  res.render("account/login", { title: "Login", nav, errors: null, message });
}

// Show register form - pass empty values for form fields initially
async function buildRegister(req, res) {
  const nav = await utils.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    first_name: '',
    last_name: '',
    email: '',
  });
}

// Show account management page after login
async function buildAccount(req, res) {
  const nav = await utils.getNav();
  // Extract info from JWT token decoded user in req.user if you have middleware
  // OR you can decode the JWT here if needed
  const accountData = req.user || {}; // assuming middleware attaches user to req.user

  res.render("account/account", {
    title: "Account Management",
    nav,
    accountData,
    message: "You’re logged in!",
    errors: null,
  });
}

// Handle registration POST
async function registerAccount(req, res, next) {
  try {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
       VALUES ($1, $2, $3, $4, $5)`,
      [first_name, last_name, email, hashedPassword, "client"] // match enum value
    );

    res.redirect("/account/login");
  } catch (error) {
    const nav = await utils.getNav();

    if (error.errors) {
      return res.status(400).render("account/register", {
        title: "Register",
        nav,
        errors: error.errors,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
      });
    }
    next(error);
  }
}

// Handle login POST
async function loginAccount(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(400).render("account/login", {
        title: "Login",
        nav: await utils.getNav(),
        errors: [{ msg: "Invalid email or password" }],
      });
    }

    const account = result.rows[0];
    const validPassword = await bcrypt.compare(password, account.account_password);

    if (!validPassword) {
      return res.status(400).render("account/login", {
        title: "Login",
        nav: await utils.getNav(),
        errors: [{ msg: "Invalid email or password" }],
      });
    }

    const token = jwt.sign(
      {
        account_id: account.account_id,
        account_firstname: account.account_firstname,
        account_lastname: account.account_lastname,
        account_email: account.account_email,
        account_type: account.account_type,
        role: account.account_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    if (account.account_type && account.account_type.toLowerCase() === "admin") {
      return res.redirect("/admin");
    } else {
      return res.redirect("/account");  // redirect to account page after login
    }
  } catch (error) {
    next(error);
  }
}

// Handle logout
function logoutAccount(req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  buildAccount,      // <--- add new function here
  registerAccount,
  loginAccount,
  logoutAccount,
};
