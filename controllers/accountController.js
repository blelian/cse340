const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utils = require("../utilities/");
const pool = require("../database/");

async function buildLogin(req, res) {
  const nav = await utils.getNav();
  const message = req.query.message; // get message from query string
  res.render("account/login", { title: "Login", nav, errors: null, message });
}

async function buildRegister(req, res) {
  const nav = await utils.getNav();
  res.render("account/register", { title: "Register", nav, errors: null });
}

async function registerAccount(req, res, next) {
  try {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default account_type to 'user' on registration
    await pool.query(
      `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
       VALUES ($1, $2, $3, $4, $5)`,
      [first_name, last_name, email, hashedPassword, "user"]
    );

    res.redirect("/account/login");
  } catch (error) {
    next(error);
  }
}

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

    // Sign JWT with role info included (account_type)
    const token = jwt.sign(
      {
        account_id: account.account_id,
        email: account.account_email,
        role: account.account_type, // use "role" key for clarity
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, { httpOnly: true });

    // Redirect based on role - **MODIFIED HERE**
    if (account.account_type && account.account_type.toLowerCase() === "admin") {
      return res.redirect("/admin");  // changed from /admin/dashboard
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
}

function logoutAccount(req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  logoutAccount,
};
