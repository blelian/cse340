const utilities = require('../utilities');
const inventoryModel = require('../models/inventoryModel');

async function buildManagement(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classifications = await inventoryModel.getClassifications();

    const selectedClassificationId = req.query.classification_id
      ? parseInt(req.query.classification_id, 10)
      : (classifications[0] ? classifications[0].classification_id : 0);

    const inventory = await inventoryModel.getInventoryByClassificationId(selectedClassificationId);

    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      classifications,
      inventory,
      selectedClassificationId,
    });
  } catch (error) {
    next(error);
  }
}

async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = parseInt(req.params.classificationId, 10);
    const nav = await utilities.getNav();
    const inventory = await inventoryModel.getInventoryByClassificationId(classificationId);
    const grid = await utilities.buildClassificationGrid(inventory);
    const classificationName = inventory.length > 0 ? inventory[0].classification_name : 'Vehicles';

    res.render('inventory/classification', {
      title: classificationName,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildManagement,
  buildByClassificationId,
};
