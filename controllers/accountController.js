// controllers/accountController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utils = require("../utilities/");
const pool = require("../database/");

async function buildLogin(req, res) {
  const nav = await utils.getNav();
  res.render("account/login", { title: "Login", nav, errors: null });
}

async function buildRegister(req, res) {
  const nav = await utils.getNav();
  res.render("account/register", { title: "Register", nav, errors: null });
}

async function registerAccount(req, res, next) {
  try {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO account (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4)`,
      [first_name, last_name, email, hashedPassword]
    );

    res.redirect("/account/login");
  } catch (error) {
    next(error);
  }
}

async function loginAccount(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM account WHERE email = $1", [email]);
    if (result.rowCount === 0) {
      return res.status(400).render("account/login", {
        title: "Login",
        nav: await utils.getNav(),
        errors: [{ msg: "Invalid email or password" }],
      });
    }

    const account = result.rows[0];
    const validPassword = await bcrypt.compare(password, account.password);
    if (!validPassword) {
      return res.status(400).render("account/login", {
        title: "Login",
        nav: await utils.getNav(),
        errors: [{ msg: "Invalid email or password" }],
      });
    }

    const token = jwt.sign(
      { account_id: account.account_id, email: account.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

function logoutAccount(req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, logoutAccount };
