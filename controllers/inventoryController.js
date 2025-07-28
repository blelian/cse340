const invModel = require('../models/inventoryModel');
const utils = require('../utilities/');

async function buildById(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const data = await invModel.getVehicleById(invId);
    const nav = await utils.getNav();
    res.render('inventory/detail', {
      title: data.inv_make + " " + data.inv_model,
      nav,
      vehicle: data,  
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { buildById };
