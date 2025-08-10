// controllers/adminInventoryController.js
const invModel = require("../models/inventoryModel");
const utilities = require("../utilities");

async function listInventory(req, res, next) {
  try {
    const inventory = await invModel.getAllInventory();
    const nav = await utilities.getNav();
    res.render("admin/inventory", {
      title: "Inventory Management",
      nav,
      inventory,
      isAdmin: true,
      user: req.user, // pass user info if available
    });
  } catch (error) {
    next(error);
  }
}

async function showAddForm(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    res.render("inventory/add_inventory", {  // Corrected path
      title: "Add Inventory Item",
      nav,
      classifications,
      errors: null,
      isAdmin: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

async function addInventory(req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    if (!inv_make || !inv_model || !inv_price) {
      const nav = await utilities.getNav();
      const classifications = await invModel.getClassifications();
      return res.status(400).render("inventory/add_inventory", {  // Corrected path
        title: "Add Inventory Item",
        nav,
        classifications,
        errors: [{ msg: "Please fill out required fields" }],
        isAdmin: true,
        user: req.user,
      });
    }

    await invModel.addInventory(
      inv_make,
      inv_model,
      parseInt(inv_year),
      inv_description,
      inv_image,
      inv_thumbnail,
      parseFloat(inv_price),
      parseInt(inv_miles),
      inv_color,
      parseInt(classification_id)
    );

    res.redirect("/admin/inventory");
  } catch (error) {
    next(error);
  }
}

async function showEditForm(req, res, next) {
  try {
    const { id } = req.params;
    const inventoryItem = await invModel.getInventoryById(id);
    if (!inventoryItem) {
      return res.status(404).send("Inventory item not found");
    }
    const nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    res.render("inventory/edit-inventory", {  // Corrected path
      title: "Edit Inventory Item",
      nav,
      inventoryItem,
      classifications,
      errors: null,
      isAdmin: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

async function updateInventory(req, res, next) {
  try {
    const { id } = req.params;
    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    await invModel.updateInventory(
      inv_make,
      inv_model,
      parseInt(inv_year),
      inv_description,
      inv_image,
      inv_thumbnail,
      parseFloat(inv_price),
      parseInt(inv_miles),
      inv_color,
      parseInt(classification_id),
      id
    );

    res.redirect("/admin/inventory");
  } catch (error) {
    next(error);
  }
}

async function deleteInventory(req, res, next) {
  try {
    const { id } = req.params;
    await invModel.deleteInventory(id);
    res.redirect("/admin/inventory");
  } catch (error) {
    next(error);
  }
}

// ===== Classification routes =====

async function showAddClassificationForm(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add_classification", {  // Corrected path
      title: "Add Classification",
      nav,
      errors: null,
      isAdmin: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;

    if (!classification_name) {
      const nav = await utilities.getNav();
      return res.status(400).render("inventory/add_classification", {  // Corrected path
        title: "Add Classification",
        nav,
        errors: [{ msg: "Classification name is required" }],
        isAdmin: true,
        user: req.user,
      });
    }

    await invModel.addClassification(classification_name);
    res.redirect("/admin/inventory");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listInventory,
  showAddForm,
  addInventory,
  showEditForm,
  updateInventory,
  deleteInventory,
  showAddClassificationForm,
  addClassification,
};
