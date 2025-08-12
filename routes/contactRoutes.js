const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// GET Contact form
router.get("/", contactController.showContactForm);

// POST Contact form submission
router.post("/", contactController.handleContactForm);

module.exports = router;
