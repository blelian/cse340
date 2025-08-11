const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const { authenticateToken } = require("../middleware/auth");

// Public routes - no authentication required
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerAccount);
router.post("/login", accountController.loginAccount);
router.get("/logout", accountController.logoutAccount);

// Example: If you have profile or other account pages that require login,
// you can protect them with authenticateToken middleware like this:

// router.get("/profile", authenticateToken, accountController.buildProfile);
// router.post("/update-profile", authenticateToken, accountController.updateProfile);

// Add any other existing account routes here, and protect them as needed

module.exports = router;
