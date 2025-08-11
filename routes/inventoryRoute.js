const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");
const utilities = require("../utilities");

// Base inventory page (no forms.css)
router.get("/", async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/index", {
      title: "Inventory",
      nav,
      errors: null,
      useFormsCSS: false,
    });
  } catch (error) {
    next(error);
  }
});

// Inventory by classification ID
router.get("/type/:classificationId", invController.buildByClassificationId);

// JSON inventory data API
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

// Inventory details page (no forms)
router.get("/details/:inv_id", invController.buildByInventoryId);

// Add inventory (uses forms.css)
router.get("/add", (req, res) => {
  res.render("inventory/add", {
    useFormsCSS: true,
    title: "Add Inventory Item",
    errors: null,
  });
});

// Edit inventory (uses forms.css)
router.get("/edit/:inv_id", (req, res) => {
  const inv_id = req.params.inv_id;
  res.render("inventory/edit", {
    useFormsCSS: true,
    title: "Edit Inventory Item",
    inv_id,
    errors: null,
  });
});

module.exports = router;
