// routes/inventoryRoute.js
const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");
const utilities = require("../utilities");

// Base inventory page (e.g., inventory home)
router.get("/", async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/index", {
      title: "Inventory",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
});

// Display inventory by classification ID (renders page with grid)
router.get("/type/:classificationId", invController.buildByClassificationId);

// Provide inventory JSON data for a classification (API or dropdown)
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

// **Add route for inventory details page**
router.get("/details/:inv_id", invController.buildByInventoryId);

module.exports = router;
