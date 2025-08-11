const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// Account routes
router.get("/", accountController.buildAccount);           // <-- new account page route
router.get("/login", accountController.buildLogin);
router.post("/login", accountController.loginAccount);

router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerAccount);

router.get("/logout", accountController.logoutAccount);

module.exports = router;
