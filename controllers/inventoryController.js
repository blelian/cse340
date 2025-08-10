// controllers/inventoryController.js
const invModel = require("../models/inventoryModel");
const utilities = require("../utilities/");

async function buildByClassificationId(req, res, next) {
  const classification_id = parseInt(req.params.classificationId);
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const nav = await utilities.getNav();
    const grid = await utilities.buildClassificationGrid(data);

    res.render("./inventory/classification", {
      title: data.length > 0 ? data[0].classification_name + " vehicles" : "No vehicles found",
      nav,
      grid,
    });
  } catch (err) {
    next(err);
  }
}

// JSON endpoint for dropdown fetch
async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
  try {
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    return res.json(invData);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildByClassificationId,
  getInventoryJSON
};
