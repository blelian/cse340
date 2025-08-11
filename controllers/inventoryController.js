const invModel = require("../models/inventoryModel");
const utilities = require("../utilities/");

// Show inventory filtered by classification ID, render classification view with grid
async function buildByClassificationId(req, res, next) {
  const classification_id = parseInt(req.params.classificationId);
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const nav = await utilities.getNav();
    const grid = await utilities.buildClassificationGrid(data);

    res.render("inventory/classification", {
      title: data.length > 0 ? `${data[0].classification_name} vehicles` : "No vehicles found",
      nav,
      grid,
    });
  } catch (err) {
    next(err);
  }
}

// JSON endpoint to fetch inventory by classification (for dropdown or API)
async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
  try {
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    return res.json(invData);
  } catch (error) {
    next(error);
  }
}

// Show vehicle details page by inventory ID
async function buildByInventoryId(req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  try {
    const vehicle = await invModel.getInventoryById(inv_id);
    const nav = await utilities.getNav();

    if (!vehicle) {
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        message: "No vehicle found with that ID.",
        nav,
      });
    }

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model} Details`,
      nav,
      vehicle,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  buildByClassificationId,
  getInventoryJSON,
  buildByInventoryId,
};
