// routes/inventoryRoute.js
const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");
const utilities = require("../utilities");

// Route: Base inventory page (e.g., list all or landing page)
router.get("/", async (req, res, next) => {
  try {
    // Fetch navigation dynamically
    const nav = await utilities.getNav();

    // Optionally, you could fetch inventory summary here if you want to list something
    // For now, just render a simple inventory index page

    res.render("inventory/index", {
      title: "Inventory",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
});

// Route: Display inventory by classification ID (renders a page)
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route: Provide inventory JSON data for a classification (for dropdowns or API)
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

module.exports = router;
