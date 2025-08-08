// utilities/checkAuth.js
const jwt = require('jsonwebtoken');
const accountModel = require("../models/accountModel");

async function checkAuth(req, res, next) {
  const token = req.cookies && req.cookies.jwt;
  if (!token) {
    console.log("[checkAuth] No token found, redirecting to login.");
    res.locals.loggedin = 0;
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[checkAuth] Decoded JWT:", decoded);

    // Fetch full account info from DB using id in the token
    const accountData = await accountModel.getAccountById(decoded.account_id);
    if (!accountData) {
      console.log("[checkAuth] No user found for account_id:", decoded.account_id);
      res.locals.loggedin = 0;
      return res.redirect("/account/login");
    }

    // Attach full account data to res.locals for views/controllers
    res.locals.accountData = accountData;
    // Mark logged in flag (used by utilities.checkLogin middleware if present)
    res.locals.loggedin = 1;

    console.log("[checkAuth] Loaded accountData from DB:", {
      account_id: accountData.account_id,
      account_email: accountData.account_email,
      account_firstname: accountData.account_firstname,
      account_type: accountData.account_type,
    });

    next();
  } catch (err) {
    console.error("[checkAuth] Error verifying token:", err.message);
    res.locals.loggedin = 0;
    // Clear any invalid cookie
    try { res.clearCookie("jwt"); } catch (e) {}
    return res.redirect("/account/login");
  }
}

module.exports = checkAuth;
