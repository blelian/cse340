// routes/accountRoute.js
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const { registerRules, loginRules, checkValidation } = require("../utilities/account-validation");
const { checkJWTToken } = require("../utilities/jwt-auth");
const utils = require("../utilities/");

// Middleware to load nav for every account route
router.use(async (req, res, next) => {
  req.nav = await utils.getNav();
  next();
});

// Public routes
router.get("/login", accountController.buildLogin);
router.post("/login", loginRules(), checkValidation, accountController.loginAccount);

router.get("/register", accountController.buildRegister);
router.post("/register", registerRules(), checkValidation, accountController.registerAccount);

// Protected route example
router.get("/dashboard", checkJWTToken, (req, res) => {
  res.render("account/dashboard", {
    title: "Dashboard",
    nav: req.nav,
    user: req.user,
    errors: null,
  });
});

router.get("/logout", accountController.logoutAccount);

module.exports = router;
